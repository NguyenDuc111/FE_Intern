import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { AnimatePresence, motion } from "framer-motion";
import {
  HomeIcon,
  CubeIcon,
  TagIcon,
  ShoppingCartIcon,
  StarIcon,
  UserGroupIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ChatBubbleLeftIcon,
  GiftIcon,
  TicketIcon,
  BellIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon, // Thêm icon hamburger menu
} from "@heroicons/react/24/solid";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [FullName, setAdminName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [toast, setToast] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const savedState = localStorage.getItem("sidebarOpen");
    return savedState !== null ? JSON.parse(savedState) : true;
  });

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

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
        setToast({
          type: "error",
          message: "Bạn không có quyền truy cập trang admin.",
        });
        navigate("/admin/login");
        setIsAuthenticated(false);
      } else {
        setAdminName(decoded.FullName || "Admin");
        setIsAuthenticated(true);
      }
    } catch (err) {
      localStorage.removeItem("token");
      setToast({ type: "error", message: "Token không hợp lệ." });
      navigate("/admin/login");
      setIsAuthenticated(false);
    } finally {
      setIsCheckingAuth(false);
    }
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("sidebarOpen");
    setToast({ type: "info", message: "Đã đăng xuất." });
    navigate("/admin/login");
    setTimeout(() => window.location.reload(), 100);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (isCheckingAuth) return null;

  if (!isAuthenticated && location.pathname === "/admin/login") {
    return <Outlet />;
  }

  if (!isAuthenticated) return null;

  const sidebarVariants = {
    hidden: { width: 0, opacity: 0, transition: { duration: 0.3 } },
    visible: { width: 256, opacity: 1, transition: { duration: 0.3 } },
    mobileVisible: { width: "100%", opacity: 1, transition: { duration: 0.3 } },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const toastVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 50, transition: { duration: 0.3 } },
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50">
      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial={{ width: 0 }}
        animate={
          isSidebarOpen
            ? window.innerWidth < 768
              ? "mobileVisible"
              : "visible"
            : "hidden"
        }
        className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 text-white flex flex-col shadow-xl overflow-hidden fixed top-0 left-0 h-full z-50 md:static md:z-0"
      >
        <div className="flex items-center justify-between p-4 sm:p-6 text-center">
          <NavLink
            to="/admin/dashboard"
            onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}
          >
            <div className="text-xl sm:text-2xl font-bold bg-white bg-clip-text text-transparent tracking-wide">
              CHOLIMEX ADMIN
            </div>
          </NavLink>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white hover:text-gray-200"
          >
            {isSidebarOpen ? (
              <ChevronLeftIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            ) : (
              <ChevronRightIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            )}
          </motion.button>
        </div>
        <nav className="flex flex-col gap-2 p-4 sm:p-6 text-base sm:text-lg flex-1 overflow-y-auto">
          {[
            { to: "/admin/dashboard", icon: HomeIcon, label: "Tổng Quan" },
            { to: "/admin/products", icon: CubeIcon, label: "Sản Phẩm" },
            { to: "/admin/categories", icon: TagIcon, label: "Danh Mục" },
            { to: "/admin/orders", icon: ShoppingCartIcon, label: "Đơn Hàng" },
            { to: "/admin/loyalty", icon: StarIcon, label: "Tích Lũy" },
            { to: "/admin/users", icon: UserGroupIcon, label: "Người Dùng" },
            {
              to: "/admin/quan-ly-binh-luan",
              icon: ChatBubbleLeftIcon,
              label: "Bình Luận",
            },
            { to: "/admin/khuyen-mai", icon: GiftIcon, label: "Khuyến Mãi" },
            {
              to: "/admin/quan-ly-voucher",
              icon: TicketIcon,
              label: "Voucher",
            },
            {
              to: "/admin/quan-ly-thong-bao",
              icon: BellIcon,
              label: "Thông Báo",
            },
            { to: "/home", icon: HomeIcon, label: "Về Trang Chủ User" },
          ].map((item, index) => (
            <motion.div key={index} whileHover="hover" whileTap="tap">
              <NavLink
                to={item.to}
                onClick={() =>
                  window.innerWidth < 768 && setIsSidebarOpen(false)
                }
                className={({ isActive }) =>
                  isActive
                    ? "bg-white text-red-600 font-semibold px-3 sm:px-4 py-1 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 shadow-md"
                    : "px-3 sm:px-4 py-1 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 hover:bg-white hover:text-red-600 transition-colors duration-200"
                }
              >
                <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                {item.label}
              </NavLink>
            </motion.div>
          ))}
        </nav>
      </motion.aside>

      {/* Overlay khi sidebar mở trên mobile */}
      {isSidebarOpen && window.innerWidth < 768 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black z-40 md:hidden"
        />
      )}

      {/* Content */}
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 flex flex-col"
      >
        {/* Navbar */}
        <header className="h-14 sm:h-16 bg-gradient-to-r from-gray-100 to-blue-50 shadow-md px-3 sm:px-6 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-1 sm:gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-600 hover:text-red-600 md:hidden"
            >
              <Bars3Icon className="h-5 w-5" />
            </motion.button>
            <h1 className="text-lg sm:text-2xl font-semibold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              ADMIN PANEL
            </h1>
            <span className="text-lg sm:text-2xl font-semibold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent tracking-widest">
              CHOLIMEX-FOOD
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-4">
            <div className="flex items-center gap-1 sm:gap-2">
              <UserCircleIcon className="h-6 sm:h-8 w-6 sm:w-8 text-gray-600" />
              <span className="text-gray-700 font-medium text-sm sm:text-base">
                Xin chào, {FullName}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg shadow-md transition-all duration-200 flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              Đăng xuất
            </motion.button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-3 sm:p-6 overflow-auto flex-1 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 1 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>

      {/* Toast Notification */}
      {toast && (
        <motion.div
          variants={toastVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`fixed top-14 sm:top-16 right-2 sm:right-4 px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-xl text-white text-sm sm:text-base ${
            toast.type === "success"
              ? "bg-gradient-to-r from-green-500 to-green-600"
              : toast.type === "info"
              ? "bg-gradient-to-r from-blue-500 to-blue-600"
              : "bg-gradient-to-r from-red-500 to-red-600"
          }`}
        >
          {toast.message}
        </motion.div>
      )}
    </div>
  );
}
