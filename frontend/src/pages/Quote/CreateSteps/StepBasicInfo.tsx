import { Form, Input, Button, Space } from 'antd';
import { formRules } from '@/utils/validation';

interface Props {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
}

const StepBasicInfo = ({ data, onChange, onNext }: Props) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onChange(values);
      onNext();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={data}
      style={{ maxWidth: 800 }}
    >
      <Form.Item
        label="客户名称"
        name="customer_name"
        rules={[formRules.required]}
      >
        <Input placeholder="请输入客户名称" />
      </Form.Item>

      <Form.Item
        label="联系人"
        name="contact_person"
        rules={[formRules.required]}
      >
        <Input placeholder="请输入联系人" />
      </Form.Item>

      <Form.Item
        label="联系电话"
        name="contact_phone"
        rules={[formRules.required, formRules.phone]}
      >
        <Input placeholder="请输入联系电话" />
      </Form.Item>

      <Form.Item label="客户地址" name="customer_address">
        <Input placeholder="请输入客户地址" />
      </Form.Item>

      <Form.Item label="日均发货量" name="daily_volume">
        <Input placeholder="例如: 500票/天" />
      </Form.Item>

      <Form.Item label="重量段" name="weight_range">
        <Input placeholder="例如: 1-5kg" />
      </Form.Item>

      <Form.Item label="产品类型" name="product_type">
        <Input placeholder="例如: 电子产品" />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" onClick={handleSubmit}>
            下一步
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default StepBasicInfo;
