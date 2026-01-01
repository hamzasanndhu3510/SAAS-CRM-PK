
import { Tenant, User, UserRole } from '../types';

export const MOCK_TENANT: Tenant = {
  id: 'tenant-123',
  name: 'Neural Workspace',
  logo_url: '',
  primary_color: '#2563eb',
  config: {
    currency: 'PKR',
    timezone: 'Asia/Karachi',
    whatsapp_provider: 'zensend'
  }
};

export const MOCK_USER: User = {
  id: 'user-456',
  tenant_id: 'tenant-123',
  name: 'Hamza',
  email: 'hamza@agency.pk',
  role: UserRole.ADMIN,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hamza'
};
