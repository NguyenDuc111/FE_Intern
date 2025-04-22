import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginUser/LoginForm";
import RegisterForm from "./components/signup/RegisterForm";
import ContentComponent from "./components/Content/HomePage";
import HomePage from "./components/Content/HomePage";
import ProductPage from "./components/Pages/ProductPage";
function App() {
  return (
    <>
      <div>
        <nav>{/* <NavigationWithLoading /> */}</nav>

        {/* Cấu hình định tuyến */}
        <Routes>
          {/* Tự động chuyển về /login khi vào / */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/products" element={<ProductPage />} />
        </Routes>
        <ContentComponent />
      </div>
    </>
  );
}
// }

export default App;
