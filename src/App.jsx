// src/App.jsx
import React, { useState } from 'react';
import { ConfigProvider, Layout, Modal, Space, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import {
  ThunderboltOutlined,
  DatabaseOutlined,
  LayoutOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  ApiOutlined
} from '@ant-design/icons';
import LeftSidebar from './components/LeftSidebar';
import MainChat from './components/MainChat';
import RightSidebar from './components/RightSidebar';
import { useChat } from './hooks/useChat';
import { INITIAL_CHATS, AGENTS as AGENTS_DATA, TABS } from './utils/constants';
import styles from './App.module.css';

const { Sider, Content } = Layout;
const { Text } = Typography;

// 創建包含圖標的 AGENTS
const AGENTS = AGENTS_DATA.map(agent => {
  const iconMap = {
    'ThunderboltOutlined': <ThunderboltOutlined />,
    'DatabaseOutlined': <DatabaseOutlined />,
    'LayoutOutlined': <LayoutOutlined />,
    'SearchOutlined': <SearchOutlined />,
    'ClockCircleOutlined': <ClockCircleOutlined />,
    'ApiOutlined': <ApiOutlined />
  };
  return {
    ...agent,
    icon: iconMap[agent.iconType]
  };
});

function App() {
  // 頁面路由狀態
  const [currentPage, setCurrentPage] = useState('chat'); // 'chat' or 'graph'

  // 聊天頁面狀態
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightExpanded, setRightExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("trace");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);

  // 使用聊天 Hook
  const {
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
    handleSend,
    cancelRequest,
    createNewChat,
    deleteChat,
    startEdit,
    finishEdit
  } = useChat(INITIAL_CHATS, AGENTS);

  // 開啟知識圖譜管理（新分頁）
  const openGraphManagement = () => {
    window.open('/graph-management', '_blank');
  };

  // 返回聊天頁面
  const backToChat = () => {
    setCurrentPage('chat');
  };

  // 確認刪除對話
  const confirmDelete = (chat) => {
    setChatToDelete(chat);
    setDeleteModalVisible(true);
  };

  // 執行刪除
  const handleDelete = () => {
    if (chatToDelete) {
      deleteChat(chatToDelete.id);
    }
    setDeleteModalVisible(false);
    setChatToDelete(null);
  };

  // 全局主題配置
  const themeConfig = {
    token: {
      colorPrimary: '#666666',
      borderRadius: 12,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans TC', sans-serif"
    }

  };

  // 如果在圖譜管理頁面
  if (currentPage === 'graph') {
    return (
      <ConfigProvider theme={themeConfig}>
        <GraphManagement />
        {/* onBack={backToChat} */}
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider theme={themeConfig}>
      <Layout className={styles.layout}>
        {/* 左側邊欄 */}
        <Sider
          collapsible
          collapsed={leftCollapsed}
          onCollapse={setLeftCollapsed}
          trigger={null}
          width={320}
          collapsedWidth={80}
          className={styles.leftSider}
        >
          <LeftSidebar
            collapsed={leftCollapsed}
            onCollapse={() => setLeftCollapsed(!leftCollapsed)}
            onNewChat={createNewChat}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            chats={filteredChats}
            activeChatId={activeChatId}
            onChatSelect={setActiveChatId}
            editingChatId={editingChatId}
            editTitle={editTitle}
            onEditTitleChange={setEditTitle}
            editInputRef={editInputRef}
            onStartEdit={startEdit}
            onFinishEdit={finishEdit}
            onDeleteChat={confirmDelete}
            onOpenGraph={openGraphManagement}
          />
        </Sider>

        {/* 主要內容區 */}
        <Layout className={styles.mainLayout}>
          <Content className={styles.content}>
            <MainChat
              currentAgent={currentAgent}
              onAgentChange={setCurrentAgent}
              agents={AGENTS}
              rightExpanded={rightExpanded}
              onToggleRight={() => setRightExpanded(!rightExpanded)}
              activeChat={activeChat}
              isLoading={isLoading}
              messagesEndRef={messagesEndRef}
              inputValue={inputValue}
              isStreaming={isStreaming}
              streamingMessage={streamingMessage}
              onInputChange={setInputValue}
              onSend={handleSend}
              inputRef={inputRef}
              onCancelRequest={cancelRequest}
            />
          </Content>
        </Layout>

        {/* 右側面板 */}
        <RightSidebar
          visible={rightExpanded}
          onClose={() => setRightExpanded(false)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeChat={activeChat}
          tabs={TABS}
        />
      </Layout>

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
    </ConfigProvider>
  );
}

export default App;