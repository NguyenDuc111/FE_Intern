import Header from "../headerfooter/Header";
import Footer from "../headerfooter/Footer";
import ScrollToTopButton from "./ScrollToTopButton";
export default function CholimexLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-white">{children}</main>
      <ScrollToTopButton/>
      <Footer />
    </div>
  );
}
