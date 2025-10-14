// src/components/ChatMessage/index.jsx
import React from 'react';
import { Avatar, Card, Typography, Space } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';
import styles from './index.module.css';

const { Text } = Typography;

const ChatMessage = ({ message }) => {
  const { role, content, timestamp, isLoading } = message;
  const isUser = role === 'user';

  return (
    <div className={`${styles.message} ${isUser ? styles.user : styles.assistant}`}>
      <Avatar 
        size={40}
        className={styles.avatar}
        icon={isUser ? <UserOutlined /> : <RobotOutlined />}
      />
      <Card className={styles.bubble} bordered={false}>
        <div className={styles.header}>
          <Text strong className={styles.role}>
            {isUser ? '您' : 'AI 助理'}
          </Text>
          {timestamp && (
            <Text type="secondary" className={styles.timestamp}>
              {timestamp}
            </Text>
          )}
        </div>
        <div className={styles.content}>
          {isLoading ? (
            <Space>
              <div className={styles.loadingDot} />
              <div className={styles.loadingDot} style={{ animationDelay: '0.2s' }} />
              <div className={styles.loadingDot} style={{ animationDelay: '0.4s' }} />
            </Space>
          ) : (
            content
          )}
        </div>
      </Card>
    </div>
  );
};

export default ChatMessage;