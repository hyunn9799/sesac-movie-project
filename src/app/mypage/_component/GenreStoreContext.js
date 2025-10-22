'use client'
import { createContext, useState, useContext } from 'react';

// 1. Context 생성
const GenreContext = createContext(null);

// 2. Provider 컴포넌트 생성 (실제 상태와 로직을 포함)
export function GenreProvider({ children }) {
  // 전역으로 관리할 상태
  const [favGenres, setFavGenres] = useState(['모험', '공포', '코미디']);
  const [unfavGenres, setUnfavGenres] = useState(['액션', '애니메이션', '다큐멘터리']);

  // 상태 업데이트 함수
  const updateGenres = (newFav, newUnfav) => {
    setFavGenres(newFav);
    setUnfavGenres(newUnfav);
  };

  const value = { favGenres, unfavGenres, updateGenres };

  return <GenreContext.Provider value={value}>{children}</GenreContext.Provider>;
}

// 3. 커스텀 훅 생성 (사용 편의성 증진)
export function useGenreStore() {
  const context = useContext(GenreContext);
  if (context === undefined) {
    throw new Error('useGenreStore는 GenreProvider 내부에서 사용되어야 합니다.');
  }
  return context;
}