// src/components/LeftSidebar/index.jsx
import React from 'react';
import { Button, Input, Avatar, Dropdown, Space } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
  MoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ClockCircleOutlined,
  RobotOutlined,
  UserOutlined,
  DatabaseOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import styles from './index.module.css';

const LeftSidebar = ({
  collapsed,
  onCollapse,
  onNewChat,
  searchQuery,
  onSearchChange,
  chats,
  activeChatId,
  onChatSelect,
  editingChatId,
  editTitle,
  onEditTitleChange,
  editInputRef,
  onStartEdit,
  onFinishEdit,
  onDeleteChat,
  onOpenGraph
}) => {
  const getChatMenu = (chat) => ({
    items: [
      {
        key: 'rename',
        label: '重新命名',
        icon: <EditOutlined />,
        onClick: () => onStartEdit(chat)
      },
      {
        key: 'delete',
        label: '刪除對話',
        icon: <DeleteOutlined />,
        danger: true,
        onClick: () => onDeleteChat(chat)
      }
    ]
  });

  const userMenu = {
    items: [
      {
        key: 'graph',
        icon: <DatabaseOutlined />,
        label: '知識圖譜管理',
        onClick: onOpenGraph
      },
      { type: 'divider' },
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: '系統設定'
      },
      {
        key: 'help',
        icon: <QuestionCircleOutlined />,
        label: '使用說明'
      },
      { type: 'divider' },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '登出系統',
        danger: true
      }
    ]
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          {!collapsed && (
            <Space>
              <Avatar 
                size={40}
                className={styles.brandAvatar}
                icon={<RobotOutlined />}
              />
              <div>
                <div className={styles.brandName}>Enterprise AI</div>
                <div className={styles.brandSub}>智能助理系統</div>
              </div>
            </Space>
          )}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={onCollapse}
            className={styles.collapseBtn}
          />
        </div>

        {!collapsed && (
          <>
            {/* New Chat Button */}
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onNewChat}
              block
              size="large"
              className={styles.newChatBtn}
            >
              新建對話
            </Button>

            {/* Search */}
            <Input
              prefix={<SearchOutlined />}
              placeholder="搜尋對話記錄..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              allowClear
              className={styles.searchInput}
            />

            {/* Section Title */}
            <div className={styles.sectionTitle}>
              <ClockCircleOutlined /> 對話記錄
            </div>

            {/* Chat List */}
            <div className={styles.chatList}>
              {chats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => {
                    if (editingChatId !== chat.id) {
                      onChatSelect(chat.id);
                    }
                  }}
                  className={`${styles.chatItem} ${chat.id === activeChatId ? styles.active : ''}`}
                >
                  {editingChatId === chat.id ? (
                    <Input
                      ref={editInputRef}
                      value={editTitle}
                      onChange={(e) => onEditTitleChange(e.target.value)}
                      onPressEnter={onFinishEdit}
                      onBlur={onFinishEdit}
                      onClick={(e) => e.stopPropagation()}
                      className={styles.editInput}
                    />
                  ) : (
                    <>
                      <div className={styles.chatContent}>
                        <div className={styles.chatTitle}>{chat.title}</div>
                        <div className={styles.chatMeta}>
                          {chat.messages.length} 則訊息
                        </div>
                      </div>
                      <Dropdown menu={getChatMenu(chat)} trigger={['click']}>
                        <Button
                          type="text"
                          icon={<MoreOutlined />}
                          size="small"
                          onClick={(e) => e.stopPropagation()}
                          className={styles.moreBtn}
                        />
                      </Dropdown>
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* User Section */}
      {!collapsed && (
        <div className={styles.userSection}>
          <Dropdown menu={userMenu} trigger={['click']} placement="topLeft">
            <div className={styles.userSummary}>
              <Avatar
                size={40}
                className={styles.userAvatar}
                icon={<UserOutlined />}
              />
              <div className={styles.userInfo}>
                <div className={styles.userName}>企業管理員</div>
                <div className={styles.userEmail}>admin@company.com</div>
              </div>
              <SettingOutlined className={styles.settingIcon} />
            </div>
          </Dropdown>
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;