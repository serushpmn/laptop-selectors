import { supabase } from './supabaseClient'

export type CategoryRow = { id: number; name: string }
export type ProgramRow = {
  id: number
  name: string
  version: string | null
  category: string | null
  cpu_min: number
  cpu_rec: number | null
  gpu_min: number
  gpu_rec: number | null
  ram_min_gb: number
  ram_rec_gb: number | null
  notes: string | null
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
  const { data, error } = await supabase.from('categories').select('id, name').order('id')
  if (error) throw error
  return data || []
}

export async function getProgramsByCategory(category: string | null): Promise<ProgramRow[]> {
  let query = supabase.from('programs_latest').select('*')
  if (category) query = query.eq('category', category)
  const { data, error } = await query
  if (error) throw error
  return data || []
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
