// types/manager.ts

export type Manager = {
  id: number;
  avatar: string;
  name: string;
  email: string;
  password: string;
  isBlocked: boolean;
};

export type ApiManager = {
  id: number;
  name: string;
  email: string;
  password: string;
  profileImage: string | null;
  isBlocked: boolean;
};