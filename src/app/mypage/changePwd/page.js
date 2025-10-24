'use client'

import { useAuth } from "@/app/auth/AuthContext";
import { useEffect, useState } from "react";

// 비밀번호 최소 길이 설정
const MIN_PASSWORD_LENGTH = 6;

export default function ChangePwdPage() {
    // 1. 입력 필드 상태
    const [currentPwd, setCurrentPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    // 4. 메시지/경고 표시 상태 (alert() 대체)
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('error'); // 'error' or 'success'

    // 2. 유효성 검사 메시지 상태
    const [currentPwdError, setCurrentPwdError] = useState('');
    const [newPwdError, setNewPwdError] = useState('');
    const [confirmPwdError, setConfirmPwdError] = useState('');

    // 3. 버튼 활성화 상태
    const [isFormValid, setIsFormValid] = useState(false);
    const [realPwd,setRealPwd] = useState('')

    const {user, updateUser} = useAuth();
    

    /* --- 유효성 검사 및 버튼 활성화 로직 --- */
    useEffect(() => {
        // 메시지 초기화
        setRealPwd(user?.password)
        setMessage(null);
        // setCurrentPwd(user?.password);

        // 모든 필드가 최소 길이를 만족하는지 확인
        const isCurrentValid = currentPwd?.length >= MIN_PASSWORD_LENGTH;
        const isNewValid = newPwd.length >= MIN_PASSWORD_LENGTH;

        // 새 비밀번호와 확인이 일치하고, 길이가 0보다 큰지 확인
        const isConfirmMatch = newPwd === confirmPwd && newPwd.length > 0;
        
        // 새 비밀번호는 기존 비밀번호와 달라야 함
        const isDifferentFromCurrent = newPwd !== currentPwd;

        // 최종 유효성 검사 (모든 조건 만족)
        const allValid = isCurrentValid && isNewValid && isConfirmMatch && isDifferentFromCurrent;

        setIsFormValid(allValid);

        // 실시간 에러 메시지 업데이트

        // 기존 비밀번호 에러 메시지
        if (currentPwd?.length > 0 && currentPwd?.length < MIN_PASSWORD_LENGTH) {
            setCurrentPwdError(`${MIN_PASSWORD_LENGTH}자리 이상의 비밀번호를 입력해주세요.`);
        } else {
            setCurrentPwdError('');
        }
        
        // 새 비밀번호 에러 메시지
        if (newPwd.length > 0 && newPwd.length < MIN_PASSWORD_LENGTH) {
            setNewPwdError(`${MIN_PASSWORD_LENGTH}자리 이상의 비밀번호를 입력해주세요.`);
        } else if (newPwd === currentPwd && newPwd.length > 0) {
            setNewPwdError('새 비밀번호는 기존 비밀번호와 달라야 합니다.');
        } else {
            setNewPwdError('');
        }

        // 새 비밀번호 확인 에러 메시지
        if (confirmPwd.length > 0 && newPwd !== confirmPwd) {
            setConfirmPwdError('새 비밀번호와 일치하지 않습니다.');
        } else {
            setConfirmPwdError('');
        }

    }, [currentPwd, newPwd, confirmPwd]);


    /* --- 핸들러 함수 --- */
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isFormValid) {
            setMessage("입력 정보를 다시 확인해 주세요.");
            setMessageType('error');
            return;
        }

        if (currentPwd !== realPwd) {
        setCurrentPwdError('비밀번호가 틀립니다.'); // 기존 비밀번호 필드 아래 에러 메시지 표시
        setMessage("기존 비밀번호가 올바르지 않습니다."); // 상단 알림 메시지 표시
        setMessageType('error');
        return; // 비밀번호 변경 중단
    }

        // 💡 실제 비밀번호 변경 API 호출 로직 (시뮬레이션)
        console.log("Password change requested. Current:", currentPwd, "New:", newPwd);
        
        setMessage("비밀번호가 성공적으로 변경되었습니다. (마이페이지로 이동 시뮬레이션)");
        setMessageType('success');

        const updatedUser = {
            ...user,
            password : newPwd
        }

        updateUser(updatedUser)
        
        // 2초 후 페이지 이동 시뮬레이션 (router.push 대체)
        setTimeout(() => {
            // 이 환경에서는 실제 페이지 이동이 어려우므로, 뒤로 가기 동작을 시뮬레이션합니다.
          
            window.history.back(); 
        }, 1500);
    };

    const handleBack = () => {
        // router.back() 대체
        window.history.back(); 
    };

    /* --- 렌더링 --- */
    return (
        <div style={CONTAINER_STYLE}>
            <div style={OVERLAY_STYLE}></div>
            
            {/* 메시지 표시 영역 (Alert 대체) */}
            {message && (
                <div style={{
                    ...MESSAGE_BOX_STYLE, 
                    background: messageType === 'error' 
                        ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)'
                        : 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)'
                }}>
                    {message}
                    <button 
                        onClick={() => setMessage(null)}
                        style={CLOSE_BUTTON_STYLE}
                    >
                        &times;
                    </button>
                </div>
            )}

            {/* 콘텐츠 중앙 정렬 및 패딩 */}
            <div style={CENTER_CONTENT_STYLE}>
                <div style={styles.content}>
                    <h1 style={styles.title}>🔒 비밀번호 변경</h1>

                    <div style={styles.formWrapper} onSubmit={handleSubmit}>

                        {/* 1. 기존 비밀번호 */}
                        <div style={styles.formGroup}>
                            <label style={currentPwdError ? styles.labelError : styles.label}>기존 비밀번호</label>
                            <input
                                type="password"
                                value={currentPwd}
                                onChange={(e) => setCurrentPwd(e.target.value)}
                                style={{ ...styles.input, ...(currentPwdError ? styles.inputError : {}) }}
                                placeholder="기존 비밀번호"
                                minLength={MIN_PASSWORD_LENGTH}
                            />
                            {currentPwdError && <p style={styles.hintError}>{currentPwdError}</p>}
                            {!currentPwdError && <p style={styles.hint}>{MIN_PASSWORD_LENGTH}자리 이상의 비밀번호를 입력해 주세요</p>}
                        </div>

                        {/* 2. 새 비밀번호 */}
                        <div style={styles.formGroup}>
                            <label style={newPwdError ? styles.labelError : styles.label}>새 비밀번호</label>
                            <input
                                type="password"
                                value={newPwd}
                                onChange={(e) => setNewPwd(e.target.value)}
                                style={{ ...styles.input, ...(newPwdError ? styles.inputError : {}) }}
                                placeholder="새 비밀번호"
                                minLength={MIN_PASSWORD_LENGTH}
                            />
                            {newPwdError && <p style={styles.hintError}>{newPwdError}</p>}
                        </div>

                        {/* 3. 새 비밀번호 확인 */}
                        <div style={styles.formGroup}>
                            <label style={confirmPwdError ? styles.labelError : styles.label}>새 비밀번호 확인</label>
                            <input
                                type="password"
                                value={confirmPwd}
                                onChange={(e) => setConfirmPwd(e.target.value)}
                                style={{ ...styles.input, ...(confirmPwdError ? styles.inputError : {}) }}
                                placeholder="새 비밀번호 확인"
                                minLength={MIN_PASSWORD_LENGTH}
                            />
                            {confirmPwdError && <p style={styles.hintError}>{confirmPwdError}</p>}
                        </div>

                        {/* 4. 액션 버튼 */}
                        <div style={styles.actions}>
                            <button
                                type="button"
                                style={isFormValid ? styles.buttonPrimary : styles.buttonDisabled}
                                disabled={!isFormValid}
                                onClick={handleSubmit}
                            >
                                💾 저장
                            </button>
                            <button
                                type="button"
                                style={styles.buttonBack}
                                onClick={handleBack}
                            >
                                ← 뒤로
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


