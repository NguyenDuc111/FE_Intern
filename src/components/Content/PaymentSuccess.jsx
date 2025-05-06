import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CholimexLayout from "../Layout/CholimexLayout";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toastShown = useRef(false); // Biến để kiểm tra toast đã hiển thị chưa

  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!toastShown.current && orderId) {
      toast.success(`Thanh toán đơn hàng #${orderId} thành công!`, {
        toastId: `success-${orderId}`,
        autoClose: 3000,
      });
      toastShown.current = true; // Đánh dấu toast đã được hiển thị
    } else if (!orderId) {
      toast.error("Không tìm thấy mã đơn hàng!", {
        toastId: "error-no-order",
        autoClose: 3000,
      });
      toastShown.current = true;
    }
  }, [orderId]);

  return (
    <CholimexLayout>
      <div className="bg-gradient-to-br from-red-600 to-red-700 py-10 px-4 min-h-[60vh]">
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-xl text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            Thanh Toán Thành Công
          </h2>
          <p className="text-lg mb-4">
            Cảm ơn bạn đã thanh toán đơn hàng #{orderId || "N/A"}.
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Đơn hàng của bạn đã được xác nhận và đang được xử lý.
          </p>
          <button
            onClick={() => {
              toast.dismiss(); // Đóng tất cả toast trước khi điều hướng
              setTimeout(() => navigate("/"), 500); // Trì hoãn điều hướng
            }}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    </CholimexLayout>
  );
};

export default PaymentSuccess;