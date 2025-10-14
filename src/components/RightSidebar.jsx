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

const { Text } = Typography;

export default function RightSidebar({
  rightExpanded,
  setRightExpanded,
  activeTab,
  setActiveTab,
  activeChat
}) {
  if (!rightExpanded) return null;

  return (
    <aside style={{
      position: 'fixed',
      right: 0,
      top: 0,
      height: '100vh',
      width: 440,
      background: '#ffffff',
      borderLeft: '1px solid #e5e7eb',
      transform: 'translateX(0)',
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottom: '1px solid #e5e7eb',
        background: '#f8fafc'
      }}>
        <Space wrap>
          {[
            { key: 'trace', label: '執行軌跡', icon: <ThunderboltOutlined /> },
            { key: 'kg', label: '知識圖譜', icon: <DatabaseOutlined /> },
            { key: 'sources', label: '來源資料', icon: <SearchOutlined /> },
            { key: 'perf', label: '效能分析', icon: <ClockCircleOutlined /> }
          ].map(tab => (
            <Button
              key={tab.key}
              type={activeTab === tab.key ? 'primary' : 'default'}
              icon={tab.icon}
              onClick={() => setActiveTab(tab.key)}
              style={{
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 500
              }}
            >
              {tab.label}
            </Button>
          ))}
        </Space>
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={() => setRightExpanded(false)}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10
          }}
        />
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 16
      }}>
        {activeTab === 'trace' && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {activeChat?.traces && activeChat.traces.length > 0 ? (
              activeChat.traces.map(trace => (
                <Card key={trace.id} size="small" style={{ borderRadius: 14 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12
                  }}>
                    <Tag color={trace.usedKG ? 'purple' : 'blue'}>
                      {trace.usedKG ? '知識圖譜模式' : '文件檢索模式'}
                    </Tag>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {trace.time}
                    </Text>
                  </div>
                  <Divider style={{ margin: '12px 0' }} />
                  <div style={{
                    fontSize: 13,
                    color: '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 12,
                    fontWeight: 500
                  }}>
                    <RobotOutlined /> 代理：{trace.agent}
                  </div>
                  <Space direction="vertical" style={{ width: '100%' }} size="small">
                    {trace.steps.map((step, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <div style={{
                          width: 24,
                          height: 24,
                          borderRadius: 8,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          fontWeight: 700,
                          flexShrink: 0
                        }}>
                          {idx + 1}
                        </div>
                        <div style={{
                          flex: 1,
                          fontSize: 13,
                          color: '#334155',
                          lineHeight: 1.6,
                          paddingTop: 2
                        }}>
                          {step}
                        </div>
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
        )}
        
        {activeTab === 'kg' && (
          <Card>
            <Empty 
              description="知識圖譜資訊"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button type="primary" icon={<DatabaseOutlined />} style={{ marginTop: 16 }}>
                開啟圖譜管理
              </Button>
            </Empty>
          </Card>
        )}
        
        {activeTab === 'sources' && (
          <Card>
            <Empty 
              description="來源資料將在查詢後顯示"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </Card>
        )}
        
        {activeTab === 'perf' && (
          <Card title="效能統計" style={{ borderRadius: 14 }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <Text strong>平均回應時間</Text>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#667eea', marginTop: 8 }}>
                  1.2 秒
                </div>
              </div>
              <Divider style={{ margin: 0 }} />
              <div>
                <Text strong>知識庫命中率</Text>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#10b981', marginTop: 8 }}>
                  87%
                </div>
              </div>
              <Divider style={{ margin: 0 }} />
              <div>
                <Text strong>今日查詢次數</Text>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#f59e0b', marginTop: 8 }}>
                  45 次
                </div>
              </div>
            </Space>
          </Card>
        )}
      </div>
    </aside>
  );
}