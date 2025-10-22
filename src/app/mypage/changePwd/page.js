
'use client'
// Next.js useRouter 대신 브라우저의 history API를 사용하거나 동작을 시뮬레이션합니다.

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

    /* --- 유효성 검사 및 버튼 활성화 로직 --- */
    useEffect(() => {
        // 메시지 초기화
        setMessage(null);

        // 모든 필드가 최소 길이를 만족하는지 확인
        const isCurrentValid = currentPwd.length >= MIN_PASSWORD_LENGTH;
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
        if (currentPwd.length > 0 && currentPwd.length < MIN_PASSWORD_LENGTH) {
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

        // 💡 실제 비밀번호 변경 API 호출 로직 (시뮬레이션)
        console.log("Password change requested. Current:", currentPwd, "New:", newPwd);
        
        setMessage("비밀번호가 성공적으로 변경되었습니다. (마이페이지로 이동 시뮬레이션)");
        setMessageType('success');
        
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
        // ❗ 1. 배경 이미지와 오버레이를 포함하는 최상위 컨테이너
        <div style={CONTAINER_STYLE}>
            
            {/* ❗ 2. 메시지 표시 영역 (Alert 대체) */}
            {message && (
                <div style={{...MESSAGE_BOX_STYLE, backgroundColor: messageType === 'error' ? '#e74c3c' : '#2ecc71'}}>
                    {message}
                    <button 
                        onClick={() => setMessage(null)}
                        style={CLOSE_BUTTON_STYLE}
                    >
                        &times;
                    </button>
                </div>
            )}

            {/* ❗ 3. 콘텐츠 중앙 정렬 및 패딩 */}
            <div style={CENTER_CONTENT_STYLE}>
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
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}


/* --- 고정 스타일 정의 --- */

// 💡 배경 이미지 URL (로컬 이미지 대신 다크 테마 플레이스홀더 사용)
const BACKGROUND_IMAGE_URL = '/black_lock.jpg';

// 💡 배경 이미지 및 오버레이 스타일 (CONTAINER_STYLE와 OVERLAY_STYLE을 결합)
const CONTAINER_STYLE = {
    minHeight: '100vh',
    display: 'flex', // 자식 요소(콘텐츠)를 중앙에 배치하기 위해 flex 사용
    justifyContent: 'center', // 가로 중앙 정렬
    // alignItems: 'center', // 세로 중앙 정렬
    padding: '50px',
    boxSizing: 'border-box',
    fontFamily: 'Inter, sans-serif',
    // 배경 이미지 설정
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${BACKGROUND_IMAGE_URL}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
};

// 💡 콘텐츠 중앙 정렬 래퍼 스타일 (모바일 반응성을 위해 최대 너비 지정)
const CENTER_CONTENT_STYLE = {
    width: '100%',
    maxWidth: '500px',
    zIndex: 10,
    position: 'relative',
};

// 💡 메시지 박스 스타일 (Alert 대체)
const MESSAGE_BOX_STYLE = {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '15px 30px',
    borderRadius: '8px',
    color: 'white',
    fontSize: '15px',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
};

// 💡 메시지 박스 닫기 버튼 스타일
const CLOSE_BUTTON_STYLE = {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '0 5px',
};

/* --- 컴포넌트 내부 스타일 정의 --- */
const styles = {
    // ❗ content 스타일 조정: 배경 이미지 위에 콘텐츠 영역이 불투명하게 보이도록 함
    content: {
        width: '100%',
        padding: '40px',
        textAlign: 'center',
        // backgroundColor: 'rgba(28, 28, 28, 0.95)', // 더 불투명하게 조정
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        border: '1px solid black',
        maxWidth: '650px'
    },
    title: {
        fontSize: '32px',
        marginBottom: '40px',
        color: 'white',
        fontWeight: '700',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        textAlign: 'left',
    },
    formGroup: {
        marginBottom: '10px',
    },
    label: {
        display: 'block',
        color: 'white',
        marginBottom: '5px',
        fontSize: '14px',
        // opacity: 0.7,
    },
    labelError: {
        color: '#e74c3c',
        opacity: 1,
    },
    input: {
        width: '100%',
        padding: '14px',
        backgroundColor: '#3c3c3c',
        border: '1px solid #555',
        color: 'white',
        borderRadius: '6px',
        fontSize: '16px',
        boxSizing: 'border-box', // 패딩이 너비에 포함되도록 설정
        transition: 'border-color 0.2s',
    },
    inputError: {
        border: '1px solid #e74c3c',
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
        color: '#e74c3c',
        marginTop: '8px',
        marginBottom: '0',
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-start',
        gap: '15px',
        marginTop: '30px',
    },
    buttonPrimary: {
        backgroundColor: '#c0392b',
        color: 'white',
        border: 'none',
        padding: '12px 25px',
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: '6px',
        fontWeight: 'bold',
        transition: 'background-color 0.2s',
        flexGrow: 1,
        maxWidth: '150px'
    },
    buttonDisabled: {
        backgroundColor: '#555',
        color: '#ccc',
        border: 'none',
        padding: '12px 25px',
        fontSize: '16px',
        cursor: 'not-allowed',
        borderRadius: '6px',
        fontWeight: 'bold',
        flexGrow: 1,
        maxWidth: '150px'
    },
    buttonBack: {
        backgroundColor: '#444',
        color: 'white',
        border: 'none',
        padding: '12px 25px',
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: '6px',
        transition: 'background-color 0.2s',
        flexGrow: 1,
        maxWidth: '150px'
    },
};
