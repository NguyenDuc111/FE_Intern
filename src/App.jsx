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
import Dashboard from "./components/Admin/Dashboard";
import AdminLayout from "./components/Admin/AdminLayout";
import ProductManager from "./components/Admin/ProductManager";
import CategoryManager from "./components/Admin/CategoryManager";
import OrderManager from "./components/Admin/OrderManager";
import LoyaltyManager from "./components/Admin/LoyaltyManager";
import UserManager from "./components/Admin/UserManager";

function App() {
  return (
    <>
      <div>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          limit={1}
        />
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
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failed" element={<PaymentFailed />} />
          <Route path="/order" element={<PaymentHistory />} />

          {/* ✅ Route admin đúng cách */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<ProductManager />} />
            <Route path="categories" element={<CategoryManager />} />
            <Route path="orders" element={<OrderManager/>}/>
            <Route path="loyalty" element={<LoyaltyManager />} />
            <Route path="users" element={<UserManager />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}
// }

export default App;
