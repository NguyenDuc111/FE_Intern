import React, { useEffect, useState, useRef } from "react";
import {
  getAllNotifications,
  createNotification,
  deleteNotification,
} from "../../api/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";

export default function NotificationManager() {
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState({ Title: "", Message: "" });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const notificationsPerPage = 10;

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await getAllNotifications(token);
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.Title.trim() || !formData.Message.trim()) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await createNotification(formData, token);
      setToast({ type: "success", message: "Thêm thông báo thành công!" });
      setFormData({ Title: "", Message: "" });
      setShowModal(false);
      fetchNotifications();
    } catch (err) {
      console.error("Error adding notification:", err);
      setError(err.response?.data?.error || "Có lỗi xảy ra khi thêm thông báo");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc muốn xóa thông báo này?")) {
      try {
        const token = localStorage.getItem("token");
        await deleteNotification(id, token);
        setToast({ type: "success", message: "Xóa thông báo thành công!" });
        fetchNotifications();
      } catch (err) {
        console.error("Error deleting notification:", err);
        setError("Không thể xóa thông báo. Vui lòng thử lại.");
      }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const filteredNotifications = notifications.filter(
    (n) =>
      n.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.Message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastNotification = currentPage * notificationsPerPage;
  const indexOfFirstNotification =
    indexOfLastNotification - notificationsPerPage;
  const currentNotifications = filteredNotifications.slice(
    indexOfFirstNotification,
    indexOfLastNotification
  );
  const totalPages = Math.ceil(
    filteredNotifications.length / notificationsPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-red-600">
        🔔 Quản lý Thông báo
      </h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 shadow-md">
          {error}
        </div>
      )}

      {toast && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          className={`fixed top-16 right-4 px-6 py-3 rounded-lg shadow-xl text-white ${
            toast.type === "success"
              ? "bg-gradient-to-r from-green-500 to-green-600"
              : "bg-gradient-to-r from-red-500 to-red-600"
          }`}
        >
          {toast.message}
        </motion.div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-md w-full sm:w-auto"
          onClick={() => setShowModal(true)}
        >
          <PlusIcon className="h-5 w-5" /> Thêm thông báo
        </motion.button>

        <motion.div
          className="relative w-full sm:max-w-[400px]"
          initial={{ width: "200px" }}
          animate={{ width: isFocused || searchTerm ? "100%" : "200px" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              if (!searchTerm) setIsFocused(false);
            }}
            placeholder="Tìm kiếm theo tiêu đề hoặc nội dung..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md bg-gray-50"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </motion.div>
      </div>

      <motion.div
        variants={tableVariants}
        initial="hidden"
        animate="visible"
        className="overflow-x-auto shadow-xl rounded-xl bg-white border border-gray-200"
      >
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-4 font-semibold">STT</th>
              <th className="px-6 py-4 font-semibold">Tiêu đề</th>
              <th className="px-6 py-4 font-semibold">Nội dung</th>
              <th className="px-6 py-4 font-semibold text-center"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center">
                  Đang tải...
                </td>
              </tr>
            ) : currentNotifications.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center">
                  Không có thông báo nào.
                </td>
              </tr>
            ) : (
              currentNotifications.map((n, index) => (
                <motion.tr
                  key={n.NotificationID}
                  variants={rowVariants}
                  className="bg-white border-b hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-200"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {indexOfFirstNotification + index + 1}
                  </td>
                  <td className="px-6 py-4 font-medium">{n.Title}</td>
                  <td className="px-6 py-4">{n.Message}</td>
                  <td className="px-6 py-4 text-center">
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => handleDelete(n.NotificationID)}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-1.5 rounded-lg transition-colors duration-200 flex items-center gap-1.5 shadow-sm"
                    >
                      <TrashIcon className="h-5 w-5" /> Xóa
                    </motion.button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-4">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 rounded-lg transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trước
          </motion.button>
          <span className="text-gray-700">
            Trang {currentPage} / {totalPages}
          </span>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 rounded-lg transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sau
          </motion.button>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <div
            className="fixed inset-0 backdrop-blur-md bg-black/60 flex items-center justify-center z-50"
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="bg-white rounded-2xl w-[500px] max-w-[95vw] h-auto max-h-[95vh] relative flex flex-col shadow-2xl border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 flex-1 flex flex-col overflow-hidden">
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  ➕ Thêm Thông Báo
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block mb-1.5 font-medium text-gray-700">
                      Tiêu đề <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Nhập tiêu đề"
                      value={formData.Title}
                      onChange={(e) =>
                        setFormData({ ...formData, Title: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md bg-gray-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 font-medium text-gray-700">
                      Nội dung <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      placeholder="Nhập nội dung"
                      value={formData.Message}
                      onChange={(e) =>
                        setFormData({ ...formData, Message: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md bg-gray-50"
                      rows={3}
                      required
                    />
                  </div>
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-5 py-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 rounded-lg transition-colors duration-200 shadow-md"
                    >
                      Hủy
                    </motion.button>
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      type="submit"
                      className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-colors duration-200 shadow-md"
                    >
                      Lưu
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
