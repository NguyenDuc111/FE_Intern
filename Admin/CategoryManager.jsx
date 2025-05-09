import { useEffect, useState } from "react";
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/",
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
  const [toast, setToast] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Lỗi tải danh mục:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        await API.put(`/cate-update/${editingId}`, form);
        setToast({ type: "success", message: "Cập nhật thành công!" });
      } else {
        await API.post("/cate-add", form);
        setToast({ type: "success", message: "Thêm thành công!" });
      }
      fetchCategories();
      closeModal();
    } catch (err) {
      console.error("Lỗi:", err);
      setError(err.response?.data?.error || "Có lỗi xảy ra!");
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
        setToast({ type: "success", message: "Xóa thành công!" });
      } catch (err) {
        console.error("Lỗi xóa:", err);
        setToast({ type: "error", message: "Không thể xóa danh mục!" });
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({ CategoryName: "" });
    setError("");
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-red-600">📁 Quản lý Danh mục</h1>

      {toast && (
        <div
          className={`fixed top-16 right-4 px-4 py-3 rounded shadow text-white ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}

<button
  onClick={() => setShowModal(true)}
  className="flex items-center bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded mb-6"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2" // Thêm margin-right để tạo khoảng cách
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
</button>

      <div className="overflow-x-auto shadow rounded">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Tên danh mục</th>
              <th className="px-6 py-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {categories.map((cat) => (
              <tr key={cat.CategoryID} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{cat.CategoryID}</td>
                <td className="px-6 py-4">{cat.CategoryName}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="text-blue-600 hover:underline mr-4"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(cat.CategoryID)}
                    className="text-red-600 hover:underline"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-white p-6 rounded-lg w-[400px] shadow relative">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Sửa danh mục" : "Thêm danh mục"}
            </h2>
            <form onSubmit={handleSubmit}>
              <label className="block mb-2 font-medium">Tên danh mục:</label>
              <input
                type="text"
                value={form.CategoryName}
                onChange={(e) => setForm({ CategoryName: e.target.value })}
                className="w-full p-2 border rounded mb-3"
                required
              />
              {error && <p className="text-red-600 mb-3">{error}</p>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
