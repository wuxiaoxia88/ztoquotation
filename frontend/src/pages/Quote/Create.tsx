import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Steps, Card, Button, Space, message } from 'antd';
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

const QuoteCreate = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);

  // 表单数据
  const [formData, setFormData] = useState<any>({
    // 步骤1: 基本信息
    customer_name: '',
    contact_person: '',
    contact_phone: '',
    customer_address: '',
    daily_volume: '',
    weight_range: '',
    product_type: '',

    // 步骤2: 选择模板
    template_type: 'TONGPIAO',
    template_id: null,

    // 步骤3: 价格数据
    price_data: {},

    // 步骤4: 条款
    fixed_terms: [],
    optional_terms: [],
    custom_terms: [],

    // 步骤5: 报价信息
    quoter_id: null,
    quote_date: dayjs().format('YYYY-MM-DD'),
    valid_days: 30,
    is_tax_included: true,
    remark: '',
  });

  // 基础数据
  const [quoters, setQuoters] = useState<Quoter[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [fixedTerms, setFixedTerms] = useState<any[]>([]);
  const [optionalTerms, setOptionalTerms] = useState<any[]>([]);

  // 加载基础数据
  useEffect(() => {
    loadQuoters();
    loadProvinces();
    loadRegions();
    loadTerms();
  }, []);

  // 加载模板(根据类型)
  useEffect(() => {
    if (formData.template_type) {
      loadTemplates(formData.template_type);
    }
  }, [formData.template_type]);

  const loadQuoters = async () => {
    try {
      const data = await quoterApi.list();
      setQuoters(data);
      // 设置默认报价人
      const defaultQuoter = data.find((q) => q.is_default);
      if (defaultQuoter) {
        setFormData((prev: any) => ({ ...prev, quoter_id: defaultQuoter.id }));
      }
    } catch (error) {
      console.error('Load quoters failed:', error);
    }
  };

  const loadTemplates = async (type: string) => {
    try {
      const data = await templateApi.list({ template_type: type });
      setTemplates(data);
      // 设置默认模板
      const defaultTemplate = data.find((t) => t.is_default);
      if (defaultTemplate) {
        setFormData((prev: any) => ({
          ...prev,
          template_id: defaultTemplate.id,
          price_data: defaultTemplate.template_data,
        }));
      }
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
      // 自动选中固定条款
      setFormData((prev: any) => ({ ...prev, fixed_terms: fixed }));
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

  // 提交保存
  const handleSubmit = async () => {
    try {
      setLoading(true);

      // 构建提交数据
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

      const newQuote = await quoteApi.create(submitData);
      message.success('创建成功');
      navigate(`/quotes/${newQuote.id}`);
    } catch (error: any) {
      console.error('Create quote failed:', error);
      message.error(error.response?.data?.detail || '创建失败');
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

export default QuoteCreate;
