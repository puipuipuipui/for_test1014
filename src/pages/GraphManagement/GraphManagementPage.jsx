import React from 'react';
import { ConfigProvider } from 'antd';
import GraphManagement from './index.jsx';

const GraphManagementPage = () => {
  const themeConfig = {
    token: {
      colorPrimary: '#667eea',
      borderRadius: 12,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans TC', sans-serif"
    }
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <GraphManagement onBack={() => window.close()} />
    </ConfigProvider>
  );
};

export default GraphManagementPage;