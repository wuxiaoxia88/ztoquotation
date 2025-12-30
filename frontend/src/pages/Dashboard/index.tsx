import { Card, Row, Col, Statistic } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const Dashboard = () => {
  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>仪表盘</h2>

      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总报价单"
              value={0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title="待确认"
              value={0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title="已确认"
              value={0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title="已过期"
              value={0}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="最近报价单" style={{ marginTop: 24 }}>
        <p style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>
          暂无数据
        </p>
      </Card>
    </div>
  );
};

export default Dashboard;
