// src/hooks/useChat.js

import { useState, useRef, useEffect, useMemo } from "react";
import { message as antMessage } from 'antd';
import { uid, now } from "../utils/helpers";
import { AGENTS, INITIAL_CHATS } from "../utils/constants";
import { sendChatMessage } from "../services/chatService";

export const useChat = () => {
  const [chats, setChats] = useState(() => {
    const stored = localStorage.getItem("chats");
    return stored ? JSON.parse(stored) : INITIAL_CHATS;
  });

  const [activeChatId, setActiveChatId] = useState(() => {
    const stored = localStorage.getItem("activeChatId");
    return stored || (chats.length > 0 ? chats[0].id : null);
  });

  const [currentAgent, setCurrentAgent] = useState("auto");
  
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // 串流訊息狀態
  const [streamingMessage, setStreamingMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const messagesEndRef = useRef(null);
  const editInputRef = useRef(null);
  const inputRef = useRef(null);
  const cancelRequestRef = useRef(null);

  // 自動儲存
  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (activeChatId) {
      localStorage.setItem("activeChatId", activeChatId);
    }
  }, [activeChatId]);

  // 滾動到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, activeChatId, streamingMessage]);

  // 當前聊天
  const activeChat = useMemo(
    () => chats.find(c => c.id === activeChatId),
    [chats, activeChatId]
  );

  // 搜尋過濾
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats;
    const q = searchQuery.toLowerCase();
    return chats.filter(c => c.title.toLowerCase().includes(q));
  }, [chats, searchQuery]);

  // 當前 Agent 資訊
  const currentAgentInfo = useMemo(
    () => AGENTS.find(a => a.value === currentAgent) || AGENTS[0],
    [currentAgent]
  );

  // 發送訊息
  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading || isStreaming) return;
    if (!activeChatId) return;

    // 建立用戶訊息
    const userMessage = {
      role: "user",
      content: trimmed,
      timestamp: now()
    };

    // 立即加入用戶訊息
    setChats(prev => prev.map(chat =>
      chat.id === activeChatId
        ? { ...chat, messages: [...chat.messages, userMessage] }
        : chat
    ));

    setInputValue("");
    setIsLoading(true);
    setIsStreaming(true);
    setStreamingMessage("");

    try {
      let accumulatedContent = "";
      let assistantMessage = null;

      // 發送 API 請求
      const cancelFn = await sendChatMessage({
        message: trimmed,
        agent: currentAgent,
        chatId: activeChatId,
        
        // 接收每個 chunk
        onChunk: (data) => {
          // 假設後端回傳格式: { content: "文字片段", done: false }
          if (data.content) {
            accumulatedContent += data.content;
            setStreamingMessage(accumulatedContent);
          }

          // 如果有 trace 資訊也可以在這裡處理
          if (data.trace) {
            setChats(prev => prev.map(chat =>
              chat.id === activeChatId
                ? {
                    ...chat,
                    traces: [data.trace, ...(chat.traces || [])]
                  }
                : chat
            ));
          }
        },

        // 串流完成
        onComplete: () => {
          assistantMessage = {
            role: "assistant",
            content: accumulatedContent,
            timestamp: now()
          };

          // 加入完整的助理訊息
          setChats(prev => prev.map(chat =>
            chat.id === activeChatId
              ? {
                  ...chat,
                  messages: [...chat.messages, assistantMessage]
                }
              : chat
          ));

          setIsLoading(false);
          setIsStreaming(false);
          setStreamingMessage("");
        },

        // 錯誤處理
        onError: (error) => {
          console.error('Chat API Error:', error);
          antMessage.error('訊息發送失敗，請稍後再試');
          setIsLoading(false);
          setIsStreaming(false);
          setStreamingMessage("");
        }
      });

      // 儲存取消函數
      cancelRequestRef.current = cancelFn;

    } catch (error) {
      console.error('Send message error:', error);
      antMessage.error('發送訊息時發生錯誤');
      setIsLoading(false);
      setIsStreaming(false);
      setStreamingMessage("");
    }
  };

  // 取消請求
  const cancelRequest = () => {
    if (cancelRequestRef.current) {
      cancelRequestRef.current();
      cancelRequestRef.current = null;
    }
    setIsLoading(false);
    setIsStreaming(false);
    setStreamingMessage("");
  };

  // 創建新對話
  const createNewChat = () => {
    const newChat = {
      id: uid(),
      title: `新對話 ${new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}`,
      createdAt: Date.now(),
      messages: [{
        role: "assistant",
        content: `👋 您好！我是企業智能助理。\n\n我可以協助您：\n• 資料分析與洞察\n• 知識檢索與整合\n• 文件生成與優化\n\n請告訴我您需要什麼協助？`,
        timestamp: now()
      }],
      traces: []
    };
    setChats([newChat, ...chats]);
    setActiveChatId(newChat.id);
  };

  // 刪除對話
  const deleteChat = (chatId) => {
    setChats(prev => {
      const filtered = prev.filter(c => c.id !== chatId);
      if (activeChatId === chatId && filtered.length > 0) {
        setActiveChatId(filtered[0].id);
      }
      return filtered;
    });
  };

  // 開始編輯標題
  const startEdit = (chat) => {
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  // 完成編輯
  const finishEdit = () => {
    if (editTitle.trim()) {
      setChats(prev => prev.map(c =>
        c.id === editingChatId ? { ...c, title: editTitle.trim() } : c
      ));
    }
    setEditingChatId(null);
    setEditTitle("");
  };

  return {
    chats,
    activeChatId,
    setActiveChatId,
    currentAgent,
    setCurrentAgent,
    inputValue,
    setInputValue,
    searchQuery,
    setSearchQuery,
    isLoading,
    isStreaming,
    streamingMessage,
    editingChatId,
    editTitle,
    setEditTitle,
    messagesEndRef,
    editInputRef,
    inputRef,
    activeChat,
    filteredChats,
    currentAgentInfo,
    handleSend,
    cancelRequest,
    createNewChat,
    deleteChat,
    startEdit,
    finishEdit
  };
};