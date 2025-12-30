import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Button,
  Space,
  Tag,
  message,
  Spin,
  Dropdown,
  Modal,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  CopyOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { quoteApi, exportApi } from '@/services';
import { Quote } from '@/types';
import { formatDate, statusMap, templateTypeMap } from '@/utils/format';

const QuoteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  // 加载报价单详情
  const loadQuote = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await quoteApi.get(Number(id));
      setQuote(data);
    } catch (error) {
      console.error('Load quote failed:', error);
      message.error('加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuote();
  }, [id]);

  // 复制报价单
  const handleCopy = async () => {
    if (!id) return;
    try {
      const newQuote = await quoteApi.copy(Number(id));
      message.success('复制成功');
      navigate(`/quotes/${newQuote.id}`);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  // 删除报价单
  const handleDelete = async () => {
    if (!id) return;
    try {
      await quoteApi.delete(Number(id));
      message.success('删除成功');
      navigate('/quotes');
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  // 预览
  const handlePreview = (theme: string = 'blue') => {
    if (!id) return;
    const url = exportApi.preview(Number(id), theme);
    setPreviewUrl(url);
    setPreviewVisible(true);
  };

  // 导出菜单
  const exportMenuItems: MenuProps['items'] = [
    {
      key: 'html',
      label: '导出HTML',
      onClick: () => {
        if (!quote) return;
        const url = exportApi.exportHtml(quote.id);
        exportApi.download(url, `${quote.quote_number}.html`);
      },
    },
    {
      key: 'excel',
      label: '导出Excel',
      onClick: () => {
        if (!quote) return;
        const url = exportApi.exportExcel(quote.id);
        exportApi.download(url, `${quote.quote_number}.xlsx`);
      },
    },
    {
      key: 'pdf',
      label: '导出PDF',
      onClick: () => {
        if (!quote) return;
        const url = exportApi.exportPdf(quote.id);
        exportApi.download(url, `${quote.quote_number}.pdf`);
      },
    },
  ];

  if (loading || !quote) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* 头部操作栏 */}
        <Card>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/quotes')}>
              返回列表
            </Button>
            <Space>
              <Button onClick={() => handlePreview('blue')}>预览</Button>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => navigate(`/quotes/${id}/edit`)}
              >
                编辑
              </Button>
              <Button icon={<CopyOutlined />} onClick={handleCopy}>
                复制
              </Button>
              <Dropdown menu={{ items: exportMenuItems }}>
                <Button icon={<DownloadOutlined />}>导出</Button>
              </Dropdown>
              <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
                删除
              </Button>
            </Space>
          </Space>
        </Card>

        {/* 基本信息 */}
        <Card title="基本信息">
          <Descriptions column={2} bordered>
            <Descriptions.Item label="报价单编号">{quote.quote_number}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={statusMap[quote.status]?.color}>
                {statusMap[quote.status]?.text}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="客户名称">{quote.customer_name}</Descriptions.Item>
            <Descriptions.Item label="联系人">{quote.contact_person}</Descriptions.Item>
            <Descriptions.Item label="联系电话">{quote.contact_phone}</Descriptions.Item>
            <Descriptions.Item label="客户地址">{quote.customer_address || '-'}</Descriptions.Item>
            <Descriptions.Item label="报价日期">{formatDate(quote.quote_date)}</Descriptions.Item>
            <Descriptions.Item label="有效期至">{formatDate(quote.expire_date)}</Descriptions.Item>
            <Descriptions.Item label="有效天数">{quote.valid_days} 天</Descriptions.Item>
            <Descriptions.Item label="是否含税">{quote.is_tax_included ? '是' : '否'}</Descriptions.Item>
            <Descriptions.Item label="日均发货量">{quote.daily_volume || '-'}</Descriptions.Item>
            <Descriptions.Item label="重量段">{quote.weight_range || '-'}</Descriptions.Item>
            <Descriptions.Item label="产品类型">{quote.product_type || '-'}</Descriptions.Item>
            <Descriptions.Item label="模板类型">
              {templateTypeMap[quote.template_type]}
            </Descriptions.Item>
            <Descriptions.Item label="备注" span={2}>{quote.remark || '-'}</Descriptions.Item>
          </Descriptions>
        </Card>

        {/* 价格信息 */}
        <Card title="价格信息">
          <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 4 }}>
            {JSON.stringify(quote.price_data, null, 2)}
          </pre>
        </Card>

        {/* 条款信息 */}
        {(quote.fixed_terms || quote.optional_terms || quote.custom_terms) && (
          <Card title="条款信息">
            {quote.fixed_terms && quote.fixed_terms.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <h4>固定条款:</h4>
                {quote.fixed_terms.map((term: any, index: number) => (
                  <p key={index}>
                    <strong>{term.title}:</strong> {term.content}
                  </p>
                ))}
              </div>
            )}
            {quote.optional_terms && quote.optional_terms.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <h4>选中的条款:</h4>
                {quote.optional_terms.map((term: any, index: number) => (
                  <p key={index}>
                    <strong>{term.title}:</strong> {term.content}
                  </p>
                ))}
              </div>
            )}
            {quote.custom_terms && quote.custom_terms.length > 0 && (
              <div>
                <h4>自定义条款:</h4>
                {quote.custom_terms.map((term: string, index: number) => (
                  <p key={index}>• {term}</p>
                ))}
              </div>
            )}
          </Card>
        )}
      </Space>

      {/* 预览弹窗 */}
      <Modal
        title="报价单预览"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        width={1000}
        footer={null}
      >
        <iframe
          src={previewUrl}
          style={{ width: '100%', height: '600px', border: 'none' }}
        />
      </Modal>
    </div>
  );
};

export default QuoteDetail;
