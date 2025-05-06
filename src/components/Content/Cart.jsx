import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import CholimexLayout from "../Layout/CholimexLayout";
import {
  getCartAPI,
  updateCartAPI,
  removeCartItemAPI,
  createOrderAPI,
  processPaymentAPI,
  getLoyaltyPointsAPI,
  getUserProfile,
} from "../../api/api";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [pointsUsed, setPointsUsed] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [userInfo, setUserInfo] = useState({ FullName: "", Phone: "" });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let userId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.UserID;
    } catch (err) {
      console.error("Lỗi giải mã token:", err);
      toast.error("Token không hợp lệ. Vui lòng đăng nhập lại.");
    }
  }

  useEffect(() => {
    const status = searchParams.get("status");
    const orderId = searchParams.get("orderId");
    const message = searchParams.get("message");
    const vnp_TransactionStatus = searchParams.get("vnp_TransactionStatus");
    const vnp_TxnRef = searchParams.get("vnp_TxnRef");

    if (status === "success" && orderId) {
      toast.success(`Thanh toán đơn hàng #${orderId} thành công!`);
    } else if (status === "failed" && orderId) {
      toast.error(
        message
          ? `Thanh toán đơn hàng #${orderId} thất bại: ${decodeURIComponent(
              message
            )}`
          : `Thanh toán đơn hàng #${orderId} thất bại.`
      );
    } else if (vnp_TransactionStatus && vnp_TxnRef) {
      if (vnp_TransactionStatus === "00") {
        navigate(`/payment/success?orderId=${vnp_TxnRef}&status=success`);
      } else {
        navigate(
          `/payment/failed?orderId=${vnp_TxnRef}&status=failed&message=${encodeURIComponent(
            "Giao dịch VNPay thất bại"
          )}`
        );
      }
    }
  }, [searchParams, navigate]);

  const calculateTotal = (items) =>
    items.reduce(
      (acc, item) => acc + item.Quantity * parseFloat(item.Product.Price),
      0
    );

  const loadCart = async () => {
    if (!token) {
      toast.error("Vui lòng đăng nhập để tiếp tục.");
      return;
    }
    try {
      const res = await getCartAPI(token);
      const items = res.data.cartItems || [];
      setCartItems(items);
      setTotalAmount(calculateTotal(items));
    } catch (err) {
      console.error("Lỗi khi lấy giỏ hàng:", err);
      toast.error("Không thể tải giỏ hàng");
    }
  };

  const loadLoyaltyPoints = async () => {
    if (!token) return;
    try {
      const res = await getLoyaltyPointsAPI(token);
      setTotalPoints(res.data.totalPoints || 0);
    } catch (err) {
      console.error("Lỗi khi lấy điểm tích lũy:", err);
      toast.error("Không thể tải điểm tích lũy");
    }
  };

  const loadUserInfo = async () => {
    if (!token || !userId) {
      toast.error("Vui lòng đăng nhập để tiếp tục.");
      return;
    }
    try {
      const res = await getUserProfile(userId, token); 
      setUserInfo({
        FullName: res.data.FullName || "Không có thông tin",
        Phone: res.data.Phone || "Không có thông tin",
      });
    } catch (err) {
      console.error("Lỗi khi lấy thông tin người dùng:", err);
      toast.error("Không thể tải thông tin người dùng");
    }
  };

  useEffect(() => {
    loadCart();
    loadLoyaltyPoints();
    loadUserInfo();
  }, []);

  const handleQuantityChange = async (cartId, quantity, maxStock) => {
    const newQty = parseInt(quantity);
    if (newQty < 1 || newQty > maxStock) return;

    try {
      await updateCartAPI(cartId, newQty, token);
      const updatedItems = cartItems.map((item) =>
        item.CartID === cartId ? { ...item, Quantity: newQty } : item
      );
      setCartItems(updatedItems);
      setTotalAmount(calculateTotal(updatedItems));
    } catch (err) {
      console.error("Lỗi cập nhật số lượng:", err);
      toast.error(err.response?.data?.error || "Cập nhật giỏ hàng thất bại");
    }
  };

  const handleRemoveItem = async (cartId) => {
    try {
      await removeCartItemAPI(Number(cartId), token);
      const updatedItems = cartItems.filter((item) => item.CartID !== cartId);
      setCartItems(updatedItems);
      setTotalAmount(calculateTotal(updatedItems));
    } catch (err) {
      console.error("Lỗi xóa sản phẩm:", err);
      toast.error("Xóa sản phẩm thất bại");
    }
  };

  const handlePointsChange = (e) => {
    const points = parseInt(e.target.value) || 0;
    if (points <= totalPoints && points >= 0) {
      setPointsUsed(points);
    }
  };

  const calculateFinalAmount = () => {
    const discountFromPoints = pointsUsed * 1000;
    const finalAmount = Math.max(0, totalAmount - discountFromPoints);
    return {
      finalAmount,
      discountFromPoints,
    };
  };

  const handleCheckout = () => {
    if (!shippingAddress.trim()) {
      toast.error("Vui lòng nhập địa chỉ giao hàng");
      return;
    }

    const tempOrderDetails = {
      items: cartItems.map((item) => ({
        ProductID: item.ProductID,
        Quantity: item.Quantity,
      })),
      cartItemIds: cartItems.map((item) => item.CartID),
      shippingAddress,
      priceDetails: {
        totalAmountBeforeDiscount: totalAmount,
        discountFromPoints: pointsUsed * 1000,
        finalAmount: Math.max(0, totalAmount - pointsUsed * 1000),
      },
    };

    setOrderDetails(tempOrderDetails);
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    try {
      if (!paymentMethod) {
        toast.error("Vui lòng chọn phương thức thanh toán");
        return;
      }

      const orderResponse = await createOrderAPI(
        {
          items: orderDetails.items,
          pointsUsed,
          cartItemIds: orderDetails.cartItemIds,
          shippingAddress,
        },
        token
      );

      const createdOrder = orderResponse.data;

      if (paymentMethod === "cod") {
        toast.success("Đặt hàng thành công! Thanh toán khi nhận hàng.");
        setShowPaymentModal(false);
        setOrderDetails(null);
        loadCart();
      } else {
        const paymentResponse = await processPaymentAPI(
          {
            orderId: createdOrder.order.OrderID,
            paymentMethod: paymentMethod.toLowerCase(),
          },
          token
        );

        if (paymentResponse.data.payUrl) {
          window.location.href = paymentResponse.data.payUrl;
        } else {
          toast.error("Không thể tạo URL thanh toán");
        }
      }
    } catch (err) {
      console.error("Lỗi khi xử lý thanh toán:", err);
      const errorMessage =
        err.response?.data?.error ||
        "Đã xảy ra lỗi khi xử lý thanh toán. Vui lòng thử lại.";
      toast.error(errorMessage);
    }
  };

  const handleCancelPayment = () => {
    setShowPaymentModal(false);
    setOrderDetails(null);
    toast.info("Đã hủy thanh toán. Giỏ hàng vẫn được giữ nguyên.");
  };

  const { finalAmount, discountFromPoints } = calculateFinalAmount();

  return (
    <CholimexLayout>
      <div className="bg-gradient-to-br from-red-600 to-red-700 py-10 px-4 min-h-[60vh]">
        <div className="max-w-5xl mx-auto bg-white p-4 md:p-6 rounded-xl shadow-xl overflow-x-auto">
          <h2 className="text-3xl text-center font-semibold mb-8 text-red-700">Giỏ Hàng</h2>

          {cartItems.length === 0 ? (
            <p className="text-center">Giỏ hàng hiện đang trống <br /> Hãy tiếp tục mua hàng.</p>
          ) : (
            <>
              <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-700 uppercase text-xs tracking-wide">
                    <tr>
                      <th className="text-left px-4 py-3">Sản phẩm</th>
                      <th className="text-center px-4 py-3">Đơn giá</th>
                      <th className="text-center px-4 py-3">Số lượng</th>
                      <th className="text-center px-4 py-3">Tổng</th>
                      <th className="text-center px-4 py-3">Xóa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr
                        key={item.CartID}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 min-w-[200px]">
                          <img
                            src={item.Product.ImageURL}
                            alt={item.Product.ProductName}
                            className="w-14 h-14 object-cover rounded"
                          />
                          <div>
                            <span className="font-medium text-gray-800 block">
                              {item.Product.ProductName}
                            </span>
                            <span className="text-xs text-gray-500 block mt-1">
                              Còn lại: {item.Product.StockQuantity}
                            </span>
                          </div>
                        </td>
                        <td className="text-center text-gray-700 px-4 py-3">
                          {parseInt(item.Product.Price).toLocaleString()}₫
                        </td>
                        <td className="text-center px-4 py-3">
                          <input
                            type="number"
                            value={item.Quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.CartID,
                                e.target.value,
                                item.Product.StockQuantity
                              )
                            }
                            className="w-16 text-center border border-gray-300 rounded px-2 py-1"
                            min={1}
                            max={item.Product.StockQuantity}
                          />
                        </td>
                        <td className="text-center font-semibold px-4 py-3 text-gray-800">
                          {(
                            parseInt(item.Product.Price) * item.Quantity
                          ).toLocaleString()}
                          ₫
                        </td>
                        <td className="text-center px-4 py-3">
                          <button
                            onClick={() => handleRemoveItem(item.CartID)}
                            className="text-red-500 hover:underline text-sm"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="w-full md:w-1/2">
                  <div className="flex flex-col gap-2 mb-4">
                    <label className="text-sm font-semibold">
                      Sử dụng điểm tích lũy (có sẵn: {totalPoints} điểm)
                    </label>
                    <input
                      type="number"
                      value={pointsUsed}
                      onChange={handlePointsChange}
                      className="border border-gray-300 px-3 py-2 rounded text-sm w-full"
                      min={0}
                      max={totalPoints}
                      placeholder="Nhập số điểm muốn dùng"
                    />
                    <p className="text-xs text-gray-500">1 điểm = 1,000₫</p>
                  </div>
                  <div className="mt-4">
                    <label className="text-sm font-semibold">
                      Địa chỉ giao hàng
                    </label>
                    <input
                      type="text"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="border border-gray-300 px-3 py-2 rounded text-sm w-full"
                      placeholder="Nhập địa chỉ giao hàng"
                    />
                  </div>
                </div>

                <div className="flex flex-col items-end w-full md:w-1/2">
                  <p className="text-base text-gray-700">
                    Tổng tiền gốc: {totalAmount.toLocaleString()}₫
                  </p>
                  {discountFromPoints > 0 && (
                    <p className="text-sm text-green-600">
                      Giảm giá từ điểm: {discountFromPoints.toLocaleString()}₫
                    </p>
                  )}
                  <p className="text-lg font-semibold text-black">
                    Tổng tiền thanh toán:
                    <span className="font-bold text-[#dd3333]">
                      {finalAmount.toLocaleString()}₫
                    </span>
                  </p>
                  <button
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0}
                    className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Thanh toán
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {showPaymentModal && orderDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-lg w-full">
            <h3 className="text-xl font-bold mb-4 ">Xác nhận đơn hàng</h3>

            <div className="mb-6">
              <h4 className="text-lg font-semibold">Thông tin đơn hàng</h4>
              <p className="text-sm text-gray-600">
                Tên khách hàng: {userInfo.FullName}
              </p>
              <p className="text-sm text-gray-600">
                Số điện thoại: {userInfo.Phone}
              </p>
              <p className="text-sm text-gray-600">
                Địa chỉ giao hàng: {orderDetails.shippingAddress}
              </p>

              <div className="mt-4">
                <h5 className="text-sm font-semibold">Sản phẩm:</h5>
                <ul className="list-disc pl-5 text-sm">
                  {orderDetails.items.map((item, index) => (
                    <li key={index}>
                      {cartItems.find(
                        (cartItem) => cartItem.ProductID === item.ProductID
                      )?.Product.ProductName || "Sản phẩm"}{" "}
                      (x{item.Quantity})
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <p className="text-sm">
                  Tổng tiền gốc:
                  {orderDetails.priceDetails.totalAmountBeforeDiscount.toLocaleString()}
                  ₫
                </p>
                {orderDetails.priceDetails.discountFromPoints > 0 && (
                  <p className="text-sm text-green-600">
                    Giảm từ điểm tích lũy:
                    {orderDetails.priceDetails.discountFromPoints.toLocaleString()}
                    ₫
                  </p>
                )}
                <p className="text-sm font-semibold">
                  Tổng tiền thanh toán:
                  {orderDetails.priceDetails.finalAmount.toLocaleString()}₫
                </p>
              </div>
            </div>

            <h4 className="text-lg font-semibold mb-2">
              Chọn phương thức thanh toán
            </h4>
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="vnpay"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="form-radio"
                />
                <span>VNPay</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="form-radio"
                />
                <span>Thanh toán khi nhận hàng</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={handleCancelPayment}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handlePayment}
                disabled={!paymentMethod}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                Xác nhận thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
    </CholimexLayout>
  );
};

export default Cart;
