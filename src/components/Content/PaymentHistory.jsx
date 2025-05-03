import React, { useEffect, useState } from "react";
import CholimexLayout from "../Layout/CholimexLayout";
import { getAllOrders, getOrderById, getProductById } from "../../api/api";
import { toast } from "react-toastify";

const PaymentHistory = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");

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
      }

      // Fetch product names for each order's OrderDetails
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
    } catch (err) {
      console.error("Lỗi khi lấy lịch sử mua hàng:", err);
      toast.error("Không thể tải lịch sử mua hàng.");
      setOrders([]);
    }
  };

  const viewOrderDetails = async (order) => {
    try {
      const response = await getOrderById(token, order.OrderID);
      const orderInfo = response.data;

      const detailsWithProductInfo = await Promise.all(
        orderInfo.OrderDetails.map(async (item) => {
          try {
            const productResponse = await getProductById(item.ProductID);
            const product = productResponse.data;
            return {
              ...item,
              ProductName: product.ProductName || "Không xác định",
              ImageURL: product.ImageURL || "Lỗi hiển thị hình ảnh",
              UnitPrice: item.UnitPrice,
              TotalPrice: item.UnitPrice * item.Quantity,
            };
          } catch (err) {
            console.error(`Lỗi khi lấy sản phẩm ${item.ProductID}:`, err);
            return {
              ...item,
              ProductName: "Không xác định",
              ImageURL: item.ImageURL,
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
      toast.error("Không thể lấy chi tiết đơn hàng.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setOrderDetails([]);
  };

  useEffect(() => {
    loadOrders();
  }, []);
  const calculateDiscount = () => {
    if (!orderDetails || !selectedOrder) return 0;
    const totalProductsPrice = orderDetails.reduce(
      (acc, item) => acc + parseFloat(item.TotalPrice),
      0
    );
    const totalPaid = parseFloat(selectedOrder.TotalAmount);
    return totalProductsPrice - totalPaid;
  };
  return (
    <CholimexLayout>
      <div className="bg-gradient-to-br from-red-600 to-red-700 py-10 px-4 min-h-[60vh]">
        <div className="max-w-5xl mx-auto bg-white p-4 md:p-6 rounded-xl shadow-xl">
          <h2 className="text-2xl font-bold text-center mb-6">
            📜 Lịch Sử Thanh Toán
          </h2>

          {orders.length === 0 ? (
            <p className="text-center">
              Bạn chưa có đơn hàng nào đã thanh toán.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-700 uppercase text-xs tracking-wide">
                  <tr>
                    <th className="text-left px-4 py-3">Mã đơn hàng</th>
                    <th className="text-left px-4 py-3">Tổng tiền</th>
                    <th className="text-left px-4 py-3">Địa chỉ giao hàng</th>
                    <th className="text-left px-4 py-3">Sản phẩm</th>
                    <th className="text-left px-4 py-3">Số lượng</th>
                    <th className="text-center px-4 py-3">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.OrderID}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="text-left px-4 py-3">#{order.OrderID}</td>
                      <td className="text-left text-green-600 px-4 py-3 ">
                        {parseFloat(order.TotalAmount).toLocaleString()}₫
                      </td>
                      <td className="text-left px-4 py-3">
                        {order.ShippingAddress}
                      </td>
                      <td className="text-left px-4 py-3">
                        {order.OrderDetails && order.OrderDetails.length > 0 ? (
                          order.OrderDetails.map((item) => (
                            <p key={item.OrderDetailID}>{item.ProductName}:</p>
                          ))
                        ) : (
                          <p>Không có sản phẩm</p>
                        )}
                      </td>
                      <td className="text-left px-4 py-3">
                        {order.OrderDetails && order.OrderDetails.length > 0 ? (
                          order.OrderDetails.map((item) => (
                            <p key={item.OrderDetailID}>{item.Quantity}</p>
                          ))
                        ) : (
                          <p>Không có số lượng</p>
                        )}
                      </td>
                      <td className="text-center px-4 py-3">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-center gap-4 border-b pb-4">
              Chi tiết đơn hàng #{selectedOrder.OrderID}
            </h2>

            <div className="space-y-4">
              {orderDetails.map((item) => (
                <div
                  key={item.OrderDetailID}
                  className="flex items-center gap-4 border-b pb-4"
                >
                  <img
                    src={item.ImageURL}
                    alt={item.ProductName}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1 text-left">
                    <p>
                      <strong>Tên sản phẩm:</strong> {item.ProductName}
                    </p>
                    <p>
                      <strong>Số lượng:</strong> {item.Quantity}
                    </p>
                    <p>
                      <strong>Giá đơn vị: </strong>{" "}
                      {parseFloat(item.UnitPrice).toLocaleString()}₫
                    </p>
                    <p>
                      <strong>Tổng giá:</strong>{" "}
                      {parseFloat(item.TotalPrice).toLocaleString()}₫
                    </p>
                  </div>
                </div>
              ))}
              <div className="mb-4 text-right">
                <p>
                  <strong>Tổng tiền sản phẩm:</strong>{" "}
                  {orderDetails
                    .reduce((acc, item) => acc + parseFloat(item.TotalPrice), 0)
                    .toLocaleString()}
                  ₫
                </p>
                <p className="text-red-300">
                  <strong>Giảm giá:</strong>{" "}
                  {calculateDiscount().toLocaleString()}₫
                </p>
                <p className="text-green-600">
                  <strong>Tổng tiền đã thanh toán:</strong>{" "}
                  {parseFloat(selectedOrder.TotalAmount).toLocaleString()}₫
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </CholimexLayout>
  );
};

export default PaymentHistory;
