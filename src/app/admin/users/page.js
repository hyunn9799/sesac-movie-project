'use client';

import { useState } from 'react';
import { initialMembers } from '@/lib/data/memberData';
import AdminLayout from '@/app/admin/_components/AdminLayout';
import {
  adminColors,
  adminSizes,
  adminStyles,
  mergeStyles,
} from '@/app/admin/_lib/style/adminTokens';

export default function MemberManagement() {
  const [members, setMembers] = useState(initialMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('전체');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // 필터링된 회원 목록
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm);

    const matchesStatus =
      selectedStatus === '전체' || member.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // 회원 삭제
  const handleDelete = (id) => {
    if (confirm('정말 이 회원을 삭제하시겠습니까?')) {
      setMembers(members.filter((member) => member.id !== id));
      alert('삭제되었습니다.');
    }
  };

  // 회원 수정 모달 열기
  const handleEdit = (member) => {
    setEditingMember({ ...member });
    setIsModalOpen(true);
  };

  // 회원 수정 저장
  const handleSave = () => {
    if (!editingMember.name || !editingMember.email || !editingMember.phone) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    setMembers(
      members.map((m) => (m.id === editingMember.id ? editingMember : m))
    );
    setIsModalOpen(false);
    setEditingMember(null);
    alert('수정되었습니다.');
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  // 수정 폼 입력 핸들러
  const handleInputChange = (field, value) => {
    setEditingMember({ ...editingMember, [field]: value });
  };

  // 통계 데이터
  const stats = [
    {
      icon: '👥',
      label: '전체 회원',
      value: members.length,
      color: adminColors.statRed,
      bg: adminColors.statRedBg,
    },
    {
      icon: '✅',
      label: '활성 회원',
      value: members.filter((m) => m.status === '활성').length,
      color: adminColors.statGreen,
      bg: adminColors.statGreenBg,
    },
    {
      icon: '😴',
      label: '휴면 회원',
      value: members.filter((m) => m.status === '휴면').length,
      color: adminColors.statYellow,
      bg: adminColors.statYellowBg,
    },
    {
      icon: '⭐',
      label: '프리미엄',
      value: members.filter((m) => m.role === '프리미엄').length,
      color: adminColors.statPurple,
      bg: adminColors.statPurpleBg,
    },
  ];

  // 상태 뱃지
  const getStatusBadge = (status) => {
    const badgeStyles = {
      활성: mergeStyles(adminStyles.badge.base, adminStyles.badge.success),
      휴면: mergeStyles(adminStyles.badge.base, adminStyles.badge.warning),
      정지: mergeStyles(adminStyles.badge.base, adminStyles.badge.error),
    };
    return <span style={badgeStyles[status]}>{status}</span>;
  };

  // 등급 뱃지
  const getRoleBadge = (role) => {
    const isPremium = role === '프리미엄';
    return (
      <span
        style={mergeStyles(adminStyles.badge.base, {
          background: isPremium
            ? adminColors.statPurpleBg
            : adminColors.statBlueBg,
          color: isPremium ? adminColors.statPurple : adminColors.statBlue,
        })}
      >
        {role}
      </span>
    );
  };

  return (
    <AdminLayout title="회원 관리" currentMenu="users">
      {/* 통계 카드 그리드 */}
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
                justifyContent: 'space-between',
                marginBottom: adminSizes.spacing.md,
              }}
            >
              <span
                style={{
                  fontSize: '13px',
                  color: adminColors.textTertiary,
                  fontWeight: 600,
                }}
              >
                {stat.label}
              </span>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: stat.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                }}
              >
                {stat.icon}
              </div>
            </div>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 700,
                color: stat.color,
              }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* 검색 및 필터 */}
      <div
        style={mergeStyles(adminStyles.card.base, {
          padding: adminSizes.spacing.xl,
          marginBottom: adminSizes.spacing.xl,
        })}
      >
        <div
          style={{
            display: 'flex',
            gap: adminSizes.spacing.md,
            flexWrap: 'wrap',
          }}
        >
          <input
            type="text"
            placeholder="이름, 이메일, 전화번호 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={mergeStyles(adminStyles.form.input, {
              flex: 1,
              minWidth: '250px',
            })}
          />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={adminStyles.form.select}
          >
            <option value="전체">전체 상태</option>
            <option value="활성">활성</option>
            <option value="휴면">휴면</option>
            <option value="정지">정지</option>
          </select>
          <button
            style={mergeStyles(
              adminStyles.button.base,
              adminStyles.button.primary
            )}
          >
            + 회원 추가
          </button>
        </div>
      </div>

      {/* 회원 목록 테이블 */}
      <section style={adminStyles.card.base}>
        <div
          style={{
            padding: `20px ${adminSizes.spacing.xl}`,
            borderBottom: `1px solid ${adminColors.border}`,
            background: adminColors.bgHover,
          }}
        >
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: adminColors.textPrimary,
              margin: 0,
            }}
          >
            회원 목록
          </h2>
        </div>

        <div style={adminStyles.table.container}>
          <table style={adminStyles.table.table}>
            <thead style={adminStyles.table.thead}>
              <tr>
                <th style={adminStyles.table.th}>회원 정보</th>
                <th style={adminStyles.table.th}>연락처</th>
                <th style={adminStyles.table.th}>가입일</th>
                <th style={adminStyles.table.th}>마지막 로그인</th>
                <th style={adminStyles.table.th}>등급</th>
                <th style={adminStyles.table.th}>상태</th>
                <th style={{ ...adminStyles.table.th, textAlign: 'center' }}>
                  관리
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  style={{
                    transition: 'background 0.2s',
                  }}
                >
                  <td style={adminStyles.table.td}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: adminSizes.spacing.md,
                      }}
                    >
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: adminSizes.radius.full,
                          background:
                            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: adminColors.textWhite,
                          fontSize: '14px',
                          fontWeight: 600,
                        }}
                      >
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: adminColors.textPrimary,
                            marginBottom: '2px',
                          }}
                        >
                          {member.name}
                        </div>
                        <div
                          style={{
                            fontSize: '13px',
                            color: adminColors.textTertiary,
                          }}
                        >
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={adminStyles.table.td}>{member.phone}</td>
                  <td style={adminStyles.table.td}>{member.joinDate}</td>
                  <td style={adminStyles.table.td}>{member.lastLogin}</td>
                  <td style={adminStyles.table.td}>
                    {getRoleBadge(member.role)}
                  </td>
                  <td style={adminStyles.table.td}>
                    {getStatusBadge(member.status)}
                  </td>
                  <td style={{ ...adminStyles.table.td, textAlign: 'center' }}>
                    <div
                      style={{
                        display: 'flex',
                        gap: adminSizes.spacing.sm,
                        justifyContent: 'center',
                      }}
                    >
                      <button
                        onClick={() => handleEdit(member)}
                        style={mergeStyles(
                          adminStyles.button.base,
                          adminStyles.button.small,
                          adminStyles.button.info
                        )}
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
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

        {filteredMembers.length === 0 && (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              color: adminColors.textTertiary,
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
            <p style={{ margin: 0, fontSize: '16px' }}>검색 결과가 없습니다</p>
          </div>
        )}
      </section>

      {/* 수정 모달 */}
      {isModalOpen && editingMember && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              background: adminColors.bgSecondary,
              borderRadius: adminSizes.radius.lg,
              width: '90%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div
              style={{
                padding: adminSizes.spacing.xl,
                borderBottom: `1px solid ${adminColors.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: adminColors.textPrimary,
                  margin: 0,
                }}
              >
                회원 정보 수정
              </h3>
              <button
                onClick={handleCloseModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  color: adminColors.textTertiary,
                  cursor: 'pointer',
                  padding: 0,
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ×
              </button>
            </div>

            {/* 모달 바디 */}
            <div style={{ padding: adminSizes.spacing.xl }}>
              <div style={{ marginBottom: adminSizes.spacing.lg }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: adminSizes.spacing.sm,
                    fontSize: '13px',
                    fontWeight: 600,
                    color: adminColors.textSecondary,
                  }}
                >
                  이름
                </label>
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  style={mergeStyles(adminStyles.form.input, {
                    width: '100%',
                  })}
                />
              </div>

              <div style={{ marginBottom: adminSizes.spacing.lg }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: adminSizes.spacing.sm,
                    fontSize: '13px',
                    fontWeight: 600,
                    color: adminColors.textSecondary,
                  }}
                >
                  이메일
                </label>
                <input
                  type="email"
                  value={editingMember.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  style={mergeStyles(adminStyles.form.input, {
                    width: '100%',
                  })}
                />
              </div>

              <div style={{ marginBottom: adminSizes.spacing.lg }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: adminSizes.spacing.sm,
                    fontSize: '13px',
                    fontWeight: 600,
                    color: adminColors.textSecondary,
                  }}
                >
                  전화번호
                </label>
                <input
                  type="tel"
                  value={editingMember.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  style={mergeStyles(adminStyles.form.input, {
                    width: '100%',
                  })}
                />
              </div>

              <div style={{ marginBottom: adminSizes.spacing.lg }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: adminSizes.spacing.sm,
                    fontSize: '13px',
                    fontWeight: 600,
                    color: adminColors.textSecondary,
                  }}
                >
                  등급
                </label>
                <select
                  value={editingMember.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  style={mergeStyles(adminStyles.form.select, {
                    width: '100%',
                  })}
                >
                  <option value="일반회원">일반회원</option>
                  <option value="프리미엄">프리미엄</option>
                </select>
              </div>

              <div style={{ marginBottom: adminSizes.spacing.lg }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: adminSizes.spacing.sm,
                    fontSize: '13px',
                    fontWeight: 600,
                    color: adminColors.textSecondary,
                  }}
                >
                  상태
                </label>
                <select
                  value={editingMember.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  style={mergeStyles(adminStyles.form.select, {
                    width: '100%',
                  })}
                >
                  <option value="활성">활성</option>
                  <option value="휴면">휴면</option>
                  <option value="정지">정지</option>
                </select>
              </div>
            </div>

            {/* 모달 푸터 */}
            <div
              style={{
                padding: adminSizes.spacing.xl,
                borderTop: `1px solid ${adminColors.border}`,
                display: 'flex',
                justifyContent: 'flex-end',
                gap: adminSizes.spacing.md,
              }}
            >
              <button
                onClick={handleCloseModal}
                style={mergeStyles(
                  adminStyles.button.base,
                  adminStyles.button.secondary
                )}
              >
                취소
              </button>
              <button
                onClick={handleSave}
                style={mergeStyles(
                  adminStyles.button.base,
                  adminStyles.button.primary
                )}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
