"use client";
import React, { useState } from "react";
import styles from "./qna.module.css";
import { initialQna } from "@/lib/data/qna";

export default function QnaPage() {
  const [qnaList] = useState(initialQna);
  const [openId, setOpenId] = useState(null);

  // ✅ 페이지네이션 관련 상태
  const [currentPage, setCurrentPage] = useState(1);
  const qnaPerPage = 10; // 한 페이지당 표시할 QnA 수
  const totalPages = Math.ceil(qnaList.length / qnaPerPage);

  // ✅ 현재 페이지의 QnA 리스트 계산
  const startIndex = (currentPage - 1) * qnaPerPage;
  const endIndex = startIndex + qnaPerPage;
  const currentQnaList = qnaList.slice(startIndex, endIndex);

  // ✅ 페이지 이동 함수
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // ✅ QnA 열기/닫기
  const toggleQna = (id) => setOpenId(openId === id ? null : id);

  return (
    <div className={styles.container}>
      <div className={styles.qnaBox}>
        <h2 className={styles.title}>Q&amp;A</h2>
        <p className={styles.subtitle}>
          <em>MovieHub</em> 이용 시 궁금한 점을 확인할 수 있습니다.
        </p>

        {/* 검색창 */}
        <div className={styles.searchBox}>
          <input type="text" placeholder="검색어를 입력하세요" />
          <button>검색</button>
        </div>

        {/* QnA 테이블 */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성일자</th>
              <th>조회수</th>
            </tr>
          </thead>
          <tbody>
            {currentQnaList.map((qna) => (
              <React.Fragment key={qna.id}>
                <tr
                  className={styles.row}
                  onClick={() => toggleQna(qna.id)}
                >
                  <td>{qna.id}</td>
                  <td>{qna.title}</td>
                  <td>{qna.date}</td>
                  <td>{qna.views}</td>
                </tr>
                {openId === qna.id && (
                  <tr className={styles.dropdownRow}>
                    <td colSpan="4">{qna.content}</td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        <div className={styles.pagination}>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            이전
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              className={
                currentPage === i + 1
                  ? styles.activePage
                  : styles.pageButton
              }
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>

        {/* 하단 버튼 */}
        <div className={styles.footerBtns}>
          <button>검색결과 수집에 대한 정책</button>
          <button>MovieHub 사용문의</button>
          <button>제휴제안</button>
          <button>고객센터</button>
        </div>
      </div>
    </div>
  );
}
