// src/components/MainChat/index.jsx

import React from 'react';
import { Button, Input, Space, Select } from 'antd';
import { 
  SendOutlined, 
  CloseOutlined, 
  LayoutOutlined,
  StopOutlined
} from '@ant-design/icons';
import ChatMessage from '../ChatMessage';
import styles from './index.module.css';

const { TextArea } = Input;

const MainChat = ({
  activeChat,
  currentAgent,
  agents,
  inputValue,
  isLoading,
  isStreaming,
  streamingMessage,
  rightExpanded,
  messagesEndRef,
  inputRef,
  onAgentChange,
  onInputChange,
  onSend,
  onToggleRight,
  onCancelRequest
}) => {
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && !isStreaming) {
        onSend();
      }
    }
  };

  return (
    <div className={styles.mainChat}>
      {/* Header */}
      <header className={styles.header}>
        <Space size="middle">
          <span className={styles.chatTitle}>
            {activeChat?.title || '選擇或建立對話'}
          </span>
          <Select
            value={currentAgent}
            onChange={onAgentChange}
            style={{ minWidth: 180 }}
            options={agents.map(agent => ({
              value: agent.value,
              label: (
                <Space>
                  {agent.icon}
                  <span>{agent.name}</span>
                </Space>
              )
            }))}
          />
        </Space>
        <Space>
          <Button
            type={rightExpanded ? "default" : "primary"}
            icon={rightExpanded ? <CloseOutlined /> : <LayoutOutlined />}
            onClick={onToggleRight}
          >
            {rightExpanded ? '關閉' : '工具面板'}
          </Button>
        </Space>
      </header>

      {/* Messages */}
      <div className={styles.messages}>
        <div className={styles.messagesInner} style={{ overflowY: 'auto', height: '100%' }}>
          {activeChat?.messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} />
          ))}
          
          {/* 串流中的訊息 */}
          {isStreaming && streamingMessage && (
            <div className={styles.streamingMessage}>
              <ChatMessage 
                message={{
                  role: 'assistant',
                  content: streamingMessage,
                  isStreaming: true
                }}
              />
            </div>
          )}
          
          {/* 載入中但還沒開始串流 */}
          {isLoading && !isStreaming && !streamingMessage && (
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
                  disabled={isLoading || isStreaming}
                />
                
                {/* 發送或取消按鈕 */}
                {isStreaming ? (
                  <Button
                    danger
                    icon={<StopOutlined />}
                    onClick={onCancelRequest}
                    size="large"
                    className={styles.sendBtn}
                  >
                    停止
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={onSend}
                    size="large"
                    disabled={!inputValue.trim() || isLoading}
                    loading={isLoading && !isStreaming}
                    className={styles.sendBtn}
                  >
                    
                  </Button>
                )}
              </div>
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainChat;