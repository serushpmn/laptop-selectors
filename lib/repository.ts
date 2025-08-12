import { supabase } from './supabaseClient'

export type CategoryRow = { id: number; name?: string; fa_name?: string; icon?: string | null; desc?: any }
export type ProgramRow = {
  id: number
  name: string
  version: string | null
  category: string[] | null  // Changed to string array
  cpu_min: number
  cpu_rec: number | null
  gpu_min: number
  gpu_rec: number | null
  ram_min_gb: number
  ram_rec_gb: number | null
}

export type FeatureRow = { id: number; name: string }
export type PortRow = { id: number; name: string }

export type LaptopFullInfoRow = {
  id: number
  laptop_name: string | null
  cpu_name: string | null
  gpu_name: string | null
  ram_size_gb: number | null
  ram_type: string | null
  ram_speed_mhz: number | null
  storage_kind: string | null
  storage_interface: string | null
  storage_size_gb: number | null
  display_size_inch: number | null
  display_quality: string | null
  display_refresh_hz: number | null
  display_panel: string | null
  os_name: string | null
  os_version: string | null
  ports: string[] | null
  features: string[] | null
}

export type LaptopComponentScoresRow = {
  laptop_id: number
  cpu_score: number | null
  gpu_score: number | null
  ram_score: number | null
}

export type LaptopMinPriceRow = { laptop_id: number; min_price_toman: number | null }

export type CpuScoreRow = { id: number; score_robust: number | null }
export type GpuScoreRow = { id: number; score_robust: number | null }

export async function getCategories(): Promise<CategoryRow[]> {
  const { data, error } = await supabase.from('categories').select('id, fa_name, name, icon, desc').order('id')
  if (error) {
    console.error('❌ Error fetching categories:', error);
    throw error;
  }
  console.log('📂 Categories fetched:', data);
  return data || []
}

export async function debugDatabase(): Promise<void> {
  console.log('🔍 Debugging database...');
  
  try {
    // Check categories
    const { data: categories, error: catError } = await supabase.from('categories').select('*')
    console.log('📂 Categories:', categories);
    console.log('📂 Categories error:', catError);
    
    // Check programs
    const { data: programs, error: progError } = await supabase.from('programs').select('*')
    console.log('📱 Programs:', programs);
    console.log('📱 Programs error:', progError);
    
    // Check if programs table exists and has data
    if (programs && programs.length > 0) {
      console.log('✅ Programs table has data');
      console.log('📋 Sample program:', programs[0]);
      console.log('📋 All categories in programs:', Array.from(new Set(programs.flatMap(p => p.category || []))));
    } else {
      console.log('⚠️ Programs table is empty or has no data');
    }
    
    // Check if categories match
    if (categories && programs) {
      const categoryNames = categories.map(c => c.name).filter(Boolean);
      const programCategories = programs.flatMap(p => p.category || []).filter(Boolean);
      
      console.log('🔗 Category names in categories table:', categoryNames);
      console.log('🔗 Category values in programs table:', programCategories);
      
      const matchingCategories = categoryNames.filter(cat => programCategories.includes(cat));
      console.log('✅ Matching categories:', matchingCategories);
      
      const missingCategories = categoryNames.filter(cat => !programCategories.includes(cat));
      console.log('❌ Missing categories in programs:', missingCategories);
    }
    
  } catch (error) {
    console.error('❌ Debug error:', error);
  }
}

export async function getAllPrograms(): Promise<ProgramRow[]> {
  const { data, error } = await supabase.from('programs').select('*')
  if (error) {
    console.error('❌ Error fetching all programs:', error);
    throw error;
  }
  console.log('📋 All programs fetched:', data);
  return data || []
}

export async function getProgramsByCategory(category: string | null): Promise<ProgramRow[]> {
  console.log('🔍 Searching for programs with category:', category);
  
  // First, let's see all programs and their categories
  const { data: allPrograms, error: allError } = await supabase.from('programs').select('id, name, category')
  if (allError) {
    console.error('❌ Error fetching all programs:', allError);
    throw allError;
  }
  console.log('📋 All programs in database:', allPrograms);
  
  // Now search for specific category
  if (!category) {
    return [];
  }
  
  // Use textSearch for array fields or filter manually
  const { data, error } = await supabase.from('programs').select('*')
  if (error) {
    console.error('❌ Error fetching all programs:', error);
    throw error;
  }
  
  // Filter programs manually based on category (support both string and array)
  let filteredPrograms = data?.filter(program => {
    if (!program.category) return false;
    if (Array.isArray(program.category)) {
      return program.category.includes(category);
    } else if (typeof program.category === 'string') {
      try {
        const arr = JSON.parse(program.category);
        if (Array.isArray(arr)) {
          return arr.includes(category);
        }
      } catch {
        return program.category === category;
      }
    }
    return false;
  }) || [];

  // فقط جدیدترین ورژن هر برنامه را نگه دار
  // فرض: version عددی یا رشته قابل مقایسه است
  const latestByName: Record<string, ProgramRow> = {};
  filteredPrograms.forEach(p => {
    const name = p.name;
    if (!latestByName[name]) {
      latestByName[name] = p;
    } else {
      // مقایسه ورژن فعلی با قبلی
      const prevVersion = latestByName[name].version;
      const currVersion = p.version;
      // اگر ورژن جدیدتر است جایگزین کن
      if (compareVersion(currVersion, prevVersion) > 0) {
        latestByName[name] = p;
      }
    }
  });
  filteredPrograms = Object.values(latestByName);

  console.log('✅ Found programs for category (latest only):', category, ':', filteredPrograms);
  return filteredPrograms;
}

// مقایسه ورژن به صورت عددی یا رشته‌ای
function compareVersion(a: string | null, b: string | null): number {
  if (!a && !b) return 0;
  if (!a) return -1;
  if (!b) return 1;
  // اگر هر دو عددی باشند
  const aNum = parseFloat(a);
  const bNum = parseFloat(b);
  if (!isNaN(aNum) && !isNaN(bNum)) {
    return aNum - bNum;
  }
  // مقایسه رشته‌ای
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

export async function getFeatures(): Promise<FeatureRow[]> {
  const { data, error } = await supabase.from('features').select('id, name').order('id')
  if (error) throw error
  return data || []
}

export async function getPorts(): Promise<PortRow[]> {
  const { data, error } = await supabase.from('ports').select('id, name').order('id')
  if (error) throw error
  return data || []
}

export async function getLaptopsFull(): Promise<LaptopFullInfoRow[]> {
  const { data, error } = await supabase.from('laptop_full_info').select('*')
  if (error) throw error
  return data || []
}

export async function getLaptopComponentScores(): Promise<LaptopComponentScoresRow[]> {
  const { data, error } = await supabase.from('laptop_component_scores').select('*')
  if (error) throw error
  return data || []
}

export async function getLaptopMinPrices(): Promise<LaptopMinPriceRow[]> {
  const { data, error } = await supabase.from('laptop_min_price').select('*')
  if (error) throw error
  return data || []
}

export async function getCpuScores(): Promise<CpuScoreRow[]> {
  const { data, error } = await supabase.from('cpu_scores').select('id, score_robust')
  if (error) throw error
  return data || []
}

export async function getGpuScores(): Promise<GpuScoreRow[]> {
  const { data, error } = await supabase.from('gpu_scores').select('id, score_robust')
  if (error) throw error
  return data || []
}
