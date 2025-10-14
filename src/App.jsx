import React, { useState, useEffect, useRef } from 'react';
import { ConfigProvider, Modal, Space, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import LeftSidebar from './components/LeftSidebar';
import MainChat from './components/MainChat';
import RightSidebar from './components/RightSidebar';
import { uid, now, AGENTS_DATA, INITIAL_CHATS } from './constants';
import './styles.css';

const { Text } = Typography;

// 將 AGENTS_DATA 轉換為包含實際 icon 組件的 AGENTS
import {
  ThunderboltOutlined,
  DatabaseOutlined,
  LayoutOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  ApiOutlined
} from '@ant-design/icons';

const ICON_MAP = {
  'ThunderboltOutlined': <ThunderboltOutlined />,
  'DatabaseOutlined': <DatabaseOutlined />,
  'LayoutOutlined': <LayoutOutlined />,
  'SearchOutlined': <SearchOutlined />,
  'ClockCircleOutlined': <ClockCircleOutlined />,
  'ApiOutlined': <ApiOutlined />
};

const AGENTS = AGENTS_DATA.map(agent => ({
  ...agent,
  icon: ICON_MAP[agent.iconType]
}));

export default function App() {
  // 狀態管理
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState(INITIAL_CHATS[0].id);
  const [currentAgent, setCurrentAgent] = useState("auto");
  const [inputValue, setInputValue] = useState("");
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightExpanded, setRightExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("trace");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);
  const editInputRef = useRef(null);
  const inputRef = useRef(null);

  const activeChat = chats.find(c => c.id === activeChatId);
  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 自動滾動到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  // 編輯時自動聚焦
  useEffect(() => {
    if (editingChatId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingChatId]);

  // 開啟知識圖譜管理頁面
  const openGraphManagement = () => {
    window.open('graph.html', '_blank', 'noopener,noreferrer');
  };

  // 發送消息
  const handleSend = async () => {
    if (!inputValue.trim() || !activeChat || isLoading) return;
    
    setIsLoading(true);
    const userMessage = { 
      role: "user", 
      content: inputValue.trim(),
      timestamp: now()
    };
    
    // 立即顯示用戶消息
    setChats(prev => prev.map(chat => 
      chat.id === activeChatId 
        ? { ...chat, messages: [...chat.messages, userMessage] }
        : chat
    ));
    
    setInputValue("");
    
    // 模擬 AI 回應
    setTimeout(() => {
      const usedKG = Math.random() < 0.35;
      const assistantMessage = {
        role: "assistant",
        content: `針對您的問題「${userMessage.content}」,系統分析結果如下：

根據 ${AGENTS.find(a => a.value === currentAgent)?.name} 代理分析,${usedKG ? '已從知識圖譜中檢索相關資訊' : '已從文件庫中檢索相關資料'}。

建議採取以下行動方案：
• 優先處理核心需求
• 整合現有資源
• 建立追蹤機制

${usedKG ? '📊 本次回應使用了知識圖譜增強' : '📄 本次回應基於文件檢索'}`,
        timestamp: now()
      };

      const newTrace = {
        id: uid(),
        time: now(),
        agent: currentAgent,
        usedKG,
        inputText: userMessage.content,
        steps: usedKG 
          ? ["分析查詢意圖", "檢索知識圖譜", "整合多源資料", "生成結構化回覆", "品質驗證"] 
          : ["分析查詢意圖", "文件向量檢索", "語意排序", "生成回覆"]
      };

      setChats(prev => prev.map(chat => 
        chat.id === activeChatId 
          ? {
              ...chat,
              messages: [...chat.messages, assistantMessage],
              traces: [newTrace, ...chat.traces]
            }
          : chat
      ));
      
      setIsLoading(false);
    }, 1000 + Math.random() * 1000);
  };

  // 創建新對話
  const createNewChat = () => {
    const newChat = {
      id: uid(),
      title: `新對話 ${new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}`,
      createdAt: Date.now(),
      messages: [{ 
        role: "assistant", 
        content: `👋 您好!我是企業智能助理。

我可以協助您：
• 資料分析與洞察
• 知識檢索與整合
• 文件生成與優化

請告訴我您需要什麼協助?`,
        timestamp: now()
      }],
      traces: []
    };
    setChats([newChat, ...chats]);
    setActiveChatId(newChat.id);
    setRightExpanded(false);
  };

  // 確認刪除對話
  const confirmDelete = (chat) => {
    setChatToDelete(chat);
    setDeleteModalVisible(true);
  };

  // 執行刪除
  const handleDelete = () => {
    if (chatToDelete) {
      setChats(prev => {
        const filtered = prev.filter(c => c.id !== chatToDelete.id);
        if (activeChatId === chatToDelete.id && filtered.length > 0) {
          setActiveChatId(filtered[0].id);
        }
        return filtered;
      });
    }
    setDeleteModalVisible(false);
    setChatToDelete(null);
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

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#667eea',
          borderRadius: 12,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans TC', sans-serif"
        }
      }}
    >
      <div className="app-container">
        <div className={`app-layout ${leftCollapsed ? 'left-collapsed' : ''}`}>
          <LeftSidebar
            leftCollapsed={leftCollapsed}
            setLeftCollapsed={setLeftCollapsed}
            createNewChat={createNewChat}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredChats={filteredChats}
            activeChatId={activeChatId}
            setActiveChatId={setActiveChatId}
            editingChatId={editingChatId}
            editTitle={editTitle}
            setEditTitle={setEditTitle}
            editInputRef={editInputRef}
            startEdit={startEdit}
            finishEdit={finishEdit}
            confirmDelete={confirmDelete}
            openGraphManagement={openGraphManagement}
          />
          
          <MainChat
            currentAgent={currentAgent}
            setCurrentAgent={setCurrentAgent}
            rightExpanded={rightExpanded}
            setRightExpanded={setRightExpanded}
            activeChat={activeChat}
            isLoading={isLoading}
            messagesEndRef={messagesEndRef}
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSend={handleSend}
            inputRef={inputRef}
            agents={AGENTS}
          />
          
          <RightSidebar
            rightExpanded={rightExpanded}
            setRightExpanded={setRightExpanded}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeChat={activeChat}
          />
        </div>

        {/* 刪除確認對話框 */}
        <Modal
          title={
            <Space>
              <DeleteOutlined style={{ color: '#ff4d4f' }} />
              <span>確認刪除對話</span>
            </Space>
          }
          open={deleteModalVisible}
          onOk={handleDelete}
          onCancel={() => setDeleteModalVisible(false)}
          okText="確認刪除"
          cancelText="取消"
          okButtonProps={{ danger: true }}
        >
          <div style={{ margin: '20px 0' }}>
            <Text>
              此操作無法復原，確認要刪除「<Text strong>{chatToDelete?.title}</Text>」對話嗎？
            </Text>
          </div>
          <Text type="secondary" style={{ fontSize: 14 }}>
            該對話包含 {chatToDelete?.messages?.length || 0} 則訊息記錄。
          </Text>
        </Modal>
      </div>
    </ConfigProvider>
  );
}