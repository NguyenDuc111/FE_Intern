import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  getAllVouchers,
  addVoucher,
  editVoucher,
  deleteVoucher,
} from "../../api/api.js";

const AdminVoucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [formData, setFormData] = useState({
    Name: "",
    DiscountValue: "",
    PointsRequired: "",
    UsageLimit: "",
    RedemptionLimit: "",
    ExpiryDays: "",
    MinOrderValue: "",
  });
  const token = localStorage.getItem("token");

  const loadVouchers = async () => {
    try {
      const response = await getAllVouchers(token);
      setVouchers(response.data.vouchers || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách voucher:", err);
      toast.error(
        err.response?.data?.message || "Không thể tải danh sách voucher."
      );
    }
  };

  useEffect(() => {
    loadVouchers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddVoucher = async (e) => {
    e.preventDefault();
    try {
      const response = await addVoucher(formData, token);
      toast.success(response.data.message);
      setShowAddModal(false);
      setFormData({
        Name: "",
        DiscountValue: "",
        PointsRequired: "",
        UsageLimit: "",
        RedemptionLimit: "",
        ExpiryDays: "",
        MinOrderValue: "",
      });
      loadVouchers();
    } catch (err) {
      console.error("Lỗi khi thêm voucher:", err);
      toast.error(err.response?.data?.message || "Không thể thêm voucher.");
    }
  };

  const handleEditVoucher = async (e) => {
    e.preventDefault();
    try {
      const response = await editVoucher(selectedVoucher.id, formData, token);
      toast.success(response.data.message);
      setShowEditModal(false);
      setSelectedVoucher(null);
      setFormData({
        Name: "",
        DiscountValue: "",
        PointsRequired: "",
        UsageLimit: "",
        RedemptionLimit: "",
        ExpiryDays: "",
        MinOrderValue: "",
      });
      loadVouchers();
    } catch (err) {
      console.error("Lỗi khi sửa voucher:", err);
      toast.error(err.response?.data?.message || "Không thể sửa voucher.");
    }
  };

  const handleDeleteVoucher = async (voucherId) => {
    if (window.confirm("Bạn có chắc muốn xóa voucher này?")) {
      try {
        const response = await deleteVoucher(voucherId, token);
        toast.success(response.data.message);
        loadVouchers();
      } catch (err) {
        console.error("Lỗi khi xóa voucher:", err);
        toast.error(err.response?.data?.message || "Không thể xóa voucher.");
      }
    }
  };

  const openEditModal = (voucher) => {
    setSelectedVoucher(voucher);
    setFormData({
      Name: voucher.name,
      DiscountValue: voucher.discount,
      PointsRequired: voucher.pointsRequired,
      UsageLimit: voucher.usageLimit,
      RedemptionLimit: voucher.redemptionLimit,
      ExpiryDays: voucher.expiryDays,
      MinOrderValue: voucher.minOrderValue,
    });
    setShowEditModal(true);
  };

  return (
    <div className="bg-gradient-to-br from-[#dd3333] to-[#a71d1d] py-12 px-4 sm:px-6 min-h-[60vh]">
      <motion.div
        className="max-w-6xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-lg"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl sm:text-4xl text-center font-bold mb-8 text-[#dd3333]">
          Quản Lý Voucher
        </h2>

        <div className="mb-6">
          <motion.button
            onClick={() => setShowAddModal(true)}
            className="bg-[#dd3333] text-white px-6 py-2.5 rounded-lg hover:bg-[#a71d1d] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Thêm Voucher Mới
          </motion.button>
        </div>

        {vouchers.length === 0 ? (
          <motion.p
            className="text-center text-gray-600 text-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Chưa có voucher nào.
          </motion.p>
        ) : (
          <motion.div
            className="overflow-x-auto rounded-xl border border-gray-200 shadow-md"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <table className="w-full text-sm sm:text-base">
              <thead className="bg-[#f8f8f8] text-[#333333] uppercase text-xs sm:text-sm tracking-wide">
                <tr>
                  <th className="px-6 py-4 text-left">Tên</th>
                  <th className="px-6 py-4 text-center">Giảm Giá</th>
                  <th className="px-6 py-4 text-center">Điểm Yêu Cầu</th>
                  <th className="px-6 py-4 text-center">Giới Hạn Sử Dụng</th>
                  <th className="px-6 py-4 text-center">Giới Hạn Đổi</th>
                  <th className="px-6 py-4 text-center">Ngày Hết Hạn</th>
                  <th className="px-6 py-4 text-center">Đơn Tối Thiểu</th>
                  <th className="px-6 py-4 text-center">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {vouchers.map((voucher) => (
                  <motion.tr
                    key={voucher.id}
                    className="border-t border-gray-100 hover:bg-[#f5c518]/10 transition-colors"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <td className="px-6 py-4 text-left">{voucher.name}</td>
                    <td className="px-6 py-4 text-center">
                      {voucher.discount}
                      {voucher.discount <= 100 ? "%" : "₫"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {voucher.pointsRequired}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {voucher.usageLimit}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {voucher.redemptionLimit}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {voucher.expiryDays} ngày
                    </td>
                    <td className="px-6 py-4 text-center">
                      {parseInt(voucher.minOrderValue).toLocaleString()}₫
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <button
                        onClick={() => openEditModal(voucher)}
                        className="text-[#dd3333] hover:text-[#a71d1d] font-medium text-sm"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteVoucher(voucher.id)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm"
                      >
                        Xóa
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              className="bg-white p-6 sm:p-8 rounded-2xl max-w-lg w-full shadow-xl"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-6 text-[#dd3333]">
                Thêm Voucher Mới
              </h3>
              <form onSubmit={handleAddVoucher} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#333333]">
                    Tên Voucher
                  </label>
                  <input
                    type="text"
                    name="Name"
                    value={formData.Name}
                    onChange={handleInputChange}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#dd3333] focus:ring-[#dd3333] text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333333]">
                    Giá Trị Giảm (%, hoặc VND)
                  </label>
                  <input
                    type="number"
                    name="DiscountValue"
                    value={formData.DiscountValue}
                    onChange={handleInputChange}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#dd3333] focus:ring-[#dd3333] text-sm"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333333]">
                    Điểm Yêu Cầu
                  </label>
                  <input
                    type="number"
                    name="PointsRequired"
                    value={formData.PointsRequired}
                    onChange={handleInputChange}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#dd3333] focus:ring-[#dd3333] text-sm"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333333]">
                    Giới Hạn Sử Dụng
                  </label>
                  <input
                    type="number"
                    name="UsageLimit"
                    value={formData.UsageLimit}
                    onChange={handleInputChange}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#dd3333] focus:ring-[#dd3333] text-sm"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333333]">
                    Giới Hạn Đổi
                  </label>
                  <input
                    type="number"
                    name="RedemptionLimit"
                    value={formData.RedemptionLimit}
                    onChange={handleInputChange}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#dd3333] focus:ring-[#dd3333] text-sm"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333333]">
                    Thời Gian Hết Hạn (Ngày)
                  </label>
                  <input
                    type="number"
                    name="ExpiryDays"
                    value={formData.ExpiryDays}
                    onChange={handleInputChange}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#dd3333] focus:ring-[#dd3333] text-sm"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333333]">
                    Giá Trị Đơn Hàng Tối Thiểu
                  </label>
                  <input
                    type="number"
                    name="MinOrderValue"
                    value={formData.MinOrderValue}
                    onChange={handleInputChange}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#dd3333] focus:ring-[#dd3333] text-sm"
                    required
                    min="0"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <motion.button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="bg-gray-200 text-[#333333] px-5 py-2.5 rounded-lg hover:bg-gray-300 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Hủy
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="bg-[#dd3333] text-white px-5 py-2.5 rounded-lg hover:bg-[#a71d1d] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Thêm
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditModal && selectedVoucher && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              className="bg-white p-6 sm:p-8 rounded-2xl max-w-lg w-full shadow-xl"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-6 text-[#dd3333]">
                Sửa Voucher
              </h3>
              <form onSubmit={handleEditVoucher} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#333333]">
                    Tên Voucher
                  </label>
                  <input
                    type="text"
                    name="Name"
                    value={formData.Name}
                    onChange={handleInputChange}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#dd3333] focus:ring-[#dd3333] text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333333]">
                    Giá Trị Giảm (%, hoặc VND)
                  </label>
                  <input
                    type="number"
                    name="DiscountValue"
                    value={formData.DiscountValue}
                    onChange={handleInputChange}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#dd3333] focus:ring-[#dd3333] text-sm"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333333]">
                    Điểm Yêu Cầu
                  </label>
                  <input
                    type="number"
                    name="PointsRequired"
                    value={formData.PointsRequired}
                    onChange={handleInputChange}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#dd3333] focus:ring-[#dd3333] text-sm"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333333]">
                    Giới Hạn Sử Dụng
                  </label>
                  <input
                    type="number"
                    name="UsageLimit"
                    value={formData.UsageLimit}
                    onChange={handleInputChange}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#dd3333] focus:ring-[#dd3333] text-sm"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333333]">
                    Giới Hạn Đổi
                  </label>
                  <input
                    type="number"
                    name="RedemptionLimit"
                    value={formData.RedemptionLimit}
                    onChange={handleInputChange}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#dd3333] focus:ring-[#dd3333] text-sm"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333333]">
                    Thời Gian Hết Hạn (Ngày)
                  </label>
                  <input
                    type="number"
                    name="ExpiryDays"
                    value={formData.ExpiryDays}
                    onChange={handleInputChange}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#dd3333] focus:ring-[#dd3333] text-sm"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333333]">
                    Giá Trị Đơn Hàng Tối Thiểu
                  </label>
                  <input
                    type="number"
                    name="MinOrderValue"
                    value={formData.MinOrderValue}
                    onChange={handleInputChange}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#dd3333] focus:ring-[#dd3333] text-sm"
                    required
                    min="0"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <motion.button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="bg-gray-200 text-[#333333] px-5 py-2.5 rounded-lg hover:bg-gray-300 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Hủy
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="bg-[#dd3333] text-white px-5 py-2.5 rounded-lg hover:bg-[#a71d1d] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Lưu
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminVoucher;
