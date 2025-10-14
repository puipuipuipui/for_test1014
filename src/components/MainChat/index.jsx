// src/components/MainChat/index.jsx
import React from 'react';
import { Button, Input, Space, Badge, Dropdown } from 'antd';
import {
  SendOutlined,
  CloseOutlined,
  LayoutOutlined,
  CheckOutlined
} from '@ant-design/icons';
import ChatMessage from '../ChatMessage';
import styles from './index.module.css';

const { TextArea } = Input;

const MainChat = ({
  currentAgent,
  onAgentChange,
  agents,
  rightExpanded,
  onToggleRight,
  activeChat,
  isLoading,
  messagesEndRef,
  inputValue,
  onInputChange,
  onSend,
  inputRef
}) => {
  const currentAgentInfo = agents.find(a => a.value === currentAgent) || agents[0];

  const agentMenu = {
    items: agents.map(agent => ({
      key: agent.value,
      label: (
        <Space direction="vertical" style={{ padding: '4px 0', width: '100%' }}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Space>
              {agent.icon}
              <strong>{agent.name}</strong>
            </Space>
            {agent.value === currentAgent && (
              <CheckOutlined style={{ color: '#52c41a' }} />
            )}
          </Space>
          <div style={{ fontSize: 12, color: '#64748b', paddingLeft: 24 }}>
            {agent.desc}
          </div>
        </Space>
      ),
      onClick: () => onAgentChange(agent.value)
    }))
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <Dropdown menu={agentMenu} trigger={['click']}>
          <Button type="text" className={styles.agentTrigger}>
            <Space>
              {currentAgentInfo.icon}
              <div className={styles.agentInfo}>
                <div className={styles.agentLabel}>當前代理</div>
                <div className={styles.agentName}>{currentAgentInfo.name}</div>
              </div>
            </Space>
          </Button>
        </Dropdown>

        <Space>
          <Badge status="processing" text="知識庫已連接" />
          <Button
            type="text"
            icon={rightExpanded ? <CloseOutlined /> : <LayoutOutlined />}
            onClick={onToggleRight}
          >
            {rightExpanded ? '關閉' : '工具面板'}
          </Button>
        </Space>
      </header>

      {/* Messages */}
      <div className={styles.messages}>
        <div className={styles.messagesInner}>
          {activeChat?.messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} />
          ))}
          
          {isLoading && (
            <div className={styles.loadingMessage}>
              <ChatMessage 
                message={{
                  role: 'assistant',
                  content: '正在思考...',
                  isLoading: true
                }}
              />
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className={styles.inputArea}>
        <div className={styles.inputWrapper}>
          <div className={styles.inputBox}>
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              <div className={styles.inputRow}>
                <TextArea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => onInputChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="輸入您的問題... (Shift + Enter 換行)"
                  autoSize={{ minRows: 2, maxRows: 6 }}
                  className={styles.textarea}
                  disabled={isLoading}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={onSend}
                  size="large"
                  disabled={!inputValue.trim() || isLoading}
                  loading={isLoading}
                  className={styles.sendBtn}
                >
                  發送
                </Button>
              </div>
              <div className={styles.hint}>
                💡 提示：使用 @ 提及知識庫，使用 # 搜尋歷史對話
              </div>
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainChat;