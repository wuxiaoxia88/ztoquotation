import { useState } from 'react';
import { Checkbox, Button, Space, Input, Card, Divider } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { TextArea } = Input;

interface Props {
  data: any;
  fixedTerms: any[];
  optionalTerms: any[];
  onChange: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepSelectTerms = ({
  data,
  fixedTerms,
  optionalTerms,
  onChange,
  onNext,
  onPrev,
}: Props) => {
  const [customTermInput, setCustomTermInput] = useState('');

  // 切换可选条款
  const toggleOptionalTerm = (term: any, checked: boolean) => {
    let newOptionalTerms = [...(data.optional_terms || [])];
    if (checked) {
      newOptionalTerms.push(term);
    } else {
      newOptionalTerms = newOptionalTerms.filter((t) => t.id !== term.id);
    }
    onChange({ optional_terms: newOptionalTerms });
  };

  // 添加自定义条款
  const addCustomTerm = () => {
    if (!customTermInput.trim()) return;
    const newCustomTerms = [...(data.custom_terms || []), customTermInput.trim()];
    onChange({ custom_terms: newCustomTerms });
    setCustomTermInput('');
  };

  // 删除自定义条款
  const deleteCustomTerm = (index: number) => {
    const newCustomTerms = data.custom_terms.filter((_: any, i: number) => i !== index);
    onChange({ custom_terms: newCustomTerms });
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* 固定条款 */}
      <Card title="固定条款 (自动包含)" size="small">
        {fixedTerms.map((term) => (
          <div key={term.id} style={{ marginBottom: 12 }}>
            <strong>{term.title}</strong>
            <div style={{ color: '#666', marginTop: 4 }}>{term.content}</div>
          </div>
        ))}
      </Card>

      {/* 可选条款 */}
      <Card title="可选条款" size="small">
        <Space direction="vertical" style={{ width: '100%' }}>
          {optionalTerms.map((term) => (
            <Checkbox
              key={term.id}
              checked={data.optional_terms?.some((t: any) => t.id === term.id)}
              onChange={(e) => toggleOptionalTerm(term, e.target.checked)}
            >
              <div>
                <strong>{term.title}</strong>
                <div style={{ color: '#666', marginTop: 4 }}>{term.content}</div>
              </div>
            </Checkbox>
          ))}
        </Space>
      </Card>

      {/* 自定义条款 */}
      <Card title="自定义条款" size="small">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space.Compact style={{ width: '100%' }}>
            <TextArea
              value={customTermInput}
              onChange={(e) => setCustomTermInput(e.target.value)}
              placeholder="输入自定义条款内容"
              rows={2}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={addCustomTerm}>
              添加
            </Button>
          </Space.Compact>

          {data.custom_terms && data.custom_terms.length > 0 && (
            <div>
              <Divider style={{ margin: '12px 0' }} />
              {data.custom_terms.map((term: string, index: number) => (
                <div
                  key={index}
                  style={{
                    padding: '8px 12px',
                    background: '#f5f5f5',
                    marginBottom: 8,
                    borderRadius: 4,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>{term}</span>
                  <Button
                    type="link"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => deleteCustomTerm(index)}
                  />
                </div>
              ))}
            </div>
          )}
        </Space>
      </Card>

      {/* 操作按钮 */}
      <Space>
        <Button onClick={onPrev}>上一步</Button>
        <Button type="primary" onClick={onNext}>
          下一步
        </Button>
      </Space>
    </Space>
  );
};

export default StepSelectTerms;
