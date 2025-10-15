// src/utils/constants.js

import { uid, now } from './helpers';

// ==================== Agent 配置 ====================
export const AGENTS = [
  { 
    value: "auto", 
    name: "Auto", 
    desc: "自動選擇最佳策略",
    iconType: "ThunderboltOutlined"
  },
  { 
    value: "graph_agent", 
    name: "Graph Agent", 
    desc: "專注知識圖譜檢索",
    iconType: "DatabaseOutlined"
  },
  { 
    value: "hybrid_agent", 
    name: "Hybrid Agent", 
    desc: "混合圖譜與文件檢索",
    iconType: "LayoutOutlined"
  },
  { 
    value: "naive_rag_agent", 
    name: "Naive RAG", 
    desc: "基礎檢索增強生成",
    iconType: "SearchOutlined"
  },
  { 
    value: "deep_research_agent", 
    name: "Deep Research", 
    desc: "多步深入研究流程",
    iconType: "ClockCircleOutlined"
  },
  { 
    value: "fusion_agent", 
    name: "Fusion Agent", 
    desc: "整合多種資訊來源",
    iconType: "ApiOutlined"
  }
];

// ==================== Tab 配置 ====================
export const TABS = [
  { 
    key: 'trace', 
    label: '執行軌跡',
    iconType: 'ThunderboltOutlined'
  },
  { 
    key: 'kg', 
    label: '知識圖譜',
    iconType: 'DatabaseOutlined'
  },
  { 
    key: 'sources', 
    label: '來源資料',
    iconType: 'SearchOutlined'
  },
  { 
    key: 'perf', 
    label: '效能分析',
    iconType: 'ClockCircleOutlined'
  }
];

// ==================== 初始對話數據 ====================
export const INITIAL_CHATS = [
  {
    id: uid(),
    title: "教育市場週報",
    createdAt: Date.now() - 1000 * 60 * 60 * 6,
    messages: [
      { 
        role: "assistant", 
        content: "我已整理本週教育科技市場走勢，協助你掌握目標客群和新品上市節奏。", 
        timestamp: now() 
      },
      { 
        role: "user", 
        content: "幫我統整高中職市場導入混成教學時的痛點。", 
        timestamp: now() 
      },
      { 
        role: "assistant", 
        content: "主要痛點有三項：\n1. 教師數位教材不足\n2. 校務系統整合繁瑣\n3. 家長對資料隱私的疑慮", 
        timestamp: now() 
      },
      { 
        role: "user", 
        content: "最快怎麼做才能低成本試行？", 
        timestamp: now() 
      },
      { 
        role: "assistant", 
        content: "建議先以模組化 API 打包教材，再用簡易儀表板協助教務處快速部署。", 
        timestamp: now() 
      }
    ],
    traces: []
  },
  {
    id: uid(),
    title: "客服話術草稿",
    createdAt: Date.now() - 1000 * 60 * 60 * 3,
    messages: [
      { 
        role: "assistant", 
        content: "我整理了針對新客戶的開場白，可以凸顯本季方案的價值。", 
        timestamp: now() 
      },
      { 
        role: "user", 
        content: "幫我補上費用說明，以及跨區使用的差異。", 
        timestamp: now() 
      },
      { 
        role: "assistant", 
        content: "已補上：方案、費用、常見疑問三段式，並在結尾提醒改期方式。", 
        timestamp: now() 
      },
      { 
        role: "user", 
        content: "記得在結尾邀請他預約七天試用。", 
        timestamp: now() 
      }
    ],
    traces: []
  },
  {
    id: uid(),
    title: "數據洞察回顧",
    createdAt: Date.now() - 1000 * 60 * 60 * 0.75,
    messages: [
      { 
        role: "assistant", 
        content: "本週轉換率 13.8%，較上週提升 2.6%，主因是新導入的引導流程。", 
        timestamp: now() 
      },
      { 
        role: "user", 
        content: "請把第二步驟的下降趨勢拆成兩個重點說明。", 
        timestamp: now() 
      },
      { 
        role: "assistant", 
        content: "重點 A：用戶仍會停留在比較頁；重點 B：示範影片的 CTA 不夠明顯。", 
        timestamp: now() 
      },
      { 
        role: "user", 
        content: "幫我把這兩點轉成列點腳本，下午戰情會要用。", 
        timestamp: now() 
      }
    ],
    traces: []
  },
  {
    id: uid(),
    title: "行銷活動激勵",
    createdAt: Date.now() - 1000 * 60 * 60 * 0.1667,
    messages: [
      { 
        role: "assistant", 
        content: "準備舉辦季度客戶交流日，你想聚焦哪些亮點？", 
        timestamp: now() 
      },
      { 
        role: "user", 
        content: "我想分享成功案例、治理最佳實務，並安排知識盤點工作坊。", 
        timestamp: now() 
      },
      { 
        role: "assistant", 
        content: "了解，我會把流程拆成三段並加上 EDM 口吻的邀請詞。", 
        timestamp: now() 
      }
    ],
    traces: []
  }
];

// ==================== 應用配置 ====================
export const APP_CONFIG = {
  name: 'Enterprise AI',
  version: '1.0.0',
  description: '企業級知識圖譜聊天機器人系統',
  maxMessageLength: 5000,
  maxChatHistory: 100,
  autoSaveInterval: 30000, // 30秒自動保存
  theme: {
    primaryColor: '#667eea',
    borderRadius: 12,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans TC', sans-serif"
  }
};

// ==================== API 配置（預留） ====================
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  timeout: 30000,
  retryLimit: 3,
  endpoints: {
    chat: '/chat/stream',
    agents: '/api/agents',
    knowledge: '/api/knowledge',
    graph: '/api/graph'
  }
};

// ==================== 本地儲存鍵名 ====================
export const STORAGE_KEYS = {
  CHATS: 'app_chats',
  ACTIVE_CHAT: 'app_active_chat',
  CURRENT_AGENT: 'app_current_agent',
  USER_SETTINGS: 'app_user_settings',
  THEME: 'app_theme'
};

// ==================== 錯誤訊息 ====================
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '網路連線失敗，請檢查網路設定',
  TIMEOUT_ERROR: '請求超時，請稍後再試',
  SERVER_ERROR: '伺服器錯誤，請稍後再試',
  VALIDATION_ERROR: '輸入內容格式不正確',
  EMPTY_MESSAGE: '請輸入訊息內容',
  MESSAGE_TOO_LONG: '訊息內容過長，請精簡後再試'
};

// ==================== 成功訊息 ====================
export const SUCCESS_MESSAGES = {
  CHAT_CREATED: '對話建立成功',
  CHAT_DELETED: '對話已刪除',
  CHAT_RENAMED: '對話重新命名成功',
  MESSAGE_SENT: '訊息已發送',
  SETTINGS_SAVED: '設定已儲存'
};