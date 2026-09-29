export type Language = 'en' | 'ta' | 'hi';

export type PortalMode = 'citizen' | 'policymaker';

export type CitizenIntakeMode = 'voice' | 'whatsapp' | 'web';

export type InfrastructureCategory = 
  | 'water' 
  | 'roads' 
  | 'power' 
  | 'health' 
  | 'education' 
  | 'sanitation' 
  | 'transport' 
  | 'other';

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';

export type TicketStatus = 
  | 'submitted' 
  | 'under_review' 
  | 'prioritized' 
  | 'sanctioned' 
  | 'resolved';

export interface SentimentScore {
  score: number; // 0 - 100 composite
  urgency_index: number; // 0 - 100
  frustration_index: number; // 0 - 100
  label_en: string;
  label_ta: string;
  tone: 'critical' | 'high' | 'moderate' | 'low';
  triggers: string[];
}

export interface CitizenTicket {
  id: string;
  tracking_code: string;
  title_en: string;
  title_ta: string;
  description_en: string;
  description_ta: string;
  raw_submission: string;
  language: 'ta' | 'en' | 'tanglish';
  category: InfrastructureCategory;
  severity: SeverityLevel;
  district: string;
  taluk?: string;
  village?: string;
  coordinates?: { lat: number; lng: number };
  affected_population_estimate: number;
  upvotes: number;
  hasUpvoted?: boolean;
  status: TicketStatus;
  channel: 'voice' | 'whatsapp' | 'web';
  government_scheme?: string;
  estimated_budget_inr_lakhs?: number;
  created_at: string;
  sentiment?: SentimentScore;
}

export interface DistrictData {
  id: string;
  name: string;
  name_ta: string;
  population: number;
  water_deficit_score: number; // 0-100
  road_deficit_score: number; // 0-100
  health_deficit_score: number; // 0-100
  power_deficit_score: number; // 0-100
  overall_deficit_index: number; // 0-100
  citizen_tickets_count: number;
  planned_capex_crores: number;
  required_capex_crores: number;
  alignment_mismatch_pct: number;
  center_coords: { lat: number; lng: number };
  top_unaddressed_demand: string;
  top_unaddressed_demand_ta: string;
}

export interface HotspotCluster {
  id: string;
  district_id: string;
  district_name: string;
  sector: InfrastructureCategory;
  title_en: string;
  title_ta: string;
  ticket_count: number;
  affected_villages_count: number;
  estimated_beneficiaries: number;
  urgency: SeverityLevel;
  key_complaint_summary_en: string;
  key_complaint_summary_ta: string;
  recommended_scheme: string;
}

export interface CandidateProject {
  id: string;
  title_en: string;
  title_ta: string;
  district_name: string;
  sector: InfrastructureCategory;
  budget_inr_crores: number;
  status: 'proposed' | 'tender_ready' | 'cabinet_pending' | 'sanctioned';
  citizen_tickets_linked: number;
  impact_score?: number;
  citizen_alignment_index?: number;
  deficit_urgency_score?: number;
  recommended_tier?: string;
  rationale_en?: string;
  rationale_ta?: string;
  estimated_beneficiaries: number;
}

export interface DPRMemo {
  memo_reference_no: string;
  executive_title_en: string;
  executive_title_ta: string;
  strategic_context_en: string;
  strategic_context_ta: string;
  citizen_demand_evidence: string[];
  budget_breakdown: { component: string; cost_crores: number; percentage: number }[];
  socio_economic_impact_en: string;
  socio_economic_impact_ta: string;
  implementation_milestones: { phase: string; timeline: string }[];
  recommended_approval: string;
}

export interface WhatsAppMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  isVoice?: boolean;
  ticketRef?: string;
}
