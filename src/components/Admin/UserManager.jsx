import { useEffect, useState } from "react";
import { getAllUsers, deleteUser, updateUserProfile } from "../../api/api";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    Email: "",
    Address: "",
    Phone: "",
    Password: "",
  });
  const [toast, setToast] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch {
      setToast({
        type: "error",
        message: "Không thể tải danh sách người dùng.",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Xử lý toast tự động ẩn sau 3 giây
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      await deleteUser(id);
      setToast({ type: "success", message: "Xóa người dùng thành công." });
      fetchUsers();
    } catch {
      setToast({ type: "error", message: "Lỗi khi xóa người dùng." });
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      Email: user.Email || "",
      Address: user.Address || "",
      Phone: user.Phone || "",
      Password: "",
    });
  };

  const handleSave = async () => {
    try {
      await updateUserProfile(editingUser.UserID, formData);
      setToast({ type: "success", message: "Cập nhật người dùng thành công." });
      setEditingUser(null);
      fetchUsers();
    } catch {
      setToast({
        type: "error",
        message: "Lỗi khi cập nhật thông tin người dùng.",
      });
    }
  };

  // Animation variants
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

  const toastVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 50, transition: { duration: 0.3 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const renderTable = (data, title) => (
    <div className="mb-10">
      <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
        {title}
      </h3>
      <motion.div
        variants={tableVariants}
        initial="hidden"
        animate="visible"
        className="overflow-x-auto shadow-xl rounded-xl bg-white border border-gray-200"
      >
        <table className="min-w-[800px] w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-white uppercase bg-gradient-to-r from-red-500 to-red-600">
            <tr>
              <th className="px-4 py-4 font-semibold">ID</th>
              <th className="px-4 py-4 font-semibold">Họ tên</th>
              <th className="px-4 py-4 font-semibold">Email</th>
              <th className="px-4 py-4 font-semibold">Điện thoại</th>
              <th className="px-4 py-4 font-semibold">Địa chỉ</th>
              <th className="px-4 py-4 font-semibold">Role</th>
              <th className="px-4 py-4 font-semibold text-center"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((u) => (
              <motion.tr
                key={u.UserID}
                variants={rowVariants}
                className="bg-white border-b hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-200"
              >
                <td className="px-4 py-3 font-medium text-gray-900">{u.UserID}</td>
                <td className="px-4 py-3 font-medium">{u.FullName}</td>
                <td className="px-4 py-3">{u.Email}</td>
                <td className="px-4 py-3">{u.Phone}</td>
                <td className="px-4 py-3">{u.Address}</td>
                <td className="px-4 py-3">
                  {u.Role?.RoleName === "admin" ? (
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-red-700 bg-red-200 rounded-full shadow-sm">
                       Admin
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full shadow-sm">
                      User
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-3">
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => handleEditClick(u)}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-1.5 rounded-lg transition-colors duration-200 flex items-center gap-1.5 shadow-sm"
                    >
                      <PencilIcon className="h-5 w-5" />
                      Sửa
                    </motion.button>
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => handleDelete(u.UserID)}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-1.5 rounded-lg transition-colors duration-200 flex items-center gap-1.5 shadow-sm"
                    >
                      <TrashIcon className="h-5 w-5" />
                      Xóa
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );

  // Sắp xếp để admin lên đầu
  const sortedUsers = [...users].sort((a, b) => {
    if (a.Role?.RoleName === "admin" && b.Role?.RoleName !== "admin") return -1;
    if (a.Role?.RoleName !== "admin" && b.Role?.RoleName === "admin") return 1;
    return 0;
  });

  return (
    <div className="p-6 bg-gradient-to-b from-gray-250 to-gray-300 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-red-600">
        👥 Quản lý Người dùng & Quản trị viên
      </h2>

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
              : "bg-gradient-to-r from-red-500 to-red-600"
          }`}
        >
          {toast.message}
        </motion.div>
      )}

      {renderTable(sortedUsers, "👥 Danh sách tài khoản")}

      {editingUser && (
        <div
          className="fixed inset-0 backdrop-blur-md bg-black/60 flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && setEditingUser(null)}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl w-[450px] max-w-[90vw] p-6 shadow-2xl border border-gray-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Chỉnh sửa người dùng
              </h3>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setEditingUser(null)}
                className="text-gray-500 hover:text-gray-800 transition-colors"
              >
                <XMarkIcon className="h-7 w-7" />
              </motion.button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block mb-1.5 font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="text"
                  placeholder="Nhập email"
                  value={formData.Email}
                  onChange={(e) =>
                    setFormData({ ...formData, Email: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md bg-gray-50"
                />
              </div>
              <div>
                <label className="block mb-1.5 font-medium text-gray-700">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  placeholder="Nhập số điện thoại"
                  value={formData.Phone}
                  onChange={(e) =>
                    setFormData({ ...formData, Phone: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md bg-gray-50"
                />
              </div>
              <div>
                <label className="block mb-1.5 font-medium text-gray-700">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  placeholder="Nhập địa chỉ"
                  value={formData.Address}
                  onChange={(e) =>
                    setFormData({ ...formData, Address: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md bg-gray-50"
                />
              </div>
              <div>
                <label className="block mb-1.5 font-medium text-gray-700">
                  Mật khẩu mới (bỏ trống nếu không đổi)
                </label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu mới"
                  value={formData.Password}
                  onChange={(e) =>
                    setFormData({ ...formData, Password: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md bg-gray-50"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setEditingUser(null)}
                className="px-5 py-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 rounded-lg transition-colors duration-200 shadow-md"
              >
                Hủy
              </motion.button>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={handleSave}
                className="px-5 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-colors duration-200 shadow-md"
              >
                Lưu
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserManager;
