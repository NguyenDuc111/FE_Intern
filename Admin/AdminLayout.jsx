import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminName, setAdminName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuthenticated(false);
      if (location.pathname !== "/admin/login") {
        navigate("/admin/login");
      }
      setIsCheckingAuth(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.RoleName !== "admin") {
        localStorage.removeItem("token");
        toast.error("Bạn không có quyền truy cập trang admin.");
        navigate("/admin/login");
        setIsAuthenticated(false);
      } else {
        setAdminName(decoded.FullName || "Admin");
        setIsAuthenticated(true);
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      localStorage.removeItem("token");
      toast.error("Token không hợp lệ.");
      navigate("/admin/login");
      setIsAuthenticated(false);
    } finally {
      setIsCheckingAuth(false);
    }
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.info("Đã đăng xuất.");
    navigate("/admin/login");
    setTimeout(() => window.location.reload(), 100);
  };

  // Chờ xác thực xong
  if (isCheckingAuth) return null;

  // Cho phép truy cập trang login nếu chưa đăng nhập
  if (!isAuthenticated && location.pathname === "/admin/login") {
    return <Outlet />;
  }

  // Chặn truy cập các route admin khác nếu chưa xác thực
  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-[#f9f9f9]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#dd3333] text-white flex flex-col">
        <div className="p-4 text-2xl font-bold tracking-wide">
          Cholimex Admin
        </div>
        <nav className="flex flex-col gap-2 p-4 text-lg">
          <NavLink to="/admin/dashboard" className={navLinkClass}>
            Tổng Quan
          </NavLink>
          <NavLink to="/admin/products" className={navLinkClass}>
            Sản Phẩm
          </NavLink>
          <NavLink to="/admin/categories" className={navLinkClass}>
            Danh Mục
          </NavLink>
          <NavLink to="/admin/orders" className={navLinkClass}>
            Đơn Hàng
          </NavLink>
          <NavLink to="/admin/loyalty" className={navLinkClass}>
            Tích Lũy
          </NavLink>
          <NavLink to="/admin/users" className={navLinkClass}>
            Người Dùng
          </NavLink>
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="h-16 bg-white shadow-md px-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-[#dd3333]">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Xin chào, {adminName}</span>
            <button
              onClick={handleLogout}
              className="text-[#dd3333] font-semibold hover:underline"
            >
              Đăng xuất
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const navLinkClass = ({ isActive }) =>
  isActive
    ? "bg-white text-[#dd3333] font-semibold px-3 py-2 rounded-lg"
    : "px-3 py-2 rounded-lg hover:bg-white hover:text-[#dd3333]";
