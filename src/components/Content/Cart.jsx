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
  applyVoucher,
  getRedeemedVouchers,
} from "../../api/api";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [pointsUsed, setPointsUsed] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [redeemedVouchers, setRedeemedVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
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
      setVoucherCode("");
      setVoucherDiscount(null);
      setSelectedVoucher(null);
      loadCart();
    } else if (status === "failed" && orderId) {
      toast.error(
        message
          ? `Thanh toán đơn hàng #${orderId} thất bại: ${decodeURIComponent(message)}`
          : `Thanh toán đơn hàng #${orderId} thất bại.`
      );
    } else if (vnp_TransactionStatus && vnp_TxnRef) {
      if (vnp_TransactionStatus === "00") {
        navigate(`/payment/success?orderId=${vnp_TxnRef}&status=success`);
      } else {
        navigate(
          `/payment/failed?orderId=${vnp_TxnRef}&status=failed&message=${encodeURIComponent("Giao dịch VNPay thất bại")}`
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

  const loadRedeemedVouchers = async () => {
    if (!token) {
      toast.error("Vui lòng đăng nhập để xem voucher đã đổi.");
      return;
    }
    try {
      const response = await getRedeemedVouchers(token);
      const activeVouchers = (response.data.vouchers || []).filter(
        (voucher) => voucher.status === "active"
      );
      setRedeemedVouchers(activeVouchers);
    } catch (err) {
      console.error("Lỗi khi lấy voucher đã đổi:", err);
      toast.error(
        err.response?.data?.message || "Không thể tải voucher đã đổi."
      );
    }
  };

  useEffect(() => {
    loadCart();
    loadLoyaltyPoints();
    loadUserInfo();
    loadRedeemedVouchers();
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

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      toast.error("Vui lòng nhập mã voucher");
      return;
    }

    try {
      const response = await applyVoucher(
        { voucherCode, totalAmount, pointsUsed },
        token
      );
      setVoucherDiscount({
        discount: response.data.discount,
        isPercentage: response.data.isPercentage,
        finalAmount: response.data.finalAmount,
      });
      setSelectedVoucher(null);
      toast.success(response.data.message);
    } catch (err) {
      console.error("Lỗi khi áp dụng voucher:", err);
      toast.error(err.response?.data?.message || "Áp dụng voucher thất bại.");
      setVoucherDiscount(null);
      setVoucherCode("");
    }
  };

  const handleSelectVoucher = async (voucher) => {
    try {
      const response = await applyVoucher(
        { voucherCode: voucher.voucherCode, totalAmount, pointsUsed },
        token
      );
      setVoucherDiscount({
        discount: response.data.discount,
        isPercentage: response.data.isPercentage,
        finalAmount: response.data.finalAmount,
      });
      setSelectedVoucher(voucher);
      setVoucherCode(voucher.voucherCode);
      setShowVoucherModal(false);
      toast.success(`Đã chọn voucher ${voucher.name}`);
    } catch (err) {
      console.error("Lỗi khi chọn voucher:", err);
      toast.error(err.response?.data?.message || "Không thể áp dụng voucher.");
    }
  };

  const calculateFinalAmount = () => {
    let finalAmount = totalAmount;
    const discountFromPoints = pointsUsed * 1000;
    let discountFromVoucher = 0;

    if (voucherDiscount) {
      if (voucherDiscount.isPercentage) {
        discountFromVoucher = (totalAmount * voucherDiscount.discount) / 100;
      } else {
        discountFromVoucher = voucherDiscount.discount;
      }
    }

    finalAmount = Math.max(
      0,
      totalAmount - discountFromPoints - discountFromVoucher
    );
    return {
      finalAmount,
      discountFromPoints,
      discountFromVoucher,
    };
  };

  const handleCheckout = () => {
    if (!shippingAddress.trim()) {
      toast.error("Vui lòng nhập địa chỉ giao hàng");
      return;
    }

    const { finalAmount } = calculateFinalAmount();
    if (finalAmount < 20000) {
      toast.error(
        "Tổng giá đơn hàng sau khi áp dụng voucher và điểm tích lũy phải tối thiểu 20,000₫."
      );
      return;
    }

    const tempOrderDetails = {
      items: cartItems.map((item) => ({
        ProductID: item.ProductID,
        Quantity: item.Quantity,
      })),
      cartItemIds: cartItems.map((item) => item.CartID),
      shippingAddress,
      voucherCode: voucherCode || null,
      pointsUsed,
      priceDetails: {
        totalAmountBeforeDiscount: totalAmount,
        discountFromPoints: pointsUsed * 1000,
        discountFromVoucher: voucherDiscount
          ? voucherDiscount.isPercentage
            ? (totalAmount * voucherDiscount.discount) / 100
            : voucherDiscount.discount
          : 0,
        finalAmount: finalAmount,
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

      console.log("Creating order with data:", {
        items: orderDetails.items,
        pointsUsed,
        cartItemIds: orderDetails.cartItemIds,
        shippingAddress,
      });
      const orderResponse = await createOrderAPI(
        {
          items: orderDetails.items,
          pointsUsed,
          cartItemIds: orderDetails.cartItemIds,
          shippingAddress,
          voucherCode: orderDetails.voucherCode,
        },
        token
      );
      console.log("Order creation response:", orderResponse.data);

      const createdOrder = orderResponse.data;

      if (paymentMethod === "cod") {
        console.log("Processing COD payment for OrderID:", createdOrder.order.OrderID);
        toast.success(`Đặt hàng thành công! Thanh toán khi nhận hàng. Đơn hàng #${createdOrder.order.OrderID}.`);
        setShowPaymentModal(false);
        setOrderDetails(null);
        setVoucherCode("");
        setVoucherDiscount(null);
        setSelectedVoucher(null);
        loadCart();
        navigate(`/payment/success?orderId=${createdOrder.order.OrderID}`);
      } else {
        console.log("Processing VNPay payment for OrderID:", createdOrder.order.OrderID);
        const paymentResponse = await processPaymentAPI(
          {
            orderId: createdOrder.order.OrderID,
            paymentMethod: paymentMethod.toLowerCase(),
          },
          token
        );
        console.log("Payment response:", paymentResponse.data);

        if (paymentResponse.data.payUrl) {
          window.location.href = paymentResponse.data.payUrl;
        } else {
          toast.error("Không thể tạo URL thanh toán");
        }
      }
    } catch (err) {
      console.error("Error in handlePayment:", err);
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

  const { finalAmount, discountFromPoints, discountFromVoucher } =
    calculateFinalAmount();

  return (
    <CholimexLayout>
      <div className="bg-gradient-to-br from-[#dd3333] to-[#a71d1d] py-12 px-4 sm:px-6 min-h-[60vh]">
        <div className="max-w-6xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl sm:text-4xl text-center font-bold mb-8 text-[#dd3333]">
            Giỏ Hàng
          </h2>

          {cartItems.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">
              Giỏ hàng hiện đang trống <br />{" "}
              <a href="/Categories" className="text-[#dd3333] hover:underline">
                Tiếp tục mua sắm
              </a>
            </p>
          ) : (
            <>
              <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-md">
                <table className="w-full text-sm sm:text-base">
                  <thead className="bg-[#f8f8f8] text-[#333333] uppercase text-xs sm:text-sm tracking-wide">
                    <tr>
                      <th className="text-left px-6 py-4 font-semibold">Sản phẩm</th>
                      <th className="text-center px-6 py-4 font-semibold">Đơn giá</th>
                      <th className="text-center px-6 py-4 font-semibold">Số lượng</th>
                      <th className="text-center px-6 py-4 font-semibold">Tổng</th>
                      <th className="text-center px-6 py-4 font-semibold">Xóa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr
                        key={item.CartID}
                        className="border-t border-gray-100 hover:bg-[#f5c518]/10 transition-colors"
                      >
                        <td className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-4 min-w-[250px]">
                          <img
                            src={item.Product.ImageURL}
                            alt={item.Product.ProductName}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                          />
                          <div>
                            <span className="font-semibold text-[#333333] block text-sm sm:text-base">
                              {item.Product.ProductName}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-500 block mt-1">
                              Còn lại: {item.Product.StockQuantity}
                            </span>
                          </div>
                        </td>
                        <td className="text-center text-[#333333] px-6 py-4 font-medium">
                          {parseInt(item.Product.Price).toLocaleString()}₫
                        </td>
                        <td className="text-center px-6 py-4">
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
                            className="w-16 sm:w-20 text-center border border-gray-300 rounded-lg px-2 py-1.5 focus:border-[#dd3333] focus:ring-[#dd3333] text-sm"
                            min={1}
                            max={item.Product.StockQuantity}
                          />
                        </td>
                        <td className="text-center font-semibold px-6 py-4 text-[#333333]">
                          {(parseInt(item.Product.Price) * item.Quantity).toLocaleString()}₫
                        </td>
                        <td className="text-center px-6 py-4">
                          <button
                            onClick={() => handleRemoveItem(item.CartID)}
                            className="text-[#dd3333] hover:text-[#a71d1d] font-medium text-sm"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-10 flex flex-col lg:flex-row justify-between gap-8">
                <div className="w-full lg:w-1/2 space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#333333]">
                      Sử dụng điểm tích lũy (có sẵn: {totalPoints} điểm)
                    </label>
                    <input
                      type="number"
                      value={pointsUsed}
                      onChange={handlePointsChange}
                      className="border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-[#dd3333] focus:ring-[#dd3333] w-full"
                      min={0}
                      max={totalPoints}
                      placeholder="Nhập số điểm muốn dùng"
                    />
                    <p className="text-xs text-gray-500">1 điểm = 1.000₫</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#333333]">
                      Mã voucher
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                        className="border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-[#dd3333] focus:ring-[#dd3333] w-full"
                        placeholder="Nhập mã voucher"
                      />
                      <button
                        onClick={handleApplyVoucher}
                        className="bg-[#dd3333] text-white px-6 py-2.5 rounded-lg hover:bg-[#a71d1d] transition-colors"
                      >
                        Áp dụng
                      </button>
                    </div>
                    <button
                      onClick={() => setShowVoucherModal(true)}
                      className="mt-2 text-[#dd3333] hover:text-[#a71d1d] text-sm font-medium"
                    >
                      Chọn voucher của bạn
                    </button>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#333333]">
                      Địa chỉ giao hàng
                    </label>
                    <input
                      type="text"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-[#dd3333] focus:ring-[#dd3333] w-full"
                      placeholder="Nhập địa chỉ giao hàng"
                    />
                  </div>
                </div>

                <div className="w-full lg:w-1/2 bg-[#f8f8f8] p-6 rounded-xl shadow-sm">
                  <h3 className="text-xl font-semibold text-[#333333] mb-4">
                    Thông tin thanh toán
                  </h3>
                  <div className="space-y-3">
                    <p className="text-base text-[#333333] flex justify-between">
                      <span>Tổng tiền gốc:</span>
                      <span>{totalAmount.toLocaleString()}₫</span>
                    </p>
                    {discountFromPoints > 0 && (
                      <p className="text-sm text-green-600 flex justify-between">
                        <span>Giảm giá từ điểm:</span>
                        <span>{discountFromPoints.toLocaleString()}₫</span>
                      </p>
                    )}
                    {discountFromVoucher > 0 && (
                      <p className="text-sm text-green-600 flex justify-between">
                        <span>Giảm giá từ voucher:</span>
                        <span>{discountFromVoucher.toLocaleString()}₫</span>
                      </p>
                    )}
                    <p className="text-lg font-semibold text-[#333333] flex justify-between">
                      <span>Tổng tiền thanh toán:</span>
                      <span className="text-[#dd3333] font-bold">
                        {finalAmount.toLocaleString()}₫
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0}
                    className="mt-6 w-full bg-gradient-to-r from-[#dd3333] to-[#a71d1d] text-white px-6 py-3 rounded-lg hover:from-[#a71d1d] hover:to-[#dd3333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 sm:p-8 rounded-2xl max-w-lg w-full shadow-xl">
            <h3 className="text-2xl font-bold mb-6 text-[#dd3333] border-b border-gray-100 pb-3">
              Xác nhận đơn hàng
            </h3>

            <div className="mb-6 space-y-4">
              <h4 className="text-lg font-semibold text-[#333333]">
                Thông tin đơn hàng
              </h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Tên khách hàng:</span> {userInfo.FullName}
                </p>
                <p>
                  <span className="font-medium">Số điện thoại:</span> {userInfo.Phone}
                </p>
                <p>
                  <span className="font-medium">Địa chỉ giao hàng:</span> {orderDetails.shippingAddress}
                </p>
                {orderDetails.voucherCode && (
                  <p>
                    <span className="font-medium">Mã voucher:</span> {orderDetails.voucherCode}
                  </p>
                )}
                {orderDetails.pointsUsed > 0 && (
                  <p>
                    <span className="font-medium">Điểm tích lũy sử dụng:</span>{" "}
                    {orderDetails.pointsUsed} điểm
                  </p>
                )}
              </div>

              <div className="mt-4">
                <h5 className="text-sm font-semibold text-[#333333]">Sản phẩm:</h5>
                <ul className="list-disc pl-5 text-sm text-gray-600">
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

              <div className="mt-4 space-y-2">
                <p className="text-sm text-[#333333] flex justify-between">
                  <span>Tổng tiền gốc:</span>
                  <span>{orderDetails.priceDetails.totalAmountBeforeDiscount.toLocaleString()}₫</span>
                </p>
                {orderDetails.priceDetails.discountFromPoints > 0 && (
                  <p className="text-sm text-green-600 flex justify-between">
                    <span>Giảm từ điểm tích lũy:</span>
                    <span>{orderDetails.priceDetails.discountFromPoints.toLocaleString()}₫</span>
                  </p>
                )}
                {orderDetails.priceDetails.discountFromVoucher > 0 && (
                  <p className="text-sm text-green-600 flex justify-between">
                    <span>Giảm từ voucher:</span>
                    <span>{orderDetails.priceDetails.discountFromVoucher.toLocaleString()}₫</span>
                  </p>
                )}
                <p className="text-sm font-semibold text-[#333333] flex justify-between">
                  <span>Tổng tiền thanh toán:</span>
                  <span className="text-[#dd3333]">{orderDetails.priceDetails.finalAmount.toLocaleString()}₫</span>
                </p>
              </div>
            </div>

            <h4 className="text-lg font-semibold text-[#333333] mb-3">
              Chọn phương thức thanh toán
            </h4>
            <div className="flex flex-col gap-4 mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="vnpay"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="form-radio h-5 w-5 text-[#dd3333]"
                />
                <span className="text-sm text-[#333333]">VNPay</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="form-radio h-5 w-5 text-[#dd3333]"
                />
                <span className="text-sm text-[#333333]">Thanh toán khi nhận hàng</span>
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelPayment}
                className="bg-gray-200 text-[#333333] px-5 py-2.5 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handlePayment}
                disabled={!paymentMethod}
                className="bg-[#dd3333] text-white px-5 py-2.5 rounded-lg hover:bg-[#a71d1d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Xác nhận thanh toán
              </button>
            </div>
          </div>
        </div>
      )}

      {showVoucherModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 sm:p-8 rounded-2xl max-w-3xl w-full shadow-xl">
            <h3 className="text-2xl font-bold mb-6 text-center text-[#dd3333]">
              Chọn Voucher Của Bạn
            </h3>
            {redeemedVouchers.length === 0 ? (
              <p className="text-center text-gray-600 text-lg">
                Bạn chưa có voucher nào khả dụng.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {redeemedVouchers.map((voucher) => (
                  <div
                    key={voucher.voucherId}
                    onClick={() => handleSelectVoucher(voucher)}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedVoucher?.voucherId === voucher.voucherId
                        ? "border-[#f5c518] bg-[#f5c518]/10"
                        : "border-gray-200 hover:border-[#f5c518] hover:bg-[#f5c518]/5"
                    }`}
                  >
                    <h4 className="text-lg font-semibold text-[#333333]">
                      {voucher.name}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Giảm: {voucher.discount}
                      {voucher.isPercentage ? "%" : " VND"}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Mã Voucher: {voucher.voucherCode}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Hết hạn: {new Date(voucher.expiryDate).toLocaleDateString()}
                    </p>
                    {voucher.minOrderValue > 0 && (
                      <p className="text-gray-600 text-sm">
                        Đơn hàng tối thiểu: {voucher.minOrderValue.toLocaleString()}₫
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowVoucherModal(false)}
                className="bg-gray-200 text-[#333333] px-5 py-2.5 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </CholimexLayout>
  );
};

export default Cart;