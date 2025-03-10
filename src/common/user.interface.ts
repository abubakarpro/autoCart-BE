export interface User {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN'; // Adjust roles as needed
    createdAt: Date;
    updatedAt: Date;
    is_emailVerified: boolean;
  }