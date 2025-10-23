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

  // 페이지 관련
  const [currentPage, setCurrentPage] = useState(1);
  const noticesPerPage = 10;
  const totalPages = Math.ceil(notices.length / noticesPerPage);
  const startIndex = (currentPage - 1) * noticesPerPage;
  const endIndex = startIndex + noticesPerPage;
  const currentNotices = notices.slice(startIndex, endIndex);

  // 공지 펼치기
  const [openId, setOpenId] = useState(null);
  const toggleNotice = (id) => setOpenId(openId === id ? null : id);

  // localStorage에서 공지사항 불러오기
  useEffect(() => {
    loadNotices();
  }, []);

  // localStorage 변경 감지
  useEffect(() => {
    const intervalId = setInterval(() => {
      loadNotices();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const loadNotices = () => {
    try {
      let saved = localStorage.getItem('moviehub_notices');
      if (!saved) {
        saved = localStorage.getItem('notices');
      }

      if (saved) {
        const loadedNotices = JSON.parse(saved);
        setNotices(loadedNotices);
      } else {
        setNotices(initialNotices);
        localStorage.setItem('notices', JSON.stringify(initialNotices));
      }
    } catch (error) {
      console.error('공지사항 불러오기 실패:', error);
      setNotices(initialNotices);
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setOpenId(null);
    }
  };

  const highlightText = (text, keyword) => {
    if (!keyword) return text;
    const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <mark
          key={i}
          style={{
            backgroundColor: colors.yellow,
            color: colors.dark,
            padding: '2px 4px',
            borderRadius: borderRadius.small,
          }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
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

        {search && (
          <p style={styles.searchResult}>
            🔍 검색어: <strong>{search}</strong>
          </p>
        )}

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
              currentNotices.map((notice) => (
                <React.Fragment key={notice.id}>
                  <tr
                    style={styles.tableRow}
                    onClick={() => toggleNotice(notice.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.darkGray;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td style={styles.tableCell}>{notice.id}</td>
                    <td style={styles.tableCell}>
                      {notice.isPinned && (
                        <span style={{ marginRight: spacing.sm }}>📌</span>
                      )}
                      {notice.isNew && <span style={styles.newBadge}>NEW</span>}
                      <em style={{ color: colors.primary }}>MovieHub</em>{' '}
                      {highlightText(
                        notice.title.replace('MovieHub', ''),
                        search
                      )}
                    </td>
                    <td style={styles.tableCell}>{notice.date}</td>
                  </tr>
                  {openId === notice.id && (
                    <tr style={styles.dropdownRow}>
                      <td colSpan="3" style={styles.dropdownCell}>
                        {highlightText(notice.content, search)}
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

// 스타일 정의
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: colors.dark,
    padding: spacing.xl,
    paddingTop: '100px', // 헤더 높이만큼 여백
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
  searchResult: {
    fontSize: fontSize.medium,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
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
    cursor: 'pointer',
    transition: transition.fast,
  },
  tableCell: {
    padding: spacing.lg,
    color: colors.white,
    fontSize: fontSize.medium,
    borderBottom: `1px solid ${colors.mediumGray}`,
  },
  emptyCell: {
    padding: spacing.xxl,
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: fontSize.large,
  },
  newBadge: {
    backgroundColor: colors.primary,
    color: colors.white,
    padding: '4px 8px',
    borderRadius: borderRadius.small,
    fontSize: '11px',
    fontWeight: fontWeight.bold,
    marginRight: spacing.sm,
  },
  dropdownRow: {
    backgroundColor: colors.dark,
  },
  dropdownCell: {
    padding: spacing.xl,
    color: colors.textLight,
    fontSize: fontSize.medium,
    lineHeight: '1.8',
    borderBottom: `1px solid ${colors.mediumGray}`,
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
    gap: spacing.md,
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
