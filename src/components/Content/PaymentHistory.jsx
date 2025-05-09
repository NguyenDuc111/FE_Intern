import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CholimexLayout from "../Layout/CholimexLayout";
import { getAllOrders, getOrderByIdUser, getProductById } from "../../api/api";
import { toast } from "react-toastify";

const PaymentHistory = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");
  const [searchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const loadOrders = async () => {
    if (!token) {
      toast.error("Vui lòng đăng nhập để xem lịch sử mua hàng.");
      return;
    }

    try {
      const response = await getAllOrders(token);
      let orderData = [];
      if (response.data && Array.isArray(response.data.data)) {
        orderData = response.data.data;
      } else if (
        response.data &&
        typeof response.data === "object" &&
        response.data.OrderID
      ) {
        orderData = [response.data];
      } else {
        throw new Error("Dữ liệu đơn hàng không hợp lệ.");
      }

      const enrichedOrders = await Promise.all(
        orderData.map(async (order) => {
          if (order.OrderDetails && order.OrderDetails.length > 0) {
            const enrichedDetails = await Promise.all(
              order.OrderDetails.map(async (item) => {
                try {
                  const productResponse = await getProductById(item.ProductID);
                  const product = productResponse.data;
                  return {
                    ...item,
                    ProductName: product.ProductName || "Không xác định",
                  };
                } catch (err) {
                  console.error(`Lỗi khi lấy sản phẩm ${item.ProductID}:`, err);
                  return {
                    ...item,
                    ProductName: "Không xác định",
                  };
                }
              })
            );
            return { ...order, OrderDetails: enrichedDetails };
          }
          return order;
        })
      );

      setOrders(enrichedOrders);

      const orderIdFromQuery = searchParams.get("orderId");
      if (orderIdFromQuery) {
        const orderToView = enrichedOrders.find(
          (order) => order.OrderID === parseInt(orderIdFromQuery)
        );
        if (orderToView) {
          viewOrderDetails(orderToView);
        } else {
          toast.error(`Không tìm thấy đơn hàng #${orderIdFromQuery}`);
        }
      }
    } catch (err) {
      console.error("Lỗi khi lấy lịch sử mua hàng:", err);
      toast.error(
        err.response?.data?.error || "Không thể tải lịch sử mua hàng."
      );
      setOrders([]);
    }
  };

  const viewOrderDetails = async (order) => {
    try {
      const response = await getOrderByIdUser(token, order.OrderID);
      const orderInfo = response.data;

      const detailsWithProductInfo = await Promise.all(
        orderInfo.OrderDetails.map(async (item) => {
          try {
            const productResponse = await getProductById(item.ProductID);
            const product = productResponse.data;
            return {
              ...item,
              ProductName: product.ProductName || "Không xác định",
              ImageURL: product.ImageURL || "https://via.placeholder.com/80",
              UnitPrice: item.UnitPrice,
              TotalPrice: item.UnitPrice * item.Quantity,
            };
          } catch (err) {
            console.error(`Lỗi khi lấy sản phẩm ${item.ProductID}:`, err);
            return {
              ...item,
              ProductName: "Không xác định",
              ImageURL: "https://via.placeholder.com/80",
              UnitPrice: item.UnitPrice,
              TotalPrice: item.UnitPrice * item.Quantity,
            };
          }
        })
      );

      setSelectedOrder(orderInfo);
      setOrderDetails(detailsWithProductInfo);
      setShowModal(true);
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", err);
      toast.error(
        err.response?.data?.error || "Không thể lấy chi tiết đơn hàng."
      );
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setOrderDetails([]);
  };

  const calculateDiscount = () => {
    if (!orderDetails || !selectedOrder) return 0;
    const totalProductsPrice = orderDetails.reduce(
      (acc, item) => acc + parseFloat(item.TotalPrice),
      0
    );
    const totalPaid = parseFloat(selectedOrder.TotalAmount);
    return totalProductsPrice - totalPaid;
  };

  useEffect(() => {
    loadOrders();
  }, []);

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

  return (
    <CholimexLayout>
      <div className="bg-gradient-to-br from-red-600 to-red-700 py-10 px-4 min-h-[60vh]">
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-2xl">
          <h2 className="text-3xl text-center font-semibold mb-8 text-red-700">
            Lịch Sử Mua Hàng
          </h2>

          {orders.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">
              Bạn chưa có đơn hàng nào được thanh toán.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4 text-center">Mã Đơn</th>
                    <th className="px-6 py-4 text-center">Tổng Tiền</th>
                    <th className="px-6 py-4 text-center">Địa Chỉ</th>
                    <th className="px-6 py-4 text-center">Trạng Thái</th>
                    <th className="px-6 py-4 text-center">Sản Phẩm</th>
                    <th className="px-6 py-4 text-center">Số Lượng</th>
                    <th className="px-6 py-4 text-center">Chi Tiết</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {currentOrders.map((order) => (
                    <tr key={order.OrderID} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-center font-semibold text-gray-700">
                        #{order.OrderID}
                      </td>
                      <td className="px-6 py-4 text-center text-green-600 font-bold">
                        {parseFloat(order.TotalAmount).toLocaleString()}₫
                      </td>
                      <td className="px-6 py-4 text-center">
                        {order.ShippingAddress}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-2 py-1 rounded text-white text-sm ${
                            order.Status === "Paid"
                              ? "bg-green-500"
                              : order.Status === "Processing"
                              ? "bg-yellow-500"
                              : order.Status === "Pending"
                              ? "bg-blue-500"
                              : "bg-red-500"
                          }`}
                        >
                          {getStatusDisplay(order.Status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center space-y-1">
                        {order.OrderDetails?.map((item) => (
                          <p key={item.OrderDetailID}>{item.ProductName}</p>
                        ))}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {order.OrderDetails?.map((item) => (
                          <p key={item.OrderDetailID}>{item.Quantity}</p>
                        ))}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow-md transition duration-200"
                        >
                          Xem
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                        currentPage === i + 1
                          ? "bg-red-600 text-white border-red-600"
                          : "bg-white text-red-600 border-red-300 hover:bg-red-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl relative animate-fadeIn">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-red-700">
              Chi tiết đơn hàng #{selectedOrder.OrderID}
            </h2>

            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Địa chỉ giao hàng: {selectedOrder.ShippingAddress}
              </p>
              {selectedOrder.VoucherCode && (
                <p className="text-sm text-gray-600">
                  Mã voucher: {selectedOrder.VoucherCode}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {orderDetails.map((item) => (
                <div
                  key={item.OrderDetailID}
                  className="border rounded-lg p-4 shadow-md flex gap-4"
                >
                  <img
                    src={item.ImageURL}
                    alt={item.ProductName}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {item.ProductName}
                    </p>
                    <p>Giá: {parseFloat(item.UnitPrice).toLocaleString()}₫</p>
                    <p>Số lượng: {item.Quantity}</p>
                    <p className="font-medium text-green-600">
                      Thành tiền: {parseFloat(item.TotalPrice).toLocaleString()}
                      ₫
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-right text-lg">
              <p>
                <span className="font-semibold text-gray-700">
                  Tổng thanh toán:
                </span>{" "}
                <span className="text-red-600 font-bold">
                  {parseFloat(selectedOrder.TotalAmount).toLocaleString()}₫
                </span>
              </p>
              {calculateDiscount() > 0 && (
                <p className="text-sm text-green-600">
                  (Đã giảm: {calculateDiscount().toLocaleString()}₫)
                </p>
              )}
              <p>
                <span className="font-semibold text-gray-700">Trạng thái:</span>{" "}
                <span
                  className={`px-2 py-1 rounded text-white text-sm ${
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
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </CholimexLayout>
  );
};

export default PaymentHistory;
