
export type Tenant = {
  id: number;
  image: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
  status?: string;
};

export type ApiTenant = {
  id: number;
  image?: string;
  name: string;
  email: string;
  phone: string;
  gender?: string;
  address?: string;
  status?: string;
};