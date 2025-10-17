// src/components/RightSidebar/index.jsx
import React from 'react';
import { Button, Card, Space, Tag, Empty, Divider, Typography } from 'antd';
import {
  ThunderboltOutlined,
  DatabaseOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  RobotOutlined
} from '@ant-design/icons';
import styles from './index.module.css';

const { Text } = Typography;

const RightSidebar = ({
  visible,
  onClose,
  activeTab,
  onTabChange,
  activeChat,
  tabs,
  kgData,
  executionLog,
}) => {
  // console.log('✅ RightSidebar props:', { kgData, executionLog });
  // console.log('✅ activeChat:', activeChat);
  if (!visible) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'trace':
        return (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {activeChat?.traces && activeChat.traces.length > 0 ? (
              activeChat.traces.map(trace => (
                <Card key={trace.id} size="small" className={styles.traceCard}>
                  <div className={styles.traceHeader}>
                    <Tag color={trace.usedKG ? 'purple' : '#333333'}>
                      {trace.usedKG ? '知識圖譜模式' : '文件檢索模式'}
                    </Tag>
                    <Text type="secondary" className={styles.traceTime}>
                      {trace.time}
                    </Text>
                  </div>
                  <Divider style={{ margin: '12px 0' }} />
                  <div className={styles.traceAgent}>
                    <RobotOutlined /> 代理：{trace.agent}
                  </div>
                  <Space direction="vertical" style={{ width: '100%' }} size="small">
                    {trace.steps.map((step, idx) => (
                      <div key={idx} className={styles.traceStep}>
                        <div className={styles.stepNumber}>{idx + 1}</div>
                        <div className={styles.stepContent}>{step}</div>
                      </div>
                    ))}
                  </Space>
                </Card>
              ))
            ) : (
              <Empty
                description="尚無執行軌跡"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Space>
        );

      case 'kg':
        console.log('🔍 kg tab - kgData:', kgData);
        return (
          <div>
            {kgData ? (
              <Card title="知識圖譜資料">
                <pre style={{
                  background: '#f5f5f5',
                  padding: '12px',
                  borderRadius: '8px',
                  maxHeight: '400px',
                  overflow: 'auto'
                }}>
                  {JSON.stringify(kgData, null, 2)}
                </pre>
              </Card>
            ) : (
              <Card className={styles.emptyCard}>
                <Empty
                  description="知識圖譜資訊"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </Card>
            )}
          </div>
        );

      case 'sources':
        return (
          <div>
            {executionLog ? (
              <Card title="執行日誌">
                <pre style={{
                  background: '#f5f5f5',
                  padding: '12px',
                  borderRadius: '8px',
                  maxHeight: '400px',
                  overflow: 'auto'
                }}>
                  {JSON.stringify(executionLog, null, 2)}
                </pre>
              </Card>
            ) : (
              <Card className={styles.emptyCard}>
                <Empty
                  description="執行日誌將在查詢後顯示"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </Card>
            )}
          </div>
        );

      case 'perf':
        return (
          <Card title="效能統計" className={styles.perfCard}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div className={styles.perfItem}>
                <Text strong>平均回應時間</Text>
                <div className={styles.perfValue} style={{ color: '#667eea' }}>
                  1.2 秒
                </div>
              </div>
              <Divider style={{ margin: 0 }} />
              <div className={styles.perfItem}>
                <Text strong>知識庫命中率</Text>
                <div className={styles.perfValue} style={{ color: '#10b981' }}>
                  87%
                </div>
              </div>
              <Divider style={{ margin: 0 }} />
              <div className={styles.perfItem}>
                <Text strong>今日查詢次數</Text>
                <div className={styles.perfValue} style={{ color: '#f59e0b' }}>
                  45 次
                </div>
              </div>
            </Space>
          </Card>
        );

      default:
        return null;
    }
  };

  const getTabIcon = (tabKey) => {
    const iconMap = {
      trace: <ThunderboltOutlined />,
      kg: <DatabaseOutlined />,
      sources: <SearchOutlined />,
      perf: <ClockCircleOutlined />
    };
    return iconMap[tabKey];
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Space wrap className={styles.tabs}>
          {tabs.map(tab => (
            <Button
              key={tab.key}
              type={activeTab === tab.key ? 'primary' : 'default'}
              icon={getTabIcon(tab.key)}
              onClick={() => onTabChange(tab.key)}
              className={`${styles.tab} ${activeTab === tab.key ? styles.active : ''}`}
            >
              {tab.label}
            </Button>
          ))}
        </Space>
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={onClose}
          className={styles.closeBtn}
        />
      </div>

      <div className={styles.content}>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default RightSidebar;