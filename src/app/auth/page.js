'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './auth.module.css';
import { initialMembers } from '@/lib/data/memberData';
import { adminMembers } from '@/lib/data/admin1';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    // 로그인 상태 확인
    const loggedInUser = localStorage.getItem('loggedInUser');
    const loggedInAdmin = localStorage.getItem('loggedInAdmin');
    if (loggedInUser) {
      router.push('/');
    } else if (loggedInAdmin) {
      router.push('/admin');
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone) => {
    const regex = /^010-\d{3,4}-\d{4}$/;
    return regex.test(phone);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = '유효한 이메일을 입력해주세요.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = '이름을 입력해주세요.';
      }

      if (!formData.phone) {
        newErrors.phone = '휴대폰 번호를 입력해주세요.';
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = '휴대폰 번호 형식: 010-1234-5678';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
      }

      // 중복 이메일 확인
      const existingUser = initialMembers.find(
        (user) => user.email === formData.email
      );
      if (existingUser) {
        newErrors.email = '이미 가입된 이메일입니다.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage('');

    // 네트워크 지연 시뮬레이션
    setTimeout(() => {
      try {
        if (isLogin) {
          // 관리자 로그인 확인
          const admin = adminMembers.find(
            (a) => a.email === formData.email && a.password === formData.password
          );

          if (admin) {
            // 관리자 로그인 성공
            const adminLoginData = {
              id: admin.id,
              name: admin.name,
              email: admin.email,
              phone: admin.phone,
              role: admin.role,
              status: admin.status,
              joinDate: admin.joinDate,
              lastLogin: new Date().toISOString().split('T')[0],
            };

            localStorage.setItem('loggedInAdmin', JSON.stringify(adminLoginData));
            setMessage('관리자 로그인에 성공했습니다!');

            setTimeout(() => {
              router.push('/admin');
            }, 1000);
            setLoading(false);
            return;
           
          }

          // 일반 회원 로그인
          const user = initialMembers.find(
            (u) => u.email === formData.email && u.password === formData.password
          );

          if (!user) {
            setMessage('이메일 또는 비밀번호가 일치하지 않습니다.');
            setLoading(false);
            return;
          }

          if (user.status === '정지') {
            setMessage('정지된 계정입니다. 관리자에게 문의하세요.');
            setLoading(false);
            return;
          }

          // 로그인 성공
          const loginData = {
            id: user.id,
            name: user.name,
            email: user.email,
            password : user.password,
            phone: user.phone,
            role: user.role,
            status: user.status,
            joinDate: user.joinDate,
            lastLogin: new Date().toISOString().split('T')[0],
          };

          localStorage.setItem('loggedInUser', JSON.stringify(loginData));
          setMessage('로그인에 성공했습니다!');

          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
            

        } else {
          // 회원가입 처리
          const newUser = {
            id: initialMembers.length + 1,
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            joinDate: new Date().toISOString().split('T')[0],
            status: '활성',
            role: '일반회원',
            lastLogin: new Date().toISOString().split('T')[0],
          };

          // 실제로는 여기서 새 사용자를 서버에 저장해야 하지만,
          // 프론트엔드 전용이므로 localStorage에만 저장
          try {
            const users = JSON.parse(localStorage.getItem('allUsers')) || [];
            users.push(newUser);
            localStorage.setItem('allUsers', JSON.stringify(users));
          } catch {}

          setMessage('회원가입에 성공했습니다! 로그인해주세요.');
          setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
            phone: '',
          });

          setTimeout(() => {
            setIsLogin(true);
            setMessage('');
          }, 2000);
        }
      } catch (error) {
        setMessage('오류가 발생했습니다. 다시 시도해주세요.');
        console.error('Auth error:', error);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      phone: '',
    });
    setErrors({});
    setMessage('');
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>
            {isLogin ? '로그인' : '회원가입'}
          </h1>
          <p className={styles.authSubtitle}>
            {isLogin
              ? 'MovieHub에 로그인하세요'
              : 'MovieHub 계정을 만들어보세요'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          {!isLogin && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  이름
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="이름을 입력하세요"
                  className={`${styles.input} ${
                    errors.name ? styles.inputError : ''
                  }`}
                />
                {errors.name && (
                  <span className={styles.errorText}>{errors.name}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.label}>
                  휴대폰 번호
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="010-1234-5678"
                  className={`${styles.input} ${
                    errors.phone ? styles.inputError : ''
                  }`}
                />
                {errors.phone && (
                  <span className={styles.errorText}>{errors.phone}</span>
                )}
              </div>
            </>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              이메일
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className={`${styles.input} ${
                errors.email ? styles.inputError : ''
              }`}
            />
            {errors.email && (
              <span className={styles.errorText}>{errors.email}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="최소 6자 이상"
              className={`${styles.input} ${
                errors.password ? styles.inputError : ''
              }`}
            />
            {errors.password && (
              <span className={styles.errorText}>{errors.password}</span>
            )}
          </div>

          {!isLogin && (
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                비밀번호 확인
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="비밀번호를 다시 입력하세요"
                className={`${styles.input} ${
                  errors.confirmPassword ? styles.inputError : ''
                }`}
              />
              {errors.confirmPassword && (
                <span className={styles.errorText}>
                  {errors.confirmPassword}
                </span>
              )}
            </div>
          )}

          {message && (
            <div
              className={`${styles.message} ${
                message.includes('오류') ||
                message.includes('일치') ||
                message.includes('정지')
                  ? styles.messageError
                  : styles.messageSuccess
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`${styles.submitButton} ${
              loading ? styles.buttonLoading : ''
            }`}
          >
            {loading
              ? isLogin
                ? '로그인 중...'
                : '회원가입 중...'
              : isLogin
                ? '로그인'
                : '회원가입'}
          </button>
        </form>

       

        <div className={styles.toggleSection}>
          <p className={styles.toggleText}>
            {isLogin ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}
            <button
              type="button"
              onClick={toggleMode}
              className={styles.toggleButton}
            >
              {isLogin ? '회원가입' : '로그인'}
            </button>
          </p>
        </div>

        <div className={styles.divider}></div>

        <Link href="/" className={styles.backButton}>
          ← 홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}