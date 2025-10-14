// constants.js - 不使用 JSX

// 工具函數
export const uid = () => Math.random().toString(36).slice(2, 10);

export const now = () => new Date().toLocaleString('zh-TW', { 
  year: 'numeric',
  month: '2-digit', 
  day: '2-digit',
  hour: '2-digit', 
  minute: '2-digit',
  hour12: false 
});

// Agent 配置（只保存數據，icon 在使用時才創建）
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

// 初始對話數據
export const INITIAL_CHATS = [
  {
    id: uid(),
    title: "教育市場週報",
    createdAt: Date.now() - 1000 * 60 * 60 * 6,
    messages: [
      { role: "assistant", content: "我已整理本週教育科技市場走勢，協助你掌握目標客群和新品上市節奏。", timestamp: now() },
      { role: "user", content: "幫我統整高中職市場導入混成教學時的痛點。", timestamp: now() },
      { role: "assistant", content: "主要痛點有三項：\n1. 教師數位教材不足\n2. 校務系統整合繁瑣\n3. 家長對資料隱私的疑慮", timestamp: now() }
    ],
    traces: []
  },
  {
    id: uid(),
    title: "客服話術草稿",
    createdAt: Date.now() - 1000 * 60 * 60 * 3,
    messages: [
      { role: "assistant", content: "我整理了針對新客戶的開場白，可以凸顯本季方案的價值。", timestamp: now() },
      { role: "user", content: "幫我補上費用說明，以及跨區使用的差異。", timestamp: now() }
    ],
    traces: []
  },
  {
    id: uid(),
    title: "數據洞察回顧",
    createdAt: Date.now() - 1000 * 60 * 60 * 0.75,
    messages: [
      { role: "assistant", content: "本週轉換率 13.8%,較上週提升 2.6%,主因是新導入的引導流程。", timestamp: now() }
    ],
    traces: []
  }
];

// 樣式常量
export const styles = {
  container: {
    height: '100vh',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans TC', sans-serif",
    background: '#f8fafc'
  },
  leftSidebar: {
    background: '#ffffff',
    borderRight: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)'
  },
  mainChat: {
    background: '#ffffff',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  }
};

// Icon 映射幫助函數
export const getIconComponent = (iconType) => {
  const iconMap = {
    'ThunderboltOutlined': 'ThunderboltOutlined',
    'DatabaseOutlined': 'DatabaseOutlined',
    'LayoutOutlined': 'LayoutOutlined',
    'SearchOutlined': 'SearchOutlined',
    'ClockCircleOutlined': 'ClockCircleOutlined',
    'ApiOutlined': 'ApiOutlined'
  };
  return iconMap[iconType];
};