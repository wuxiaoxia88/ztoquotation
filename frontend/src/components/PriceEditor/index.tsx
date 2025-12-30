import { useState } from 'react';
import { Tabs } from 'antd';
import TongpiaoEditor from './TongpiaoEditor';
import DakehuEditor from './DakehuEditor';

interface Props {
  templateType: string;
  data: any;
  provinces: any[];
  regions: any[];
  onChange: (data: any) => void;
}

const PriceEditor = ({ templateType, data, provinces, regions, onChange }: Props) => {
  // 根据模板类型渲染不同的编辑器
  const renderEditor = () => {
    switch (templateType) {
      case 'TONGPIAO':
        return (
          <TongpiaoEditor
            data={data}
            provinces={provinces}
            regions={regions}
            onChange={onChange}
          />
        );
      case 'DAKEHU':
        return (
          <DakehuEditor
            data={data}
            provinces={provinces}
            onChange={onChange}
          />
        );
      case 'CANGPEI':
        // 仓配模式暂时使用大客户编辑器
        return (
          <DakehuEditor
            data={data}
            provinces={provinces}
            onChange={onChange}
          />
        );
      default:
        return <div>请选择模板类型</div>;
    }
  };

  return <div>{renderEditor()}</div>;
};

export default PriceEditor;
