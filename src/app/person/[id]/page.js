// src/app/person/[id]/page.js

import React from 'react';
import Link from 'next/link';
// 팀 스타일 가이드를 가져옵니다 (경로가 다를 수 있으니 확인 필요)
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  commonStyles,
  layout,
} from '@/lib/style/styles';

// --- TMDB API 호출 함수들 ---
// API 키는 서버 컴포넌트이므로 NEXT_PUBLIC_ 없이도 접근 가능합니다.
// .env.local에 NEXT_PUBLIC_TMDB_API_KEY만 있다면 그것을 사용합니다.
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// 인물 상세 정보 및 필모그래피 API 호출 함수
async function fetchPersonDetails(personId) {
  const url = `${TMDB_BASE_URL}/person/${personId}?api_key=${TMDB_API_KEY}&language=ko-KR&append_to_response=movie_credits`;
  const res = await fetch(url);
  if (!res.ok) {
    // 간단한 오류 처리
    console.error(`Failed to fetch person details for ID: ${personId}`);
    return null; // 데이터 못 가져오면 null 반환
  }
  return res.json();
}
// ------------------------------

// --- 메인 페이지 컴포넌트 (서버 컴포넌트) ---
export default async function PersonDetailPage({ params }) {
  const { id } = params; // URL에서 인물 ID 가져오기

  // API 호출
  const person = await fetchPersonDetails(id);

  // API 호출 실패 시 간단한 메시지 표시
  if (!person) {
    return (
      <div style={{ padding: spacing.xl, color: 'white', backgroundColor: colors.dark }}>
        인물 정보를 불러오는 데 실패했습니다.
      </div>
    );
  }

  // 필모그래피 정렬 (인기도 순, 포스터 있는 것만)
  const filmography = person.movie_credits?.cast
    ?.filter(movie => movie.poster_path)
    .sort((a, b) => b.popularity - a.popularity) || []; // 데이터 없으면 빈 배열

  // --- 스타일 정의 (기존 영화 페이지 스타일 재활용 및 추가) ---
  // page.js 에서 가져온 styles 객체와 유사하게 구성
  const styles = {
    pageWrapper: {
      backgroundColor: colors.dark,
      color: colors.textPrimary || 'white', // 기본값 추가
      minHeight: '100vh',
      paddingBottom: spacing.xxl,
    },
    container: {
      ...commonStyles.container, // maxWidth 1200px, margin auto
    },
    // 인물 정보 섹션
    personHeader: {
      display: 'flex',
      gap: spacing.xl,
      marginBottom: spacing.xxl,
      paddingTop: spacing.xxl, // 헤더 아래 간격
      alignItems: 'flex-start',
    },
    personImage: {
      width: '200px', // 이미지 크기 조정
      height: '300px',
      objectFit: 'cover',
      borderRadius: borderRadius.medium,
      backgroundColor: colors.darkGray,
      flexShrink: 0, // 이미지가 찌그러지지 않도록
    },
    personInfo: {
      flex: 1,
    },
    personName: {
      fontSize: fontSize.hero, // 영화 제목처럼 크게
      fontWeight: fontWeight.bold,
      color: colors.white,
      margin: 0,
      marginBottom: spacing.md,
    },
    personBio: {
      fontSize: fontSize.medium,
      color: colors.lightGray,
      lineHeight: 1.6,
      margin: 0,
      maxHeight: '200px', // 소개글이 너무 길 경우 대비
      overflowY: 'auto',
    },
    // 필모그래피 섹션
    section: {
      marginBottom: spacing.xxl,
    },
    sectionTitle: {
      ...commonStyles.sectionTitle,
    },
    // 관련 영화 스타일 재활용
    filmographyGrid: {
      ...layout.movieGrid, // 영화 그리드 레이아웃 사용
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', // 카드 크기 조절
    },
    movieCard: {
      ...commonStyles.movieCard,
      cursor: 'pointer', // 클릭 가능 표시 (실제 링크는 추가 필요)
    },
    moviePoster: {
      width: '100%',
      // height: '270px', // 높이 자동 조절되도록 주석 처리하거나 비율로 설정
      aspectRatio: '2 / 3', // 포스터 비율 유지
      objectFit: 'cover',
      backgroundColor: colors.dark,
    },
    movieTitle: {
      ...commonStyles.movieTitle,
      textAlign: 'center',
      padding: spacing.sm,
      fontSize: fontSize.medium,
    },
    // 임시 색상 (styles.js import 확인 필요)
    textPrimary: { color: colors.textPrimary || 'white' },
    textLight: { color: colors.textLight || '#999' },
  };

  return (
    // 페이지 전체 레이아웃 (Header/Footer는 RootLayout에서 적용됨)
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        {/* --- 인물 정보 섹션 --- */}
        <section style={styles.personHeader}>
          <img
            src={person.profile_path ? `${IMAGE_BASE_URL}/w342${person.profile_path}` : 'https://i.imgur.com/dDD1biL.png'}
            alt={person.name}
            style={styles.personImage}
          />
          <div style={styles.personInfo}>
            <h1 style={styles.personName}>{person.name}</h1>
            <p style={styles.personBio}>
              {person.biography || "소개 정보가 없습니다."}
            </p>
            {/* 추가 정보 (생년월일 등) 필요시 여기에 추가 */}
            {person.birthday && <p style={{color: colors.lightGray, marginTop: spacing.md}}>생년월일: {person.birthday}</p>}
            {person.place_of_birth && <p style={{color: colors.lightGray}}>출생지: {person.place_of_birth}</p>}
          </div>
        </section>

        {/* --- 필모그래피 섹션 --- */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>주요 필모그래피 (출연작)</h2>
          {filmography.length > 0 ? (
            <div style={styles.filmographyGrid}>
              {filmography.slice(0, 12).map((movie) => ( // 상위 12개 영화 표시
                // 각 영화 카드를 클릭하면 해당 영화 상세 페이지로 이동하도록 Link 추가
                <Link href={`/movieInfo/${movie.id}`} key={movie.id} style={{ textDecoration: 'none' }}>
                  <div style={styles.movieCard}>
                    <img
                      src={`${IMAGE_BASE_URL}/w342${movie.poster_path}`}
                      alt={movie.title}
                      style={styles.moviePoster}
                    />
                    <div style={commonStyles.movieInfo || { padding: spacing.md }}>
                      <h3 style={styles.movieTitle}>{movie.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p style={{ ...styles.textLight }}>출연작 정보가 없습니다.</p>
          )}
        </section>
      </div>
    </div>
  );
}