import React from 'react';
import Card from './Card';

export interface NamedItem { id: string; name: string; desc?: string }

interface Step3FeaturesProps {
  features: NamedItem[];
  ports: NamedItem[];
  selectedFeatures: string[];
  selectedPorts: string[];
  onFeatureChange: (id: string) => void;
  onPortChange: (id: string) => void;
}

export default function Step3Features({ features, ports, selectedFeatures, selectedPorts, onFeatureChange, onPortChange }: Step3FeaturesProps) {
  return (
    <>
      <h2 className="text-xl md:text-2xl font-semibold text-center mb-2">
        ۳. ویژگی‌ها و اتصالات مورد نیازتان چیست؟
      </h2>
      <p className="text-center text-gray-500 mb-6">
        ویژگی‌های مهم و پورت‌های ضروری را انتخاب کنید.
      </p>
      
      <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <h3 className="font-bold mb-3 text-lg">ویژگی‌های کلیدی</h3>
          <div id="feature-cards" className="space-y-3">
            {features.map(item => (
              <Card
                key={item.id}
                id={item.id}
                name={item.name}
                desc={item.desc}
                type="checkbox"
                isSelected={selectedFeatures.includes(item.id)}
                onClick={onFeatureChange}
              />
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-bold mb-3 text-lg">پورت‌های ضروری</h3>
          <div id="port-cards" className="space-y-3">
            {ports.map(item => (
              <Card
                key={item.id}
                id={item.id}
                name={item.name}
                desc={item.desc}
                type="checkbox"
                isSelected={selectedPorts.includes(item.id)}
                onClick={onPortChange}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
