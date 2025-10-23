"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./qna.module.css";
import { faqs as initialFaqs } from "../../lib/data/faq";

export default function QnaPage() {
  const router = useRouter();

  // ✅ 초기 데이터 설정
  const [qnaList, setQnaList] = useState(initialFaqs || []);
  const [openId, setOpenId] = useState(null);
  const [search, setSearch] = useState("");

  // ✅ 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const qnaPerPage = 10;
  const totalPages = Math.ceil(qnaList.length / qnaPerPage) || 1;

  // ✅ 안전한 검색 필터
  const filteredQna = qnaList.filter((qna) => {
    const title = qna?.title?.toLowerCase() || "";
    const content = qna?.content?.toLowerCase() || "";
    const keyword = search.toLowerCase();
    return title.includes(keyword) || content.includes(keyword);
  });

  // ✅ 현재 페이지 계산
  const startIndex = (currentPage - 1) * qnaPerPage;
  const endIndex = startIndex + qnaPerPage;
  const currentQnaList = filteredQna.slice(startIndex, endIndex);

  // ✅ 페이지 이동
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setOpenId(null);
    }
  };

  // ✅ QnA 열고 닫기
  const toggleQna = (id) => setOpenId(openId === id ? null : id);

  // ✅ 안전한 텍스트 하이라이트
  const highlightText = (text = "", keyword = "") => {
    if (!keyword) return text;
    const parts = text.split(new RegExp(`(${keyword})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <mark key={i} className={styles.highlight}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // ✅ 등록 버튼 클릭 시 이동
  const goToRegister = () => {
    router.push("/qna/write");
  };

  return (
    <div className={styles.container}>
      <div className={styles.qnaBox}>
        <h2 className={styles.title}>자주하는 질문(FAQ)</h2>
        <p className={styles.subtitle}>
          <em>MovieHub</em> 이용 시 궁금한 점을 확인할 수 있습니다.
        </p>

        {/* 검색창 */}
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="🔍 검색어를 입력하세요"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button>검색</button>
        </div>

        {search && (
          <p className={styles.searchResult}>
            🔎 검색어: <strong>{search}</strong>
          </p>
        )}

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
            {currentQnaList.length > 0 ? (
              currentQnaList.map((qna) => (
                <React.Fragment key={qna.id}>
                  <tr className={styles.row} onClick={() => toggleQna(qna.id)}>
                    <td>{qna.id}</td>
                    <td>{highlightText(qna.title, search)}</td>
                    <td>{qna.date}</td>
                    <td>{qna.views}</td>
                  </tr>
                  {openId === qna.id && (
                    <tr className={styles.dropdownRow}>
                      <td colSpan="4">{highlightText(qna.content, search)}</td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        <div className={styles.pagination}>
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            이전
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              className={currentPage === i + 1 ? styles.activePage : styles.pageButton}
            >
              {i + 1}
            </button>
          ))}

          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
            다음
          </button>
        </div>

        {/* 등록 버튼 */}
        <div className={styles.buttonBox}>
          <button className={styles.registerBtn} onClick={goToRegister}>
            Q&A 등록
          </button>
        </div>
      </div>
    </div>
  );
}
