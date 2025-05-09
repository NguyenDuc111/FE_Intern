import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

import { getAllReviews, updateReview, deleteReview } from "../../api/api";

// Component để chỉnh sửa đánh giá
const EditReviewForm = ({ review, onSave, onCancel }) => {
  const [rating, setRating] = useState(review.Rating);
  const [comment, setComment] = useState(review.Comment || "");

  const handleSubmit = () => {
    if (!Number.isInteger(Number(rating)) || rating < 1 || rating > 5) {
      toast.error("Điểm đánh giá phải là số nguyên từ 1 đến 5.");
      return;
    }
    onSave({ Rating: Number(rating), Comment: comment });
  };

  return (
    <motion.div
      className="p-4 bg-gray-50 rounded-lg"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-4">
        <label className="block text-sm font-semibold text-[#333333] mb-1">
          Điểm đánh giá
        </label>
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:border-[#dd3333] focus:ring-[#dd3333] text-sm"
          min={1}
          max={5}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold text-[#333333] mb-1">
          Bình luận
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:border-[#dd3333] focus:ring-[#dd3333] text-sm"
          rows={3}
        />
      </div>
      <div className="flex justify-end gap-2">
        <motion.button
          onClick={onCancel}
          className="bg-gray-200 text-[#333333] px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Hủy
        </motion.button>
        <motion.button
          onClick={handleSubmit}
          className="bg-[#dd3333] text-white px-4 py-2 rounded-lg hover:bg-[#a71d1d] transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Lưu
        </motion.button>
      </div>
    </motion.div>
  );
};

const ReviewManager = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReviews = async () => {
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

        const { data } = await getAllReviews();
        setReviews(data || []);
      } catch (err) {
        toast.error(
          err.response?.data?.error || "Không thể tải danh sách đánh giá."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [navigate, token]);

  const handleUpdateReview = async (reviewId, data) => {
    try {
      const { data: updatedReview } = await updateReview(reviewId, data);
      setReviews(
        reviews.map((review) =>
          review.ReviewID === reviewId
            ? { ...review, ...updatedReview.review }
            : review
        )
      );
      setEditingReviewId(null);
      toast.success("Đã cập nhật đánh giá.");
    } catch (err) {
      toast.error(err.response?.data?.error || "Cập nhật đánh giá thất bại.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setReviews(reviews.filter((review) => review.ReviewID !== reviewId));
      toast.success("Đã xóa đánh giá.");
    } catch (err) {
      toast.error(err.response?.data?.error || "Xóa đánh giá thất bại.");
    }
  };

  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const rowVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.2,
        type: "spring",
        stiffness: 100,
      },
    },
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-[#dd3333] to-[#a71d1d] py-12 px-4 sm:px-6 min-h-[60vh] flex items-center justify-center">
        <p className="text-white text-lg">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#dd3333] to-[#a71d1d] py-12 px-4 sm:px-6 min-h-[60vh]">
      <motion.div
        className="max-w-6xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-lg"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <h2 className="text-3xl sm:text-4xl text-center font-bold mb-8 text-[#dd3333]">
          📦 Quản Lý Bình Luận
        </h2>

        {reviews.length === 0 ? (
          <motion.p
            className="text-center text-gray-600 text-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            Không có bình luận nào để quản lý.
          </motion.p>
        ) : (
          <motion.div
            className="overflow-x-auto rounded-xl border border-gray-100 shadow-md"
            variants={tableVariants}
            initial="hidden"
            animate="visible"
          >
            <table className="w-full text-sm sm:text-base">
              <thead className="bg-[#f8f8f8] text-[#333333] uppercase text-xs sm:text-sm tracking-wide">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold">ID</th>
                  <th className="text-left px-6 py-4 font-semibold">
                    Người dùng
                  </th>
                  <th className="text-left px-6 py-4 font-semibold">
                    Sản phẩm
                  </th>
                  <th className="text-center px-6 py-4 font-semibold">Điểm</th>
                  <th className="text-left px-6 py-4 font-semibold">
                    Bình luận
                  </th>
                  <th className="text-center px-6 py-4 font-semibold">
                    Ngày tạo
                  </th>
                  <th className="text-center px-6 py-4 font-semibold">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <motion.tr
                    key={review.ReviewID}
                    className="border-t border-gray-100 hover:bg-[#f5c518]/10 transition-colors"
                    variants={rowVariants}
                  >
                    <td className="px-6 py-4">{review.ReviewID}</td>
                    <td className="px-6 py-4">{review.User.FullName}</td>
                    <td className="px-6 py-4">{review.Product.ProductName}</td>
                    <td className="text-center px-6 py-4">{review.Rating}/5</td>
                    <td className="px-6 py-4">
                      {review.Comment || "Không có bình luận"}
                    </td>
                    <td className="text-center px-6 py-4">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                    <td className="text-center px-6 py-4 space-x-2">
                      <motion.button
                        onClick={() => setEditingReviewId(review.ReviewID)}
                        className="bg-[#dd3333] text-white px-4 py-1.5 rounded-lg hover:bg-[#a71d1d] transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Sửa
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteReview(review.ReviewID)}
                        className="bg-gray-200 text-[#333333] px-4 py-1.5 rounded-lg hover:bg-gray-300 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Xóa
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        <AnimatePresence>
          {editingReviewId && (
            <motion.div
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setEditingReviewId(null)}
            >
              <motion.div
                className="bg-white p-6 sm:p-8 rounded-2xl max-w-lg w-full shadow-xl"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold mb-6 text-[#dd3333] border-b border-gray-100 pb-3">
                  Chỉnh sửa đánh giá
                </h3>
                <EditReviewForm
                  review={reviews.find((r) => r.ReviewID === editingReviewId)}
                  onSave={(data) => handleUpdateReview(editingReviewId, data)}
                  onCancel={() => setEditingReviewId(null)}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ReviewManager;
