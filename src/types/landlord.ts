// types/landlord.ts

export type Landlord = {
  id: number;
  image?: string | null;
  name: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
  status?: string;
};

export type ApiLandlord = {
  id: number;
  image?: string | null;
  name: string;
  email: string;
  phone: string;
  gender?: string | null;
  address?: string | null;
  status?: string | null;
};