import React from 'react';

// Style constants (copied from MyReviewsPage for consistency)
const colors = {
  dark: '#1e1e3f',
  white: '#ffffff',
  textPrimary: '#f4f4f4',
  mediumGray: '#6c757d',
  lightGray: '#dee2e6',
  accent: '#DB6666',
  error: '#dc3545',
};

const spacing = {
  sm: '8px',
  md: '12px',
  lg: '20px',
  xl: '28px',
  xxl: '60px',
};

const fontSize = {
  small: '14px',
  medium: '16px',
  large: '18px',
  xlarge: '24px',
  xxlarge: '32px',
};

const borderRadius = {
  small: '4px',
  medium: '8px',
};

const commonStyles = {
  button: {
    padding: '10px 20px',
    borderRadius: borderRadius.medium,
    transition: 'background-color 0.3s ease, transform 0.1s ease',
  },
};

/**
 * 📢 경고/성공 메시지를 표시하는 사용자 정의 모달 컴포넌트 (alert 대체)
 */
const CustomModal = ({ isOpen, message, onClose, onConfirm, showConfirm = false, confirmText = '확인', cancelText = '취소' }) => {
  if (!isOpen) return null;

  const modalStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const contentStyles = {
    backgroundColor: colors.white,
    color: colors.dark,
    padding: spacing.xl,
    borderRadius: borderRadius.medium,
    maxWidth: '400px',
    textAlign: 'center',
    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
    animation: 'fadeIn 0.3s ease-out',
  };

  const buttonBaseStyle = {
    ...commonStyles.button,
    marginTop: spacing.lg,
    border: 'none',
    cursor: 'pointer',
    padding: '10px 30px',
    fontWeight: '600',
    minWidth: '100px',
  };

  const confirmButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: colors.accent,
    color: colors.white,
    marginLeft: showConfirm ? spacing.md : '0',
  };

  const cancelButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: colors.lightGray,
    color: colors.dark,
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div style={modalStyles}>
      <div style={contentStyles}>
        <p style={{ fontSize: fontSize.large, marginBottom: spacing.lg, whiteSpace: 'pre-wrap' }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: spacing.md }}>
          <button style={cancelButtonStyle} onClick={onClose}>
            {cancelText}
          </button>
          {showConfirm && (
            <button style={confirmButtonStyle} onClick={handleConfirm}>
              {confirmText}
            </button>
          )}
        </div>
      </div>
      {/* CSS Animation */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default CustomModal;