import { Radio, Button, Space, Card, Tag, Empty } from 'antd';
import { Template, TemplateType } from '@/types';
import { templateTypeMap } from '@/utils/format';

interface Props {
  data: any;
  templates: Template[];
  onChange: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepSelectTemplate = ({ data, templates, onChange, onNext, onPrev }: Props) => {
  const handleTypeChange = (type: TemplateType) => {
    onChange({ template_type: type, template_id: null, price_data: {} });
  };

  const handleTemplateSelect = (template: Template) => {
    onChange({
      template_id: template.id,
      price_data: template.template_data,
    });
  };

  const handleNext = () => {
    if (!data.template_type) {
      return;
    }
    onNext();
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* 选择模板类型 */}
      <div>
        <h3>选择模板类型</h3>
        <Radio.Group
          value={data.template_type}
          onChange={(e) => handleTypeChange(e.target.value)}
          size="large"
        >
          <Radio.Button value="TONGPIAO">通票</Radio.Button>
          <Radio.Button value="DAKEHU">大客户</Radio.Button>
          <Radio.Button value="CANGPEI">仓配</Radio.Button>
        </Radio.Group>
      </div>

      {/* 选择具体模板 */}
      <div>
        <h3>选择模板 (可选)</h3>
        {templates.length > 0 ? (
          <Space direction="vertical" style={{ width: '100%' }}>
            {templates.map((template) => (
              <Card
                key={template.id}
                hoverable
                onClick={() => handleTemplateSelect(template)}
                style={{
                  border:
                    data.template_id === template.id
                      ? '2px solid #1890ff'
                      : '1px solid #d9d9d9',
                }}
              >
                <Space>
                  <strong>{template.name}</strong>
                  {template.is_default && <Tag color="blue">默认</Tag>}
                  <Tag>{templateTypeMap[template.template_type]}</Tag>
                </Space>
                {template.remark && (
                  <div style={{ marginTop: 8, color: '#666' }}>{template.remark}</div>
                )}
              </Card>
            ))}
          </Space>
        ) : (
          <Empty description="暂无模板,将使用默认设置" />
        )}
      </div>

      {/* 操作按钮 */}
      <Space>
        <Button onClick={onPrev}>上一步</Button>
        <Button type="primary" onClick={handleNext}>
          下一步
        </Button>
      </Space>
    </Space>
  );
};

export default StepSelectTemplate;
