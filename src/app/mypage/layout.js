import { GenreProvider } from "./_component/GenreStoreContext";

export default function RootLayout({ children }) {
  return (
    <>

      <GenreProvider> 
        {children}
      </GenreProvider>

    </>
  );
}