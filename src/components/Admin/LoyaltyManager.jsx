import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

import { getUserPointsByAdmin, updateLoyaltyPoint, deleteLoyaltyPoint } from "../../api/api";

// Component chỉnh sửa điểm
const EditPointForm = ({ point, onSave, onCancel }) => {
  const [points, setPoints] = useState(point.Points);
  const [description, setDescription] = useState(point.Description || "");

  const handleSubmit = () => {
    if (!Number.isFinite(Number(points)) || points === 0) {
      toast.error("Điểm phải là một số khác 0.");
      return;
    }
    onSave({ Points: Number(points), Description: description });
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      className="p-4 bg-gray-50 rounded-lg"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
    >
      <div className="mb-4">
        <label className="block mb-1.5 font-medium text-gray-700">
          Điểm <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md bg-gray-50"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1.5 font-medium text-gray-700">
          Mô tả
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md bg-gray-50"
          rows={3}
        />
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t mt-4">
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={onCancel}
          className="px-5 py-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 rounded-lg transition-colors duration-200 shadow-md"
        >
          Hủy
        </motion.button>
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={handleSubmit}
          className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-colors duration-200 shadow-md"
        >
          Lưu
        </motion.button>
      </div>
    </motion.div>
  );
};

const LoyaltyManager = () => {
  const [points, setPoints] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editingPointId, setEditingPointId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPoints = async () => {
      if (!token) {
        toast.error("Vui lòng đăng nhập để tiếp tục.");
        navigate("/admin/login");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        if (decoded.RoleName !== "admin") {
          toast.error("Bạn không có quyền truy cập.");
          navigate("/admin/login");
          return;
        }

        if (selectedUserId) {
          setLoading(true);
          const res = await getUserPointsByAdmin(token, selectedUserId);
          const { totalPoints, history } = res.data;
          setPoints(history || []);
          setTotalPoints(totalPoints || 0);
        } else {
          setPoints([]);
          setTotalPoints(0);
        }
      } catch (err) {
        toast.error(
          err.response?.data?.error || "Không thể tải danh sách điểm."
        );
        setPoints([]);
        setTotalPoints(0);
      } finally {
        setLoading(false);
      }
    };
    fetchPoints();
  }, [navigate, token, selectedUserId]);

  const handleUpdatePoint = async (pointId, data) => {
    try {
      await updateLoyaltyPoint(pointId, data, token);
      const updatedPoints = points.map((point) =>
        point.PointID === pointId ? { ...point, ...data } : point
      );
      setPoints(updatedPoints);
      const updatedTotal = updatedPoints.reduce(
        (sum, point) => sum + point.Points,
        0
      );
      setTotalPoints(updatedTotal);
      setEditingPointId(null);
      toast.success("Đã cập nhật điểm thành công.");
    } catch (err) {
      toast.error(err.response?.data?.error || "Cập nhật điểm thất bại.");
    }
  };

  const handleDeletePoint = async (pointId) => {
    if (window.confirm("Bạn có chắc muốn xóa bản ghi này?")) {
      try {
        await deleteLoyaltyPoint(pointId, token);
        const updatedPoints = points.filter(
          (point) => point.PointID !== pointId
        );
        setPoints(updatedPoints);
        const updatedTotal = updatedPoints.reduce(
          (sum, point) => sum + point.Points,
          0
        );
        setTotalPoints(updatedTotal);
        toast.success("Đã xóa bản ghi điểm.");
      } catch (err) {
        toast.error(err.response?.data?.error || "Xóa bản ghi thất bại.");
      }
    }
  };

  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <p className="text-gray-800 text-lg">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
        📈 Quản lý Điểm Tích Lũy
      </h1>

      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">
          Chọn User ID:
        </label>
        <input
          type="number"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="w-full md:w-1/3 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md bg-gray-50"
          placeholder="Nhập User ID"
        />
        <p className="mt-2 text-lg font-semibold text-gray-800">
          Tổng điểm: {totalPoints}
        </p>
      </div>

      {points.length === 0 ? (
        <motion.p
          className="text-center text-gray-600 text-lg"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          Không có điểm nào để quản lý cho User ID này.
        </motion.p>
      ) : (
        <motion.div
          variants={tableVariants}
          initial="hidden"
          animate="visible"
          className="overflow-x-auto shadow-xl rounded-xl bg-white border border-gray-200"
        >
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">
                  ID
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  User ID
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Điểm
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Mô tả
                </th>
                <th scope="col" className="px-6 py-4 font-semibold text-center">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {points.map((point) => (
                <motion.tr
                  key={point.PointID}
                  variants={rowVariants}
                  className="bg-white border-b hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-200"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {point.PointID}
                  </td>
                  <td className="px-6 py-4">{point.UserID}</td>
                  <td className="px-6 py-4">
                    {point.Points > 0 ? `+${point.Points}` : point.Points}
                  </td>
                  <td className="px-6 py-4">{point.Description}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-3">
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setEditingPointId(point.PointID)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-1.5 rounded-lg transition-colors duration-200 flex items-center gap-1.5 shadow-sm"
                      >
                        <PencilIcon className="h-5 w-5" />
                        Sửa
                      </motion.button>
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => handleDeletePoint(point.PointID)}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-1.5 rounded-lg transition-colors duration-200 flex items-center gap-1.5 shadow-sm"
                      >
                        <TrashIcon className="h-5 w-5" />
                        Xóa
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      <AnimatePresence>
        {editingPointId && (
          <div
            className="fixed inset-0 backdrop-blur-md bg-black/60 flex items-center justify-center z-50"
            onClick={(e) => e.target === e.currentTarget && setEditingPointId(null)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-2xl w-[600px] max-w-[95vw] h-auto max-h-[95vh] relative flex flex-col shadow-2xl border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 flex-1 flex flex-col overflow-hidden">
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  📝 Sửa Điểm Tích Lũy
                </h2>
                <EditPointForm
                  point={points.find((p) => p.PointID === editingPointId)}
                  onSave={(data) => handleUpdatePoint(editingPointId, data)}
                  onCancel={() => setEditingPointId(null)}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoyaltyManager;