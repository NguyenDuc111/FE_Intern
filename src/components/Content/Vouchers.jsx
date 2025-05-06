import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getAvailableVouchersAPI,
  redeemVoucherAPI,
  getLoyaltyPointsAPI,
} from "../../api/api";
import CholimexLayout from "../Layout/CholimexLayout";
import { jwtDecode } from "jwt-decode";

const Vouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
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
    const fetchData = async () => {
      if (!token || !userId) {
        toast.error("Vui lòng đăng nhập để tiếp tục.");
        setIsLoading(false);
        return;
      }

      try {
        const [vouchersRes, pointsRes] = await Promise.all([
          getAvailableVouchersAPI(null, token),
          getLoyaltyPointsAPI(null, token),
        ]);

        // Kiểm tra dữ liệu trả về từ API
        if (!vouchersRes.data || !Array.isArray(vouchersRes.data.vouchers)) {
          console.error("Dữ liệu voucher không hợp lệ:", vouchersRes);
          setVouchers([]);
          toast.error("Dữ liệu voucher không hợp lệ.");
        } else {
          setVouchers(vouchersRes.data.vouchers);
        }

        setTotalPoints(pointsRes.data.totalPoints || 0);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error.message, error.stack);
        setVouchers([]);
        toast.error(error.response?.data?.message || "Không thể tải dữ liệu.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, userId]);

  const handleRedeemVoucher = async (voucherId) => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);
        userId = decoded.UserID; // Make sure this matches the capitalization
      } catch (err) {
        console.error("Lỗi giải mã token:", err);
        toast.error("Token không hợp lệ. Vui lòng đăng nhập lại.");
      }
    }

    try {
      // Pass the token as the second parameter
      const response = await redeemVoucherAPI({ voucherId }, token);
      toast.success(response.data.message);

      // Cập nhật lại điểm sau khi đổi voucher
      const pointsRes = await getLoyaltyPointsAPI(null, token);
      setTotalPoints(pointsRes.data.totalPoints || 0);
    } catch (error) {
      console.error("Lỗi khi đổi voucher:", error);
      toast.error(
        error.response?.data?.message ||
          "Đổi voucher thất bại. Vui lòng kiểm tra lại thông tin."
      );
    }
  };

  return (
    <CholimexLayout>
      <div className="container mx-auto p-6 max-w-6xl">
        <h1 className="text-4xl font-bold text-center text-red-700 mb-8">
          Đổi Điểm Tích Lũy Lấy Voucher
        </h1>
        <p className="text-center text-lg mb-6">
          Điểm tích lũy hiện tại:{" "}
          <span className="font-semibold">{totalPoints}</span>
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Danh Sách Voucher Có Sẵn
          </h2>
          {isLoading ? (
            <p className="text-center text-gray-600">Đang tải...</p>
          ) : Array.isArray(vouchers) && vouchers.length === 0 ? (
            <p className="text-center text-gray-600">
              Hiện không có voucher nào.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vouchers.map((voucher) => (
                <div
                  key={voucher.id}
                  className="border rounded-lg p-6 shadow-md hover:shadow-lg transition bg-white"
                >
                  <h3 className="text-xl font-bold text-gray-800">
                    {voucher.name}
                  </h3>
                  <p className="text-gray-600">
                    Giảm giá: {voucher.discount}
                    {voucher.discount <= 100 ? "%" : " VND"}
                  </p>
                  <p className="text-gray-600">
                    Điểm yêu cầu: {voucher.pointsRequired}
                  </p>
                  <p className="text-gray-600">
                    Giới hạn sử dụng: {voucher.usageLimit} lần
                  </p>
                  <p className="text-gray-600">
                    Hết hạn sau: {voucher.expiryDays} ngày
                  </p>
                  <button
                    onClick={() => handleRedeemVoucher(voucher.id)}
                    className="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={totalPoints < voucher.pointsRequired}
                  >
                    Đổi Voucher
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </CholimexLayout>
  );
};

export default Vouchers;
