
'use client';


import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const updateUser = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem('loggedInUser', JSON.stringify(newUserData))
  }


  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("인증 정보 파싱 오류:", e);
        localStorage.removeItem('loggedInUser');
      }
    }
  }, []);


  const value = { user, updateUser };


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}