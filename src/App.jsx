import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Content/Home";
import About from "./components/Content/About";
import Contact from "./components/Content/Contact";
import Profile from "./components/UserPage/Profile";
import Categories from "./components/Content/Categories";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cart from "./components/Content/Cart";
import ProductDetail from "./components/Content/ProductDetail";
import PaymentSuccess from "./components/Content/PaymentSuccess";
import PaymentFailed from "./components/Content/PaymentFailed";
import PaymentHistory from "./components/Content/PaymentHistory";

function App() {
  return (
    <>
      <div>
        <ToastContainer position="top-center" autoClose={3000} />
        {/* Cấu hình định tuyến */}

        <Routes>
          {/* Tự động chuyển về /login khi vào / */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/Product-detail" element={<ProductDetail />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failed" element={<PaymentFailed />} />
          <Route path="/order" element={<PaymentHistory />} />
        </Routes>
      </div>
    </>
  );
}
// }

export default App;
