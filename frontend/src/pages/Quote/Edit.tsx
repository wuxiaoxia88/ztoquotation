import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Steps, Card, Button, Space, message, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { quoteApi, quoterApi, templateApi, baseApi } from '@/services';
import { Quoter, Template } from '@/types';
import StepBasicInfo from './CreateSteps/StepBasicInfo';
import StepSelectTemplate from './CreateSteps/StepSelectTemplate';
import StepEditPrice from './CreateSteps/StepEditPrice';
import StepSelectTerms from './CreateSteps/StepSelectTerms';
import StepQuoteInfo from './CreateSteps/StepQuoteInfo';
import StepPreview from './CreateSteps/StepPreview';

const QuoteEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // 表单数据
  const [formData, setFormData] = useState<any>({});

  // 基础数据
  const [quoters, setQuoters] = useState<Quoter[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [fixedTerms, setFixedTerms] = useState<any[]>([]);
  const [optionalTerms, setOptionalTerms] = useState<any[]>([]);

  // 加载报价单数据
  useEffect(() => {
    if (id) {
      loadQuote();
    }
  }, [id]);

  // 加载基础数据
  useEffect(() => {
    loadQuoters();
    loadProvinces();
    loadRegions();
    loadTerms();
  }, []);

  // 加载模板
  useEffect(() => {
    if (formData.template_type) {
      loadTemplates(formData.template_type);
    }
  }, [formData.template_type]);

  const loadQuote = async () => {
    if (!id) return;
    try {
      setInitialLoading(true);
      const data = await quoteApi.get(Number(id));
      setFormData({
        customer_name: data.customer_name,
        contact_person: data.contact_person,
        contact_phone: data.contact_phone,
        customer_address: data.customer_address,
        daily_volume: data.daily_volume,
        weight_range: data.weight_range,
        product_type: data.product_type,
        template_type: data.template_type,
        template_id: null,
        price_data: data.price_data,
        fixed_terms: data.fixed_terms || [],
        optional_terms: data.optional_terms || [],
        custom_terms: data.custom_terms || [],
        quoter_id: data.quoter_id,
        quote_date: data.quote_date,
        valid_days: data.valid_days,
        is_tax_included: data.is_tax_included,
        remark: data.remark,
      });
    } catch (error) {
      console.error('Load quote failed:', error);
      message.error('加载报价单失败');
    } finally {
      setInitialLoading(false);
    }
  };

  const loadQuoters = async () => {
    try {
      const data = await quoterApi.list();
      setQuoters(data);
    } catch (error) {
      console.error('Load quoters failed:', error);
    }
  };

  const loadTemplates = async (type: string) => {
    try {
      const data = await templateApi.list({ template_type: type });
      setTemplates(data);
    } catch (error) {
      console.error('Load templates failed:', error);
    }
  };

  const loadProvinces = async () => {
    try {
      const data = await baseApi.getProvinces();
      setProvinces(data);
    } catch (error) {
      console.error('Load provinces failed:', error);
    }
  };

  const loadRegions = async () => {
    try {
      const data = await baseApi.getRegions();
      setRegions(data);
    } catch (error) {
      console.error('Load regions failed:', error);
    }
  };

  const loadTerms = async () => {
    try {
      const [fixed, optional] = await Promise.all([
        baseApi.getFixedTerms(),
        baseApi.getOptionalTerms(),
      ]);
      setFixedTerms(fixed);
      setOptionalTerms(optional);
    } catch (error) {
      console.error('Load terms failed:', error);
    }
  };

  // 步骤配置
  const steps = [
    { title: '客户信息', description: '填写客户基本信息' },
    { title: '选择模板', description: '选择报价模板类型' },
    { title: '编辑价格', description: '设置价格信息' },
    { title: '选择条款', description: '选择报价条款' },
    { title: '报价信息', description: '填写报价相关信息' },
    { title: '预览保存', description: '预览并保存报价单' },
  ];

  // 更新表单数据
  const updateFormData = (data: any) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
  };

  // 下一步
  const handleNext = () => {
    setCurrent(current + 1);
  };

  // 上一步
  const handlePrev = () => {
    setCurrent(current - 1);
  };

  // 提交更新
  const handleSubmit = async () => {
    if (!id) return;
    try {
      setLoading(true);

      const submitData = {
        customer_name: formData.customer_name,
        contact_person: formData.contact_person,
        contact_phone: formData.contact_phone,
        customer_address: formData.customer_address,
        daily_volume: formData.daily_volume,
        weight_range: formData.weight_range,
        product_type: formData.product_type,
        quoter_id: formData.quoter_id,
        quote_date: formData.quote_date,
        valid_days: formData.valid_days,
        is_tax_included: formData.is_tax_included,
        template_type: formData.template_type,
        price_data: formData.price_data,
        fixed_terms: formData.fixed_terms,
        optional_terms: formData.optional_terms,
        custom_terms: formData.custom_terms,
        remark: formData.remark,
      };

      await quoteApi.update(Number(id), submitData);
      message.success('更新成功');
      navigate(`/quotes/${id}`);
    } catch (error: any) {
      console.error('Update quote failed:', error);
      message.error(error.response?.data?.detail || '更新失败');
    } finally {
      setLoading(false);
    }
  };

  // 渲染当前步骤内容
  const renderStepContent = () => {
    switch (current) {
      case 0:
        return (
          <StepBasicInfo
            data={formData}
            onChange={updateFormData}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <StepSelectTemplate
            data={formData}
            templates={templates}
            onChange={updateFormData}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 2:
        return (
          <StepEditPrice
            data={formData}
            provinces={provinces}
            regions={regions}
            onChange={updateFormData}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 3:
        return (
          <StepSelectTerms
            data={formData}
            fixedTerms={fixedTerms}
            optionalTerms={optionalTerms}
            onChange={updateFormData}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 4:
        return (
          <StepQuoteInfo
            data={formData}
            quoters={quoters}
            onChange={updateFormData}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 5:
        return (
          <StepPreview
            data={formData}
            quoters={quoters}
            onSubmit={handleSubmit}
            onPrev={handlePrev}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  if (initialLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" tip="加载报价单数据..." />
      </div>
    );
  }

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/quotes')}>
            返回列表
          </Button>
        </Card>

        <Card>
          <Steps current={current} items={steps} />
        </Card>

        <Card>{renderStepContent()}</Card>
      </Space>
    </div>
  );
};

export default QuoteEdit;
