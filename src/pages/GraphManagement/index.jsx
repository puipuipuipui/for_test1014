// src/pages/GraphManagement/index.jsx
import React, { useState } from 'react';
import {
  Layout,
  Card,
  Button,
  Upload,
  Space,
  Progress,
  Tag,
  Empty,
  Statistic,
  Modal,
  message,
  Tabs,
  List,
  Typography,
  Row,
  Col
} from 'antd';
import {
  UploadOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  DownloadOutlined,
  ReloadOutlined,
  LeftOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import styles from './index.module.css';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Dragger } = Upload;

const GraphManagement = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('create');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [processedData, setProcessedData] = useState(null);
  const [historyData] = useState([
    {
      id: 1,
      title: '建立知識｜核心企業知識庫',
      subtitle: '完成節點 124 個、關係 268 條 · 使用 multilingual-e5-large 模型',
      status: 'success',
      time: '2025/10/05 14:12'
    },
    {
      id: 2,
      title: '新增知識｜產品與型號',
      subtitle: '完成節點 8 個、關係 11 條 · 2 項衝突待審查',
      status: 'warning',
      time: '2025/10/03 09:34'
    }
  ]);

  const uploadProps = {
    multiple: true,
    fileList,
    beforeUpload: (file) => {
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        message.error('文件大小不能超過 50MB！');
        return false;
      }
      setFileList([...fileList, file]);
      return false;
    },
    onRemove: (file) => {
      const newFileList = fileList.filter(f => f.uid !== file.uid);
      setFileList(newFileList);
    }
  };

  const applySampleFiles = () => {
    const samples = [
      { uid: '1', name: '企業白皮書_v5.pdf', size: 2.4 * 1024 * 1024, status: 'done' },
      { uid: '2', name: '智慧物流案例.json', size: 820 * 1024, status: 'done' },
      { uid: '3', name: '操作手冊.txt', size: 120 * 1024, status: 'done' }
    ];
    setFileList(samples);
    message.success('已匯入範例檔案');
  };

  const startProcessing = () => {
    if (fileList.length === 0) {
      message.warning('請先上傳至少一個檔案');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setProcessedData({
            nodes: 124,
            edges: 268,
            topics: ['供應鏈最佳化', '智慧感測', '跨語系 AI'],
            nodesSample: [
              '公司｜海鋒科技',
              '產品｜Atlas Insight',
              '專利｜智慧感測演算法',
              '模型｜跨語系向量化',
              '專案｜盲測 A 計畫',
              '資料集｜Logistics-2024'
            ],
            edgesSample: [
              '海鋒科技 —[推出]→ Atlas Insight',
              'Atlas Insight —[使用]→ 跨語系向量化',
              'Atlas Insight —[引用]→ 智慧感測演算法'
            ]
          });
          message.success('知識圖譜建立完成！');
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 300);
  };

  const resetAll = () => {
    setFileList([]);
    setProgress(0);
    setProcessedData(null);
    setIsProcessing(false);
  };

  const publishToKnowledge = () => {
    Modal.confirm({
      title: '確認發佈',
      content: '確定要將此知識圖譜發佈到知識庫嗎？',
      okText: '確認發佈',
      cancelText: '取消',
      onOk: () => {
        message.success('已成功發佈至知識庫');
        resetAll();
      }
    });
  };

  const tabItems = [
    {
      key: 'create',
      label: <span><DatabaseOutlined /> 建立知識</span>,
      children: (
        <div className={styles.tabPane}>
          <Row gutter={24}>
            {/* 左側上傳區 */}
            <Col xs={24} lg={10}>
              <Card className={styles.uploadCard}>
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  <div className={styles.cardHeader}>
                    <Title level={4}>上傳檔案</Title>
                    <Button type="link" onClick={applySampleFiles}>
                      套用範例檔
                    </Button>
                  </div>

                  <Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon">
                      <UploadOutlined style={{ fontSize: 48, color: '#667eea' }} />
                    </p>
                    <p className="ant-upload-text" style={{ fontSize: 16, fontWeight: 600 }}>
                      點擊或拖曳檔案至此
                    </p>
                    <p className="ant-upload-hint" style={{ fontSize: 14, color: '#64748b' }}>
                      可同時上傳多個檔案，單檔上限 50 MB
                    </p>
                  </Dragger>

                  <Card size="small" style={{ background: '#f8fafc' }}>
                    <Title level={5} style={{ marginBottom: 12, fontSize: 14 }}>上傳提醒</Title>
                    <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: '#64748b', lineHeight: 1.8 }}>
                      <li>建議先移除封面與版權頁，可降低處理時間。</li>
                      <li>大量檔案請分批上傳，避免單批超過 200 頁。</li>
                      <li>若需審核，請先套用「預覽節點」確認內容後再發佈。</li>
                    </ul>
                  </Card>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                    <Button onClick={resetAll}>重置</Button>
                    <Button
                      type="primary"
                      size="large"
                      onClick={startProcessing}
                      loading={isProcessing}
                      disabled={fileList.length === 0}
                    >
                      開始文件處理
                    </Button>
                  </div>
                </Space>
              </Card>
            </Col>

            {/* 右側預覽區 */}
            <Col xs={24} lg={14}>
              <Card className={styles.previewCard}>
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  <div className={styles.cardHeader}>
                    <Title level={4}>圖譜預覽</Title>
                    <Button
                      type="primary"
                      onClick={publishToKnowledge}
                      disabled={!processedData}
                    >
                      發佈至知識庫
                    </Button>
                  </div>

                  {/* 統計數據 */}
                  <Row gutter={16}>
                    <Col span={8}>
                      <Card size="small" style={{ textAlign: 'center' }}>
                        <Statistic
                          title="節點數"
                          value={processedData?.nodes || 0}
                          prefix={<DatabaseOutlined />}
                        />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card size="small" style={{ textAlign: 'center' }}>
                        <Statistic
                          title="關係數"
                          value={processedData?.edges || 0}
                          prefix={<DatabaseOutlined />}
                        />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card size="small" style={{ textAlign: 'center' }}>
                        <Statistic
                          title="覆蓋主題"
                          value={processedData?.topics?.length || 0}
                        />
                      </Card>
                    </Col>
                  </Row>

                  {/* 處理進度 */}
                  {isProcessing && (
                    <Card size="small" style={{ background: '#f8fafc' }}>
                      <Progress
                        percent={Math.floor(progress)}
                        status={progress >= 100 ? 'success' : 'active'}
                        strokeColor={{ '0%': '#667eea', '100%': '#764ba2' }}
                      />
                      <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: 12 }}>
                        {progress < 30 ? '解析檔案結構...' :
                          progress < 60 ? '建立節點與關係...' :
                            progress < 90 ? '生成圖譜摘要...' : '處理完成'}
                      </Text>
                    </Card>
                  )}

                  {/* 圖譜內容 */}
                  {processedData ? (
                    <Card size="small">
                      <Space direction="vertical" style={{ width: '100%' }} size="middle">

                        <div>
                          <Title level={5} style={{ fontSize: 14, marginBottom: 12 }}>預留圖譜預覽</Title>
                          <div className={styles.graphPlaceholder}>
                            圖譜視覺化示意圖
                          </div>
                        </div>


                        <div>
                          <Title level={5} style={{ fontSize: 14, marginBottom: 12 }}>重要節點</Title>
                          <Space wrap>
                            {processedData.nodesSample.map((node, idx) => (
                              <Tag key={idx} color="blue">{node}</Tag>
                            ))}
                          </Space>
                        </div>

                        <div>
                          <Title level={5} style={{ fontSize: 14, marginBottom: 12 }}>主要關係</Title>
                          <List
                            size="small"
                            dataSource={processedData.edgesSample}
                            renderItem={item => (
                              <List.Item style={{ padding: '8px 0' }}>
                                <Text code style={{ fontSize: 13 }}>{item}</Text>
                              </List.Item>
                            )}
                          />
                        </div>
                      </Space>
                    </Card>
                  ) : (
                    <Empty
                      description="完成處理後會顯示互動節點示意"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  )}
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      )
    },
    {
      key: 'add',
      label: <span><FileTextOutlined /> 新增知識</span>,
      children: (
        <div className={styles.tabPane}>
          <Empty
            description="新增知識功能開發中"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ padding: '60px 0' }}
          />
        </div>
      )
    },
    {
      key: 'history',
      label: <span><ReloadOutlined /> 歷程記錄</span>,
      children: (
        <div className={styles.tabPane}>
          <Card>
            <div className={styles.cardHeader} style={{ marginBottom: 24 }}>
              <Title level={4}>圖譜處理紀錄</Title>
              <Button icon={<DownloadOutlined />}>下載紀錄</Button>
            </div>

            <List
              dataSource={historyData}
              renderItem={item => (
                <List.Item
                  style={{
                    padding: 20,
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                    marginBottom: 16,
                    borderLeft: item.status === 'success' ? '4px solid #52c41a' :
                      item.status === 'warning' ? '4px solid #faad14' : '4px solid #ff4d4f'
                  }}
                  actions={[
                    <Button type="text" danger icon={<DeleteOutlined />}>
                      刪除
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      item.status === 'success' ? (
                        <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                      ) : item.status === 'warning' ? (
                        <ExclamationCircleOutlined style={{ fontSize: 24, color: '#faad14' }} />
                      ) : (
                        <CloseCircleOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
                      )
                    }
                    title={<Text strong>{item.title}</Text>}
                    description={
                      <Space direction="vertical" size={4}>
                        <Text type="secondary">{item.subtitle}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>{item.time}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </div>
      )
    }
  ];

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <Space size="large">
          {/* {onBack && (
            <Button
              type="text"
              icon={<LeftOutlined />}
              onClick={onBack}
              style={{ fontWeight: 500 }}
            >
              返回對話
            </Button>
          )} */}
          <Space>
            <div className={styles.brandLogo}>
              <DatabaseOutlined />
            </div>
            <div>
              <Title level={4} style={{ margin: 0, fontSize: 18 }}>
                知識圖譜管理中心
              </Title>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Knowledge Graph Management
              </Text>
            </div>
          </Space>
        </Space>
      </Header>

      <Content className={styles.content}>
        <div className={styles.container}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            size="large"
          />
        </div>
      </Content>
    </Layout>
  );
};

export default GraphManagement;