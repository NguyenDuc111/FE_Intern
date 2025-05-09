import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../../api/api.js";
import {
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import {jwtDecode} from "jwt-decode";

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    Status: "",
    TotalAmount: "",
    ShippingAddress: "",
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Check if user is admin by decoding JWT token
  const fetchUserRole = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Vui lòng đăng nhập để tiếp tục");
        window.location.href = "/login"; // Redirect to login page
        return;
      }
      const decoded = jwtDecode(token);
      console.log("Decoded JWT:", decoded); // Debug log
      // Check multiple possible role fields
      const isAdminUser =
        (decoded.RoleName && decoded.RoleName.toLowerCase() === "admin") ||
        (decoded.role && decoded.role.toLowerCase() === "admin") ||
        decoded.isAdmin === true;
      setIsAdmin(isAdminUser);
      if (!isAdminUser) {
        toast.warn("Bạn cần quyền admin để quản lý đơn hàng");
      }
    } catch (error) {
      console.error("Lỗi khi giải mã token:", error);
      toast.error("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.");
      window.location.href = "/login";
      setIsAdmin(false);
    }
  };

  // Validate token before API calls
  const validateToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      window.location.href = "/login";
      return false;
    }
    try {
      const decoded = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < now) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return false;
      }
      return true;
    } catch (error) {
      console.error("Lỗi khi kiểm tra token:", error);
      toast.error("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.");
      window.location.href = "/login";
      return false;
    }
  };

  // Fetch all orders
  const fetchOrders = async () => {
    if (!validateToken()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await getAllOrders(token);
      setOrders(response.data.data);
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("Bạn không có quyền truy cập danh sách đơn hàng.");
      } else {
        toast.error("Không thể tải danh sách đơn hàng.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRole();
    fetchOrders();
  }, []);

  // Handle view order details
  const viewOrderDetails = async (orderId) => {
    if (!isAdmin) {
      toast.error("Chỉ admin mới có thể xem/chỉnh sửa đơn hàng.");
      return;
    }
    if (!validateToken()) return;
    console.log("Calling getOrderById with orderId:", orderId); // Debug log
    try {
      const token = localStorage.getItem("token");
      const response = await getOrderById(token, orderId);
      setSelectedOrder(response.data);
      setFormData({
        Status: response.data.Status,
        TotalAmount: response.data.TotalAmount,
        ShippingAddress: response.data.ShippingAddress,
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error in viewOrderDetails:", error.response); // Debug log
      if (error.response?.status === 403) {
        toast.error(
          "Không có quyền truy cập đơn hàng này. Vui lòng kiểm tra lại quyền admin."
        );
      } else {
        toast.error("Không thể tải chi tiết đơn hàng.");
      }
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select change
  const handleSelectChange = (e) => {
    setFormData((prev) => ({ ...prev, Status: e.target.value }));
  };

  // Handle update order
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      toast.error("Chỉ admin mới có thể cập nhật đơn hàng.");
      return;
    }
    if (!validateToken()) return;
    try {
      const token = localStorage.getItem("token");
      await updateOrder(selectedOrder.OrderID, formData, token);
      toast.success("Cập nhật đơn hàng thành công.");
      setIsModalOpen(false);
      setSelectedOrder(null);
      fetchOrders();
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("Bạn không có quyền cập nhật đơn hàng này.");
      } else {
        toast.error("Không thể cập nhật đơn hàng.");
      }
    }
  };

  // Handle delete order
  const handleDelete = async (orderId) => {
    if (!isAdmin) {
      toast.error("Chỉ admin mới có thể xóa đơn hàng.");
      return;
    }
    if (!validateToken()) return;
    try {
      const token = localStorage.getItem("token");
      await deleteOrder(orderId, token);
      toast.success("Xóa đơn hàng thành công.");
      setConfirmDelete(null);
      fetchOrders();
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("Bạn không có quyền xóa đơn hàng này.");
      } else {
        toast.error("Không thể xóa đơn hàng.");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
       <h1 className="text-3xl font-bold mb-6 text-red-600">Quản lý đơn hàng</h1>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã đơn hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã người dùng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng tiền
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Địa chỉ giao hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  Đang tải...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  Không có đơn hàng nào
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.OrderID}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.OrderID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.UserID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${parseFloat(order.TotalAmount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.Status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.ShippingAddress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => viewOrderDetails(order.OrderID)}
                      className="text-blue-600 hover:text-blue-800 mr-4"
                      disabled={!isAdmin}
                    >
                      <PencilIcon className="h-5 w-5 inline" /> Xem/Chỉnh sửa
                    </button>
                    <button
                      onClick={() => setConfirmDelete(order.OrderID)}
                      className="text-red-600 hover:text-red-800"
                      disabled={!isAdmin}
                    >
                      <TrashIcon className="h-5 w-5 inline" /> Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Chi tiết đơn hàng</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Trạng thái
                </label>
                <select
                  name="Status"
                  value={formData.Status}
                  onChange={handleSelectChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Paid">Paid</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Tổng tiền
                </label>
                <input
                  type="number"
                  name="TotalAmount"
                  value={formData.TotalAmount}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Địa chỉ giao hàng
                </label>
                <input
                  type="text"
                  name="ShippingAddress"
                  value={formData.ShippingAddress}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-medium">Sản phẩm</h3>
                {selectedOrder.OrderDetails?.map((item) => (
                  <div key={item.OrderDetailID} className="mb-2">
                    <p className="text-sm">Mã sản phẩm: {item.ProductID}</p>
                    <p className="text-sm">Số lượng: {item.Quantity}</p>
                    <p className="text-sm">
                      Đơn giá: ${parseFloat(item.UnitPrice).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <CheckIcon className="h-5 w-5 inline mr-1" />
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Xác nhận xóa đơn hàng
            </h2>
            <p className="mb-4">
              Bạn có chắc chắn muốn xóa đơn hàng #{confirmDelete}?
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                <TrashIcon className="h-5 w-5 inline mr-1" />
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManager;