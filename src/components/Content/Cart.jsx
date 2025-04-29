import React, { useEffect, useState } from "react";
import CholimexLayout from "../Layout/CholimexLayout";
import {
  getCartAPI,
  updateCartAPI,
  removeCartItemAPI,
} from "../../api/api";
import { toast } from "react-toastify";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [voucher, setVoucher] = useState("");
  const [discount, setDiscount] = useState(0);
  const [voucherStatus, setVoucherStatus] = useState(null); // thêm dòng trạng thái
  const token = localStorage.getItem("token");

  const calculateTotal = (items) =>
    items.reduce(
      (acc, item) => acc + item.Quantity * parseFloat(item.Product.Price),
      0
    );

  const loadCart = async () => {
    if (!token) return;
    try {
      const res = await getCartAPI(token);
      const items = res.data.cartItems || [];
      setCartItems(items);
      setTotalAmount(calculateTotal(items));
    } catch (err) {
      console.error("Lỗi khi lấy giỏ hàng:", err);
    }
  };

  useEffect(() => {
    loadCart();
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

  const applyVoucher = () => {
    if (voucher.trim().toUpperCase() === "GIAM10") {
      setDiscount(10);
      setVoucherStatus({ success: true, message: "Áp dụng mã giảm giá thành công!" });
    } else {
      setDiscount(0);
      setVoucherStatus({ success: false, message: "Mã giảm giá không hợp lệ hoặc đã hết hạn." });
    }
  };

  const discountedTotal = totalAmount * (1 - discount / 100);

  return (
    <CholimexLayout>
      <div className="bg-gradient-to-br from-red-600 to-red-700 py-10 px-4 min-h-[60vh]">
        <div className="max-w-5xl mx-auto bg-white p-4 md:p-6 rounded-xl shadow-xl overflow-x-auto">
          <h2 className="text-2xl font-bold text-center mb-6">🛒 Giỏ Hàng</h2>

          {cartItems.length === 0 ? (
            <p className="text-center">Giỏ hàng đang trống.</p>
          ) : (
            <>
              {/* TABLE */}
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
                      <tr key={item.CartID} className="border-t hover:bg-gray-50">
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
                          ₫{parseInt(item.Product.Price).toLocaleString()}
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
                          ₫
                          {(
                            parseInt(item.Product.Price) * item.Quantity
                          ).toLocaleString()}
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

              {/* Voucher + Tổng tiền */}
              <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                
                {/* Voucher */}
                <div className="w-full md:w-1/2">
                  {voucherStatus && (
                    <div
                      className={`mb-2 text-sm font-semibold ${
                        voucherStatus.success ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {voucherStatus.message}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Mã giảm giá"
                      value={voucher}
                      onChange={(e) => setVoucher(e.target.value)}
                      className="border border-gray-300 px-3 py-2 rounded text-sm w-full"
                    />
                    <button
                      onClick={applyVoucher}
                      className="bg-[#dd3333] text-white text-sm px-4 py-2 rounded hover:bg-red-600"
                    >
                      Áp dụng
                    </button>
                  </div>
                </div>

                {/* Tổng tiền */}
                <div className="flex flex-col items-end w-full md:w-1/2">
                  <p className="text-lg font-semibold text-black">
                    Tổng tiền:&nbsp;
                    <span className="font-bold text-[#dd3333]">
                      ₫{discountedTotal.toLocaleString()}
                    </span>
                  </p>
                  {discount > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      Đã giảm {discount}% cho đơn hàng!
                    </p>
                  )}
                  <button
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
    </CholimexLayout>
  );
};

export default Cart;
