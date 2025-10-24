'use client';
import React, { useState, useEffect } from 'react';
import { initialNotices } from '@/lib/data/notice';
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  shadow,
  transition,
} from '@/lib/style/styles';

export default function NoticePage() {
  const [notices, setNotices] = useState([]);
  const [search, setSearch] = useState('');

  const [openId, setOpenId] = useState(null);

  // ✅ 현재 열려있는 항목 ID

  // 페이지 관련
  const [currentPage, setCurrentPage] = useState(1);
  const noticesPerPage = 10;

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = () => {
    try {
      let saved = localStorage.getItem('moviehub_notices');
      if (!saved) {
        saved = localStorage.getItem('notices');
      }

      if (saved) {
        const parsed = JSON.parse(saved);

        // ✅ ID 기준 오름차순 정렬
        parsed.sort((a, b) => a.id - b.id);

        setNotices(parsed);
      } else {
        // ✅ 초기 데이터도 정렬 후 저장
        const sorted = [...initialNotices].sort((a, b) => a.id - b.id);
        setNotices(sorted);
        localStorage.setItem('notices', JSON.stringify(sorted));
      }
    } catch (error) {
      console.error('공지사항 불러오기 실패:', error);
      const sorted = [...initialNotices].sort((a, b) => a.id - b.id);
      setNotices(sorted);
    }
  };

  // 검색

  const filteredNotices = notices.filter((notice) =>
    notice.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredNotices.length / noticesPerPage);
  const startIndex = (currentPage - 1) * noticesPerPage;
  const currentNotices = filteredNotices.slice(
    startIndex,
    startIndex + noticesPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ✅ 클릭 시 열기/닫기

  const toggleNotice = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div style={styles.container}>
      <div style={styles.noticeBox}>
        <h2 style={styles.title}>공지사항</h2>
        <p style={styles.subtitle}>
          <em style={{ color: colors.primary }}>MovieHub</em>의 각종
          공지사항(공지, 행사 등)을 제공합니다.
        </p>

        {/* 검색창 */}

        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <button style={styles.searchButton}>검색</button>
        </div>

        {/* 테이블 */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>번호</th>
              <th style={styles.tableHeader}>제목</th>
              <th style={styles.tableHeader}>작성일자</th>
            </tr>
          </thead>
          <tbody>
            {currentNotices.length === 0 ? (
              <tr>
                <td colSpan="3" style={styles.emptyCell}>
                  등록된 공지사항이 없습니다.
                </td>
              </tr>
            ) : (
              currentNotices.map((notice, index) => (
                <React.Fragment key={notice.id}>
                  <tr
                    style={{
                      ...styles.tableRow,
                      cursor: 'pointer',
                      backgroundColor:
                        openId === notice.id ? colors.darkGray : 'transparent',
                    }}
                    onClick={() => toggleNotice(notice.id)}
                  >
                    <td style={styles.tableCell}>{startIndex + index + 1}</td>
                    <td style={styles.tableCell}>
                      <em style={{ color: colors.primary }}>MovieHub</em>{' '}
                      {notice.title}
                    </td>
                    <td style={styles.tableCell}>{notice.date}</td>
                  </tr>

                  {/* ✅ 상세 내용 (열렸을 때만 표시) */}

                  {openId === notice.id && (
                    <tr>
                      <td colSpan="3" style={styles.detailCell}>
                        {notice.content || '상세 내용이 없습니다.'}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        <div style={styles.pagination}>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              ...styles.pageButton,
              ...(currentPage === 1 ? styles.pageButtonDisabled : {}),
            }}
          >
            이전
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              style={{
                ...styles.pageButton,
                ...(currentPage === i + 1 ? styles.activePageButton : {}),
              }}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              ...styles.pageButton,
              ...(currentPage === totalPages ? styles.pageButtonDisabled : {}),
            }}
          >
            다음
          </button>
        </div>

        {/* 하단 버튼 */}
        <div style={styles.footerBtns}>
          <button style={styles.footerButton}>검색결과 수집에 대한 정책</button>
          <button style={styles.footerButton}>MovieHub 사용문의</button>
          <button style={styles.footerButton}>제휴제안</button>
          <button style={styles.footerButton}>고객센터</button>
        </div>
      </div>
    </div>
  );
}

// 스타일
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: colors.dark,
    padding: spacing.xl,
    paddingTop: '100px',
  },
  noticeBox: {
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: colors.darkGray,
    borderRadius: borderRadius.large,
    padding: spacing.xxl,
    boxShadow: shadow.large,
  },
  title: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.bold,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: fontSize.large,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  searchBox: {
    display: 'flex',
    gap: spacing.md,
    marginBottom: spacing.xl,
    justifyContent: 'center',
  },
  searchInput: {
    padding: spacing.md,
    fontSize: fontSize.medium,
    border: `1px solid ${colors.mediumGray}`,
    borderRadius: borderRadius.medium,
    backgroundColor: colors.dark,
    color: colors.white,
    width: '400px',
    outline: 'none',
  },
  searchButton: {
    padding: `${spacing.sm} ${spacing.xl}`,
    fontSize: fontSize.medium,
    fontWeight: fontWeight.medium,
    backgroundColor: colors.primary,
    color: colors.white,
    border: 'none',
    borderRadius: borderRadius.medium,
    cursor: 'pointer',
    transition: transition.normal,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: spacing.xl,
  },
  tableHeader: {
    padding: spacing.lg,
    backgroundColor: colors.dark,
    color: colors.textSecondary,
    fontSize: fontSize.medium,
    fontWeight: fontWeight.bold,
    textAlign: 'left',
    borderBottom: `2px solid ${colors.mediumGray}`,
  },
  tableRow: {
    transition: transition.fast,
  },
  tableCell: {
    padding: spacing.lg,
    color: colors.white,
    fontSize: fontSize.medium,
    borderBottom: `1px solid ${colors.mediumGray}`,
  },
  detailCell: {
    padding: spacing.xl,
    backgroundColor: colors.dark,
    color: colors.textSecondary,
    fontSize: fontSize.medium,
    lineHeight: 1.6,
    borderBottom: `1px solid ${colors.mediumGray}`,
  },
  emptyCell: {
    padding: spacing.xxl,
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: fontSize.large,
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  pageButton: {
    padding: `${spacing.sm} ${spacing.md}`,
    fontSize: fontSize.medium,
    backgroundColor: colors.dark,
    color: colors.white,
    border: `1px solid ${colors.mediumGray}`,
    borderRadius: borderRadius.small,
    cursor: 'pointer',
    transition: transition.normal,
    minWidth: '40px',
  },

  activePageButton: {
    backgroundColor: colors.primary,
    color: colors.white,
    fontWeight: fontWeight.bold,
    border: `1px solid ${colors.primary}`,
  },
  pageButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  footerBtns: {
    display: 'flex',
    justifyContent: 'center',
    gap: '150px',
    flexWrap: 'wrap',
  },
  footerButton: {
    padding: `${spacing.sm} ${spacing.lg}`,
    fontSize: fontSize.medium,
    backgroundColor: 'transparent',
    color: colors.textSecondary,
    border: `1px solid ${colors.mediumGray}`,
    borderRadius: borderRadius.medium,
    cursor: 'pointer',
    transition: transition.normal,
  },
};
