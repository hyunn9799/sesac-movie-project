import { GenreProvider } from "./_component/GenreStoreContext";

export default function RootLayout({ children }) {
  return (
    <>

      <GenreProvider> {/* Provider로 감싸기 */}
        {children}
      </GenreProvider>

    </>
  );
}