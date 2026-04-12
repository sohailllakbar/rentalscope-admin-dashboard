// types/propertyRequest.ts

export type PropertyRequest = {
  id: number;
  propertyId: number;
  image?: string | null;
  name: string;
  description: string;
  saleOrRent: string;
};

export type PropertyRequestAPI = {
  id: number;
  tenantId: number;
  propertyId: number;
  requestStatus: string;
  createdAt: string;
  property: {
    id: number;
    title: string;
    location: string;
    saleOrRent: string;
  };
  requestingTenant: {
    id: number;
    name: string;
    email: string;
  };
};