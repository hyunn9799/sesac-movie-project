// 'use client'; // 👈 더 이상 클라이언트 컴포넌트일 필요 없으므로 삭제하거나 주석 처리합니다.

import React from 'react';
import Link from 'next/link'; // 👈 Next.js의 Link 컴포넌트 임포트

// API/이미지 경로는 page.js에서 가져오므로 여기서는 필요 없습니다.
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// 인물 목록을 표시하고, 클릭 시 해당 인물의 페이지로 이동시키는 컴포넌트
export default function CrewList({ director, cast, styles }) {
  // 모달 관련 useState, API 호출 함수, 이벤트 핸들러 모두 제거됨

  return (
    <>
      {/* --- 감독 출연 섹션 --- */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>감독 & 주요 출연진</h2>
        </div>
        <div style={styles.crewGrid}>
          {/* 감독 아이템 */}
          {director && (
            // 👈 div 대신 Link 컴포넌트 사용, href 속성 추가
            <Link href={`/person/${director.id}`} style={{ textDecoration: 'none' }}>
              <div style={styles.crewItem}> {/* 기존 스타일 유지 */}
                <img
                  src={director.profile_path ? `${IMAGE_BASE_URL}/w185${director.profile_path}` : 'https://i.imgur.com/dDD1biL.png'}
                  alt={director.name}
                  style={styles.crewImage}
                />
                <div>
                  <span style={styles.crewName}>{director.name}</span>
                  <div style={{color: styles.textSecondary?.color || '#808080'}}>감독</div>
                </div>
              </div>
            </Link>
          )}
          
          {/* 출연진 아이템 */}
          {cast.map((person) => (
            // 👈 div 대신 Link 컴포넌트 사용, href 속성 추가
            <Link href={`/person/${person.id}`} key={person.id} style={{ textDecoration: 'none' }}>
              <div style={styles.crewItem}> {/* 기존 스타일 유지 */}
                <img
                  src={person.profile_path ? `${IMAGE_BASE_URL}/w185${person.profile_path}` : 'https://i.imgur.com/dDD1biL.png'}
                  alt={person.name}
                  style={styles.crewImage}
                />
                <div>
                  <span style={styles.crewName}>{person.name}</span>
                  <div style={{color: styles.textSecondary?.color || '#808080'}}>{person.character}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 모달 관련 JSX 모두 제거됨 */}
    </>
  );
}