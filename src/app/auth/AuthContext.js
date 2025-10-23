// app/contexts/AuthContext.js (예시 경로)
'use client'; 
// Context API의 상태 관리 기능은 클라이언트 컴포넌트에서 작동해야 함

import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // 사용자 정보 상태

  const updateUser = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem('loggedInUser',JSON.stringify(newUserData))
  }

  // ⭐️ 초기 로드 시 localStorage에서 인증 정보 가져오기
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

//   // 로그인/로그아웃 함수
//   const login = (userData) => { /* 로그인 로직 및 localStorage 저장 */ setUser(userData); };
//   const logout = () => { /* 로그아웃 로직 및 localStorage 제거 */ setUser(null); };

  const value = { user, updateUser };
  // isLoading은 초기 로딩 시 깜빡임 방지를 위해 필요할 수 있음

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}