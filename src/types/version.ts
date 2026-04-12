// types/version.ts

export type Platform = "android" | "ios";

export type Version = {
  id: number;
  versionNumber: string;
  description: string;
  releaseDate: string;
  status: string;
  deviceType: Platform;
};

export type ApiVersion = {
  id: number;
  versionNumber: string;
  description: string;
  releaseDate: string;
  status: string;
  deviceType: Platform;
};