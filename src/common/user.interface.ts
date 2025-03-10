export interface User {
    id: string;
    name: string;
    email: string;
    role: 'SUPER_ADMIN' | 'TRADER_SELLER' | 'PRIVATE_SELLER'; // Adjust roles as needed
    createdAt: Date;
    updatedAt: Date;
    is_emailVerified: boolean;
  }
