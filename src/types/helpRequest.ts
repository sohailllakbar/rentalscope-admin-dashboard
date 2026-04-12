// types/helpRequest.ts

export type ApiHelpRequest = {
  id: number;
  requester?: { name?: string };
  firstName?: string;
  email?: string;
  subject?: string;
  feedback?: string;
  status: "Unread" | "Read";
  reply?: string | null;
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