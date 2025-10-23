'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/app/admin/_components/AdminLayout';
import {
  adminColors,
  adminSizes,
  adminStyles,
  mergeStyles,
} from '@/app/admin/_lib/style/adminTokens';
import { faqs as initialFaqs } from '@/lib/data/fqa';

export default function AdminFqa() {
  const [faqs, setFaqs] = useState([]);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState({ question: '', answer: '' });

  // 로컬스토리지에서 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('faqs');
    if (saved) {
      setFaqs(JSON.parse(saved));
    } else {
      setFaqs(initialFaqs.map((f, i) => ({ ...f, id: i + 1 })));
      localStorage.setItem(
        'faqs',
        JSON.stringify(initialFaqs.map((f, i) => ({ ...f, id: i + 1 })))
      );
    }
  }, []);

  const handleAdd = () => {
    const newFaq = {
      id: faqs.length ? Math.max(...faqs.map((f) => f.id)) + 1 : 1,
      question: '새 질문을 입력하세요',
      answer: '새 답변을 입력하세요',
    };
    const updated = [...faqs, newFaq];
    setFaqs(updated);
    localStorage.setItem('faqs', JSON.stringify(updated));
    setSelectedFaq(newFaq);
    setEditData({ question: newFaq.question, answer: newFaq.answer });
    setIsModalOpen(true);
    setIsEditMode(true);
  };

  const handleView = (faq) => {
    setSelectedFaq(faq);
    setEditData({ question: faq.question, answer: faq.answer });
    setIsModalOpen(true);
    setIsEditMode(false);
  };

  const handleDelete = (id) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      const updated = faqs.filter((f) => f.id !== id);
      setFaqs(updated);
      localStorage.setItem('faqs', JSON.stringify(updated));
      setIsModalOpen(false);
      setSelectedFaq(null);
    }
  };

  const handleEditMode = () => setIsEditMode(true);

  const handleCancelEdit = () => {
    setIsEditMode(false);
    if (selectedFaq)
      setEditData({
        question: selectedFaq.question,
        answer: selectedFaq.answer,
      });
  };

  const handleSaveEdit = () => {
    if (!editData.question.trim() || !editData.answer.trim()) {
      alert('질문과 답변을 모두 입력해주세요.');
      return;
    }
    const updated = faqs.map((f) =>
      f.id === selectedFaq.id ? { ...f, ...editData } : f
    );
    setFaqs(updated);
    localStorage.setItem('faqs', JSON.stringify(updated));
    setSelectedFaq({ ...selectedFaq, ...editData });
    setIsEditMode(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFaq(null);
    setIsEditMode(false);
  };

  return (
    <AdminLayout title="자주 묻는 질문 관리" currentMenu="fqa">
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
              fontSize: '18px',
              fontWeight: 700,
              color: adminColors.textPrimary,
              margin: 0,
            }}
          >
            📋 FAQ 관리
          </h2>
          <button
            onClick={handleAdd}
            style={mergeStyles(
              adminStyles.button.base,
              adminStyles.button.primary
            )}
          >
            + 새 FAQ 작성
          </button>
        </div>

        {/* 테이블 */}
        <div style={adminStyles.table.container}>
          <table style={adminStyles.table.table}>
            <thead style={adminStyles.table.thead}>
              <tr>
                <th style={{ ...adminStyles.table.th, width: '80px' }}>번호</th>
                <th style={adminStyles.table.th}>질문</th>
                <th style={{ ...adminStyles.table.th, width: '200px' }}>
                  관리
                </th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((faq, index) => (
                <tr key={faq.id}>
                  <td style={adminStyles.table.td}>{index + 1}</td>
                  <td
                    style={{
                      ...adminStyles.table.td,
                      cursor: 'pointer',
                      color: adminColors.textPrimary,
                    }}
                    onClick={() => handleView(faq)}
                  >
                    {faq.question}
                  </td>
                  <td style={adminStyles.table.td}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleView(faq)}
                        style={mergeStyles(
                          adminStyles.button.base,
                          adminStyles.button.small,
                          adminStyles.button.info
                        )}
                      >
                        보기
                      </button>
                      <button
                        onClick={() => handleDelete(faq.id)}
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
      </section>

      {/* 모달 */}
      {isModalOpen && selectedFaq && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
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
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
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
                    value={editData.question}
                    onChange={(e) =>
                      setEditData({ ...editData, question: e.target.value })
                    }
                    style={{
                      ...adminStyles.form.input,
                      fontSize: '20px',
                      fontWeight: 700,
                      flex: 1,
                      marginRight: '20px',
                    }}
                  />
                ) : (
                  <h2
                    style={{
                      fontSize: '24px',
                      fontWeight: 700,
                      color: adminColors.textPrimary,
                      margin: 0,
                      flex: 1,
                    }}
                  >
                    {selectedFaq.question}
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
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* 본문 */}
            <div
              style={{
                padding: `${adminSizes.spacing.xxl} ${adminSizes.spacing.xl}`,
                minHeight: '200px',
              }}
            >
              {isEditMode ? (
                <textarea
                  value={editData.answer}
                  onChange={(e) =>
                    setEditData({ ...editData, answer: e.target.value })
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
                  {selectedFaq.answer}
                </div>
              )}
            </div>

            {/* 푸터 */}
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
                onClick={() => handleDelete(selectedFaq.id)}
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
