import React from 'react';
import { Button, Input, Avatar, Dropdown, Space, Tooltip } from 'antd';
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
import { styles } from '../constants';

export default function LeftSidebar({
  leftCollapsed,
  setLeftCollapsed,
  createNewChat,
  searchQuery,
  setSearchQuery,
  filteredChats,
  activeChatId,
  setActiveChatId,
  editingChatId,
  editTitle,
  setEditTitle,
  editInputRef,
  startEdit,
  finishEdit,
  confirmDelete,
  openGraphManagement
}) {
  // 對話選單項目
  const getChatMenu = (chat) => ({
    items: [
      {
        key: 'rename',
        label: '重新命名',
        icon: <EditOutlined />,
        onClick: () => startEdit(chat)
      },
      {
        key: 'delete',
        label: '刪除對話',
        icon: <DeleteOutlined />,
        danger: true,
        onClick: () => confirmDelete(chat)
      }
    ]
  });

  // 用戶選單項目
  const userMenu = {
    items: [
      {
        key: 'graph',
        icon: <DatabaseOutlined />,
        label: '知識圖譜管理',
        onClick: openGraphManagement
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
    <aside style={styles.leftSidebar}>
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 16px' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: 20 
        }}>
          {!leftCollapsed && (
            <Space>
              <Avatar 
                size={40}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                }}
                icon={<RobotOutlined />}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#1e293b' }}>
                  Enterprise AI
                </div>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  智能助理系統
                </div>
              </div>
            </Space>
          )}
          <Tooltip title={leftCollapsed ? "展開側邊欄" : "收合側邊欄"}>
            <Button
              type="text"
              icon={leftCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setLeftCollapsed(!leftCollapsed)}
              style={{ width: 36, height: 36, borderRadius: 10 }}
            />
          </Tooltip>
        </div>

        {!leftCollapsed && (
          <>
            {/* New Chat Button */}
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={createNewChat}
              block
              size="large"
              style={{
                marginBottom: 16,
                height: 44,
                borderRadius: 12,
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)'
              }}
            >
              新建對話
            </Button>

            {/* Search */}
            <Input
              prefix={<SearchOutlined />}
              placeholder="搜尋對話記錄..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
              style={{ marginBottom: 20, borderRadius: 12 }}
            />

            {/* Section Title */}
            <div style={{
              fontSize: 12,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              margin: '20px 0 12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}>
              <ClockCircleOutlined />
              對話記錄
            </div>
            
            {/* Chat List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredChats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => {
                    if (editingChatId !== chat.id) {
                      setActiveChatId(chat.id);
                    }
                  }}
                  style={{
                    padding: '14px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: 12,
                    background: chat.id === activeChatId ? 
                      'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)' : 
                      '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    transition: 'all 0.2s',
                    borderColor: chat.id === activeChatId ? '#667eea' : '#e2e8f0',
                    boxShadow: chat.id === activeChatId ? '0 4px 12px rgba(102, 126, 234, 0.15)' : 'none'
                  }}
                >
                  {editingChatId === chat.id ? (
                    <Input
                      ref={editInputRef}
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onPressEnter={finishEdit}
                      onBlur={finishEdit}
                      onClick={(e) => e.stopPropagation()}
                      style={{ flex: 1 }}
                    />
                  ) : (
                    <>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontWeight: 600,
                          fontSize: 14,
                          color: '#1e293b',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          marginBottom: 4
                        }}>
                          {chat.title}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>
                          {chat.messages.length} 則訊息
                        </div>
                      </div>
                      <Dropdown menu={getChatMenu(chat)} trigger={['click']}>
                        <Button
                          type="text"
                          icon={<MoreOutlined />}
                          size="small"
                          onClick={(e) => e.stopPropagation()}
                          style={{ opacity: 0.6 }}
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
      {!leftCollapsed && (
        <div style={{
          borderTop: '1px solid #e5e7eb',
          padding: 16,
          background: '#f8fafc'
        }}>
          <Dropdown menu={userMenu} trigger={['click']} placement="topLeft">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: 12,
              borderRadius: 12,
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: '#ffffff',
              border: '1px solid #e2e8f0'
            }}>
              <Avatar 
                size={40}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
                icon={<UserOutlined />} 
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#1e293b' }}>
                  企業管理員
                </div>
                <div style={{
                  fontSize: 12,
                  color: '#64748b',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  admin@company.com
                </div>
              </div>
              <SettingOutlined style={{ color: '#94a3b8', fontSize: 16 }} />
            </div>
          </Dropdown>
        </div>
      )}
    </aside>
  );
}