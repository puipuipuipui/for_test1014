// src/hooks/useChat.js
import { useState, useRef, useEffect } from 'react';
import { uid, now, generateMockResponse, generateTrace } from '../utils/helpers';

export const useChat = (initialChats, agents) => {
  const [chats, setChats] = useState(initialChats);
  const [activeChatId, setActiveChatId] = useState(initialChats[0]?.id);
  const [currentAgent, setCurrentAgent] = useState("auto");
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  
  const messagesEndRef = useRef(null);
  const editInputRef = useRef(null);
  const inputRef = useRef(null);

  const activeChat = chats.find(c => c.id === activeChatId);
  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const currentAgentInfo = agents.find(a => a.value === currentAgent) || agents[0];

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
        content: generateMockResponse(userMessage.content, currentAgentInfo.name, usedKG),
        timestamp: now()
      };

      const newTrace = generateTrace(userMessage.content, currentAgent, usedKG);

      setChats(prev => prev.map(chat => 
        chat.id === activeChatId 
          ? {
              ...chat,
              messages: [...chat.messages, assistantMessage],
              traces: [newTrace, ...(chat.traces || [])]
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
    createNewChat,
    deleteChat,
    startEdit,
    finishEdit
  };
};