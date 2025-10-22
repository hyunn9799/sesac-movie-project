// src/app/changepwd/page.js

"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 비밀번호 최소 길이 설정
const MIN_PASSWORD_LENGTH = 6;

export default function ChangePwdPage() {
    const router = useRouter();

    // 1. 입력 필드 상태
    const [currentPwd, setCurrentPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');

    // 2. 유효성 검사 메시지 상태
    const [currentPwdError, setCurrentPwdError] = useState('');
    const [newPwdError, setNewPwdError] = useState('');
    const [confirmPwdError, setConfirmPwdError] = useState('');

    // 3. 버튼 활성화 상태
    const [isFormValid, setIsFormValid] = useState(false);

    /* --- 유효성 검사 및 버튼 활성화 로직 --- */
    useEffect(() => {
        // 모든 필드가 최소 길이를 만족하는지 확인
        const isCurrentValid = currentPwd.length >= MIN_PASSWORD_LENGTH;
        const isNewValid = newPwd.length >= MIN_PASSWORD_LENGTH;
        
        // 새 비밀번호와 확인이 일치하고, 기존 비밀번호와 다른지 확인
        const isConfirmMatch = newPwd === confirmPwd && newPwd.length > 0;
        const isDifferentFromCurrent = newPwd !== currentPwd;

        // 최종 유효성 검사 (모든 조건 만족)
        const allValid = isCurrentValid && isNewValid && isConfirmMatch && isDifferentFromCurrent;

        setIsFormValid(allValid);
        
        // 실시간 에러 메시지 업데이트
        if (newPwd.length > 0 && newPwd.length < MIN_PASSWORD_LENGTH) {
            setNewPwdError(`${MIN_PASSWORD_LENGTH}자리 이상의 비밀번호를 입력해주세요.`);
        } else if (newPwd !== currentPwd && currentPwd.length >= MIN_PASSWORD_LENGTH && newPwd.length >= MIN_PASSWORD_LENGTH) {
            setNewPwdError(''); // 새 비밀번호가 기존과 다를 경우 메시지 제거
        } else if (newPwd === currentPwd && newPwd.length > 0) {
             setNewPwdError('새 비밀번호는 기존 비밀번호와 달라야 합니다.');
        } else {
            setNewPwdError('');
        }

        if (confirmPwd.length > 0 && newPwd !== confirmPwd) {
            setConfirmPwdError('새 비밀번호와 일치하지 않습니다.');
        } else {
            setConfirmPwdError('');
        }
        
        // 기존 비밀번호 에러 메시지 (길이 조건만)
        if (currentPwd.length > 0 && currentPwd.length < MIN_PASSWORD_LENGTH) {
            setCurrentPwdError(`${MIN_PASSWORD_LENGTH}자리 이상의 비밀번호를 입력해주세요.`);
        } else {
            setCurrentPwdError('');
        }

    }, [currentPwd, newPwd, confirmPwd]);


    /* --- 핸들러 함수 --- */
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!isFormValid) {
            alert("입력 정보를 다시 확인해 주세요.");
            return;
        }

        // 💡 실제 비밀번호 변경 API 호출 로직
        console.log("Password change requested.");
        alert("비밀번호가 성공적으로 변경되었습니다.");
        router.push('/mypage'); 
    };

    const handleBack = () => {
        router.back(); // 이전 페이지(마이페이지)로 돌아가기
    };

    /* --- 렌더링 --- */
    return (
        <div style={styles.container}>
           
            
            <div style={styles.content}>
                <h1 style={styles.title}>비밀번호 변경</h1>

                <form onSubmit={handleSubmit} style={styles.form}>
                    
                    {/* 1. 기존 비밀번호 */}
                    <div style={styles.formGroup}>
                        <label style={currentPwdError ? styles.labelError : styles.label}>기존 비밀번호</label>
                        <input
                            type="password"
                            value={currentPwd}
                            onChange={(e) => setCurrentPwd(e.target.value)}
                            style={{ ...styles.input, ...(currentPwdError ? styles.inputError : {}) }}
                            placeholder="기존 비밀번호"
                        />
                        {currentPwdError && <p style={styles.hintError}>{currentPwdError}</p>}
                        {!currentPwdError && <p style={styles.hint}>6자리 이상의 비밀번호를 입력해 주세요</p>}
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
                        />
                        {confirmPwdError && <p style={styles.hintError}>{confirmPwdError}</p>}
                    </div>
                    
                    {/* 4. 액션 버튼 */}
                    <div style={styles.actions}>
                        <button 
                            type="submit"
                            style={isFormValid ? styles.buttonPrimary : styles.buttonDisabled}
                            disabled={!isFormValid}
                        >
                            저장
                        </button>
                        <button 
                            type="button" 
                            style={styles.buttonBack}
                            onClick={handleBack}
                        >
                            뒤로
                        </button>
                        {/* 이미지에 있는 비활성화 '저장' 버튼은 필요 없으므로 제거했습니다. */}
                    </div>
                </form>
            </div>
        </div>
    );
}

/* --- 스타일 정의 --- */
const styles = {
    container: {
        backgroundColor: '#1c1c1c',
        minHeight: '100vh',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#222',
        padding: '15px 50px',
        borderBottom: '1px solid #444',
    },
    logo: {
        margin: 0,
        color: '#c0392b', // MovieHub 로고 색상
        fontSize: '24px'
    },
    headerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    buttonPrimary: {
        backgroundColor: '#c0392b', // 활성화 시 빨간색
        color: 'white',
        border: 'none',
        padding: '12px 30px',
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: '4px',
    },
    buttonSecondary: {
        backgroundColor: 'transparent',
        color: 'white',
        border: '1px solid #777',
        padding: '8px 15px',
        cursor: 'pointer',
        borderRadius: '4px',
    },
    buttonBack: {
        backgroundColor: '#444', 
        color: 'white',
        border: 'none',
        padding: '12px 30px',
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: '4px',
    },
    buttonDisabled: {
        backgroundColor: '#555', // 비활성화 시 회색
        color: '#ccc',
        border: 'none',
        padding: '12px 30px',
        fontSize: '16px',
        cursor: 'not-allowed',
        borderRadius: '4px',
    },
    content: {
        maxWidth: '500px',
        margin: '0 auto',
        padding: '40px 20px',
        textAlign: 'center',
    },
    title: {
        fontSize: '36px',
        marginBottom: '40px',
        color: 'white',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        textAlign: 'left',
    },
    formGroup: {
        marginBottom: '10px',
    },
    label: {
        display: 'block',
        color: '#aaa',
        marginBottom: '5px',
        fontSize: '14px',
        opacity: 0.8
    },
    labelError: {
        // ...this.label,
        color: '#e74c3c', // 에러 발생 시 레이블 색상
        opacity: 1
    },
    input: {
        width: '100%',
        padding: '15px',
        backgroundColor: '#3c3c3c',
        border: '1px solid #555',
        color: 'white',
        borderRadius: '4px',
        fontSize: '16px',
    },
    inputError: {
        border: '1px solid #e74c3c', // 에러 발생 시 테두리 색상
        backgroundColor: '#3e2e2e',
    },
    hint: {
        fontSize: '12px',
        color: '#aaa',
        marginTop: '8px',
        marginBottom: '0',
    },
    hintError: {
        fontSize: '12px',
        color: '#e74c3c', // 에러 메시지 색상
        marginTop: '8px',
        marginBottom: '0',
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-start',
        gap: '15px',
        marginTop: '30px',
    }
};