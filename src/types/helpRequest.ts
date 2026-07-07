// types/helpRequest.ts

export type ApiHelpRequest = {
  id: number;
  requester?: {
    name?: string;
    email?: string;
    imageProfile?: string | null;
  };
  name?: string;
  firstName?: string;
  email?: string;
  subject?: string;
  feedback?: string;
  message?: string;
  status?: "Unread" | "Read" | string;
  reply?: string | null;
  imageProfile?: string | null;
};

export type Request = {
  id: number;
  name: string;
  email: string;
  status: "Unread" | "Read";
  subject: string;
  feedback: string;
  avatar: string;
  reply: string | null;
};

export type RequestDetails = Request;