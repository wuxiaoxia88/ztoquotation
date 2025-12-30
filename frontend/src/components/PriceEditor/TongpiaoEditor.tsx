import { useState, useEffect } from 'react';
import { Table, InputNumber, Button, Space, message, Tabs } from 'antd';
import type { TableProps } from 'antd';

interface Props {
  data: any;
  provinces: any[];
  regions: any[];
  onChange: (data: any) => void;
}

const TongpiaoEditor = ({ data, provinces, regions, onChange }: Props) => {
  const [priceData, setPriceData] = useState<any>({
    regions: [],
    provinceOverrides: {},
    ...data,
  });

  // 初始化区域价格数据
  useEffect(() => {
    if (!priceData.regions || priceData.regions.length === 0) {
      const initialRegions = regions.map((region) => ({
        region_name: region.region_name,
        first_weight_price: 0,
        additional_weight_price: 0,
        min_charge: 0,
      }));
      setPriceData({
        ...priceData,
        regions: initialRegions,
      });
    }
  }, [regions]);

  // 更新区域价格
  const updateRegionPrice = (regionName: string, field: string, value: number) => {
    const newRegions = priceData.regions.map((region: any) =>
      region.region_name === regionName
        ? { ...region, [field]: value }
        : region
    );
    const newData = { ...priceData, regions: newRegions };
    setPriceData(newData);
    onChange(newData);
  };

  // 批量调整价格
  const batchAdjust = (type: 'percent' | 'amount', value: number) => {
    if (!value || value === 0) {
      message.warning('请输入调整值');
      return;
    }

    const newRegions = priceData.regions.map((region: any) => {
      if (type === 'percent') {
        return {
          ...region,
          first_weight_price: Number((region.first_weight_price * (1 + value / 100)).toFixed(2)),
          additional_weight_price: Number((region.additional_weight_price * (1 + value / 100)).toFixed(2)),
          min_charge: Number((region.min_charge * (1 + value / 100)).toFixed(2)),
        };
      } else {
        return {
          ...region,
          first_weight_price: Number((region.first_weight_price + value).toFixed(2)),
          additional_weight_price: Number((region.additional_weight_price + value).toFixed(2)),
          min_charge: Number((region.min_charge + value).toFixed(2)),
        };
      }
    });

    const newData = { ...priceData, regions: newRegions };
    setPriceData(newData);
    onChange(newData);
    message.success('批量调整成功');
  };

  // 表格列定义
  const columns: TableProps<any>['columns'] = [
    {
      title: '区域',
      dataIndex: 'region_name',
      key: 'region_name',
      width: 120,
      fixed: 'left',
    },
    {
      title: '首重价格 (元/kg)',
      dataIndex: 'first_weight_price',
      key: 'first_weight_price',
      width: 180,
      render: (value: number, record: any) => (
        <InputNumber
          value={value}
          min={0}
          step={0.1}
          precision={2}
          onChange={(v) => updateRegionPrice(record.region_name, 'first_weight_price', v || 0)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '续重价格 (元/kg)',
      dataIndex: 'additional_weight_price',
      key: 'additional_weight_price',
      width: 180,
      render: (value: number, record: any) => (
        <InputNumber
          value={value}
          min={0}
          step={0.1}
          precision={2}
          onChange={(v) => updateRegionPrice(record.region_name, 'additional_weight_price', v || 0)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '最低一票 (元)',
      dataIndex: 'min_charge',
      key: 'min_charge',
      width: 180,
      render: (value: number, record: any) => (
        <InputNumber
          value={value}
          min={0}
          step={0.1}
          precision={2}
          onChange={(v) => updateRegionPrice(record.region_name, 'min_charge', v || 0)}
          style={{ width: '100%' }}
        />
      ),
    },
  ];

  // 省份单独定价表格
  const renderProvinceOverrides = () => {
    const provinceData = provinces.map((province) => {
      const override = priceData.provinceOverrides?.[province.code] || {};
      return {
        ...province,
        ...override,
      };
    });

    const provinceColumns: TableProps<any>['columns'] = [
      {
        title: '省份',
        dataIndex: 'name',
        key: 'name',
        width: 120,
      },
      {
        title: '所属区域',
        dataIndex: 'region_name',
        key: 'region_name',
        width: 100,
      },
      {
        title: '首重价格 (元/kg)',
        dataIndex: 'first_weight_price',
        key: 'first_weight_price',
        width: 180,
        render: (value: number, record: any) => (
          <InputNumber
            value={value}
            min={0}
            step={0.1}
            precision={2}
            placeholder="使用区域价格"
            onChange={(v) => {
              const newOverrides = {
                ...priceData.provinceOverrides,
                [record.code]: {
                  ...priceData.provinceOverrides?.[record.code],
                  first_weight_price: v,
                },
              };
              const newData = { ...priceData, provinceOverrides: newOverrides };
              setPriceData(newData);
              onChange(newData);
            }}
            style={{ width: '100%' }}
          />
        ),
      },
      {
        title: '续重价格 (元/kg)',
        dataIndex: 'additional_weight_price',
        key: 'additional_weight_price',
        width: 180,
        render: (value: number, record: any) => (
          <InputNumber
            value={value}
            min={0}
            step={0.1}
            precision={2}
            placeholder="使用区域价格"
            onChange={(v) => {
              const newOverrides = {
                ...priceData.provinceOverrides,
                [record.code]: {
                  ...priceData.provinceOverrides?.[record.code],
                  additional_weight_price: v,
                },
              };
              const newData = { ...priceData, provinceOverrides: newOverrides };
              setPriceData(newData);
              onChange(newData);
            }}
            style={{ width: '100%' }}
          />
        ),
      },
      {
        title: '最低一票 (元)',
        dataIndex: 'min_charge',
        key: 'min_charge',
        width: 180,
        render: (value: number, record: any) => (
          <InputNumber
            value={value}
            min={0}
            step={0.1}
            precision={2}
            placeholder="使用区域价格"
            onChange={(v) => {
              const newOverrides = {
                ...priceData.provinceOverrides,
                [record.code]: {
                  ...priceData.provinceOverrides?.[record.code],
                  min_charge: v,
                },
              };
              const newData = { ...priceData, provinceOverrides: newOverrides };
              setPriceData(newData);
              onChange(newData);
            }}
            style={{ width: '100%' }}
          />
        ),
      },
    ];

    return (
      <Table
        columns={provinceColumns}
        dataSource={provinceData}
        rowKey="code"
        pagination={{ pageSize: 20 }}
        scroll={{ y: 400 }}
      />
    );
  };

  const items = [
    {
      key: 'region',
      label: '区域价格',
      children: (
        <div>
          <Space style={{ marginBottom: 16 }}>
            <span>批量调整:</span>
            <Button onClick={() => batchAdjust('percent', 10)}>+10%</Button>
            <Button onClick={() => batchAdjust('percent', -10)}>-10%</Button>
            <Button onClick={() => batchAdjust('amount', 1)}>+1元</Button>
            <Button onClick={() => batchAdjust('amount', -1)}>-1元</Button>
          </Space>
          <Table
            columns={columns}
            dataSource={priceData.regions}
            rowKey="region_name"
            pagination={false}
          />
        </div>
      ),
    },
    {
      key: 'province',
      label: '省份单独定价',
      children: renderProvinceOverrides(),
    },
  ];

  return (
    <div>
      <Tabs items={items} />
    </div>
  );
};

export default TongpiaoEditor;
