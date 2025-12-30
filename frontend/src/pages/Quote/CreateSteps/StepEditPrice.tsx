import { Button, Space } from 'antd';
import PriceEditor from '@/components/PriceEditor';

interface Props {
  data: any;
  provinces: any[];
  regions: any[];
  onChange: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepEditPrice = ({ data, provinces, regions, onChange, onNext, onPrev }: Props) => {
  const handlePriceChange = (priceData: any) => {
    onChange({ price_data: priceData });
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <PriceEditor
        templateType={data.template_type}
        data={data.price_data}
        provinces={provinces}
        regions={regions}
        onChange={handlePriceChange}
      />

      <Space>
        <Button onClick={onPrev}>上一步</Button>
        <Button type="primary" onClick={onNext}>
          下一步
        </Button>
      </Space>
    </Space>
  );
};

export default StepEditPrice;
