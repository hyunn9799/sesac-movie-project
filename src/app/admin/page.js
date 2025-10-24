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
import { initialReviews } from '@/lib/data/review';

export default function AdminDashboard() {
  const [notices, setNotices] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [movieCount, setMovieCount] = useState('로딩중...');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    content: '',
    isPinned: false,
    isNew: false,
  });

  // 공지사항 불러오기
  useEffect(() => {
    try {
      const saved = localStorage.getItem('notices');
      if (saved) {
        const loadedNotices = JSON.parse(saved);
        const sortedNotices = sortNotices(loadedNotices);
        setNotices(sortedNotices);
      } else {
        const sortedNotices = sortNotices(initialNotices);
        setNotices(sortedNotices);
        localStorage.setItem('notices', JSON.stringify(sortedNotices));
      }
    } catch (error) {
      console.error('공지사항 불러오기 실패:', error);
      setNotices(initialNotices);
    }
  }, []);

  // 영화 개수 가져오기
  useEffect(() => {
    const fetchMovieCount = async () => {
      try {
        const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=ko-KR`
        );
        if (response.ok) {
          const data = await response.json();
          setMovieCount(data.total_results?.toLocaleString() || '8,532');
        } else {
          setMovieCount('8,532');
        }
      } catch (error) {
        console.error('영화 개수 가져오기 실패:', error);
        setMovieCount('8,532');
      }
    };
    fetchMovieCount();
  }, []);

  // 공지사항 정렬
  const sortNotices = (noticeList) => {
    return [...noticeList].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.date) - new Date(a.date);
    });
  };

  // 공지사항 상세보기
  const handleViewNotice = (notice) => {
    const updatedNotices = notices.map((n) =>
      n.id === notice.id ? { ...n, views: n.views + 1 } : n
    );
    setNotices(updatedNotices);
    localStorage.setItem('notices', JSON.stringify(updatedNotices));
    setSelectedNotice({ ...notice, views: notice.views + 1 });
    setIsModalOpen(true);
    setIsEditMode(false);
  };

  // 수정 모드 전환
  const handleEditMode = () => {
    setEditData({
      title: selectedNotice.title,
      content: selectedNotice.content,
      isPinned: selectedNotice.isPinned || false,
      isNew: selectedNotice.isNew || false,
    });
    setIsEditMode(true);
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditData({
      title: '',
      content: '',
      isPinned: false,
      isNew: false,
    });
  };

  // 수정 저장
  const handleSaveEdit = () => {
    if (!editData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!editData.content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    const updatedNotices = notices.map((notice) => {
      if (notice.id === selectedNotice.id) {
        return {
          ...notice,
          title: editData.title,
          content: editData.content,
          isPinned: editData.isPinned,
          isNew: editData.isNew,
        };
      }
      return notice;
    });

    const sortedNotices = sortNotices(updatedNotices);
    setNotices(sortedNotices);
    localStorage.setItem('notices', JSON.stringify(sortedNotices));

    setSelectedNotice({
      ...selectedNotice,
      title: editData.title,
      content: editData.content,
      isPinned: editData.isPinned,
      isNew: editData.isNew,
    });

    setIsEditMode(false);
    alert('수정되었습니다!');
  };

  // 공지사항 삭제
  const handleDelete = (id) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      const updated = notices.filter((notice) => notice.id !== id);
      const sortedUpdated = sortNotices(updated);
      setNotices(sortedUpdated);
      localStorage.setItem('notices', JSON.stringify(sortedUpdated));
      alert('삭제되었습니다.');
      if (isModalOpen) {
        setIsModalOpen(false);
        setSelectedNotice(null);
      }
    }
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNotice(null);
    setIsEditMode(false);
  };

  // 새 공지사항 작성
  const handleAdd = () => {
    window.location.href = '/admin/notice/create';
  };

  // 통계 카드 데이터
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
      value: movieCount,
      color: adminColors.statYellow,
      bg: adminColors.statYellowBg,
    },
    {
      icon: '⭐',
      label: '리뷰 수',
      value: initialReviews.length.toLocaleString(),
      color: adminColors.statGreen,
      bg: adminColors.statGreenBg,
    },
  ];

  return (
    <AdminLayout title="대시보드" currentMenu="dashboard">
      {/* 통계 카드 */}
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
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: adminSizes.spacing.md,
                marginBottom: adminSizes.spacing.lg,
              }}
            >
              <div
                style={mergeStyles(adminStyles.card.statIcon, {
                  background: stat.bg,
                  color: stat.color,
                })}
              >
                {stat.icon}
              </div>
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
            <div style={adminStyles.card.statValue}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* 공지사항 관리 */}
      <section style={adminStyles.card.base}>
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
              {notices
                .slice(0, showAll ? notices.length : 5)
                .map((notice, index) => (
                  <tr key={notice.id}>
                    {/* 번호를 순서대로 1부터 매김 */}
                    <td style={adminStyles.table.td}>{index + 1}</td>
                    <td style={adminStyles.table.td}>
                      <div
                        style={{
                          fontWeight: 600,
                          color: adminColors.textPrimary,
                          cursor: 'pointer',
                        }}
                        onClick={() => handleViewNotice(notice)}
                      >
                        <span
                          style={{
                            textDecoration: 'underline',
                            textDecorationColor: 'transparent',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.textDecorationColor =
                              adminColors.primary;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.textDecorationColor =
                              'transparent';
                          }}
                        >
                          {notice.title}
                        </span>
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
                          onClick={() => handleViewNotice(notice)}
                          style={mergeStyles(
                            adminStyles.button.base,
                            adminStyles.button.small,
                            adminStyles.button.info
                          )}
                        >
                          보기
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
                : `전체 공지사항 보기 (${notices.length}개)`}
            </button>
          </div>
        )}
      </section>

      {/* 공지사항 상세/수정 모달 */}
      {isModalOpen && selectedNotice && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              background: adminColors.bgSecondary,
              borderRadius: adminSizes.radius.lg,
              width: '100%',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div
              style={{
                padding: adminSizes.spacing.xl,
                borderBottom: `2px solid ${adminColors.border}`,
                background: adminColors.bgHover,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: adminSizes.spacing.md,
                }}
              >
                {isEditMode ? (
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) =>
                      setEditData({ ...editData, title: e.target.value })
                    }
                    style={{
                      ...adminStyles.form.input,
                      fontSize: '20px',
                      fontWeight: 700,
                      flex: 1,
                      marginRight: '20px',
                    }}
                    placeholder="제목을 입력하세요"
                  />
                ) : (
                  <h2
                    style={{
                      fontSize: '24px',
                      fontWeight: 700,
                      color: adminColors.textPrimary,
                      margin: 0,
                      flex: 1,
                      paddingRight: '20px',
                    }}
                  >
                    {selectedNotice.title}
                  </h2>
                )}
                <button
                  onClick={handleCloseModal}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '28px',
                    color: adminColors.textTertiary,
                    cursor: 'pointer',
                    padding: 0,
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = adminColors.errorBg;
                    e.currentTarget.style.color = adminColors.error;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none';
                    e.currentTarget.style.color = adminColors.textTertiary;
                  }}
                >
                  ×
                </button>
              </div>

              {/* 옵션 체크박스 (수정 모드일 때만) */}
              {isEditMode && (
                <div
                  style={{
                    display: 'flex',
                    gap: adminSizes.spacing.lg,
                    marginBottom: adminSizes.spacing.md,
                  }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={editData.isPinned}
                      onChange={(e) =>
                        setEditData({ ...editData, isPinned: e.target.checked })
                      }
                      style={{ width: '16px', height: '16px' }}
                    />
                    📌 상단 고정
                  </label>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={editData.isNew}
                      onChange={(e) =>
                        setEditData({ ...editData, isNew: e.target.checked })
                      }
                      style={{ width: '16px', height: '16px' }}
                    />
                    🆕 NEW 배지
                  </label>
                </div>
              )}

              {/* 뱃지 (보기 모드일 때만) */}
              {!isEditMode && (
                <div
                  style={{
                    display: 'flex',
                    gap: adminSizes.spacing.sm,
                    marginBottom: adminSizes.spacing.md,
                  }}
                >
                  {selectedNotice.isNew && (
                    <span
                      style={mergeStyles(
                        adminStyles.badge.base,
                        adminStyles.badge.error
                      )}
                    >
                      NEW
                    </span>
                  )}
                  {selectedNotice.isPinned && (
                    <span
                      style={mergeStyles(adminStyles.badge.base, {
                        background: adminColors.statPurpleBg,
                        color: adminColors.statPurple,
                      })}
                    >
                      📌 고정
                    </span>
                  )}
                </div>
              )}

              {/* 메타 정보 */}
              <div
                style={{
                  display: 'flex',
                  gap: adminSizes.spacing.lg,
                  fontSize: '14px',
                  color: adminColors.textTertiary,
                }}
              >
                <div>
                  <span style={{ fontWeight: 600 }}>작성자:</span>{' '}
                  {selectedNotice.author}
                </div>
                <div>
                  <span style={{ fontWeight: 600 }}>등록일:</span>{' '}
                  {selectedNotice.date}
                </div>
                <div>
                  <span style={{ fontWeight: 600 }}>조회수:</span>{' '}
                  {selectedNotice.views.toLocaleString()}
                </div>
              </div>
            </div>

            {/* 모달 본문 */}
            <div
              style={{
                padding: `${adminSizes.spacing.xxl} ${adminSizes.spacing.xl}`,
                minHeight: '200px',
              }}
            >
              {isEditMode ? (
                <textarea
                  value={editData.content}
                  onChange={(e) =>
                    setEditData({ ...editData, content: e.target.value })
                  }
                  rows={15}
                  style={{
                    ...adminStyles.form.input,
                    width: '100%',
                    fontSize: '16px',
                    lineHeight: '1.8',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                  placeholder="내용을 입력하세요"
                />
              ) : (
                <div
                  style={{
                    fontSize: '16px',
                    lineHeight: '1.8',
                    color: adminColors.textSecondary,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {selectedNotice.content}
                </div>
              )}
            </div>

            {/* 모달 푸터 */}
            <div
              style={{
                padding: adminSizes.spacing.xl,
                borderTop: `1px solid ${adminColors.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                gap: adminSizes.spacing.md,
                background: adminColors.bgHover,
              }}
            >
              <button
                onClick={() => handleDelete(selectedNotice.id)}
                style={mergeStyles(
                  adminStyles.button.base,
                  adminStyles.button.error
                )}
              >
                삭제
              </button>
              <div style={{ display: 'flex', gap: adminSizes.spacing.md }}>
                {isEditMode ? (
                  <>
                    <button
                      onClick={handleCancelEdit}
                      style={mergeStyles(
                        adminStyles.button.base,
                        adminStyles.button.secondary
                      )}
                    >
                      취소
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      style={mergeStyles(
                        adminStyles.button.base,
                        adminStyles.button.primary
                      )}
                    >
                      저장
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleEditMode}
                      style={mergeStyles(
                        adminStyles.button.base,
                        adminStyles.button.info
                      )}
                    >
                      수정
                    </button>
                    <button
                      onClick={handleCloseModal}
                      style={mergeStyles(
                        adminStyles.button.base,
                        adminStyles.button.secondary
                      )}
                    >
                      닫기
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
