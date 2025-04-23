import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ContentComponent from "./components/Content/HomePage";
import HomePage from "./components/Content/HomePage";
import ProductPage from "./components/Pages/ProductPage";
import Header from "./components/headerfooter/Header";
import Footer from "./components/headerfooter/Footer";
import InfoUser from "./components/UserPage/InforUser";

function App() {
  return (
    <>
      <div>
       
        {/* Cấu hình định tuyến */}
        <Header />
        <Routes>
          {/* Tự động chuyển về /login khi vào / */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/profile" element = {<InfoUser />} />
          

        </Routes>
        <ContentComponent />
       <Footer></Footer>
      </div>
    </>
  );
}
// }

export default App;
