import React, { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import CholimexLayout from "../Layout/CholimexLayout";
import {
  getAvailableVouchers,
  redeemVoucher,
  getRedeemedVouchers,
} from "../../api/api";
import { toast } from "react-toastify";

const Vouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [redeemedVouchers, setRedeemedVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [redeeming, setRedeeming] = useState({});
  const token = localStorage.getItem("token");

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
      // Sắp xếp: active trước, sau đó used, rồi expired
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
    loadVouchers();
    loadRedeemedVouchers();
  }, []);

  // Hàm hiển thị trạng thái voucher
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
      <div className="bg-gradient-to-br from-red-600 to-red-700 py-10 px-4 min-h-[60vh]">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-xl">
          <h2 className="text-3xl text-center font-semibold mb-8 text-red-700">
            Danh Sách Voucher
          </h2>
          {loading ? (
            <p className="text-center">Đang tải...</p>
          ) : vouchers.length === 0 ? (
            <p className="text-center">Không có voucher nào.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vouchers.map((voucher) => (
                <div
                  key={voucher.id}
                  className="border rounded-lg p-4 shadow-md"
                >
                  <h3 className="text-lg font-semibold">{voucher.name}</h3>
                  <p>
                    Giảm: {voucher.discount}
                    {voucher.discount <= 100 ? "%" : " VND"}
                  </p>
                  <p>Điểm cần: {voucher.pointsRequired}</p>
                  <p>
                    Lượt đổi còn lại:{" "}
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
                    className={`mt-2 px-4 py-2 rounded text-white ${
                      voucher.redemptionsRemaining === 0 ||
                      redeeming[voucher.id]
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {redeeming[voucher.id] ? "Đang đổi..." : "Đổi Voucher"}
                  </button>
                </div>
              ))}
            </div>
          )}

          <h2 className="text-3xl text-center font-semibold mt-12 mb-8 text-red-700">
            Voucher Đã Đổi
          </h2>
          {loading ? (
            <p className="text-center">Đang tải...</p>
          ) : redeemedVouchers.length === 0 ? (
            <p className="text-center">Bạn chưa đổi voucher nào.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {redeemedVouchers.map((voucher) => (
                <div
                  key={voucher.voucherId}
                  className={`border rounded-lg p-4 shadow-md ${
                    voucher.status === "active"
                      ? "bg-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <h3 className="text-lg font-semibold">{voucher.name}</h3>
                  <p>
                    Giảm: {voucher.discount}
                    {voucher.isPercentage ? "%" : " VND"}
                  </p>
                  <p>Mã Voucher: {voucher.voucherCode}</p>
                  <p>
                    Hết hạn: {new Date(voucher.expiryDate).toLocaleDateString()}
                  </p>
                  <p>Trạng thái: {getStatusText(voucher.status)}</p>
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
