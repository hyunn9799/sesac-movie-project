"use client";

import React, { useState, useEffect } from "react";
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  shadow,
  transition,
} from "@/lib/style/styles";
import { faqs as initialFaqs } from "@/lib/data/fqa";

export default function FqaPage() {
  const [faqs, setFaqs] = useState([]);
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("faqs");
    if (saved) {
      setFaqs(JSON.parse(saved));
    } else {
      const withIds = initialFaqs.map((f, i) => ({ ...f, id: i + 1 }));
      localStorage.setItem("faqs", JSON.stringify(withIds));
      setFaqs(withIds);
    }
  }, []);

  const filteredFaqs = faqs.filter((item) =>
    item.question.toLowerCase().includes(search.toLowerCase())
  );

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div style={styles.container}>
      <div style={styles.noticeBox}>
        <h2 style={styles.title}>FAQ</h2>
        <p style={styles.subtitle}>
          <em style={{ color: colors.primary }}>MovieHub</em> 이용 시 궁금한 점을 확인할 수 있습니다.
        </p>

        {/* 검색창 */}
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <button style={styles.searchButton}>검색</button>
        </div>

        {/* FAQ 테이블 */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>번호</th>
              <th style={styles.tableHeader}>질문</th>
            </tr>
          </thead>
          <tbody>
            {filteredFaqs.length === 0 ? (
              <tr>
                <td colSpan="2" style={styles.emptyCell}>
                  등록된 FAQ가 없습니다.
                </td>
              </tr>
            ) : (
              filteredFaqs.map((faq) => (
                <React.Fragment key={faq.id}>
                  <tr
                    style={{
                      ...styles.tableRow,
                      cursor: "pointer",
                      backgroundColor:
                        openId === faq.id ? colors.darkGray : "transparent",
                    }}
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <td style={styles.tableCell}>{faq.id}</td>
                    <td style={styles.tableCell}>
                      <em style={{ color: colors.primary }}>MovieHub</em>{" "}
                      {faq.question}
                    </td>
                  </tr>

                  {/* ✅ 펼쳐질 답변 영역 */}
                  {openId === faq.id && (
                    <tr>
                      <td colSpan="2" style={styles.detailCell}>
                        {faq.answer || "내용이 없습니다."}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>

        {/* 하단 버튼 */}
        <div style={styles.footerBtns}>
          <button style={styles.footerButton}>검색결과 수집에 대한 정책</button>
          <button style={styles.footerButton}>MovieHub 사용문의</button>
          <button style={styles.footerButton}>제휴제안</button>
          <button style={styles.footerButton}>고객센터</button>
        </div>
      </div>
    </div>
  );
}

// ✅ 공지사항 스타일 그대로 복사
const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: colors.dark,
    padding: spacing.xl,
    paddingTop: "100px",
  },
  noticeBox: {
    maxWidth: "1200px",
    margin: "0 auto",
    backgroundColor: colors.darkGray,
    borderRadius: borderRadius.large,
    padding: spacing.xxl,
    boxShadow: shadow.large,
  },
  title: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.bold,
    color: colors.white,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: fontSize.large,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xxl,
  },
  searchBox: {
    display: "flex",
    gap: spacing.md,
    marginBottom: spacing.xl,
    justifyContent: "center",
  },
  searchInput: {
    padding: spacing.md,
    fontSize: fontSize.medium,
    border: `1px solid ${colors.mediumGray}`,
    borderRadius: borderRadius.medium,
    backgroundColor: colors.dark,
    color: colors.white,
    width: "400px",
    outline: "none",
  },
  searchButton: {
    padding: `${spacing.sm} ${spacing.xl}`,
    fontSize: fontSize.medium,
    fontWeight: fontWeight.medium,
    backgroundColor: colors.primary,
    color: colors.white,
    border: "none",
    borderRadius: borderRadius.medium,
    cursor: "pointer",
    transition: transition.normal,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: spacing.xl,
  },
  tableHeader: {
    padding: spacing.lg,
    backgroundColor: colors.dark,
    color: colors.textSecondary,
    fontSize: fontSize.medium,
    fontWeight: fontWeight.bold,
    textAlign: "left",
    borderBottom: `2px solid ${colors.mediumGray}`,
  },
  tableRow: {
    transition: transition.fast,
  },
  tableCell: {
    padding: spacing.lg,
    color: colors.white,
    fontSize: fontSize.medium,
    borderBottom: `1px solid ${colors.mediumGray}`,
  },
  detailCell: {
    padding: spacing.xl,
    backgroundColor: colors.dark,
    color: colors.textSecondary,
    fontSize: fontSize.medium,
    lineHeight: 1.6,
    borderBottom: `1px solid ${colors.mediumGray}`,
    animation: "fadeIn 0.3s ease-in-out",
  },
  emptyCell: {
    padding: spacing.xxl,
    textAlign: "center",
    color: colors.textSecondary,
    fontSize: fontSize.large,
  },
  footerBtns: {
    display: "flex",
    justifyContent: "center",
    gap: "150px",
    flexWrap: "wrap",
  },
  footerButton: {
    padding: `${spacing.sm} ${spacing.lg}`,
    fontSize: fontSize.medium,
    backgroundColor: "transparent",
    color: colors.textSecondary,
    border: `1px solid ${colors.mediumGray}`,
    borderRadius: borderRadius.medium,
    cursor: "pointer",
    transition: transition.normal,
  },
};
