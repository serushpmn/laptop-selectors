import React from 'react';

interface Step7DetailsProps {
  activeLaptopId: string | null;
  laptopsMap?: Record<string, {
    name: string;
    desc?: string;
    image?: string;
    priceMillion?: number;
    specs?: {
      cpu_name?: string;
      gpu_name?: string;
      ram?: number;
      storage?: string;
      display?: string;
    };
    ports?: string[];
    buy_link?: string;
    review?: string;
  }>;
}

export default function Step7Details({ activeLaptopId, laptopsMap = {} }: Step7DetailsProps) {
  if (!activeLaptopId) return null;
  const laptop = laptopsMap[activeLaptopId];
  if (!laptop) return null;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        {laptop.image && <img src={laptop.image} alt={laptop.name} className="w-full rounded-xl shadow-lg" />}
        {laptop.ports && (
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-3">پورت‌ها و اتصالات</h3>
            <div className="flex flex-wrap gap-3">
              {laptop.ports.map(p => (
                <div key={p} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div>
        <h2 className="text-3xl font-bold">{laptop.name}</h2>
        {laptop.desc && <p className="text-gray-600 mt-4">{laptop.desc}</p>}
        
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-3">مشخصات کلیدی</h3>
          <ul className="space-y-2">
            <li className="flex justify-between"><span>پردازنده:</span><strong className="font-semibold">{laptop.specs?.cpu_name}</strong></li>
            <li className="flex justify-between"><span>گرافیک:</span><strong className="font-semibold">{laptop.specs?.gpu_name}</strong></li>
            <li className="flex justify-between"><span>حافظه رم:</span><strong className="font-semibold">{laptop.specs?.ram} گیگابایت</strong></li>
            {laptop.specs?.storage && <li className="flex justify-between"><span>حافظه داخلی:</span><strong className="font-semibold">{laptop.specs?.storage}</strong></li>}
            {laptop.specs?.display && <li className="flex justify-between"><span>صفحه‌نمایش:</span><strong className="font-semibold">{laptop.specs?.display}</strong></li>}
          </ul>
        </div>

        {laptop.review && (
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-3">بررسی کوتاه</h3>
            <p className="text-gray-700 italic">"{laptop.review}"</p>
          </div>
        )}
        
        <div className="mt-8 flex items-center gap-4">
          {typeof laptop.priceMillion !== 'undefined' && (
            <span className="text-3xl font-bold text-blue-600">{laptop.priceMillion} میلیون تومان</span>
          )}
          {laptop.buy_link && (
            <a href={laptop.buy_link} target="_blank" rel="noopener noreferrer" className="btn btn-primary flex-grow text-center font-bold py-3 px-6 rounded-lg">
              مشاهده و خرید
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
