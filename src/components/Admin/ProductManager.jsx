import { useEffect, useState } from "react";
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllCategories,
} from "../../api/api";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

export default function ProductPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({
    ProductName: "",
    Price: "",
    Description: "",
    StockQuantity: "",
    ImageURL: "",
    Ingredients: "",
  });
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  // Fetch data khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          getAllCategories(),
          getAllProducts(),
        ]);
        setCategories(categoriesRes.data);
        setProducts(productsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      }
    };
    fetchData();
  }, []);

  // Xử lý toast tự động ẩn sau 3 giây
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const closeModal = () => {
    setShowModal(false);
    setEditProduct(null);
    setFormData({
      ProductName: "",
      Price: "",
      Description: "",
      StockQuantity: "",
      ImageURL: "",
      Ingredients: "",
    });
    setSelectedCategoryIds([]);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (selectedCategoryIds.length === 0) {
      setError("Vui lòng chọn ít nhất một danh mục");
      return;
    }

    try {
      const payload = {
        ...formData,
        Price: Number(formData.Price),
        StockQuantity: Number(formData.StockQuantity),
        CategoryIDs: selectedCategoryIds,
      };

      if (editProduct) {
        await updateProduct(editProduct.ProductID, payload);
        setToast({ type: "success", message: "Cập nhật sản phẩm thành công!" });
      } else {
        await addProduct(payload);
        setToast({ type: "success", message: "Thêm sản phẩm thành công!" });
      }

      // Refresh data
      const productsRes = await getAllProducts();
      setProducts(productsRes.data);
      closeModal();
    } catch (err) {
      console.error("Error submitting product:", err);
      setError(err.response?.data?.error || "Có lỗi xảy ra khi lưu sản phẩm");
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setFormData({
      ProductName: product.ProductName || "",
      Price: product.Price || "",
      Description: product.Description || "",
      StockQuantity: product.StockQuantity || "",
      ImageURL: product.ImageURL || "",
      Ingredients: product.Ingredients || "",
    });
    setSelectedCategoryIds(
      product.Categories ? product.Categories.map((cat) => cat.CategoryID) : []
    );
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      try {
        await deleteProduct(id);
        setToast({ type: "success", message: "Xóa sản phẩm thành công!" });
        const productsRes = await getAllProducts();
        setProducts(productsRes.data);
      } catch (err) {
        console.error("Error deleting product:", err);
        setError("Không thể xóa sản phẩm. Vui lòng thử lại.");
      }
    }
  };

  const handleCategoryChange = (e) => {
    const options = e.target.options;
    const selectedIds = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedIds.push(Number(options[i].value));
      }
    }
    setSelectedCategoryIds(selectedIds);
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

  return (
    <div className="p-6 bg-gradient-to-b from-gray-250 to-gray-300 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
        📦 Quản lý Sản phẩm
      </h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 shadow-md">
          {error}
        </div>
      )}

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

      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-lg mb-6 transition-colors duration-200 flex items-center gap-2 shadow-md"
        onClick={() => {
          setShowModal(true);
          setEditProduct(null);
          setFormData({
            ProductName: "",
            Price: "",
            Description: "",
            StockQuantity: "",
            ImageURL: "",
            Ingredients: "",
          });
          setSelectedCategoryIds([]);
        }}
      >
        <PlusIcon className="h-5 w-5" />
        Thêm sản phẩm
      </motion.button>

      <motion.div
        variants={tableVariants}
        initial="hidden"
        animate="visible"
        className="overflow-x-auto shadow-xl rounded-xl bg-white border border-gray-200"
      >
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold">
                ID
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Hình ảnh
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Tên
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Giá
              </th>
              <th scope="col" className="px-6 py-4 font-semibold text-center">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <motion.tr
                key={p.ProductID}
                variants={rowVariants}
                className="bg-white border-b hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-200"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {p.ProductID}
                </td>
                <td className="px-6 py-4">
                  {p.ImageURL ? (
                    <img
                      src={p.ImageURL}
                      alt={p.ProductName}
                      className="w-14 h-14 object-cover rounded-lg shadow-sm hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <span className="text-gray-500">N/A</span>
                  )}
                </td>
                <td className="px-6 py-4 font-medium">{p.ProductName}</td>
                <td className="px-6 py-4">
                  {Number(p.Price).toLocaleString("vi-VN")}₫
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-3">
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => handleEdit(p)}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-1.5 rounded-lg transition-colors duration-200 flex items-center gap-1.5 shadow-sm"
                    >
                      <PencilIcon className="h-5 w-5" />
                      Sửa
                    </motion.button>
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => handleDelete(p.ProductID)}
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

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 backdrop-blur-md bg-black/60 flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl w-[900px] max-w-[95vw] h-[85vh] max-h-[95vh] relative flex flex-col shadow-2xl border border-gray-200"
          >
            {/* Nút đóng (X) */}
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors z-10"
            >
              <XMarkIcon className="h-7 w-7" />
            </motion.button>

            <div className="p-6 flex-1 flex flex-col overflow-hidden">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                {editProduct ? "📝 Sửa sản phẩm" : "➕ Thêm sản phẩm"}
              </h2>

              <form
                onSubmit={handleSubmit}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-8 flex-1 overflow-y-auto pb-6">
                  {/* Cột trái */}
                  <div className="space-y-5">
                    <div>
                      <label className="block mb-1.5 font-medium text-gray-700">
                        Tên sản phẩm <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Nhập tên sản phẩm"
                        value={formData.ProductName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            ProductName: e.target.value,
                          })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md bg-gray-50"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-1.5 font-medium text-gray-700">
                        Giá <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="Nhập giá"
                        value={formData.Price}
                        onChange={(e) =>
                          setFormData({ ...formData, Price: e.target.value })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md bg-gray-50"
                        required
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block mb-1.5 font-medium text-gray-700">
                        Mô tả
                      </label>
                      <textarea
                        placeholder="Nhập mô tả"
                        value={formData.Description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            Description: e.target.value,
                          })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md bg-gray-50"
                        rows="5"
                      />
                    </div>
                  </div>

                  {/* Cột phải */}
                  <div className="space-y-5">
                    <div>
                      <label className="block mb-1.5 font-medium text-gray-700">
                        Số lượng trong kho
                      </label>
                      <input
                        type="number"
                        placeholder="Nhập số lượng"
                        value={formData.StockQuantity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            StockQuantity: e.target.value,
                          })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md bg-gray-50"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block mb-1.5 font-medium text-gray-700">
                        URL hình ảnh
                      </label>
                      <input
                        type="text"
                        placeholder="Nhập URL hình ảnh"
                        value={formData.ImageURL}
                        onChange={(e) =>
                          setFormData({ ...formData, ImageURL: e.target.value })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block mb-1.5 font-medium text-gray-700">
                        Thành phần
                      </label>
                      <textarea
                        placeholder="Nhập thành phần"
                        value={formData.Ingredients}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            Ingredients: e.target.value,
                          })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md bg-gray-50"
                        rows="5"
                      />
                    </div>

                    <div>
                      <label className="block mb-1.5 font-medium text-gray-700">
                        Danh mục <span className="text-red-500">*</span>
                      </label>
                      <select
                        multiple
                        value={selectedCategoryIds}
                        onChange={handleCategoryChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md bg-gray-50"
                        required
                        size="5"
                      >
                        {categories.map((cat) => (
                          <option key={cat.CategoryID} value={cat.CategoryID}>
                            {cat.CategoryName}
                          </option>
                        ))}
                      </select>
                      <p className="text-sm text-gray-500 mt-1.5">
                        Giữ phím Ctrl/Cmd để chọn nhiều danh mục
                      </p>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md">
                    {error}
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    type="button"
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
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
