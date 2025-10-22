import { GenreProvider } from "./_component/GenreStoreContext";

export default function RootLayout({children}) {
    return (
    <html lang="ko">
      <body>
        <GenreProvider> {/* Provider로 감싸기 */}
          {children}
        </GenreProvider>
      </body>
    </html>
  );
}