import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/image/logo-english.jpg";
import {
  login,
  register,
  forgotPassword,
  getCartAPI,
} from "../../api/api.js";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import { Menu, X, ShoppingCart } from "lucide-react";
import MiniCart from "./MiniCart.jsx";
import Notification from "./Notification";


function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const [mode, setMode] = useState("login");
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [cartItems, setCartItems] = useState([]);
  const totalQty = cartItems.length;

  const modalRef = useRef();
  const dropdownRef = useRef();
  const mobileMenuRef = useRef();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const reloadCart = () => {
    if (user && token) {
      getCartAPI(token)
        .then((res) => {
          setCartItems(res.data.cartItems || []);
        })
        .catch((err) => {
          console.error("Lỗi khi lấy giỏ hàng:", err);
        });
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  useEffect(() => {
  if (user && token) {
    reloadCart();
  } else {
    const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
    setCartItems(guestCart);
  }
}, [user, token]);

  useEffect(() => {
  const handleCartUpdate = () => {
    if (user && token) {
      reloadCart();
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
      setCartItems(guestCart);
    }
  };
  window.addEventListener("cartUpdated", handleCartUpdate);
  return () => window.removeEventListener("cartUpdated", handleCartUpdate);
}, [user]);

  const toggleLogin = () => setShowLogin((prev) => !prev);

  const handleLogout = () => {
    const id = toast.loading("Đang đăng xuất...");
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setDropdownOpen(false);
      toast.update(id, {
        render: "Đã đăng xuất thành công.",
        type: "info",
        isLoading: false,
        autoClose: 2000,
      });
      navigate("/home");
    }, 3000);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (mode === "forgotPassword") {
        const id = toast.loading("Đang gửi yêu cầu đặt lại mật khẩu...");
        await forgotPassword({ email: form.email });
        toast.update(id, {
          render: "Link đặt lại mật khẩu đã được gửi qua email.",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        setShowLogin(false);
        setForm({ name: "", email: "", password: "", phone: "", address: "" });
        setMode("login");
        return;
      }

      if (mode === "register") {
        if (form.password.length < 6) {
          toast.error("Mật khẩu phải có ít nhất 6 ký tự");
          return;
        }
        const id = toast.loading("Đang đăng ký...");
        await register(form);
        toast.update(id, {
          render: "Đăng ký thành công. Vui lòng đăng nhập.",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        setMode("login");
        return;
      }

      if (mode === "login") {
        if (form.password.length < 6) {
          toast.error("Mật khẩu phải có ít nhất 6 ký tự");
          return;
        }
        const id = toast.loading("Đang đăng nhập...");
        const res = await login(form);
        localStorage.setItem("token", res.data.token);
        console.log("Login response:", res.data);
        const token = res.data.token;
        if (!token) {
          toast.update(id, {
            render: "Đăng nhập thất bại: Không nhận được token.",
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
          return;
        }

        const decoded = jwtDecode(token);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(decoded));
        setUser(decoded);
        setShowLogin(false);

        toast.update(id, {
          render: "Đăng nhập thành công!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        setTimeout(() => navigate("/home"), 3000);
      }

      setForm({ name: "", email: "", password: "", phone: "", address: "" });
    } catch (err) {
      toast.dismiss();
      const message = err.response?.data?.error || "Có lỗi xảy ra.";
      if (message.includes("email") && message.includes("tồn tại")) {
        toast.error("Email này đã có người sử dụng rồi.");
      } else {
        toast.error(message);
      }
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target))
        setShowLogin(false);
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
        setDropdownOpen(false);
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      )
        setMobileMenuOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Kiểm tra vai trò admin từ token
  const isAdmin = user && token ? jwtDecode(token).RoleName === "admin" : false;

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        closeOnClick
        pauseOnHover={false}
        draggable={false}
        transition={Slide}
        style={{ zIndex: 99999 }}
      />

      <header className="w-full bg-gray-300 z-50 shadow-sm sticky top-0">
        <div className="flex items-center justify-between px-0 py-2 max-w-screen-xl mx-auto relative">
          <Link to="/home" className="flex-shrink-0 pl-4">
            <img
              src={logo}
              alt="Cholimex"
              className="h-14 md:h-16 object-contain"
            />
          </Link>

          <div className="md:hidden flex gap-2 items-center pr-4">
            {!user && (
              <button
                onClick={toggleLogin}
                className="text-sm font-medium uppercase text-black hover:text-[#dd3333]"
              >
                Đăng nhập
              </button>
            )}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          <nav
            ref={mobileMenuRef}
            className={`fixed top-0 left-0 w-3/4 sm:w-2/5 h-full bg-white z-50 transform transition-transform duration-300 p-6 flex flex-col items-center gap-4 md:static md:w-auto md:h-auto md:flex-row md:bg-transparent md:p-0 md:gap-4 md:translate-x-0 ${
              mobileMenuOpen
                ? "translate-x-0"
                : "-translate-x-full md:translate-x-0 hidden md:flex"
            }`}
          >
            {[
              { path: "/home", label: "Trang chủ" },
              { path: "/about", label: "Giới thiệu" },
              { path: "/categories", label: "Sản phẩm" },
              { path: "/contact", label: "Thư viện ẩm thực" },
              { path: "/contactv", label: "40 năm" },
              ...(isAdmin ? [{ path: "/admin", label: "Admin Panel" }] : []),
            ].map(({ path, label }, idx) => (
              <Link
                key={idx}
                to={path}
                className="text-sm font-medium uppercase text-black text-center w-full md:w-auto transition hover:text-[#dd3333] hover:bg-red-100 md:hover:bg-transparent px-3 py-2 rounded"
              >
                {label}
              </Link>
            ))}

            {user && (
              <div className="block md:hidden mt-4 space-y-1 w-full">
                <button
                  onClick={() => navigate("/profile")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Thông tin tài khoản
                </button>
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info("Đang chuyển đến giỏ hàng...");
                    setTimeout(() => navigate("/cart"), 500);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Giỏ hàng
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </nav>

          <div
  className="hidden md:flex items-center gap-4 pr-4"
  ref={dropdownRef}
>
  <div
    className="relative"
    onMouseEnter={() => setShowMiniCart(true)}
    onMouseLeave={() => setShowMiniCart(false)}
  >
    {showMiniCart && (
      <div
        className="absolute right-0 top-full z-50 mt-2 w-[300px]"
        onMouseEnter={() => setShowMiniCart(true)}
        onMouseLeave={() => setShowMiniCart(false)}
      >
        <MiniCart />
      </div>
    )}
  </div>

  {/* ✅ Luôn hiển thị icon giỏ hàng, kể cả khi chưa đăng nhập */}
  <Link
    to="#"
    onClick={(e) => {
      e.preventDefault();
      setTimeout(() => navigate("/cart"), 100);
    }}
    className="relative text-black hover:text-[#dd3333]"
  >
    <ShoppingCart size={28} />
    {totalQty > 0 && (
      <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        {totalQty}
      </span>
    )}
  </Link>

  {/* Nếu chưa login thì nút đăng nhập */}
  {!user ? (
    <button
      onClick={toggleLogin}
      className="text-sm font-medium uppercase text-black hover:text-[#dd3333]"
    >
      Đăng nhập
    </button>
  ) : (
    <div className="flex items-center gap-4">
      <div className="relative cursor-pointer -translate-x-2 ml-3">
        <Notification />
      </div>

      {/* Dropdown user như cũ */}
      <div
        className="cursor-pointer select-none"
        onClick={() => setDropdownOpen(!isDropdownOpen)}
      >
        <div className="flex items-center gap-1 text-sm font-medium uppercase text-black hover:text-[#dd3333] whitespace-nowrap">
          <span role="img" aria-label="user">
            👤
          </span>
          <span>
            Xin chào,{" "}
            {user?.FullName?.split(" ").slice(-1)[0] ||
              user?.email?.split("@")[0] ||
              "User"}
          </span>
        </div>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
            <button
              onClick={() => navigate("/profile")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Thông tin tài khoản
            </button>
            <button
              onClick={() => navigate("/order")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Lịch sử mua hàng
            </button>
            <button
              onClick={() => navigate("/voucher")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Voucher
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </div>
  )}
</div>
        </div>
      </header>
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative"
          >
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">
              {mode === "login"
                ? "Đăng nhập"
                : mode === "register"
                ? "Đăng ký tài khoản"
                : "Quên mật khẩu"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <>
                  <input
                    name="name"
                    placeholder="Họ tên"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                  <input
                    name="phone"
                    placeholder="Số điện thoại"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                  <input
                    name="address"
                    placeholder="Địa chỉ"
                    value={form.address}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                </>
              )}
              {mode !== "forgotPassword" && (
                <>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Mật khẩu"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                </>
              )}
              {mode === "forgotPassword" && (
                <input
                  type="email"
                  name="email"
                  placeholder="Nhập email của bạn"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              )}
              <button
                type="submit"
                className="w-full bg-[#dd3333] text-white font-bold py-2 rounded hover:bg-red-600 transition"
              >
                {mode === "login"
                  ? "Đăng nhập"
                  : mode === "register"
                  ? "Đăng ký"
                  : "Gửi link đặt lại"}
              </button>
            </form>
            <div className="text-center mt-4 text-sm">
              {mode === "login" ? (
                <>
                  <p>
                    Chưa có tài khoản?{" "}
                    <button
                      onClick={() => setMode("register")}
                      className="text-[#dd3333] font-semibold hover:underline"
                    >
                      Đăng ký
                    </button>
                  </p>
                  <p className="mt-2">
                    Quên mật khẩu?{" "}
                    <button
                      onClick={() => setMode("forgotPassword")}
                      className="text-[#dd3333] font-semibold hover:underline"
                    >
                      Đặt lại mật khẩu
                    </button>
                  </p>
                </>
              ) : mode === "register" ? (
                <p>
                  Đã có tài khoản?{" "}
                  <button
                    onClick={() => setMode("login")}
                    className="text-[#dd3333] font-semibold hover:underline"
                  >
                    Đăng nhập
                  </button>
                </p>
              ) : (
                <p>
                  Quay lại{" "}
                  <button
                    onClick={() => setMode("login")}
                    className="text-[#dd3333] font-semibold hover:underline"
                  >
                    Đăng nhập
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;