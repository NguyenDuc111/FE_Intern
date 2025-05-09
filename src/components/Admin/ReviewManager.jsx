import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { PencilIcon, TrashIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";

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
          Điểm đánh giá <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md bg-gray-50"
          min={1}
          max={5}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1.5 font-medium text-gray-700">
          Bình luận
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
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

const ReviewManager = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
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
    if (confirm("Bạn có chắc muốn xóa bình luận này?")) {
      try {
        await deleteReview(reviewId);
        setReviews(reviews.filter((review) => review.ReviewID !== reviewId));
        toast.success("Đã xóa bình luận.");
      } catch (err) {
        toast.error(err.response?.data?.error || "Xóa bình luận thất bại.");
      }
    }
  };

  // Lọc danh sách dựa trên tìm kiếm
  const filteredReviews = reviews.filter(
    (review) =>
      review.User.FullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (review.Comment &&
        review.Comment.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
      <h1 className="text-3xl font-bold mb-6 text-red-600">
        📝 Quản lý bình luận & Đánh giá
      </h1>

      {/* Ô tìm kiếm với icon kính lúp và animation */}
      <div className="mb-6 relative">
        <motion.div
          className="relative"
          initial={{ width: "160px" }}
          animate={{ width: isFocused || searchQuery ? "100%" : "160px" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              if (!searchQuery) setIsFocused(false);
            }}
            placeholder="Tìm kiếm theo tên hoặc bình luận..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md bg-gray-50"
          />
          <MagnifyingGlassIcon
            className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
          />
        </motion.div>
      </div>

      {filteredReviews.length === 0 ? (
        <motion.p
          className="text-center text-gray-600 text-lg"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          Không có bình luận nào phù hợp.
        </motion.p>
      ) : (
        <>
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
                    Người dùng
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Sản phẩm
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Điểm
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Bình luận
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Ngày tạo
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold text-center">
                    Edit
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentReviews.map((review) => (
                  <motion.tr
                    key={review.ReviewID}
                    variants={rowVariants}
                    className="bg-white border-b hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-200"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {review.ReviewID}
                    </td>
                    <td className="px-6 py-4">{review.User.FullName}</td>
                    <td className="px-6 py-4">{review.Product.ProductName}</td>
                    <td className="px-6 py-4">{review.Rating}/5</td>
                    <td className="px-6 py-4">
                      {review.Comment || "Không có bình luận"}
                    </td>
                    <td className="px-6 py-4">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString()
                        : "Không có thông tin"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-3">
                        <motion.button
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          onClick={() => setEditingReviewId(review.ReviewID)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-1.5 rounded-lg transition-colors duration-200 flex items-center gap-1.5 shadow-sm"
                        >
                          <PencilIcon className="h-5 w-5" />
                          Sửa
                        </motion.button>
                        <motion.button
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          onClick={() => handleDeleteReview(review.ReviewID)}
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

          {/* Điều hướng phân trang */}
          <div className="mt-6 flex justify-center items-center gap-4">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 rounded-lg transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </motion.button>
            <span className="text-gray-700">
              Trang {currentPage} / {totalPages}
            </span>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 rounded-lg transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </motion.button>
          </div>
        </>
      )}

      <AnimatePresence>
        {editingReviewId && (
          <div
            className="fixed inset-0 backdrop-blur-md bg-black/60 flex items-center justify-center z-50"
            onClick={() => setEditingReviewId(null)}
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
                  📝 Sửa bình luận & đánh giá
                </h2>
                <EditReviewForm
                  review={reviews.find((r) => r.ReviewID === editingReviewId)}
                  onSave={(data) => handleUpdateReview(editingReviewId, data)}
                  onCancel={() => setEditingReviewId(null)}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReviewManager;