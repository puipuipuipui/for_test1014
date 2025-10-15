// src/services/chatService.js

import { API_CONFIG } from '../utils/constants';

/**
 * 發送聊天訊息並接收 SSE 串流回應
 * @param {Object} params - 請求參數
 * @param {string} params.message - 用戶訊息
 * @param {string} params.agent - 代理類型
 * @param {string} params.chatId - 對話 ID
 * @param {Function} onChunk - 接收到資料塊時的回調函數
 * @param {Function} onThinking - 接收思考內容的回調函數
 * @param {Function} onRouting - 接收路由資訊的回調函數
 * @param {Function} onComplete - 完成時的回調函數
 * @param {Function} onError - 錯誤時的回調函數
 * @returns {Function} 取消請求的函數
 */
export const sendChatMessage = async ({
    message,
    agent = 'auto',
    chatId,
    onChunk,
    onThinking,
    onRouting,
    onComplete,
    onError
}) => {
    let controller = new AbortController();

    try {
        const requestBody = {
            message,
            session_id: chatId,
            debug: false,
            use_deeper_tool: true,
            show_thinking: false
        };

        // 如果有指定 agent，加入 agent_type
        if (agent && agent !== 'auto') {
            requestBody.agent_type = agent;
        }

        const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.chat}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream'
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                break;
            }

            // 解碼資料
            const chunk = decoder.decode(value, { stream: true });
            console.log('收到原始資料:', chunk);
            buffer += chunk;

            // 處理 SSE 格式：data: {...}\n\n
            const lines = buffer.split('\n\n');
            buffer = lines.pop() || ''; // 保留未完成的行
            console.log('分割後的行數:', lines.length);

            for (const line of lines) {
                console.log('處理行:', line);
                if (line.startsWith('data: ')) {
                    try {
                        const jsonStr = line.slice(6); // 移除 'data: ' 前綴
                        console.log('JSON 字串:', jsonStr);

                        // 檢查是否為 [DONE] 標記
                        if (jsonStr.trim() === '[DONE]') {
                            if (onComplete) onComplete();
                            continue;
                        }

                        const data = JSON.parse(jsonStr);
                        const status = data.status;
                        console.log('解析成功 - Status:', status, 'Data:', data);

                        // 根據不同的 status 處理
                        if (status === 'token') {
                            // 一般回應內容
                            console.log('Token 原始內容:', data.content);

                            let actualContent = data.content;

                            // 如果 content 是字串形式的 JSON，需要再解析一次
                            // 持續解析直到不是 JSON 字串為止
                            while (typeof actualContent === 'string') {
                                try {
                                    const parsed = JSON.parse(actualContent);
                                    actualContent = parsed;
                                    console.log('解析一次:', actualContent);
                                } catch (e) {
                                    // 解析失敗，代表已經是最終內容
                                    console.log('解析完成');
                                    break;
                                }
                            }
                            

                            if (onChunk && actualContent) {
                                onChunk(actualContent);
                            }
                        } else if (status === 'thinking') {
                            // 思考過程
                            console.log('Thinking 內容:', data.content);
                            if (onThinking && data.content) {
                                onThinking(data.content);
                            }
                        } else if (status === 'routing') {
                            // 路由資訊
                            console.log('Routing 資訊:', data);
                            if (onRouting) {
                                onRouting({
                                    selected_agent: data.selected_agent,
                                    routing_reason: data.routing_reason,
                                    routing_scores: data.routing_scores
                                });
                            }
                        } else if (status === 'execution_log') {
                            // 執行日誌（debug 用）
                            console.log('Execution Log:', data.content);
                        } else if (status === 'done') {
                            // 完成
                            console.log('完成:', data);
                            if (onRouting) {
                                onRouting({
                                    selected_agent: data.selected_agent,
                                    routing_reason: data.routing_reason,
                                    routing_scores: data.routing_scores
                                });
                            }
                            if (onComplete) onComplete();
                            break;
                        } else if (status === 'error') {
                            // 錯誤
                            console.error('錯誤:', data);
                            const errorMessage = data.message || '未知錯誤';
                            if (onError) {
                                onError(new Error(errorMessage));
                            }
                            break;
                        } else {
                            console.warn('未知的 status:', status, data);
                        }

                    } catch (parseError) {
                        console.error('JSON 解析錯誤:', parseError, 'Line:', line);
                        // 繼續處理下一個，不中斷整個流程
                        continue;
                    }
                }
            }
        }

        // 處理剩餘的 buffer
        if (buffer.trim() && buffer.startsWith('data: ')) {
            try {
                const jsonStr = buffer.slice(6);
                if (jsonStr.trim() !== '[DONE]') {
                    const data = JSON.parse(jsonStr);
                    if (data.status === 'token' && onChunk && data.content) {
                        onChunk(data.content);
                    }
                }
            } catch (parseError) {
                console.error('最後 buffer 解析錯誤:', parseError);
            }
        }

        if (onComplete) onComplete();

    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('請求已取消');
            return;
        }

        console.error('聊天 API 錯誤:', error);
        if (onError) {
            onError(error);
        }
    }

    // 返回取消函數
    return () => {
        controller.abort();
    };
};

/**
 * 獲取對話歷史
 * @param {string} chatId - 對話 ID
 * @returns {Promise<Object>} 對話資料
 */
export const getChatHistory = async (chatId) => {
    try {
        const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.chat}/${chatId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('獲取對話歷史錯誤:', error);
        throw error;
    }
};

/**
 * 刪除對話
 * @param {string} chatId - 對話 ID
 * @returns {Promise<void>}
 */
export const deleteChatHistory = async (chatId) => {
    try {
        const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.chat}/${chatId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('刪除對話錯誤:', error);
        throw error;
    }
};