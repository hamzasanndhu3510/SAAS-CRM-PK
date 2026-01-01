
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Tenant, Contact, Opportunity, DashboardData } from '../types';

interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  token: string | null;
  isDarkMode: boolean;
}

interface DraftEmail {
  contactId: string;
  subject: string;
  body: string;
  generatedAt: string;
}

interface CRMState {
  contacts: Contact[];
  opportunities: Opportunity[];
  dashboard: DashboardData;
  draftEmails: DraftEmail[];
  notifications: { id: string; text: string; time: string; read: boolean }[];
}

const initialDashboardData: DashboardData = {
  salesTrend: Array(6).fill(0).map((_, i) => ({ name: `${i+1}th`, value: Math.floor(Math.random() * 50000) })),
  summary: { revenue: 1250000, orders: 432, avgOrderValue: 2800, newSignups: 45 },
  funnel: { visitors: 5000, productViews: 3200, addToCart: 1200, checkOut: 800, completeOrder: 450 },
  retention: Array(8).fill(0).map(() => Array(8).fill(0)),
  lifetimeRevenue: []
};

const initialAuthState: AuthState = {
  user: null,
  tenant: null,
  isAuthenticated: false,
  token: null,
  isDarkMode: false,
};

const initialCRMState: CRMState = {
  contacts: [],
  opportunities: [],
  dashboard: initialDashboardData,
  draftEmails: [],
  notifications: [
    { id: '1', text: 'New lead from Karachi assigned to you', time: '2m ago', read: false },
    { id: '2', text: 'JazzCash payment verified for Order #882', time: '1h ago', read: false }
  ]
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: User; tenant: Tenant; token: string }>) => {
      state.user = action.payload.user;
      state.tenant = action.payload.tenant;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    updateTenant: (state, action: PayloadAction<Partial<Tenant>>) => {
      if (state.tenant) state.tenant = { ...state.tenant, ...action.payload };
    },
    logout: (state) => {
      state.user = null;
      state.tenant = null;
      state.token = null;
      state.isAuthenticated = false;
    }
  }
});

const crmSlice = createSlice({
  name: 'crm',
  initialState: initialCRMState,
  reducers: {
    addContact: (state, action: PayloadAction<Contact>) => {
      state.contacts.unshift(action.payload);
    },
    addOpportunity: (state, action: PayloadAction<Opportunity>) => {
      state.opportunities.unshift(action.payload);
    },
    addDraftEmail: (state, action: PayloadAction<DraftEmail>) => {
      state.draftEmails.push(action.payload);
    },
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const n = state.notifications.find(x => x.id === action.payload);
      if (n) n.read = true;
    },
    updateOpportunityStage: (state, action: PayloadAction<{ id: string; stage: string }>) => {
      const opp = state.opportunities.find(o => o.id === action.payload.id);
      if (opp) opp.stage = action.payload.stage;
    },
    // Fix: Added missing updateFunnelStage reducer for Dashboard.tsx
    updateFunnelStage: (state, action: PayloadAction<{ stage: keyof DashboardData['funnel']; value: number }>) => {
      state.dashboard.funnel[action.payload.stage] = action.payload.value;
    },
    // Fix: Added missing updateSalesTrend reducer for Dashboard.tsx
    updateSalesTrend: (state, action: PayloadAction<{ index: number; value: number }>) => {
      if (state.dashboard.salesTrend[action.payload.index]) {
        state.dashboard.salesTrend[action.payload.index].value = action.payload.value;
      }
    },
    updateDashboard: (state, action: PayloadAction<Partial<DashboardData>>) => {
      state.dashboard = { ...state.dashboard, ...action.payload };
    }
  }
});

export const { setAuth, logout, updateTenant, toggleTheme } = authSlice.actions;
export const { addContact, addOpportunity, addDraftEmail, markNotificationRead, updateOpportunityStage, updateDashboard, updateSalesTrend, updateFunnelStage } = crmSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    crm: crmSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
