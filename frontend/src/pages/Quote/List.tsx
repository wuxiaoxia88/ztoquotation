import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Button,
  Space,
  Input,
  Select,
  DatePicker,
  Tag,
  message,
  Popconfirm,
  Card,
} from 'antd';
import type { TableProps } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { quoteApi, exportApi } from '@/services';
import { Quote, QuoteStatus } from '@/types';
import { formatDate, statusMap } from '@/utils/format';

const { RangePicker } = DatePicker;

const QuoteList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [searchParams, setSearchParams] = useState({
    customer_name: '',
    contact_phone: '',
    status: undefined as QuoteStatus | undefined,
    start_date: '',
    end_date: '',
  });

  // 加载报价单列表
  const loadQuotes = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchParams.customer_name) params.customer_name = searchParams.customer_name;
      if (searchParams.contact_phone) params.contact_phone = searchParams.contact_phone;
      if (searchParams.status) params.status = searchParams.status;
      if (searchParams.start_date) params.start_date = searchParams.start_date;
      if (searchParams.end_date) params.end_date = searchParams.end_date;

      const data = await quoteApi.list(params);
      setQuotes(data);
    } catch (error) {
      console.error('Load quotes failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuotes();
  }, []);

  // 搜索
  const handleSearch = () => {
    loadQuotes();
  };

  // 重置搜索
  const handleReset = () => {
    setSearchParams({
      customer_name: '',
      contact_phone: '',
      status: undefined,
      start_date: '',
      end_date: '',
    });
    setTimeout(() => loadQuotes(), 0);
  };

  // 日期范围变化
  const handleDateChange = (dates: any) => {
    if (dates) {
      setSearchParams({
        ...searchParams,
        start_date: dates[0].format('YYYY-MM-DD'),
        end_date: dates[1].format('YYYY-MM-DD'),
      });
    } else {
      setSearchParams({
        ...searchParams,
        start_date: '',
        end_date: '',
      });
    }
  };

  // 复制报价单
  const handleCopy = async (id: number) => {
    try {
      await quoteApi.copy(id);
      message.success('复制成功');
      loadQuotes();
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  // 删除报价单
  const handleDelete = async (id: number) => {
    try {
      await quoteApi.delete(id);
      message.success('删除成功');
      loadQuotes();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  // 导出Excel
  const handleExportExcel = (id: number, quoteNumber: string) => {
    const url = exportApi.exportExcel(id);
    exportApi.download(url, `${quoteNumber}.xlsx`);
  };

  // 表格列定义
  const columns: TableProps<Quote>['columns'] = [
    {
      title: '报价单编号',
      dataIndex: 'quote_number',
      key: 'quote_number',
      width: 200,
      fixed: 'left',
    },
    {
      title: '客户名称',
      dataIndex: 'customer_name',
      key: 'customer_name',
      width: 150,
    },
    {
      title: '联系人',
      dataIndex: 'contact_person',
      key: 'contact_person',
      width: 120,
    },
    {
      title: '联系电话',
      dataIndex: 'contact_phone',
      key: 'contact_phone',
      width: 130,
    },
    {
      title: '报价日期',
      dataIndex: 'quote_date',
      key: 'quote_date',
      width: 120,
      render: (date: string) => formatDate(date),
    },
    {
      title: '有效期至',
      dataIndex: 'expire_date',
      key: 'expire_date',
      width: 120,
      render: (date: string) => formatDate(date),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: QuoteStatus) => (
        <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right',
      render: (_: any, record: Quote) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/quotes/${record.id}`)}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/quotes/${record.id}/edit`)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            icon={<CopyOutlined />}
            onClick={() => handleCopy(record.id)}
          >
            复制
          </Button>
          <Button
            type="link"
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => handleExportExcel(record.id, record.quote_number)}
          >
            导出
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除这个报价单吗?"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
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
          {/* 搜索表单 */}
          <Space wrap>
            <Input
              placeholder="客户名称"
              value={searchParams.customer_name}
              onChange={(e) =>
                setSearchParams({ ...searchParams, customer_name: e.target.value })
              }
              style={{ width: 200 }}
            />
            <Input
              placeholder="联系电话"
              value={searchParams.contact_phone}
              onChange={(e) =>
                setSearchParams({ ...searchParams, contact_phone: e.target.value })
              }
              style={{ width: 200 }}
            />
            <Select
              placeholder="状态"
              value={searchParams.status}
              onChange={(value) => setSearchParams({ ...searchParams, status: value })}
              style={{ width: 120 }}
              allowClear
            >
              <Select.Option value="DRAFT">草稿</Select.Option>
              <Select.Option value="SENT">已发送</Select.Option>
              <Select.Option value="CONFIRMED">已确认</Select.Option>
              <Select.Option value="EXPIRED">已过期</Select.Option>
            </Select>
            <RangePicker
              value={
                searchParams.start_date && searchParams.end_date
                  ? [dayjs(searchParams.start_date), dayjs(searchParams.end_date)]
                  : null
              }
              onChange={handleDateChange}
            />
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              搜索
            </Button>
            <Button onClick={handleReset}>重置</Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/quotes/create')}
            >
              创建报价单
            </Button>
          </Space>

          {/* 表格 */}
          <Table
            columns={columns}
            dataSource={quotes}
            rowKey="id"
            loading={loading}
            scroll={{ x: 1400 }}
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
          />
        </Space>
      </Card>
    </div>
  );
};

export default QuoteList;
