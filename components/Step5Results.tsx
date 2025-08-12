import React from 'react';

export interface LaptopResultItem {
  id: string;
  name: string;
  desc?: string;
  image?: string;
  priceMillion?: number;
  specs: {
    cpu_name?: string;
    ram?: number;
    gpu_name?: string;
  };
  score: number;
}

interface Step5ResultsProps {
  results: LaptopResultItem[];
  laptopsToCompare: string[];
  onCompareSelection: (laptopId: string) => void;
  onShowDetails: (laptopId: string) => void;
}

export default function Step5Results({ results, laptopsToCompare, onCompareSelection, onShowDetails }: Step5ResultsProps) {
  if (results.length === 0) {
    return (
      <div className="text-center p-8 bg-yellow-50 rounded-lg">
        <h3 className="text-2xl font-bold text-yellow-800">متاسفانه نتیجه‌ای یافت نشد!</h3>
        <p className="text-yellow-700 mt-2">
          با معیارهای انتخابی شما، لپ‌تاپی در دیتابیس ما وجود ندارد. پیشنهاد می‌کنیم معیارها را تغییر دهید.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">لپ‌تاپ‌های پیشنهادی</h2>
        <button 
          className="btn btn-primary font-bold py-2 px-6 rounded-lg" 
          disabled={laptopsToCompare.length < 2}
        >
          مقایسه انتخاب‌ها
        </button>
      </div>
      
      <div id="results-container" className="space-y-6">
        {results.map((item) => (
          <div 
            key={item.id}
            className="card bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-6" 
            onClick={() => onShowDetails(item.id)}
          >
            <div className="md:w-1/3 flex-shrink-0">
              {item.image && (
                <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-lg" />
              )}
            </div>
            <div className="md:w-2/3">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">{item.name}</h3>
                <label 
                  className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-gray-100" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-sm font-semibold">مقایسه</span>
                  <input 
                    type="checkbox" 
                    onChange={() => onCompareSelection(item.id)} 
                    className="form-checkbox h-5 w-5 text-blue-600 rounded"
                    checked={laptopsToCompare.includes(item.id)}
                  />
                </label>
              </div>
              {item.desc && <p className="text-gray-600 text-sm mt-2">{item.desc.substring(0, 100)}...</p>}
              <div className="mt-4 flex justify-between items-end">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-700">
                  <div><strong>پردازنده:</strong> {item.specs.cpu_name}</div>
                  <div><strong>رم:</strong> {item.specs.ram} GB</div>
                  <div><strong>گرافیک:</strong> {item.specs.gpu_name}</div>
                  {item.priceMillion && <div><strong>قیمت:</strong> ~{item.priceMillion} م</div>}
                </div>
                <div className={`font-bold text-lg text-white ${item.score > 85 ? 'bg-green-500' : item.score > 60 ? 'bg-yellow-500' : 'bg-red-500'} rounded-full w-20 h-20 flex flex-col items-center justify-center leading-tight`}>
                  <span>{item.score}%</span>
                  <span className="text-xs mt-1">سازگاری</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
