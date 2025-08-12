export interface User {
    id: string;
    email: string;
    username: string;
    password: string;
    role: 'user' | 'admin';
    tokens: number;
    walletAddress?: string;
    agtBalance: number;
    tabascoBalance: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface UserPayload {
    userId: string;
    role: 'user' | 'admin';
  }
  