import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/image/logo-english.jpg";
import "../headerfooter/Header.css";
import LoginForm from "../LoginUser/LoginForm";

function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const modalRef = useRef();

  const toggleLogin = () => setShowLogin((prev) => !prev);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setShowLogin(false);
    }
  };

  useEffect(() => {
    if (showLogin) {
      document.body.style.overflow = "hidden"; // khóa scroll nền
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.body.style.overflow = "auto";
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLogin]);

  return (
    <>
      <header className="header relative z-50">
        <div className="p-2 flex items-center justify-between">
          <div className="flex items-center justify-between">
            <Link to="/" className="logo">
              <img
                src={logo}
                alt="Cholimex"
                style={{ width: "100px", height: "auto" }}
              />
            </Link>

            <nav className="hidden md:flex items-center gap-4">
              <Link to="/" className="text-sm font-bold uppercase text-[#dd3333]">Trang chủ</Link>
              <Link to="/about" className="text-sm font-bold uppercase text-black hover:text-[#dd3333]">Giới thiệu</Link>
              <Link to="/products" className="text-sm font-bold uppercase text-black hover:text-[#dd3333]">Sản phẩm</Link>
              <Link to="/contact" className="text-sm font-bold uppercase text-black hover:text-[#dd3333]">Công bố sản phẩm</Link>
              <Link to="/contact" className="text-sm font-bold uppercase text-black hover:text-[#dd3333]">Thư viện ẩm thực</Link>
              <Link to="/contact" className="text-sm font-bold uppercase text-black hover:text-[#dd3333]">Tin tức</Link>
              <Link to="/contact" className="text-sm font-bold uppercase text-black hover:text-[#dd3333]">Tin cổ đông</Link>
              <Link to="/contact" className="text-sm font-bold uppercase text-black hover:text-[#dd3333]">40 năm</Link>
              <Link to="/contact" className="text-sm font-bold uppercase text-black hover:text-[#dd3333]">Liên hệ</Link>

              <button
                onClick={toggleLogin}
                className="text-sm font-bold uppercase text-black hover:text-[#dd3333] ml-95"
              >
                Đăng Nhập
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Overlay + Modal */}
      {showLogin && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center">
    <div
      ref={modalRef}
      className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative transform transition-all duration-300 ease-out animate-modal-show"
    >
      <button
        onClick={() => setShowLogin(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
      >
        &times;
      </button>
      <LoginForm />
    </div>
  </div>
)}
    </>
  );
}

export default Header;
