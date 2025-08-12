import React from 'react';

interface Step6ComparisonProps {
  laptopsToCompare: string[];
  laptopsMap?: Record<string, { name: string; priceMillion?: number; specs?: { cpu_name?: string; ram?: number; gpu_name?: string }; features?: string[]; ports?: string[] }>
}

export default function Step6Comparison({ laptopsToCompare, laptopsMap = {} }: Step6ComparisonProps) {
  const laptopsData = laptopsToCompare.map(id => ({ id, ...(laptopsMap[id] || {}) }))
  
  const fields: { key: string; label: string; render: (l: any) => React.ReactNode }[] = [
    { key: 'name', label: 'مدل', render: (l) => l.name || '-' },
    { key: 'price', label: 'قیمت (میلیون تومان)', render: (l) => l.priceMillion ?? '-' },
    { key: 'cpu', label: 'پردازنده', render: (l) => l.specs?.cpu_name ?? '-' },
    { key: 'ram', label: 'رم (گیگابایت)', render: (l) => l.specs?.ram ?? '-' },
    { key: 'gpu', label: 'گرافیک', render: (l) => l.specs?.gpu_name ?? '-' },
    { key: 'features', label: 'ویژگی‌ها', render: (l) => (l.features?.join(', ') || '-') },
    { key: 'ports', label: 'پورت‌ها', render: (l) => (l.ports?.join(', ') || '-') },
  ];

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-8">مقایسه لپ‌تاپ‌ها</h2>
      <div id="comparison-container" className="overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 font-semibold border">ویژگی</th>
              {laptopsData.map(l => (
                <th key={l.id} className="p-3 font-semibold border">{l.name || l.id}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fields.map(field => (
              <tr key={field.key} className="border-b">
                <td className="p-3 font-semibold border-l border-r">{field.label}</td>
                {laptopsData.map(laptop => (
                  <td key={laptop.id} className="p-3 border-l border-r">{field.render(laptop)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
