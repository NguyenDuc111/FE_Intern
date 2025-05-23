import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

const API = axios.create({
  baseURL: "http://tmdt1.cholimexfood.com.vn/api/",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ CategoryName: "" });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Lỗi tải danh mục:", err);
      toast.error("Không thể tải danh mục!");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        await API.put(`/cate-update/${editingId}`, form);
        toast.success("Cập nhật thành công!");
      } else {
        await API.post("/cate-add", form);
        toast.success("Thêm thành công!");
      }
      fetchCategories();
      closeModal();
    } catch (err) {
      console.error("Lỗi:", err);
      setError(err.response?.data?.error || "Có lỗi xảy ra!");
      toast.error(err.response?.data?.error || "Thao tác thất bại!");
    }
  };

  const handleEdit = (cat) => {
    setForm({ CategoryName: cat.CategoryName });
    setEditingId(cat.CategoryID);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Xóa danh mục này?")) {
      try {
        await API.delete(`/cate-del/${id}`);
        fetchCategories();
        toast.success("Xóa thành công!");
      } catch (err) {
        console.error("Lỗi xóa:", err);
        toast.error("Không thể xóa danh mục!");
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({ CategoryName: "" });
    setError("");
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
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-red-600">Quản lý Danh mục</h1>

      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={() => setShowModal(true)}
        className="flex items-center bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded mb-6 shadow-md hover:shadow-lg transition-all duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Thêm danh mục
      </motion.button>

      <motion.div
        variants={tableVariants}
        initial="hidden"
        animate="visible"
        className="overflow-x-auto shadow-xl rounded-xl bg-white border border-gray-200"
      >
        <table className="min-w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-semibold">ID</th>
              <th className="px-6 py-4 font-semibold">Tên danh mục</th>
              <th className="px-6 py-4 font-semibold text-center">Edit</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <motion.tr
                key={cat.CategoryID}
                variants={rowVariants}
                className="bg-white border-b hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-200"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {cat.CategoryID}
                </td>
                <td className="px-6 py-4">{cat.CategoryName}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-3">
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => handleEdit(cat)}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-1.5 rounded-lg transition-colors duration-200 flex items-center gap-1.5 shadow-sm"
                    >
                      <PencilIcon className="h-5 w-5" />
                      Sửa
                    </motion.button>
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => handleDelete(cat.CategoryID)}
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

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 backdrop-blur-md bg-black/60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-2xl w-[400px] p-6 shadow-2xl border border-gray-200 relative flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                {editingId ? "Sửa danh mục" : "Thêm danh mục"}
              </h2>
              <form onSubmit={handleSubmit}>
                <label className="block mb-2 font-medium text-gray-700">
                  Tên danh mục:
                </label>
                <input
                  type="text"
                  value={form.CategoryName}
                  onChange={(e) => setForm({ CategoryName: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md bg-gray-50"
                  required
                />
                {error && <p className="text-red-600 mb-3 mt-2">{error}</p>}
                <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={closeModal}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
