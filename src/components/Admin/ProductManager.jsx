import { useEffect, useState } from "react";
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllCategories,
} from "../../api/api";

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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-red-600">Quản lý Sản phẩm</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-16 right-4 px-4 py-5 rounded shadow-lg text-white ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      <button
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg mb-6 transition-colors duration-200 flex items-center gap-2"
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Thêm sản phẩm
      </button>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Hình ảnh
              </th>
              <th scope="col" className="px-6 py-3">
                Tên
              </th>
              <th scope="col" className="px-6 py-3">
                Giá
              </th>
              <th scope="col" className="px-6 py-3 text-center">
               
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.ProductID}
                className="bg-white border-b hover:bg-gray-50"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {p.ProductID}
                </td>
                <td className="px-6 py-4">
                  {p.ImageURL ? (
                    <img
                      src={p.ImageURL}
                      alt={p.ProductName}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="px-6 py-4">{p.ProductName}</td>
                <td className="px-6 py-4">
                  {Number(p.Price).toLocaleString("vi-VN")}đ
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors duration-200 text-sm"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(p.ProductID)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors duration-200 text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-white rounded-lg w-[900px] max-w-[95vw] h-[85vh] max-h-[95vh] relative flex flex-col">
            {/* Nút đóng (X) */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="p-6 flex-1 flex flex-col overflow-hidden">
              <h2 className="text-2xl font-bold mb-6">
                {editProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}
              </h2>

              <form
                onSubmit={handleSubmit}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-6 flex-1 overflow-y-auto pb-4">
                  {/* Cột trái */}
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-1 font-medium">
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
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">Giá <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        placeholder="Nhập giá"
                        value={formData.Price}
                        onChange={(e) =>
                          setFormData({ ...formData, Price: e.target.value })
                        }
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">Mô tả</label>
                      <textarea
                        placeholder="Nhập mô tả"
                        value={formData.Description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            Description: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="4"
                      />
                    </div>
                  </div>

                  {/* Cột phải */}
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-1 font-medium">
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
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">
                        URL hình ảnh
                      </label>
                      <input
                        type="text"
                        placeholder="Nhập URL hình ảnh"
                        value={formData.ImageURL}
                        onChange={(e) =>
                          setFormData({ ...formData, ImageURL: e.target.value })
                        }
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">
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
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="4"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">
                        Danh mục <span className="text-red-500">*</span>
                      </label>
                      <select
                        multiple
                        value={selectedCategoryIds}
                        onChange={handleCategoryChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        size="5"
                      >
                        {categories.map((cat) => (
                          <option key={cat.CategoryID} value={cat.CategoryID}>
                            {cat.CategoryName}
                          </option>
                        ))}
                      </select>
                      <p className="text-sm text-gray-500 mt-1">
                        Giữ phím Ctrl/Cmd để chọn nhiều danh mục
                      </p>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                    {error}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4 border-t mt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                  >
                    Lưu
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}