export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  phone?: number;
  role: "USER" | "ADMIN";
  avatarUrl?: string;
}
