
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  username: string;
  name: string;
  role: 'admin' | 'samsung' | 'callcenter' | 'representante';
  permissions: string[];
  representativeId?: string; // Para identificar representantes
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
