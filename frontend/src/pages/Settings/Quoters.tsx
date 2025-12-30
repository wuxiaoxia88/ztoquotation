import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  message,
  Popconfirm,
  Card,
  Modal,
  Form,
  Input,
} from 'antd';
import type { TableProps } from 'antd';
import { PlusOutlined, StarOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { quoterApi } from '@/services';
import { Quoter } from '@/types';
import { formatDate } from '@/utils/format';
import { formRules } from '@/utils/validation';

const QuotersManage = () => {
  const [loading, setLoading] = useState(false);
  const [quoters, setQuoters] = useState<Quoter[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingQuoter, setEditingQuoter] = useState<Quoter | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadQuoters();
  }, []);

  const loadQuoters = async () => {
    try {
      setLoading(true);
      const data = await quoterApi.list();
      setQuoters(data);
    } catch (error) {
      console.error('Load quoters failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // 设为默认
  const handleSetDefault = async (id: number) => {
    try {
      await quoterApi.setDefault(id);
      message.success('设置成功');
      loadQuoters();
    } catch (error) {
      console.error('Set default failed:', error);
    }
  };

  // 删除报价人
  const handleDelete = async (id: number) => {
    try {
      await quoterApi.delete(id);
      message.success('删除成功');
      loadQuoters();
    } catch (error: any) {
      console.error('Delete failed:', error);
      message.error(error.response?.data?.detail || '删除失败');
    }
  };

  // 打开编辑/创建模态框
  const openModal = (quoter?: Quoter) => {
    setEditingQuoter(quoter || null);
    if (quoter) {
      form.setFieldsValue(quoter);
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  // 保存报价人
  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (editingQuoter) {
        await quoterApi.update(editingQuoter.id, values);
        message.success('更新成功');
      } else {
        await quoterApi.create(values);
        message.success('创建成功');
      }

      setModalVisible(false);
      loadQuoters();
    } catch (error: any) {
      console.error('Save failed:', error);
      if (error.errorFields) {
        return;
      }
      message.error(error.response?.data?.detail || '保存失败');
    }
  };

  // 表格列定义
  const columns: TableProps<Quoter>['columns'] = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: 150,
    },
    {
      title: '默认报价人',
      dataIndex: 'is_default',
      key: 'is_default',
      width: 120,
      render: (isDefault: boolean) => (
        isDefault ? <Tag color="green">是</Tag> : <Tag>否</Tag>
      ),
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
      render: (_: any, record: Quoter) => (
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
            description="确定要删除这个报价人吗?"
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
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
              添加报价人
            </Button>
          </Space>

          <Table
            columns={columns}
            dataSource={quoters}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 20,
              showTotal: (total) => `共 ${total} 条`,
            }}
          />
        </Space>
      </Card>

      {/* 编辑/创建模态框 */}
      <Modal
        title={editingQuoter ? '编辑报价人' : '添加报价人'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="姓名"
            name="name"
            rules={[formRules.required]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item
            label="电话"
            name="phone"
            rules={[formRules.required, formRules.phone]}
          >
            <Input placeholder="请输入电话" />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[formRules.email]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item label="部门" name="department">
            <Input placeholder="请输入部门" />
          </Form.Item>

          <Form.Item label="设为默认" name="is_default" valuePropName="checked">
            <Input type="checkbox" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuotersManage;
