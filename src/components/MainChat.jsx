import React from 'react';
import { Button, Input, Avatar, Card, Space, Dropdown, Badge, Empty, Typography } from 'antd';
import {
  SendOutlined,
  CloseOutlined,
  LayoutOutlined,
  RobotOutlined,
  UserOutlined,
  CheckOutlined,
  ThunderboltOutlined,
  DatabaseOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  ApiOutlined
} from '@ant-design/icons';
import { AGENTS as AGENTS_DATA, styles } from '../constants';

const { TextArea } = Input;
const { Text } = Typography;

// Icon 映射
const ICON_MAP = {
  'ThunderboltOutlined': <ThunderboltOutlined />,
  'DatabaseOutlined': <DatabaseOutlined />,
  'LayoutOutlined': <LayoutOutlined />,
  'SearchOutlined': <SearchOutlined />,
  'ClockCircleOutlined': <ClockCircleOutlined />,
  'ApiOutlined': <ApiOutlined />
};

// 將 iconType 轉換為實際的 icon 組件
const AGENTS = AGENTS_DATA.map(agent => ({
  ...agent,
  icon: ICON_MAP[agent.iconType]
}));

export default function MainChat({
  currentAgent,
  setCurrentAgent,
  rightExpanded,
  setRightExpanded,
  activeChat,
  isLoading,
  messagesEndRef,
  inputValue,
  setInputValue,
  handleSend,
  inputRef
}) {
  const currentAgentInfo = AGENTS.find(a => a.value === currentAgent) || AGENTS[0];

  // Agent 選單項目
  const agentMenu = {
    items: AGENTS.map(agent => ({
      key: agent.value,
      label: (
        <Space direction="vertical" style={{ padding: '4px 0' }}>
          <Space>
            {agent.icon}
            <Text strong>{agent.name}</Text>
            {agent.value === currentAgent && <CheckOutlined style={{ color: '#52c41a' }} />}
          </Space>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {agent.desc}
          </Text>
        </Space>
      ),
      onClick: () => setCurrentAgent(agent.value)
    }))
  };

  // 渲染訊息列表
  const renderMessages = () => {
    if (!activeChat || activeChat.messages.length === 0) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px'
        }}>
          <Empty
            description="開始新對話"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      );
    }

    return (
      <>
        {activeChat.messages.map((msg, idx) => (
          <div 
            key={idx}
            style={{
              display: 'flex',
              gap: 16,
              alignItems: 'flex-start',
              animation: 'fadeIn 0.3s ease-out'
            }}
          >
            <Avatar 
              size={40}
              style={{
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                background: msg.role === 'user' ?
                  'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
                  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
              icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
            />
            <Card 
              style={{
                flex: 1,
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                borderRadius: 16
              }}
              bordered={false}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
                paddingBottom: 8,
                borderBottom: '1px solid #f1f5f9'
              }}>
                <Text strong style={{ fontSize: 13, color: '#475569' }}>
                  {msg.role === 'user' ? '您' : 'AI 助理'}
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {msg.timestamp}
                </Text>
              </div>
              <div style={{
                fontSize: 14,
                lineHeight: 1.7,
                color: '#334155',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {msg.content}
              </div>
            </Card>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <Avatar 
              size={40}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
              icon={<RobotOutlined />}
            />
            <Card style={{ flex: 1 }}>
              <Space>
                <div className="loading" style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#667eea',
                  animation: 'pulse 1.5s ease-in-out infinite'
                }} />
                <Text type="secondary">正在思考...</Text>
              </Space>
            </Card>
          </div>
        )}
      </>
    );
  };

  return (
    <main style={styles.mainChat}>
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: 0
      }}>
        {/* Header */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          borderBottom: '1px solid #e5e7eb',
          background: '#ffffff',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}>
          <Dropdown menu={agentMenu} trigger={['click']}>
            <Button
              type="text"
              style={{
                height: 'auto',
                padding: '10px 16px',
                borderRadius: 12,
                border: '1px solid #e2e8f0'
              }}
            >
              <Space>
                {currentAgentInfo.icon}
                <div style={{ textAlign: 'left' }}>
                  <div style={{
                    fontSize: 11,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    當前代理
                  </div>
                  <div style={{ fontWeight: 600, color: '#1e293b', fontSize: 14 }}>
                    {currentAgentInfo.name}
                  </div>
                </div>
              </Space>
            </Button>
          </Dropdown>

          <Space>
            <Badge status="processing" text="知識庫已連接" />
            <Button
              type="text"
              icon={rightExpanded ? <CloseOutlined /> : <LayoutOutlined />}
              onClick={() => setRightExpanded(!rightExpanded)}
            >
              {rightExpanded ? '關閉' : '工具面板'}
            </Button>
          </Space>
        </header>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          background: '#f9fafb'
        }}>
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 20
          }}>
            {renderMessages()}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div style={{ 
          padding: '16px 24px 20px',
          background: '#ffffff',
          borderTop: '1px solid #e5e7eb'
        }}>
          <div style={{
            width: '100%'
          }}>
            <Card 
              style={{
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                borderRadius: 20,
                border: '1px solid #e2e8f0'
              }}
              bordered={false}
            >
              <Space direction="vertical" style={{ width: '100%' }} size={12}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                  <TextArea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onPressEnter={(e) => {
                      if (!e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="輸入您的問題... (Shift + Enter 換行)"
                    autoSize={{ minRows: 2, maxRows: 6 }}
                    style={{
                      flex: 1,
                      border: '1px solid #e2e8f0',
                      borderRadius: 14,
                      padding: '12px 16px',
                      fontSize: 14
                    }}
                    disabled={isLoading}
                  />
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSend}
                    size="large"
                    disabled={!inputValue.trim() || isLoading}
                    loading={isLoading}
                    style={{
                      height: 44,
                      borderRadius: 12,
                      padding: '0 24px',
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)'
                    }}
                  >
                    發送
                  </Button>
                </div>
                <div style={{
                  fontSize: 12,
                  color: '#64748b',
                  textAlign: 'center'
                }}>
                  💡 提示：使用 @ 提及知識庫,使用 # 搜尋歷史對話
                </div>
              </Space>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}