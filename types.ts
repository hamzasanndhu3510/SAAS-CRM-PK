
export type UUID = string;

export enum UserRole {
  ADMIN = 'ADMIN',
  AGENT = 'AGENT',
  VIEWER = 'VIEWER'
}

export interface DashboardData {
  salesTrend: { name: string; value: number }[];
  summary: {
    revenue: number;
    orders: number;
    avgOrderValue: number;
    newSignups: number;
  };
  funnel: {
    visitors: number;
    productViews: number;
    addToCart: number;
    checkOut: number;
    completeOrder: number;
  };
  retention: number[][];
  lifetimeRevenue: {
    name: string;
    [key: string]: string | number;
  }[];
}

export interface Tenant {
  id: UUID;
  name: string;
  logo_url?: string;
  primary_color: string;
  config: {
    currency: string;
    timezone: string;
    whatsapp_provider?: 'zensend' | 'smscountry';
    api_key?: string;
  };
}

export interface User {
  id: UUID;
  tenant_id: UUID;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface AIAnalysis {
  score: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  summary: string;
  strategy: string;
  intent_markers: string[];
  last_analyzed: string;
  closing_probability?: number;
  post_reply_probability?: number;
  personalized_email_draft?: string;
  email_subject?: string;
  lead_persona?: string;
  suggested_stage?: string;
}

export interface Message {
  id: UUID;
  sender: 'user' | 'lead';
  text: string;
  timestamp: string;
  is_ai_generated?: boolean;
}

export interface Conversation {
  contact_id: UUID;
  messages: Message[];
  status: 'ai_handling' | 'human_needed' | 'closed';
  last_activity: string;
}

export interface Contact {
  id: UUID;
  tenant_id: UUID;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  city: string;
  description?: string;
  lead_category?: 'corporate' | 'smb' | 'individual';
  tags: string[];
  assigned_to: UUID;
  created_at: string;
  ai_analysis?: AIAnalysis;
  conversation?: Conversation;
}

export interface Opportunity {
  id: UUID;
  tenant_id: UUID;
  contact_id: UUID;
  title: string;
  value: number;
  stage: string;
  assigned_to: UUID;
  last_activity: string;
  ai_analysis?: AIAnalysis;
}

export interface AutomationTrigger {
  id: UUID;
  name: string;
  description: string;
  icon: string;
  type: 'vision' | 'sentiment' | 'time' | 'logic';
  is_active: boolean;
  color: string;
}