/* --- 고정 스타일 정의 --- */

// 💡 배경 컨테이너 스타일
const CONTAINER_STYLE = {
    minHeight: '100vh',
    display: 'flex', 
    justifyContent: 'center', 
    padding: '50px 20px',
    boxSizing: 'border-box',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    position: 'relative',
};

// 💡 오버레이 스타일
const OVERLAY_STYLE = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at top right, rgba(102, 126, 234, 0.1), transparent 50%), radial-gradient(circle at bottom left, rgba(118, 75, 162, 0.1), transparent 50%)',
    zIndex: 1,
};

// 💡 콘텐츠 중앙 정렬 래퍼 스타일
const CENTER_CONTENT_STYLE = {
    width: '100%',
    maxWidth: '650px',
    zIndex: 10,
    position: 'relative',
    height: 'fit-content', 
};

// 💡 메시지 박스 스타일 (Alert 대체)
const MESSAGE_BOX_STYLE = {
    position: 'fixed',
    top: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '16px 32px',
    borderRadius: '25px',
    color: 'white',
    fontSize: '15px',
    fontWeight: '600',
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
    backdropFilter: 'blur(10px)',
};

// 💡 메시지 박스 닫기 버튼 스타일
const CLOSE_BUTTON_STYLE = {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '0 8px',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
};

