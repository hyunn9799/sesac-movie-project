"use client";

import React, { useState, useEffect } from "react";
import styles from "./qna.module.css";
import { faqs as initialFaqs } from "@/lib/data/fqa"; // 초기 데이터 (백업용)

export default function FqaPage() {
  const [faqs, setFaqs] = useState([]); // 전체 FAQ
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ localStorage에서 데이터 불러오기
  useEffect(() => {
    const saved = localStorage.getItem("faqs");
    if (saved) {
      setFaqs(JSON.parse(saved));
    } else {
      // localStorage에 없으면 기본값 저장
      const withIds = initialFaqs.map((f, i) => ({ ...f, id: i + 1 }));
      localStorage.setItem("faqs", JSON.stringify(withIds));
      setFaqs(withIds);
    }
  }, []);

  // ✅ 검색 기능
  const filteredFaqs = faqs.filter((item) =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.faqBox}>
        <h2 className={styles.title}>FAQ</h2>
        <p className={styles.subtitle}>
          <em>MovieHub</em> 이용 시 궁금한 점을 확인할 수 있습니다.
        </p>

        {/* 검색창 */}
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>검색</button>
        </div>

        {/* FAQ 테이블 */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>내용</th>
            </tr>
          </thead>
          <tbody>
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <tr key={faq.id || index}>
                  <td>{index + 1}</td>
                  <td>{faq.question}</td>
                  <td>{faq.answer}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className={styles.noData}>
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* 하단 */}
        <div className={styles.footerBox}>
          <div className={styles.pagination}>
            <button disabled>이전</button>
            <button className={styles.active}>1</button>
            <button disabled>다음</button>
          </div>
          <div className={styles.bottomButtons}>
            <button className={styles.btn}>검색결과 수집에 대한 정책</button>
            <button className={styles.btn}>MovieHub 사용문의</button>
            <button className={styles.btn}>제휴제안</button>
            <button className={styles.btn}>고객센터</button>
          </div>
        </div>
      </div>
    </div>
  );
}
