import React, { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { FaGift, FaCheckCircle, FaRegClock } from "react-icons/fa";
import CholimexLayout from "../Layout/CholimexLayout";
import {
  getAvailableVouchers,
  redeemVoucher,
  getRedeemedVouchers,
  getLoyaltyPointsAPI,
} from "../../api/api";
import { toast } from "react-toastify";

const Vouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [redeemedVouchers, setRedeemedVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [redeeming, setRedeeming] = useState({});
  const token = localStorage.getItem("token");
  const [totalPoints, setTotalPoints] = useState(0);

  const loadVouchers = async () => {
    if (!token) {
      toast.error("Vui lòng đăng nhập để xem voucher.");
      return;
    }
    try {
      setLoading(true);
      const response = await getAvailableVouchers(token);
      setVouchers(response.data.vouchers || []);
    } catch (err) {
      console.error("Lỗi khi lấy voucher:", err);
      toast.error(err.response?.data?.message || "Không thể tải voucher.");
    } finally {
      setLoading(false);
    }
  };

  const loadRedeemedVouchers = async () => {
    if (!token) {
      toast.error("Vui lòng đăng nhập để xem voucher đã đổi.");
      return;
    }
    try {
      setLoading(true);
      const response = await getRedeemedVouchers(token);
      const sortedVouchers = (response.data.vouchers || []).sort((a, b) => {
        if (a.status === "active" && b.status !== "active") return -1;
        if (a.status !== "active" && b.status === "active") return 1;
        if (a.status === "used" && b.status === "expired") return -1;
        if (a.status === "expired" && b.status === "used") return 1;
        return 0;
      });
      setRedeemedVouchers(sortedVouchers);
    } catch (err) {
      console.error("Lỗi khi lấy voucher đã đổi:", err);
      toast.error(
        err.response?.data?.message || "Không thể tải voucher đã đổi."
      );
    } finally {
      setLoading(false);
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
  const handleRedeem = useCallback(
    debounce(async (voucherId) => {
      if (!token) {
        toast.error("Vui lòng đăng nhập để đổi voucher.");
        return;
      }
      setRedeeming((prev) => ({ ...prev, [voucherId]: true }));
      try {
        const response = await redeemVoucher({ voucherId }, token);
        toast.success(response.data.message);
        await loadVouchers();
        await loadRedeemedVouchers();
      } catch (err) {
        console.error("Lỗi khi đổi voucher:", err);
        toast.error(err.response?.data?.message || "Đổi voucher thất bại.");
      } finally {
        setRedeeming((prev) => ({ ...prev, [voucherId]: false }));
      }
    }, 1000),
    [token]
  );

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        loadVouchers(),
        loadRedeemedVouchers(),
        loadLoyaltyPoints(),
      ]);
    };
    fetchData();
  }, []);

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Còn hạn";
      case "used":
        return "Đã sử dụng";
      case "expired":
        return "Hết hạn";
      default:
        return "Không xác định";
    }
  };

  return (
    <CholimexLayout>
      <div className="bg-gradient-to-br from-red-600 to-red-700 py-10 px-6 min-h-[100vh]">
        <div className="max-w-7xl mx-auto bg-white p-6 rounded-3xl shadow-2xl overflow-hidden sm:p-8">
          <h2 className="text-4xl text-center font-semibold mb-8 text-red-700 flex items-center justify-center gap-3 sm:text-3xl">
            <FaGift /> Danh Sách Voucher
          </h2>
          <label className="text-sm font-semibold text-[#333333]">
            điểm tích lũy của bạn : {totalPoints} điểm
          </label>
          {loading ? (
            <p className="text-center text-white">Đang tải...</p>
          ) : vouchers.length === 0 ? (
            <p className="text-center text-white">Không có voucher nào.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {vouchers.map((voucher) => (
                <div
                  key={voucher.id}
                  className="border border-gray-300 rounded-lg p-4 shadow-lg hover:shadow-2xl transition-all"
                  style={{
                    background: "linear-gradient(to right, #F44336, #FF9800)",
                  }}
                >
                  <h3 className="text-lg font-semibold text-white mb-2 sm:text-xl">
                    {voucher.name}
                  </h3>
                  <p className="text-white text-sm sm:text-base">
                    📌 Giảm: {voucher.discount}
                    {voucher.discount <= 100 ? "%" : " VND"}
                  </p>
                  <p className="text-white text-sm sm:text-base mt-1">
                    🎯 Điểm cần: {voucher.pointsRequired}
                  </p>
                  <p className="text-white text-sm sm:text-base mt-1">
                    🔄 Lượt đổi còn lại:{" "}
                    {voucher.redemptionsRemaining > 0
                      ? `Còn ${voucher.redemptionsRemaining} lượt đổi`
                      : "Hết lượt đổi"}
                  </p>

                  <button
                    onClick={() => handleRedeem(voucher.id)}
                    disabled={
                      voucher.redemptionsRemaining === 0 ||
                      redeeming[voucher.id]
                    }
                    className={`mt-4 px-4 py-2 rounded-lg font-semibold text-white flex items-center justify-center min-w-[150px] ${
                      voucher.redemptionsRemaining === 0 ||
                      redeeming[voucher.id]
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-yellow-600 hover:bg-yellow-700"
                    } transition-all duration-300`}
                  >
                    {redeeming[voucher.id] ? (
                      <span className="flex items-center gap-2">
                        <FaRegClock className="animate-spin" /> Đang xử lý
                      </span>
                    ) : (
                      "Đổi Voucher"
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}

          <h2 className="text-4xl text-center font-semibold mt-12 mb-8 text-red-700 flex items-center justify-center gap-3 sm:text-3xl">
            <FaCheckCircle /> Voucher Đã Đổi
          </h2>

          {loading ? (
            <p className="text-center text-white">Đang tải...</p>
          ) : redeemedVouchers.length === 0 ? (
            <p className="text-center text-white">Bạn chưa đổi voucher nào.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {redeemedVouchers.map((voucher) => (
                <div
                  key={voucher.voucherId}
                  className="border border-gray-300 rounded-lg p-4 shadow-lg hover:shadow-2xl transition-all"
                  style={{
                    background: "linear-gradient(to right, #FF9800, #F44336)",
                  }}
                >
                  <h3 className="text-lg font-semibold text-white mb-2 sm:text-xl">
                    {voucher.name}
                  </h3>
                  <p className="text-white text-sm sm:text-base">
                    📌 Giảm: {voucher.discount}
                    {voucher.isPercentage ? "%" : " VND"}
                  </p>
                  <p className="text-white text-sm sm:text-base mt-1">
                    ⏰ Hết hạn:{" "}
                    {new Date(voucher.expiryDate).toLocaleDateString()}
                  </p>
                  <p className="text-white text-sm sm:text-base mt-1">
                    📍 Trạng thái: {getStatusText(voucher.status)}
                  </p>
                  <strong className="text-white text-sm sm:text-base mt-1">
                    🧾 Mã Voucher: {voucher.voucherCode}
                  </strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </CholimexLayout>
  );
};

export default Vouchers;
