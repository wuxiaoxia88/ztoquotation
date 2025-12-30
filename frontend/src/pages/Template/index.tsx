import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  message,
  Popconfirm,
  Card,
  Select,
  Modal,
  Form,
  Input,
} from 'antd';
import type { TableProps } from 'antd';
import { PlusOutlined, StarOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { templateApi } from '@/services';
import { Template, TemplateType } from '@/types';
import { formatDate, templateTypeMap } from '@/utils/format';
import PriceEditor from '@/components/PriceEditor';

const { TextArea } = Input;

const TemplateManage = () => {
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filterType, setFilterType] = useState<TemplateType | undefined>(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [form] = Form.useForm();

  const [provinces, setProvinces] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);

  // 加载基础数据
  useEffect(() => {
    loadTemplates();
    loadBaseData();
  }, [filterType]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filterType) params.template_type = filterType;
      const data = await templateApi.list(params);
      setTemplates(data);
    } catch (error) {
      console.error('Load templates failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBaseData = async () => {
    try {
      const [provinceData, regionData] = await Promise.all([
        import('@/services').then(({ baseApi }) => baseApi.getProvinces()),
        import('@/services').then(({ baseApi }) => baseApi.getRegions()),
      ]);
      setProvinces(provinceData);
      setRegions(regionData);
    } catch (error) {
      console.error('Load base data failed:', error);
    }
  };

  // 设为默认
  const handleSetDefault = async (id: number) => {
    try {
      await templateApi.setDefault(id);
      message.success('设置成功');
      loadTemplates();
    } catch (error) {
      console.error('Set default failed:', error);
    }
  };

  // 删除模板
  const handleDelete = async (id: number) => {
    try {
      await templateApi.delete(id);
      message.success('删除成功');
      loadTemplates();
    } catch (error: any) {
      console.error('Delete failed:', error);
      message.error(error.response?.data?.detail || '删除失败');
    }
  };

  // 打开编辑/创建模态框
  const openModal = (template?: Template) => {
    setEditingTemplate(template || null);
    if (template) {
      form.setFieldsValue(template);
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  // 保存模板
  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (editingTemplate) {
        await templateApi.update(editingTemplate.id, values);
        message.success('更新成功');
      } else {
        await templateApi.create(values);
        message.success('创建成功');
      }

      setModalVisible(false);
      loadTemplates();
    } catch (error: any) {
      console.error('Save failed:', error);
      if (error.errorFields) {
        // 表单验证错误
        return;
      }
      message.error(error.response?.data?.detail || '保存失败');
    }
  };

  // 表格列定义
  const columns: TableProps<Template>['columns'] = [
    {
      title: '模板名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '模板类型',
      dataIndex: 'template_type',
      key: 'template_type',
      width: 120,
      render: (type: TemplateType) => (
        <Tag color="blue">{templateTypeMap[type]}</Tag>
      ),
    },
    {
      title: '默认模板',
      dataIndex: 'is_default',
      key: 'is_default',
      width: 100,
      render: (isDefault: boolean) => (
        isDefault ? <Tag color="green">是</Tag> : <Tag>否</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 100,
      render: (isActive: boolean) => (
        isActive ? <Tag color="success">启用</Tag> : <Tag>禁用</Tag>
      ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (date: string) => formatDate(date),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_: any, record: Template) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
          >
            编辑
          </Button>
          {!record.is_default && (
            <Button
              type="link"
              size="small"
              icon={<StarOutlined />}
              onClick={() => handleSetDefault(record.id)}
            >
              设为默认
            </Button>
          )}
          <Popconfirm
            title="确认删除"
            description="确定要删除这个模板吗?"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              disabled={record.is_default}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {/* 筛选和操作 */}
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Select
              placeholder="模板类型"
              value={filterType}
              onChange={setFilterType}
              style={{ width: 200 }}
              allowClear
            >
              <Select.Option value="TONGPIAO">通票</Select.Option>
              <Select.Option value="DAKEHU">大客户</Select.Option>
              <Select.Option value="CANGPEI">仓配</Select.Option>
            </Select>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
              创建模板
            </Button>
          </Space>

          {/* 表格 */}
          <Table
            columns={columns}
            dataSource={templates}
            rowKey="id"
            loading={loading}
            scroll={{ x: 1200 }}
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
          />
        </Space>
      </Card>

      {/* 编辑/创建模态框 */}
      <Modal
        title={editingTemplate ? '编辑模板' : '创建模板'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={1000}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            template_type: 'TONGPIAO',
            is_default: false,
            template_data: {},
          }}
        >
          <Form.Item
            label="模板名称"
            name="name"
            rules={[{ required: true, message: '请输入模板名称' }]}
          >
            <Input placeholder="请输入模板名称" />
          </Form.Item>

          <Form.Item
            label="模板类型"
            name="template_type"
            rules={[{ required: true, message: '请选择模板类型' }]}
          >
            <Select>
              <Select.Option value="TONGPIAO">通票</Select.Option>
              <Select.Option value="DAKEHU">大客户</Select.Option>
              <Select.Option value="CANGPEI">仓配</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="是否设为默认" name="is_default" valuePropName="checked">
            <Select>
              <Select.Option value={true}>是</Select.Option>
              <Select.Option value={false}>否</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="备注" name="remark">
            <TextArea rows={2} placeholder="请输入备注" />
          </Form.Item>

          <Form.Item label="价格数据" name="template_data">
            <div style={{ border: '1px solid #d9d9d9', padding: 16, borderRadius: 4 }}>
              <Form.Item noStyle shouldUpdate={(prev, curr) => prev.template_type !== curr.template_type}>
                {({ getFieldValue }) => (
                  <PriceEditor
                    templateType={getFieldValue('template_type')}
                    data={getFieldValue('template_data') || {}}
                    provinces={provinces}
                    regions={regions}
                    onChange={(data) => form.setFieldsValue({ template_data: data })}
                  />
                )}
              </Form.Item>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TemplateManage;
