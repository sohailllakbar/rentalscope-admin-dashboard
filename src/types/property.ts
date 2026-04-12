
export type Property = {
  id: number;
  image?: string | null;
  name: string;
  description: string;
  type: string;
};

export type ApiProperty = {
  id: number;
  title: string;
  description: string;
  saleOrRent: string;
  images?: string[];
};