export interface Admin {
  id: string;
  username: string;
}

export interface AdminSession {
  adminId: string;
  username: string;
  expiresAt: Date;
}