/* --- 컴포넌트 내부 스타일 정의 --- */
const styles = {
    content: {
        padding: '50px 50px', 
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px', 
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        border: '1px solid rgba(255, 255, 255, 0.1)', 
    },
    title: {
        fontSize: '28px', 
        marginBottom: '40px', 
        color: 'white',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    formWrapper: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px', 
        textAlign: 'left',
    },
    formGroup: {
        marginBottom: '0', 
    },
    label: {
        display: 'block',
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: '10px', 
        fontSize: '14px',
        fontWeight: '600',
    },
    labelError: {
        display: 'block',
        color: '#ff6b6b',
        marginBottom: '10px',
        fontSize: '14px',
        fontWeight: '600',
    },
    input: {
        width: '100%',
        padding: '14px 18px', 
        background: 'rgba(255, 255, 255, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        color: 'white',
        borderRadius: '12px',
        fontSize: '16px',
        boxSizing: 'border-box', 
        transition: 'all 0.3s ease',
        outline: 'none',
    },
    inputError: {
        border: '1px solid #ff6b6b',
        background: 'rgba(255, 107, 107, 0.1)',
    },
    hint: {
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.5)',
        marginTop: '8px',
        marginBottom: '0',
        fontWeight: '400',
    },
    hintError: {
        fontSize: '12px',
        color: '#ff6b6b',
        marginTop: '8px',
        marginBottom: '0',
        fontWeight: '500',
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-start',
        gap: '12px', 
        marginTop: '40px',
        paddingTop: '30px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    },
    buttonPrimary: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white', 
        border: 'none',
        padding: '14px 32px', 
        fontSize: '15px',
        cursor: 'pointer',
        borderRadius: '25px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        flexGrow: 1,
        maxWidth: '200px',
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    },
    buttonDisabled: {
        background: 'rgba(255, 255, 255, 0.1)',
        color: 'rgba(255, 255, 255, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '14px 32px', 
        fontSize: '15px',
        cursor: 'not-allowed',
        borderRadius: '25px',
        fontWeight: '600',
        flexGrow: 1,
        maxWidth: '200px',
    },
    buttonBack: {
        background: 'rgba(255, 255, 255, 0.1)',
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '14px 32px', 
        fontSize: '15px',
        cursor: 'pointer',
        borderRadius: '25px',
        transition: 'all 0.3s ease',
        flexGrow: 1,
        maxWidth: '200px',
        fontWeight: '600',
    },
};