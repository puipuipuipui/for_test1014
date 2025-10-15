// src/components/ChatMessage/index.jsx

import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styles from './index.module.css';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  const isLoading = message.isLoading;
  const isStreaming = message.isStreaming;

  return (
    <div className={`${styles.message} ${isUser ? styles.user : styles.assistant}`}>
      {/* <div className={styles.avatar}>
        {isUser ? <UserOutlined /> : <RobotOutlined />}
      </div> */}
      <div className={styles.content}>
        <div className={styles.bubble}>
          {isLoading ? (
            <Space>
              <Spin indicator={<LoadingOutlined spin />} size="small" />
              <span>正在思考...</span>
            </Space>
          ) : (
            <>
              {/* 使用 dangerouslySetInnerHTML 或直接顯示，視你的需求 */}
              <div className={styles.text}>
                {message.content.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < message.content.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
              
              {/* 串流中的游標效果 */}
              {isStreaming && (
                <span className={styles.cursor}>▋</span>
              )}
            </>
          )}
        </div>
        {message.timestamp && !isLoading && (
          <div className={styles.timestamp}>{message.timestamp}</div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;