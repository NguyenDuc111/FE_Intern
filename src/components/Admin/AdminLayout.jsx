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
} from "@heroicons/react/24/solid";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [FullName, setAdminName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [toast, setToast] = useState(null);
  // Khởi tạo trạng thái sidebar từ localStorage (mặc định là true nếu không có giá trị)
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const savedState = localStorage.getItem("sidebarOpen");
    return savedState !== null ? JSON.parse(savedState) : true;
  });

  // Lưu trạng thái sidebar vào localStorage mỗi khi thay đổi
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
      // eslint-disable-next-line no-unused-vars
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
    localStorage.removeItem("sidebarOpen"); // Xóa trạng thái sidebar khi đăng xuất
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
        initial="visible"
        animate={isSidebarOpen ? "visible" : "hidden"}
        className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 text-white flex flex-col shadow-xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 text-center">
          <NavLink to="/admin/dashboard">
            <div className="text-2xl font-bold bg-white bg-clip-text text-transparent tracking-wide">
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
              <ChevronLeftIcon className="h-6 w-6" />
            ) : (
              <ChevronRightIcon className="h-6 w-6" />
            )}
          </motion.button>
        </div>
        <nav className="flex flex-col gap-2 p-6 text-lg flex-1">
          <motion.div whileHover="hover" whileTap="tap">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "bg-white text-red-600 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"
                  : "px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white hover:text-red-600 transition-colors duration-200"
              }
            >
              <HomeIcon className="h-5 w-5" />
              Tổng Quan
            </NavLink>
          </motion.div>
          <motion.div whileHover="hover" whileTap="tap">
            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                isActive
                  ? "bg-white text-red-600 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"
                  : "px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white hover:text-red-600 transition-colors duration-200"
              }
            >
              <CubeIcon className="h-5 w-5" />
              Sản Phẩm
            </NavLink>
          </motion.div>
          <motion.div whileHover="hover" whileTap="tap">
            <NavLink
              to="/admin/categories"
              className={({ isActive }) =>
                isActive
                  ? "bg-white text-red-600 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"
                  : "px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white hover:text-red-600 transition-colors duration-200"
              }
            >
              <TagIcon className="h-5 w-5" />
              Danh Mục
            </NavLink>
          </motion.div>
          <motion.div whileHover="hover" whileTap="tap">
            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                isActive
                  ? "bg-white text-red-600 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"
                  : "px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white hover:text-red-600 transition-colors duration-200"
              }
            >
              <ShoppingCartIcon className="h-5 w-5" />
              Đơn Hàng
            </NavLink>
          </motion.div>
          <motion.div whileHover="hover" whileTap="tap">
            <NavLink
              to="/admin/loyalty"
              className={({ isActive }) =>
                isActive
                  ? "bg-white text-red-600 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"
                  : "px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white hover:text-red-600 transition-colors duration-200"
              }
            >
              <StarIcon className="h-5 w-5" />
              Tích Lũy
            </NavLink>
          </motion.div>
          <motion.div whileHover="hover" whileTap="tap">
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                isActive
                  ? "bg-white text-red-600 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"
                  : "px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white hover:text-red-600 transition-colors duration-200"
              }
            >
              <UserGroupIcon className="h-5 w-5" />
              Người Dùng
            </NavLink>
          </motion.div>
          <motion.div whileHover="hover" whileTap="tap">
            <NavLink
              to="/admin/quan-ly-binh-luan"
              className={({ isActive }) =>
                isActive
                  ? "bg-white text-red-600 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"
                  : "px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white hover:text-red-600 transition-colors duration-200"
              }
            >
              <ChatBubbleLeftIcon className="h-5 w-5" />
              Bình Luận
            </NavLink>
          </motion.div>
          <motion.div whileHover="hover" whileTap="tap">
            <NavLink
              to="/admin/khuyen-mai"
              className={({ isActive }) =>
                isActive
                  ? "bg-white text-red-600 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"
                  : "px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white hover:text-red-600 transition-colors duration-200"
              }
            >
              <GiftIcon className="h-5 w-5" />
              Khuyến Mãi
            </NavLink>
          </motion.div>
          <motion.div whileHover="hover" whileTap="tap">
            <NavLink
              to="/admin/quan-ly-voucher"
              className={({ isActive }) =>
                isActive
                  ? "bg-white text-red-600 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"
                  : "px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white hover:text-red-600 transition-colors duration-200"
              }
            >
              <TicketIcon className="h-5 w-5" />
              Voucher
            </NavLink>
          </motion.div>
          <motion.div whileHover="hover" whileTap="tap">
            <NavLink
              to="/admin/quan-ly-thong-bao"
              className={({ isActive }) =>
                isActive
                  ? "bg-white text-red-600 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"
                  : "px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white hover:text-red-600 transition-colors duration-200"
              }
            >
              <BellIcon className="h-5 w-5" />
              Thông Báo
            </NavLink>
          </motion.div>
          <motion.div whileHover="hover" whileTap="tap">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                isActive
                  ? "bg-white text-red-600 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"
                  : "px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white hover:text-red-600 transition-colors duration-200"
              }
            >
              <HomeIcon className="h-5 w-5" />
              Về Trang Chủ User
            </NavLink>
          </motion.div>
        </nav>
      </motion.aside>

      {/* Content */}
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 flex flex-col"
      >
        {/* Navbar */}
        <header className="h-16 bg-gradient-to-r from-gray-100 to-blue-50 shadow-md px-6 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSidebarOpen(true)}
                className="text-gray-600 hover:text-red-600"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </motion.button>
            )}
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              ADMIN PANEL
            </h1>
            <span className="text-2xl font-semibold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent tracking-widest  ">
              CHOLIMEX-FOOD
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <UserCircleIcon className="h-8 w-8 text-gray-600" />
              <span className="text-gray-700 font-medium">
                Xin chào, {FullName}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200 flex items-center gap-2"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              Đăng xuất
            </motion.button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 overflow-auto flex-1 relative">
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
          className={`fixed top-16 right-4 px-6 py-3 rounded-lg shadow-xl text-white ${
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
