
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Tenant, Contact, Opportunity } from '../types';

interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  token: string | null;
}

interface CRMState {
  contacts: Contact[];
  opportunities: Opportunity[];
}

const initialAuthState: AuthState = {
  user: null,
  tenant: null,
  isAuthenticated: false,
  token: null,
};

const initialCRMState: CRMState = {
  contacts: [],
  opportunities: [],
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
    updateTenant: (state, action: PayloadAction<Partial<Tenant>>) => {
      if (state.tenant) {
        state.tenant = { ...state.tenant, ...action.payload };
      }
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
      state.contacts.push(action.payload);
    },
    bulkAddContacts: (state, action: PayloadAction<Contact[]>) => {
      state.contacts.push(...action.payload);
    },
    addOpportunity: (state, action: PayloadAction<Opportunity>) => {
      state.opportunities.push(action.payload);
    },
    updateOpportunityStage: (state, action: PayloadAction<{ id: string; stage: string }>) => {
      const opp = state.opportunities.find(o => o.id === action.payload.id);
      if (opp) opp.stage = action.payload.stage;
    },
    updateOpportunityAI: (state, action: PayloadAction<{ id: string; analysis: any }>) => {
      const opp = state.opportunities.find(o => o.id === action.payload.id);
      if (opp) opp.ai_analysis = action.payload.analysis;
    }
  }
});

export const { setAuth, logout, updateTenant } = authSlice.actions;
export const { addContact, bulkAddContacts, addOpportunity, updateOpportunityStage, updateOpportunityAI } = crmSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    crm: crmSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
