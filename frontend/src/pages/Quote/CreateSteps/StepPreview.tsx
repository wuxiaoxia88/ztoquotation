import { Descriptions, Button, Space, Card, Tag } from 'antd';
import { Quoter } from '@/types';
import { formatDate, templateTypeMap } from '@/utils/format';

interface Props {
  data: any;
  quoters: Quoter[];
  onSubmit: () => void;
  onPrev: () => void;
  loading: boolean;
}

const StepPreview = ({ data, quoters, onSubmit, onPrev, loading }: Props) => {
  const quoter = quoters.find((q) => q.id === data.quoter_id);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* 基本信息 */}
      <Card title="客户信息" size="small">
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="客户名称">{data.customer_name}</Descriptions.Item>
          <Descriptions.Item label="联系人">{data.contact_person}</Descriptions.Item>
          <Descriptions.Item label="联系电话">{data.contact_phone}</Descriptions.Item>
          <Descriptions.Item label="客户地址">{data.customer_address || '-'}</Descriptions.Item>
          <Descriptions.Item label="日均发货量">{data.daily_volume || '-'}</Descriptions.Item>
          <Descriptions.Item label="重量段">{data.weight_range || '-'}</Descriptions.Item>
          <Descriptions.Item label="产品类型" span={2}>{data.product_type || '-'}</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 报价信息 */}
      <Card title="报价信息" size="small">
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="报价人">{quoter?.name}</Descriptions.Item>
          <Descriptions.Item label="报价日期">{formatDate(data.quote_date)}</Descriptions.Item>
          <Descriptions.Item label="有效天数">{data.valid_days} 天</Descriptions.Item>
          <Descriptions.Item label="是否含税">{data.is_tax_included ? '是' : '否'}</Descriptions.Item>
          <Descriptions.Item label="模板类型" span={2}>
            {templateTypeMap[data.template_type]}
          </Descriptions.Item>
          <Descriptions.Item label="备注" span={2}>{data.remark || '-'}</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 价格信息 */}
      <Card title="价格信息" size="small">
        <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4, fontSize: 12 }}>
          {JSON.stringify(data.price_data, null, 2)}
        </pre>
      </Card>

      {/* 条款信息 */}
      <Card title="条款信息" size="small">
        {data.fixed_terms && data.fixed_terms.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <strong>固定条款:</strong>
            <div style={{ marginTop: 8 }}>
              {data.fixed_terms.map((term: any, index: number) => (
                <Tag key={index} color="blue" style={{ marginBottom: 4 }}>
                  {term.title}
                </Tag>
              ))}
            </div>
          </div>
        )}

        {data.optional_terms && data.optional_terms.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <strong>已选条款:</strong>
            <div style={{ marginTop: 8 }}>
              {data.optional_terms.map((term: any, index: number) => (
                <Tag key={index} color="green" style={{ marginBottom: 4 }}>
                  {term.title}
                </Tag>
              ))}
            </div>
          </div>
        )}

        {data.custom_terms && data.custom_terms.length > 0 && (
          <div>
            <strong>自定义条款:</strong>
            <div style={{ marginTop: 8 }}>
              {data.custom_terms.map((term: string, index: number) => (
                <div key={index} style={{ marginBottom: 4 }}>
                  • {term}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* 操作按钮 */}
      <Space>
        <Button onClick={onPrev}>上一步</Button>
        <Button type="primary" onClick={onSubmit} loading={loading}>
          保存报价单
        </Button>
      </Space>
    </Space>
  );
};

export default StepPreview;
