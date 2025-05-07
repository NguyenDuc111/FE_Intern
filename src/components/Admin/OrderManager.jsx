import { useEffect, useState } from "react";
import { getAllOrders, getOrderById, updateOrder, deleteOrder, getUserProfile } from "../../api/api";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const STATUS_OPTIONS = ["Pending", "Processing", "Paid", "Cancelled"];

const getStatusDisplay = (status) => {
  switch (status) {
    case "Pending":
      return "Chờ xử lý";
    case "Processing":
      return "Đang xử lý";
    case "Paid":
      return "Đã thanh toán";
    case "Cancelled":
      return "Đã hủy";
    default:
      return status ?? "N/A";
  }
};

const handleError = (error, message) => {
  console.error(message, error.response?.data || error);
  toast.error(message || "Đã có lỗi xảy ra");
};

export default function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const token = localStorage.getItem("token");
  const [userNamesCache, setUserNamesCache] = useState({});

  // Kiểm tra quyền admin
  let decoded = {};
  let isAdmin = false;
  let adminCheckMessage = "";
  try {
    if (token) {
      decoded = jwtDecode(token);
      // Kiểm tra các tên trường có thể cho quyền admin
      isAdmin =
        decoded.isAdmin ||
        decoded.is_admin ||
        decoded.role === "admin" ||
        decoded.role === "Admin" ||
        decoded.RoleName === "admin" ||
        decoded.RoleName === "Admin" ||
        false;
      console.log("Token:", token);
      console.log("Decoded Token:", decoded);
      console.log("Current User:", { UserID: decoded.UserID, isAdmin });

      // Thông báo chi tiết nếu không phải admin
      if (!isAdmin) {
        adminCheckMessage =
          "Tài khoản không có quyền admin. Kiểm tra các trường: " +
          `isAdmin: ${decoded.isAdmin}, ` +
          `is_admin: ${decoded.is_admin}, ` +
          `role: ${decoded.role}, ` +
          `RoleName: ${decoded.RoleName}`;
        console.warn(adminCheckMessage);
      }
    } else {
      console.error("No token found in localStorage");
      adminCheckMessage = "Không tìm thấy token trong localStorage. Vui lòng đăng nhập lại.";
    }
  } catch (err) {
    console.error("Error decoding token:", err);
    adminCheckMessage = "Token không hợp lệ. Vui lòng đăng nhập lại.";
    toast.error(adminCheckMessage);
  }

  useEffect(() => {
    if (!isAdmin) {
      toast.error("Bạn không có quyền truy cập trang này.");
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    if (!token) {
      toast.error("Vui lòng đăng nhập lại.");
      console.error("No token found in localStorage");
      return;
    }
    try {
      const res = await getAllOrders(token);
      console.log("API Response (getAllOrders):", res);
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      console.log("Raw Orders Data:", data);

      // Lấy danh sách UserID duy nhất
      const uniqueUserIds = [...new Set(data.map((order) => order.UserID).filter((id) => id))];
      console.log("Unique UserIDs:", uniqueUserIds);

      // Lấy FullName cho các UserID
      const newUserNames = { ...userNamesCache };
      for (const userId of uniqueUserIds) {
        if (!newUserNames[userId]) {
          try {
            const userRes = await getUserProfile(userId, token);
            console.log(`User Profile (${userId}):`, userRes.data);
            newUserNames[userId] = userRes.data.FullName || "N/A";
          } catch (err) {
            console.error(`Error fetching user ${userId}:`, err);
            newUserNames[userId] = "N/A";
          }
        }
      }
      setUserNamesCache(newUserNames);

      // Gán FullName vào dữ liệu đơn hàng
      const ordersWithNames = data.map((order) => ({
        ...order,
        FullName: newUserNames[order.UserID] || "N/A",
      }));
      console.log("Orders Data with Names:", ordersWithNames);
      setOrders(ordersWithNames);
    } catch (err) {
      handleError(err, "Lỗi khi tải danh sách đơn hàng");
      setOrders([]);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      toast.warn("Không thể xóa đơn hàng không có ID.");
      return;
    }
    if (window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
      try {
        await deleteOrder(id);
        toast.success("Đã xóa đơn hàng");
        setOrders((prevOrders) => prevOrders.filter((order) => order.OrderID !== id));
      } catch (err) {
        handleError(err, "Lỗi khi xóa đơn hàng");
      }
    }
  };

  const handleStatusChange = async (orderId, currentStatus, newStatus) => {
    if (!orderId || !newStatus) {
      toast.warn("Thông tin cập nhật không hợp lệ.");
      return;
    }
    if (currentStatus === newStatus) return;

    try {
      await updateOrder(orderId, { Status: newStatus });
      toast.success("Cập nhật trạng thái thành công");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.OrderID === orderId ? { ...order, Status: newStatus } : order
        )
      );
    } catch (err) {
      handleError(err, "Lỗi khi cập nhật trạng thái");
    }
  };

  const openOrderDetails = async (orderId) => {
    if (!orderId) {
      toast.warn("Không thể xem chi tiết đơn hàng không có ID.");
      return;
    }
    try {
      const res = await getOrderById(token, orderId);
      console.log("Order Details Response:", res);
      if (res.data) {
        let fullName = userNamesCache[res.data.UserID] || "N/A";
        if (!fullName || fullName === "N/A") {
          try {
            const userRes = await getUserProfile(res.data.UserID, token);
            console.log(`User Profile (${res.data.UserID}):`, userRes.data);
            fullName = userRes.data.FullName || "N/A";
            setUserNamesCache((prev) => ({
              ...prev,
              [res.data.UserID]: fullName,
            }));
          } catch (err) {
            console.error(`Error fetching user ${res.data.UserID}:`, err);
            fullName = "N/A";
          }
        }
        const orderWithName = {
          ...res.data,
          FullName: fullName,
        };
        setSelectedOrder(orderWithName);
        setShowModal(true);
      } else {
        toast.error("Không tìm thấy thông tin chi tiết đơn hàng.");
      }
    } catch (err) {
      handleError(err, "Lỗi khi xem chi tiết đơn hàng");
    }
  };

  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.Status?.toLowerCase() === filter.toLowerCase());
  console.log("Filtered Orders:", filteredOrders);
  console.log("All Order Statuses:", orders.map((o) => o.Status));

  if (!isAdmin) {
    return (
      <div className="p-6 text-red-700">
        Bạn không có quyền truy cập trang này.
        <br />
        <span className="text-sm text-gray-600">{adminCheckMessage}</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-red-700 mb-6">Quản lý Đơn hàng</h1>

      <div className="mb-4 flex flex-wrap gap-3 items-center">
        <label htmlFor="status-filter" className="font-medium">Lọc theo trạng thái:</label>
        <select
          id="status-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-2 shadow-sm focus:ring-red-500 focus:border-red-500"
        >
          <option value="all">Tất cả</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s.toLowerCase()}>
              {getStatusDisplay(s)}
            </option>
          ))}
        </select>
        <button
          onClick={fetchOrders}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-4"
        >
          Làm mới
        </button>
      </div>

      <div className="overflow-x-auto rounded shadow border border-gray-200">
        <table className="min-w-full text-sm bg-white">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Mã đơn</th>
              <th className="px-4 py-3 text-left font-semibold">Tên người dùng</th>
              <th className="px-4 py-3 text-left font-semibold">Tổng tiền</th>
              <th className="px-4 py-3 text-left font-semibold">Địa chỉ</th>
              <th className="px-4 py-3 text-left font-semibold">Trạng thái</th>
              <th className="px-4 py-3 text-center font-semibold">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Không có đơn hàng nào.
                </td>
              </tr>
            )}
            {filteredOrders.map((o, index) => {
              const displayAmount =
                o.TotalAmount && !isNaN(parseFloat(o.TotalAmount))
                  ? parseFloat(o.TotalAmount).toLocaleString("vi-VN") + "₫"
                  : "N/A";
              const rowKey = o.OrderID ?? `order-index-${index}`;
              const hasValidOrderId = !!o.OrderID;

              return (
                <tr key={rowKey} className="border-t hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-4 py-3 font-medium text-gray-800">#{o.OrderID ?? "..."}</td>
                  <td className="px-4 py-3 text-gray-600">{o.FullName}</td>
                  <td className="px-4 py-3 text-green-700 font-semibold">{displayAmount}</td>
                  <td className="px-4 py-3 text-gray-600">{o.ShippingAddress ?? "N/A"}</td>
                  <td className="px-4 py-3">
                    <select
                      value={o.Status ?? ""}
                      onChange={(e) =>
                        hasValidOrderId && handleStatusChange(o.OrderID, o.Status, e.target.value)
                      }
                      className={`border rounded px-2 py-1 capitalize shadow-sm focus:ring-red-500 focus:border-red-500 ${
                        !hasValidOrderId ? "bg-gray-200 cursor-not-allowed" : ""
                      }`}
                      disabled={!hasValidOrderId}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {getStatusDisplay(s)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      onClick={() => hasValidOrderId && openOrderDetails(o.OrderID)}
                      className={`bg-blue-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-600 transition-colors duration-150 ${
                        !hasValidOrderId ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={!hasValidOrderId}
                      title={!hasValidOrderId ? "Không thể xem đơn hàng thiếu ID" : "Xem chi tiết"}
                    >
                      Xem
                    </button>
                    <button
                      onClick={() => hasValidOrderId && handleDelete(o.OrderID)}
                      className={`bg-red-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-600 transition-colors duration-150 ${
                        !hasValidOrderId ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={!hasValidOrderId}
                      title={!hasValidOrderId ? "Không thể xóa đơn hàng thiếu ID" : "Xóa đơn hàng"}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl relative animate-fade-in-down">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-3xl font-light"
              aria-label="Đóng modal"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-6 text-red-700 border-b pb-3">
              Chi tiết đơn hàng #{selectedOrder.OrderID}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Trạng thái:</p>
                <p
                  className={`font-semibold px-3 py-1 inline-block rounded text-white text-sm ${
                    selectedOrder.Status === "Paid"
                      ? "bg-green-500"
                      : selectedOrder.Status === "Processing"
                      ? "bg-yellow-500"
                      : selectedOrder.Status === "Pending"
                      ? "bg-blue-500"
                      : "bg-red-500"
                  }`}
                >
                  {getStatusDisplay(selectedOrder.Status)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Ngày tạo:</p>
                <p className="font-medium text-gray-700">
                  {selectedOrder.createdAt
                    ? new Date(selectedOrder.createdAt).toLocaleString("vi-VN")
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Tên người dùng:</p>
                <p className="font-medium text-gray-700">{selectedOrder.FullName}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 mb-1">Địa chỉ giao hàng:</p>
                <p className="font-medium text-gray-700">{selectedOrder.ShippingAddress ?? "N/A"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 mb-1">Tổng tiền:</p>
                <p className="font-bold text-xl text-green-700">
                  {selectedOrder.TotalAmount && !isNaN(parseFloat(selectedOrder.TotalAmount))
                    ? parseFloat(selectedOrder.TotalAmount).toLocaleString("vi-VN") + "₫"
                    : "N/A"}
                </p>
              </div>
            </div>

            <h3 className="font-semibold text-lg mt-6 mb-3 text-gray-800">Sản phẩm đã đặt:</h3>
            <div className="border rounded overflow-hidden shadow-sm max-h-60 overflow-y-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Sản phẩm</th>
                    <th className="px-4 py-2 text-center font-medium text-gray-600">Số lượng</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-600">Đơn giá</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-600">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Array.isArray(selectedOrder.OrderDetails) && selectedOrder.OrderDetails.length > 0 ? (
                    selectedOrder.OrderDetails.map((item) => {
                      const unitPrice = parseFloat(item.UnitPrice);
                      const quantity = parseInt(item.Quantity, 10);
                      const lineTotal = !isNaN(unitPrice) && !isNaN(quantity) ? unitPrice * quantity : NaN;

                      return (
                        <tr key={`orderdetail-${item.OrderDetailID}`} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-gray-800">{item.ProductID ?? "N/A"}</td>
                          <td className="px-4 py-2 text-center text-gray-600">
                            {!isNaN(quantity) ? quantity : "N/A"}
                          </td>
                          <td className="px-4 py-2 text-right text-gray-600">
                            {!isNaN(unitPrice) ? unitPrice.toLocaleString("vi-VN") + "₫" : "N/A"}
                          </td>
                          <td className="px-4 py-2 text-right font-medium text-gray-800">
                            {!isNaN(lineTotal) ? lineTotal.toLocaleString("vi-VN") + "₫" : "N/A"}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-gray-500">
                        Không có chi tiết sản phẩm.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors duration-150"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}