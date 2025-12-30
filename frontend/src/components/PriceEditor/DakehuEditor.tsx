import { useState, useEffect } from 'react';
import { Table, InputNumber, Button, Space, message, Input } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';

interface Props {
  data: any;
  provinces: any[];
  onChange: (data: any) => void;
}

interface WeightRange {
  id: string;
  range: string;
  start_weight: number;
  end_weight: number;
  price: number;
}

const DakehuEditor = ({ data, provinces, onChange }: Props) => {
  const [priceData, setPriceData] = useState<any>({
    weightRanges: [],
    provinceOverrides: {},
    ...data,
  });

  // 初始化重量段数据
  useEffect(() => {
    if (!priceData.weightRanges || priceData.weightRanges.length === 0) {
      const initialRanges: WeightRange[] = [
        { id: '1', range: '0-1kg', start_weight: 0, end_weight: 1, price: 0 },
        { id: '2', range: '1-3kg', start_weight: 1, end_weight: 3, price: 0 },
        { id: '3', range: '3-5kg', start_weight: 3, end_weight: 5, price: 0 },
        { id: '4', range: '5-10kg', start_weight: 5, end_weight: 10, price: 0 },
        { id: '5', range: '10-30kg', start_weight: 10, end_weight: 30, price: 0 },
      ];
      setPriceData({
        ...priceData,
        weightRanges: initialRanges,
      });
    }
  }, []);

  // 更新重量段价格
  const updateWeightRange = (id: string, field: string, value: any) => {
    const newRanges = priceData.weightRanges.map((range: WeightRange) =>
      range.id === id ? { ...range, [field]: value } : range
    );
    const newData = { ...priceData, weightRanges: newRanges };
    setPriceData(newData);
    onChange(newData);
  };

  // 添加重量段
  const addWeightRange = () => {
    const lastRange = priceData.weightRanges[priceData.weightRanges.length - 1];
    const newRange: WeightRange = {
      id: Date.now().toString(),
      range: `${lastRange?.end_weight || 0}-${(lastRange?.end_weight || 0) + 10}kg`,
      start_weight: lastRange?.end_weight || 0,
      end_weight: (lastRange?.end_weight || 0) + 10,
      price: 0,
    };
    const newRanges = [...priceData.weightRanges, newRange];
    const newData = { ...priceData, weightRanges: newRanges };
    setPriceData(newData);
    onChange(newData);
  };

  // 删除重量段
  const deleteWeightRange = (id: string) => {
    const newRanges = priceData.weightRanges.filter((range: WeightRange) => range.id !== id);
    const newData = { ...priceData, weightRanges: newRanges };
    setPriceData(newData);
    onChange(newData);
  };

  // 批量调整价格
  const batchAdjust = (type: 'percent' | 'amount', value: number) => {
    if (!value || value === 0) {
      message.warning('请输入调整值');
      return;
    }

    const newRanges = priceData.weightRanges.map((range: WeightRange) => {
      if (type === 'percent') {
        return {
          ...range,
          price: Number((range.price * (1 + value / 100)).toFixed(2)),
        };
      } else {
        return {
          ...range,
          price: Number((range.price + value).toFixed(2)),
        };
      }
    });

    const newData = { ...priceData, weightRanges: newRanges };
    setPriceData(newData);
    onChange(newData);
    message.success('批量调整成功');
  };

  // 表格列定义
  const columns: TableProps<WeightRange>['columns'] = [
    {
      title: '重量段',
      dataIndex: 'range',
      key: 'range',
      width: 200,
      render: (value: string, record: WeightRange) => (
        <Input
          value={value}
          onChange={(e) => updateWeightRange(record.id, 'range', e.target.value)}
        />
      ),
    },
    {
      title: '起始重量 (kg)',
      dataIndex: 'start_weight',
      key: 'start_weight',
      width: 150,
      render: (value: number, record: WeightRange) => (
        <InputNumber
          value={value}
          min={0}
          step={0.1}
          precision={2}
          onChange={(v) => updateWeightRange(record.id, 'start_weight', v || 0)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '结束重量 (kg)',
      dataIndex: 'end_weight',
      key: 'end_weight',
      width: 150,
      render: (value: number, record: WeightRange) => (
        <InputNumber
          value={value}
          min={0}
          step={0.1}
          precision={2}
          onChange={(v) => updateWeightRange(record.id, 'end_weight', v || 0)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '价格 (元/kg)',
      dataIndex: 'price',
      key: 'price',
      width: 200,
      render: (value: number, record: WeightRange) => (
        <InputNumber
          value={value}
          min={0}
          step={0.1}
          precision={2}
          onChange={(v) => updateWeightRange(record.id, 'price', v || 0)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: WeightRange) => (
        <Button
          type="link"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => deleteWeightRange(record.id)}
          disabled={priceData.weightRanges.length <= 1}
        >
          删除
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Space>
          <span>批量调整:</span>
          <Button onClick={() => batchAdjust('percent', 10)}>+10%</Button>
          <Button onClick={() => batchAdjust('percent', -10)}>-10%</Button>
          <Button onClick={() => batchAdjust('amount', 1)}>+1元</Button>
          <Button onClick={() => batchAdjust('amount', -1)}>-1元</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={addWeightRange}>
            添加重量段
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={priceData.weightRanges}
          rowKey="id"
          pagination={false}
        />
      </Space>
    </div>
  );
};

export default DakehuEditor;
