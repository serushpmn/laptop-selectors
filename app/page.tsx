'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Step1Categories, { CategoryItem } from '@/components/Step1Categories';
import Step2Software, { ProgramItem } from '@/components/Step2Software';
import Step3Features, { NamedItem } from '@/components/Step3Features';
import Step4Prices from '@/components/Step4Prices';
import Step5Results, { LaptopResultItem } from '@/components/Step5Results';
import Step6Comparison from '@/components/Step6Comparison';
import Step7Details from '@/components/Step7Details';
import Navigation from '@/components/Navigation';
import SummaryBar from '@/components/SummaryBar';
import { 
  getCategories, 
  getProgramsByCategory, 
  getAllPrograms,
  debugDatabase,
  getFeatures, 
  getPorts, 
  getLaptopsFull, 
  getLaptopComponentScores, 
  getLaptopMinPrices 
} from '@/lib/repository';
import { supabase } from '@/lib/supabaseClient';
import { priceRanges } from '@/lib/staticData';

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selections, setSelections] = useState<any>({});
  const [laptopsToCompare, setLaptopsToCompare] = useState<string[]>([]);
  const [activeLaptopId, setActiveLaptopId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [programs, setPrograms] = useState<ProgramItem[]>([])
  const [features, setFeatures] = useState<NamedItem[]>([])
  const [ports, setPorts] = useState<NamedItem[]>([])
  const [laptopResults, setLaptopResults] = useState<LaptopResultItem[]>([])

  // Category mapping function
  const getCategoryDisplayName = (categoryName: string): string => {
    const categoryMap: Record<string, string> = {
      'Design': 'Design',
      'video_editing': 'Video Editing',
      'engineering': 'Engineering',
      'graphics': 'Graphics',
      'programming': 'Programming',
      'music_production': 'Music Production'
    };
    return categoryMap[categoryName] || categoryName;
  };

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        // Debug database first
        await debugDatabase();
        
        const [cats, feats, prts] = await Promise.all([
          getCategories(),
          getFeatures(),
          getPorts(),
        ])
        setCategories(cats.map(c => ({ id: String(c.id), name: c.name || '', fa_name: c.fa_name || c.name || '', icon: c.icon || undefined, desc: c.desc || undefined })))
        setFeatures(feats.map(f => ({ id: String(f.id), name: f.name })))
        setPorts(prts.map(p => ({ id: String(p.id), name: p.name })))
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  useEffect(() => {
    (async () => {
      const selectedCategory = categories.find(c => c.id === selections[1]);
      const cat = selectedCategory?.name || null;
      console.log('🎯 Selected category ID:', selections[1]);
      console.log('🎯 Selected category object:', selectedCategory);
      console.log('🎯 Selected category name:', cat);
      console.log('🎯 All categories:', categories);
      
      // Debug: Check if programs table has any data
      try {
        const allPrograms = await getAllPrograms()
        console.log('📋 All programs in database:', allPrograms);
        console.log('📋 Programs count:', allPrograms.length);
        
        if (allPrograms.length === 0) {
          console.log('⚠️ No programs found in database!');
        } else {
          console.log('📋 Sample program:', allPrograms[0]);
          console.log('📋 All program categories:', allPrograms.map(p => p.category));
        }
      } catch (error) {
        console.error('❌ Error fetching all programs:', error);
      }
      
      // Only fetch programs if a category is selected
      if (!cat) {
        console.log('⚠️ No category selected, clearing programs');
        setPrograms([]);
      } else {
        const rows = await getProgramsByCategory(cat)
        console.log('📱 Programs found for category:', cat, ':', rows);
        setPrograms(rows.map(r => ({ id: String(r.id), name: r.name, desc: `${r.version ? `نسخه: ${r.version}` : ''} - حداقل CPU: ${r.cpu_min} - حداقل GPU: ${r.gpu_min} - حداقل RAM: ${r.ram_min_gb}GB` })))
      }
    })()
  }, [selections[1], categories])

  useEffect(() => {
    (async () => {
      const [full, scores, minPrices] = await Promise.all([
        getLaptopsFull(),
        getLaptopComponentScores(),
        getLaptopMinPrices(),
      ])

      const laptopById = new Map<number, typeof full[number]>()
      full.forEach(f => { if (f.id != null) laptopById.set(f.id, f) })

      const priceById = new Map<number, number>()
      minPrices.forEach(p => { if (p.laptop_id != null && p.min_price_toman != null) priceById.set(p.laptop_id, p.min_price_toman) })

      let results: LaptopResultItem[] = scores.map(s => {
        const f = s.laptop_id != null ? laptopById.get(s.laptop_id) : undefined
        const priceToman = s.laptop_id != null ? priceById.get(s.laptop_id || -1) : undefined
        const priceMillion = priceToman ? Math.round(priceToman / 1_000_000) : undefined
        const cpu = Number(s.cpu_score || 0)
        const ram = Number(s.ram_score || 0)
        const gpu = Number(s.gpu_score || 0)
        const score = Math.min(100, Math.round(cpu * 0.4 + ram * 0.3 + gpu * 0.3))
        return {
          id: String(s.laptop_id),
          name: f?.laptop_name || 'نامشخص',
          desc: undefined,
          image: undefined,
          priceMillion,
          specs: {
            cpu_name: f?.cpu_name || undefined,
            ram: f?.ram_size_gb || undefined,
            gpu_name: f?.gpu_name || undefined,
          },
          score,
        }
      })
      .filter(r => r.id !== 'undefined')

      // Filter by selected price range
      if (selections[4]) {
        const range = priceRanges.find(p => p.id === selections[4])?.range || [0, Infinity]
        results = results.filter(r => typeof r.priceMillion === 'undefined' || (r.priceMillion! >= range[0] && r.priceMillion! <= range[1]))
      }

      results.sort((a, b) => b.score - a.score)
      setLaptopResults(results)
    })()
  }, [selections])

  const handleSelection = (step: number, id: string, type: 'radio' | 'checkbox', subKey?: string) => {
    if (type === 'checkbox') {
      if (!selections[step]) selections[step] = subKey ? {} : [];
      let currentSelection = subKey ? (selections[step][subKey] || []) : selections[step];
      if (currentSelection.includes(id)) currentSelection = currentSelection.filter((itemId: string) => itemId !== id); else currentSelection.push(id);
      if (subKey) setSelections((prev: any) => ({ ...prev, [step]: { ...prev[step], [subKey]: currentSelection } })); else setSelections((prev: any) => ({ ...prev, [step]: currentSelection }));
    } else {
      setSelections((prev: any) => ({ ...prev, [step]: id }));
      if (step === 1) {
        setSelections((prev: any) => ({ ...prev, 2: [] }));
        // Don't clear programs here - let useEffect handle it
      }
    }
  };

  const handleCompareSelection = (laptopId: string) => setLaptopsToCompare(prev => prev.includes(laptopId) ? prev.filter(id => id !== laptopId) : [...prev, laptopId]);
  const changeStep = (direction: number) => setCurrentStep(prev => (direction < 0 && (prev === 6 || prev === 7)) ? 5 : prev + direction);
  const showDetails = (laptopId: string) => { setActiveLaptopId(laptopId); setCurrentStep(7); };
  const resetApp = () => { setCurrentStep(1); setSelections({}); setLaptopsToCompare([]); setActiveLaptopId(null); };
  const canGoNext = () => {
    if (currentStep === 2) return true; // Step 2 (programs) is optional
    const cs = selections[currentStep];
    if (!cs) return false;
    return Array.isArray(cs) ? cs.length > 0 : !!cs;
  };

  const laptopsMap = useMemo(() => {
    const map: Record<string, any> = {}
    laptopResults.forEach(r => { map[r.id] = { name: r.name, priceMillion: r.priceMillion, specs: r.specs } })
    return map
  }, [laptopResults])

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <header className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900">لپ‌تاپ‌گزین</h1>
        <p className="text-lg text-gray-600 mt-2">راهنمای هوشمند و شخصی‌سازی شده خرید لپ‌تاپ</p>
      </header>

      <main className="relative bg-white p-6 md:p-8 rounded-2xl shadow-lg min-h-[500px]">
        {currentStep === 1 && (
          <div className="step">
            <Step1Categories
              categories={categories}
              selectedCategory={selections[1]}
              onSelectionChange={(id) => handleSelection(1, id, 'radio')}
            />
          </div>
        )}

        {currentStep === 2 && (
          <div className="step">
            <Step2Software
              programs={programs}
              selectedSoftware={selections[2] || []}
              onSelectionChange={(id) => handleSelection(2, id, 'checkbox')}
            />
          </div>
        )}

        {currentStep === 3 && (
          <div className="step">
            <Step3Features
              features={features}
              ports={ports}
              selectedFeatures={selections[3]?.features || []}
              selectedPorts={selections[3]?.ports || []}
              onFeatureChange={(id) => handleSelection(3, id, 'checkbox', 'features')}
              onPortChange={(id) => handleSelection(3, id, 'checkbox', 'ports')}
            />
          </div>
        )}

        {currentStep === 4 && (
          <div className="step">
            <Step4Prices
              selectedPrice={selections[4]}
              onSelectionChange={(id) => handleSelection(4, id, 'radio')}
            />
          </div>
        )}

        {currentStep === 5 && (
          <div className="step">
            <Step5Results
              results={laptopResults}
              laptopsToCompare={laptopsToCompare}
              onCompareSelection={handleCompareSelection}
              onShowDetails={showDetails}
            />
          </div>
        )}

        {currentStep === 6 && (
          <div className="step">
            <Step6Comparison laptopsToCompare={laptopsToCompare} laptopsMap={laptopsMap} />
          </div>
        )}

        {currentStep === 7 && (
          <div className="step">
            <Step7Details activeLaptopId={activeLaptopId} laptopsMap={laptopsMap} />
          </div>
        )}

        <Navigation
          currentStep={currentStep}
          canGoNext={canGoNext()}
          onBack={() => changeStep(-1)}
          onNext={() => changeStep(1)}
          onFinish={() => setCurrentStep(5)}
          onReset={resetApp}
          onCompare={() => setCurrentStep(6)}
          laptopsToCompare={laptopsToCompare}
        />
      </main>

      <SummaryBar currentStep={currentStep} selections={selections} categories={categories} />
    </div>
  );
}
