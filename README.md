# 🧩 grag_agent — React + Ant Design + Vite 專案

這是一個以 **React 19 + Ant Design 5 + Vite 7** 為基礎構建的前端應用範本，整合 **CSS Modules** 樣式隔離與 **Hook 模組化設計**，適用於構建聊天介面、知識圖譜管理或交互式資料控制面板。

---

## 🚀 技術堆疊

| 類別 | 技術與版本 |
|------|-------------|
| 前端框架 | React **19.1.1** |
| 打包工具 | Vite **7.1.7** |
| UI 元件庫 | Ant Design **5.27.4** |
| 圖示套件 | @ant-design/icons **6.1.0** |
| 樣式方案 | CSS Modules + global variables |
| Node.js 版本 | **v22.20.0 (LTS)** |
| 程式語言特性 | ES Modules (`"type": "module"`) |
| 程式碼品質 | ESLint 9 + React Hooks Plugin |

---

## 📁 專案結構

```
src/
├── main.jsx                  # 專案進入點
├── App.jsx                   # 主應用組件
├── App.module.css            # App 專屬樣式
│
├── components/               # 可重用元件模組
│   ├── LeftSidebar/          # 左側選單區
│   │   ├── index.jsx
│   │   └── index.module.css
│   ├── MainChat/             # 主聊天視窗
│   ├── RightSidebar/         # 右側資訊區
│   └── ChatMessage/          # 聊天訊息單元
│
├── pages/
│   └── GraphManagement/      # 圖譜/節點管理頁
│       ├── index.jsx
│       └── index.module.css
│
├── hooks/
│   └── useChat.js            # 自訂 Hook：聊天邏輯與狀態管理
│
├── utils/
│   ├── constants.js          # 全域常數定義
│   └── helpers.js            # 共用工具函式
│
└── styles/
    ├── global.css            # 全域樣式設定
    └── variables.css         # 色彩、間距、字體變數
```

---

## ⚙️ 安裝與啟動

### 1️⃣ 安裝 Node.js
請確認使用 LTS 版本：
```bash
node -v
# v22.20.0
```

---

### 2️⃣ 安裝依賴套件
```bash
npm install
```

---

### 3️⃣ 啟動開發伺服器
```bash
npm run dev
```
執行後可於 [http://localhost:5173](http://localhost:5173) 預覽。

---

### 4️⃣ 打包正式版
```bash
npm run build
```
打包後的檔案會輸出至 `/dist`，可直接部署至靜態伺服器或 CDN。

---

### 5️⃣ 預覽打包結果
```bash
npm run preview
```

---

## 🧠 模組說明

| 模組 | 功能摘要 |
|------|-----------|
| **LeftSidebar** | 聊天室列表或功能導覽區 |
| **MainChat** | 聊天內容顯示與輸入控制 |
| **RightSidebar** | 顯示使用者、屬性或其他輔助資訊 |
| **ChatMessage** | 單則訊息元件（含時間戳與樣式） |
| **GraphManagement** | 節點與關聯視覺化管理介面 |
| **useChat.js** | 管理聊天狀態、訊息串、API 呼叫 |
| **helpers.js** | 時間格式化、ID 生成等共用工具 |
| **constants.js** | 系統常數與環境設定 |

---

## 🎨 樣式管理

- 採用 **CSS Modules** 確保各組件樣式獨立。  
- 全域變數定義於 `styles/variables.css`。  
- `global.css` 用於重設樣式與設定主題基底。  

Ant Design 元件可與 CSS Modules 混用，推薦以 `:global` 選擇器進行覆寫。

---

## 🧰 常用指令

| 指令 | 功能 |
|------|------|
| `npm run dev` | 啟動開發伺服器 |
| `npm run build` | 打包正式版 |
| `npm run preview` | 預覽打包後版本 |
| `npm run lint` | 執行 ESLint 檢查 |

