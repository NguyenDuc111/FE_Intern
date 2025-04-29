import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CholimexLayout from "../Layout/CholimexLayout";
import { toast } from "react-toastify";

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get("orderId");
  const message = searchParams.get("message");

  useEffect(() => {
    toast.error(
      message
        ? `Thanh toán đơn hàng #${orderId} thất bại: ${decodeURIComponent(message)}`
        : `Thanh toán đơn hàng #${orderId} thất bại.`
    );
  }, [orderId, message]);

  return (
    <CholimexLayout>
      <div className="bg-gradient-to-br from-red-600 to-red-700 py-10 px-4 min-h-[60vh]">
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-xl text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Thanh Toán Thất Bại
          </h2>
          <p className="text-lg mb-4">
            Thanh toán đơn hàng #{orderId} không thành công.
          </p>
          {message && (
            <p className="text-sm text-gray-600 mb-6">
              Lý do: {decodeURIComponent(message)}
            </p>
          )}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate("/cart")}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
            >
              Quay lại giỏ hàng
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </CholimexLayout>
  );
};

export default PaymentFailed;