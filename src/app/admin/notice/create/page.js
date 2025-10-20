'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/app/admin/_components/AdminLayout';
import {
  adminColors,
  adminSizes,
  adminStyles,
  mergeStyles,
} from '@/app/admin/_lib/style/adminTokens';
import { initialNotices } from '@/lib/data/notice';

export default function NoticeCreatePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isPinned: false,
    isNew: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!formData.content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    // 새 공지사항 객체 생성
    const newNotice = {
      id: Date.now(),
      title: formData.title,
      content: formData.content,
      date: new Date().toISOString().split('T')[0],
      views: 0,
      isNew: formData.isNew,
      isPinned: formData.isPinned,
      author: '관리자',
    };

    // localStorage에서 기존 공지사항 가져오기
    const saved = localStorage.getItem('notices');
    const notices = saved ? JSON.parse(saved) : initialNotices;

    // 새 공지사항을 맨 앞에 추가
    const updatedNotices = [newNotice, ...notices];

    // localStorage에 저장
    localStorage.setItem('notices', JSON.stringify(updatedNotices));

    console.log('작성된 공지사항:', newNotice);
    alert('공지사항이 등록되었습니다!');
    router.push('/admin');
  };

  const handleCancel = () => {
    if (confirm('작성을 취소하시겠습니까? 작성 중인 내용이 사라집니다.')) {
      router.push('/admin');
    }
  };

  return (
    <AdminLayout title="새 공지사항 작성" currentMenu="dashboard">
      {/* 브레드크럼 */}
      <div
        style={{
          marginBottom: adminSizes.spacing.xl,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: adminColors.textTertiary,
          fontSize: '14px',
        }}
      >
        <a
          href="/admin"
          style={{ color: adminColors.info, textDecoration: 'none' }}
        >
          대시보드
        </a>
        <span>›</span>
        <span>공지사항</span>
        <span>›</span>
        <span style={{ color: adminColors.textPrimary, fontWeight: 600 }}>
          새 공지사항 작성
        </span>
      </div>

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
            공지사항 정보
          </h2>
        </div>

        <div style={{ padding: adminSizes.spacing.xl }}>
          {/* 제목 입력 */}
          <div style={{ marginBottom: adminSizes.spacing.xl }}>
            <label
              style={{
                display: 'block',
                marginBottom: adminSizes.spacing.sm,
                fontSize: '14px',
                fontWeight: 600,
                color: adminColors.textPrimary,
              }}
            >
              제목 <span style={{ color: adminColors.error }}>*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="공지사항 제목을 입력하세요 (예: 🎉 MovieHub 서비스 2.0 업데이트 안내)"
              style={{
                ...adminStyles.form.input,
                width: '100%',
                fontSize: '16px',
              }}
            />
          </div>

          {/* 내용 입력 */}
          <div style={{ marginBottom: adminSizes.spacing.xl }}>
            <label
              style={{
                display: 'block',
                marginBottom: adminSizes.spacing.sm,
                fontSize: '14px',
                fontWeight: 600,
                color: adminColors.textPrimary,
              }}
            >
              내용 <span style={{ color: adminColors.error }}>*</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="공지사항 내용을 입력하세요"
              rows={15}
              style={{
                ...adminStyles.form.input,
                width: '100%',
                resize: 'vertical',
                fontFamily: 'inherit',
                lineHeight: '1.6',
              }}
            />
          </div>

          {/* 추가 옵션 */}
          <div
            style={{
              padding: adminSizes.spacing.lg,
              background: adminColors.bgHover,
              borderRadius: adminSizes.radius.md,
              marginBottom: adminSizes.spacing.xl,
            }}
          >
            <h3
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: adminColors.textPrimary,
                marginBottom: adminSizes.spacing.md,
              }}
            >
              추가 옵션
            </h3>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: adminSizes.spacing.md,
              }}
            >
              {/* 상단 고정 */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: adminSizes.spacing.sm,
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  name="isPinned"
                  checked={formData.isPinned}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span
                  style={{ fontSize: '14px', color: adminColors.textSecondary }}
                >
                  📌 상단 고정 (메인 페이지 상단에 고정됩니다)
                </span>
              </label>

              {/* NEW 배지 */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: adminSizes.spacing.sm,
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  name="isNew"
                  checked={formData.isNew}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span
                  style={{ fontSize: '14px', color: adminColors.textSecondary }}
                >
                  🆕 중요 공지 (NEW 배지가 표시됩니다)
                </span>
              </label>
            </div>

            {/* 안내 메시지 */}
            <div
              style={{
                marginTop: adminSizes.spacing.md,
                padding: adminSizes.spacing.md,
                background: adminColors.bgSecondary,
                borderRadius: adminSizes.radius.sm,
                border: `1px solid ${adminColors.border}`,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: '13px',
                  color: adminColors.textTertiary,
                  lineHeight: '1.5',
                }}
              >
                💡 <strong>작성 팁:</strong> 제목에 이모지를 사용하면 사용자의
                눈길을 끌 수 있습니다. 중요한 공지는 상단 고정과 NEW 배지를 함께
                사용하세요.
              </p>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div
            style={{
              display: 'flex',
              gap: adminSizes.spacing.md,
              justifyContent: 'flex-end',
              paddingTop: adminSizes.spacing.lg,
              borderTop: `1px solid ${adminColors.border}`,
            }}
          >
            <button
              type="button"
              onClick={handleCancel}
              style={{
                ...mergeStyles(
                  adminStyles.button.base,
                  adminStyles.button.secondary
                ),
                minWidth: '120px',
              }}
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              style={{
                ...mergeStyles(
                  adminStyles.button.base,
                  adminStyles.button.primary
                ),
                minWidth: '120px',
              }}
            >
              등록하기
            </button>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
