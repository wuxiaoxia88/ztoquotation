import { Form, Select, DatePicker, InputNumber, Switch, Input, Button, Space } from 'antd';
import dayjs from 'dayjs';
import { Quoter } from '@/types';

const { TextArea } = Input;

interface Props {
  data: any;
  quoters: Quoter[];
  onChange: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepQuoteInfo = ({ data, quoters, onChange, onNext, onPrev }: Props) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onChange({
        ...values,
        quote_date: values.quote_date.format('YYYY-MM-DD'),
      });
      onNext();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        ...data,
        quote_date: data.quote_date ? dayjs(data.quote_date) : dayjs(),
      }}
      style={{ maxWidth: 800 }}
    >
      <Form.Item
        label="报价人"
        name="quoter_id"
        rules={[{ required: true, message: '请选择报价人' }]}
      >
        <Select placeholder="请选择报价人">
          {quoters.map((quoter) => (
            <Select.Option key={quoter.id} value={quoter.id}>
              {quoter.name} {quoter.is_default && '(默认)'}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="报价日期"
        name="quote_date"
        rules={[{ required: true, message: '请选择报价日期' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="有效天数"
        name="valid_days"
        rules={[{ required: true, message: '请输入有效天数' }]}
      >
        <InputNumber
          min={1}
          max={365}
          addonAfter="天"
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        label="是否含税"
        name="is_tax_included"
        valuePropName="checked"
      >
        <Switch checkedChildren="含税" unCheckedChildren="不含税" />
      </Form.Item>

      <Form.Item label="备注" name="remark">
        <TextArea rows={4} placeholder="请输入备注信息" />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button onClick={onPrev}>上一步</Button>
          <Button type="primary" onClick={handleSubmit}>
            下一步
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default StepQuoteInfo;
