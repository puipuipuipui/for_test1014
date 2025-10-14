// src/utils/helpers.js

/**
 * 生成唯一 ID
 * @returns {string} 8 位隨機字串
 */
export const uid = () => Math.random().toString(36).slice(2, 10);

/**
 * 獲取當前時間字串（台灣時區）
 * @returns {string} 格式化的時間字串
 */
export const now = () => new Date().toLocaleString('zh-TW', { 
  year: 'numeric',
  month: '2-digit', 
  day: '2-digit',
  hour: '2-digit', 
  minute: '2-digit',
  hour12: false 
});

/**
 * 格式化時間戳
 * @param {number|string|Date} timestamp - 時間戳
 * @returns {string} 格式化的時間字串
 */
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString('zh-TW', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

/**
 * 生成模擬 AI 回覆
 * @param {string} input - 用戶輸入
 * @param {string} agentName - 代理名稱
 * @param {boolean} usedKG - 是否使用知識圖譜
 * @returns {string} 模擬回覆內容
 */
export const generateMockResponse = (input, agentName, usedKG) => {
  return `針對您的問題「${input}」，系統分析結果如下：

根據 ${agentName} 代理分析，${usedKG ? '已從知識圖譜中檢索相關資訊' : '已從文件庫中檢索相關資料'}。

建議採取以下行動方案：
• 優先處理核心需求
• 整合現有資源
• 建立追蹤機制

${usedKG ? '📊 本次回應使用了知識圖譜增強' : '📄 本次回應基於文件檢索'}`;
};

/**
 * 生成執行軌跡
 * @param {string} input - 用戶輸入
 * @param {string} agent - 代理類型
 * @param {boolean} usedKG - 是否使用知識圖譜
 * @returns {object} 執行軌跡對象
 */
export const generateTrace = (input, agent, usedKG) => {
  return {
    id: uid(),
    time: new Date().toLocaleString('zh-TW', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    }),
    agent,
    usedKG,
    inputText: input,
    steps: usedKG 
      ? [
          "分析查詢意圖",
          "檢索知識圖譜",
          "整合多源資料",
          "生成結構化回覆",
          "品質驗證"
        ] 
      : [
          "分析查詢意圖",
          "文件向量檢索",
          "語意排序",
          "生成回覆"
        ]
  };
};

/**
 * 防抖函數
 * @param {Function} func - 要執行的函數
 * @param {number} wait - 延遲時間（毫秒）
 * @returns {Function} 防抖後的函數
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * 節流函數
 * @param {Function} func - 要執行的函數
 * @param {number} limit - 時間限制（毫秒）
 * @returns {Function} 節流後的函數
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * 截取文字
 * @param {string} text - 原始文字
 * @param {number} maxLength - 最大長度
 * @returns {string} 截取後的文字
 */
export const truncate = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * 格式化檔案大小
 * @param {number} bytes - 位元組數
 * @returns {string} 格式化的檔案大小
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * 深度複製物件
 * @param {*} obj - 要複製的物件
 * @returns {*} 複製後的物件
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    console.error('Deep clone failed:', error);
    return obj;
  }
};

/**
 * 檢查是否為空值
 * @param {*} value - 要檢查的值
 * @returns {boolean} 是否為空
 */
export const isEmpty = (value) => {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * 延遲執行
 * @param {number} ms - 延遲時間（毫秒）
 * @returns {Promise} Promise 對象
 */
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 生成隨機顏色
 * @returns {string} 十六進制顏色碼
 */
export const randomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};

/**
 * 獲取對比色（黑或白）
 * @param {string} hexColor - 十六進制顏色
 * @returns {string} 對比色
 */
export const getContrastColor = (hexColor) => {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#ffffff';
};

/**
 * 數字格式化（加千分位）
 * @param {number} num - 數字
 * @returns {string} 格式化後的字串
 */
export const formatNumber = (num) => {
  if (num == null || isNaN(num)) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * 百分比格式化
 * @param {number} value - 數值
 * @param {number} total - 總數
 * @param {number} decimals - 小數位數
 * @returns {string} 百分比字串
 */
export const formatPercentage = (value, total, decimals = 1) => {
  if (total === 0) return '0%';
  const percentage = (value / total) * 100;
  return percentage.toFixed(decimals) + '%';
};

/**
 * 複製到剪貼板
 * @param {string} text - 要複製的文字
 * @returns {Promise<boolean>} 是否成功
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Copy failed:', error);
    return false;
  }
};

/**
 * 下載文件
 * @param {string} content - 文件內容
 * @param {string} filename - 文件名
 * @param {string} mimeType - MIME 類型
 */
export const downloadFile = (content, filename, mimeType = 'text/plain') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * 獲取查詢參數
 * @param {string} param - 參數名
 * @returns {string|null} 參數值
 */
export const getQueryParam = (param) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

/**
 * 設置查詢參數
 * @param {string} param - 參數名
 * @param {string} value - 參數值
 */
export const setQueryParam = (param, value) => {
  const url = new URL(window.location.href);
  url.searchParams.set(param, value);
  window.history.pushState({}, '', url.toString());
};

/**
 * 移除查詢參數
 * @param {string} param - 參數名
 */
export const removeQueryParam = (param) => {
  const url = new URL(window.location.href);
  url.searchParams.delete(param);
  window.history.pushState({}, '', url.toString());
};

/**
 * 檢查是否為移動設備
 * @returns {boolean} 是否為移動設備
 */
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * 獲取設備類型
 * @returns {string} 設備類型
 */
export const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
};

/**
 * 生成範圍內的隨機整數
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 隨機整數
 */
export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * 陣列去重
 * @param {Array} array - 原始陣列
 * @returns {Array} 去重後的陣列
 */
export const unique = (array) => {
  return [...new Set(array)];
};

/**
 * 陣列分組
 * @param {Array} array - 原始陣列
 * @param {number} size - 分組大小
 * @returns {Array} 分組後的陣列
 */
export const chunk = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

/**
 * 打亂陣列
 * @param {Array} array - 原始陣列
 * @returns {Array} 打亂後的陣列
 */
export const shuffle = (array) => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};