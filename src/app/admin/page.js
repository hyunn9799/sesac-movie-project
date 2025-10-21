'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/app/admin/_components/AdminLayout';
import {
  adminColors,
  adminSizes,
  adminStyles,
  mergeStyles,
} from '@/app/admin/_lib/style/adminTokens';
import { initialMembers } from '@/lib/data/memberData';
import { initialNotices } from '@/lib/data/notice';

/**
 * 관리자 대시보드 메인 페이지
 * - 통계 카드 4개 표시 (공지사항, 회원, 영화, 리뷰)
 * - 공지사항 목록 테이블
 * - 공지사항 추가/수정/삭제 기능
 */
export default function AdminDashboard() {
  // ========================================
  // 상태 관리
  // ========================================

  /**
   * 공지사항 목록 상태
   * - localStorage에서 데이터 불러오기
   * - 없으면 더미 데이터 사용
   */
  const [notices, setNotices] = useState([]);
  const [showAll, setShowAll] = useState(false);

  // 컴포넌트 마운트 시 localStorage에서 데이터 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('notices');
    if (saved) {
      const loadedNotices = JSON.parse(saved);
      // 고정 공지사항을 맨 위로 정렬
      const sortedNotices = sortNotices(loadedNotices);
      setNotices(sortedNotices);
    } else {
      const sortedNotices = sortNotices(initialNotices);
      setNotices(sortedNotices);
      localStorage.setItem('notices', JSON.stringify(sortedNotices));
    }
  }, []);

  // 공지사항 정렬 함수 (고정 공지 → 일반 공지)
  const sortNotices = (noticeList) => {
    return [...noticeList].sort((a, b) => {
      // isPinned가 true인 것을 우선
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      // 같은 고정 상태면 날짜 최신순
      return new Date(b.date) - new Date(a.date);
    });
  };

  // ========================================
  // 이벤트 핸들러
  // ========================================

  /**
   * 공지사항 삭제 핸들러
   * @param {number} id - 삭제할 공지사항 ID
   */
  const handleDelete = (id) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      const updated = notices.filter((notice) => notice.id !== id);
      const sortedUpdated = sortNotices(updated);
      setNotices(sortedUpdated);
      localStorage.setItem('notices', JSON.stringify(sortedUpdated));
      alert('삭제되었습니다.');
    }
  };

  /**
   * 공지사항 수정 버튼 클릭 핸들러
   * @param {number} id - 수정할 공지사항 ID
   */
  const handleEdit = (id) => {
    alert('수정 페이지로 이동합니다.');
    // TODO: window.location.href = `/admin/notice/edit/${id}`;
  };

  /**
   * 새 공지사항 작성 버튼 클릭 핸들러
   */
  const handleAdd = () => {
    window.location.href = '/admin/notice/create';
  };

  // ========================================
  // 정적 데이터
  // ========================================

  /**
   * 대시보드 통계 카드 데이터
   */
  const stats = [
    {
      icon: '📢',
      label: '총 공지사항',
      value: notices.length,
      color: adminColors.statRed,
      bg: adminColors.statRedBg,
    },
    {
      icon: '👥',
      label: '전체 회원',
      value: initialMembers.length,
      color: adminColors.statBlue,
      bg: adminColors.statBlueBg,
    },
    {
      icon: '🎬',
      label: '등록 영화',
      value: '8,532',
      color: adminColors.statYellow,
      bg: adminColors.statYellowBg,
    },
    {
      icon: '⭐',
      label: '리뷰 수',
      value: '15,438',
      color: adminColors.statGreen,
      bg: adminColors.statGreenBg,
    },
  ];

  return (
    <AdminLayout title="대시보드" currentMenu="dashboard">
      {/* ========================================
          통계 카드 그리드
          ======================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: adminSizes.spacing.xl,
          marginBottom: adminSizes.spacing.xxl,
        }}
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            style={mergeStyles(
              adminStyles.card.base,
              adminStyles.card.statCard
            )}
          >
            {/* 카드 상단: 아이콘 + 라벨 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: adminSizes.spacing.md,
                marginBottom: adminSizes.spacing.lg,
              }}
            >
              {/* 아이콘 */}
              <div
                style={mergeStyles(adminStyles.card.statIcon, {
                  background: stat.bg,
                  color: stat.color,
                })}
              >
                {stat.icon}
              </div>
              {/* 라벨 */}
              <div
                style={{
                  fontSize: '14px',
                  color: adminColors.textTertiary,
                  fontWeight: 500,
                }}
              >
                {stat.label}
              </div>
            </div>
            {/* 수치 */}
            <div style={adminStyles.card.statValue}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* ========================================
          공지사항 관리 섹션
          ======================================== */}
      <section style={adminStyles.card.base}>
        {/* 섹션 헤더 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: `20px ${adminSizes.spacing.xl}`,
            borderBottom: `1px solid ${adminColors.border}`,
          }}
        >
          <h2
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '18px',
              fontWeight: 700,
              color: adminColors.textPrimary,
              margin: 0,
            }}
          >
            <span>📢</span>
            공지사항 관리
          </h2>
          <button
            onClick={handleAdd}
            style={mergeStyles(
              adminStyles.button.base,
              adminStyles.button.primary
            )}
          >
            <span>+</span>
            <span>새 공지사항 작성</span>
          </button>
        </div>

        {/* 테이블 */}
        <div style={adminStyles.table.container}>
          <table style={adminStyles.table.table}>
            <thead style={adminStyles.table.thead}>
              <tr>
                <th style={{ ...adminStyles.table.th, width: '80px' }}>번호</th>
                <th style={adminStyles.table.th}>제목</th>
                <th style={{ ...adminStyles.table.th, width: '120px' }}>
                  작성자
                </th>
                <th style={{ ...adminStyles.table.th, width: '120px' }}>
                  등록일
                </th>
                <th style={{ ...adminStyles.table.th, width: '100px' }}>
                  조회수
                </th>
                <th style={{ ...adminStyles.table.th, width: '200px' }}>
                  관리
                </th>
              </tr>
            </thead>
            <tbody>
              {notices.slice(0, showAll ? notices.length : 5).map((notice) => (
                <tr key={notice.id}>
                  <td style={adminStyles.table.td}>{notice.id}</td>
                  <td style={adminStyles.table.td}>
                    <div
                      style={{
                        fontWeight: 600,
                        color: adminColors.textPrimary,
                      }}
                    >
                      {notice.title}
                      {notice.isNew && (
                        <span
                          style={mergeStyles(
                            adminStyles.badge.base,
                            adminStyles.badge.error,
                            { marginLeft: '8px' }
                          )}
                        >
                          NEW
                        </span>
                      )}
                      {notice.isPinned && (
                        <span
                          style={mergeStyles(
                            adminStyles.badge.base,
                            {
                              background: adminColors.statPurpleBg,
                              color: adminColors.statPurple,
                            },
                            { marginLeft: '8px' }
                          )}
                        >
                          📌 고정
                        </span>
                      )}
                    </div>
                  </td>
                  <td
                    style={{
                      ...adminStyles.table.td,
                      color: adminColors.textTertiary,
                    }}
                  >
                    {notice.author}
                  </td>
                  <td
                    style={{
                      ...adminStyles.table.td,
                      color: adminColors.textTertiary,
                    }}
                  >
                    {notice.date}
                  </td>
                  <td style={{ ...adminStyles.table.td, fontWeight: 500 }}>
                    {notice.views.toLocaleString()}
                  </td>
                  <td style={adminStyles.table.td}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEdit(notice.id)}
                        style={mergeStyles(
                          adminStyles.button.base,
                          adminStyles.button.small,
                          adminStyles.button.info
                        )}
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(notice.id)}
                        style={mergeStyles(
                          adminStyles.button.base,
                          adminStyles.button.small,
                          adminStyles.button.error
                        )}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 더 보기 버튼 */}
        {notices.length > 5 && (
          <div
            style={{
              padding: adminSizes.spacing.lg,
              textAlign: 'center',
              borderTop: `1px solid ${adminColors.border}`,
            }}
          >
            <button
              style={mergeStyles(
                adminStyles.button.base,
                adminStyles.button.secondary
              )}
              onClick={() => setShowAll(!showAll)}
            >
              {showAll
                ? `접기 (${notices.length}개)`
                : `전체 공지사항 보기 총: (${notices.length}개)`}
            </button>
          </div>
        )}
      </section>
    </AdminLayout>
  );
}
