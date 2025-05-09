import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Star } from "lucide-react";
import CholimexLayout from "../Layout/CholimexLayout";
import {
  getProductById,
  addToCartAPI,
  getAllProducts,
  getReviewsByProduct,
  createReview,
} from "../../api/api";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        const res = await getProductById(id);
        const productData = res.data;
        setProduct(productData);

        
        const reviewRes = await getReviewsByProduct(id);
        setReviews(reviewRes.data || []);
        const totalRating = reviewRes.data.reduce(
          (sum, r) => sum + r.Rating,
          0
        );
        setRating(
          reviewRes.data.length > 0 ? totalRating / reviewRes.data.length : 0
        );

        // Fetch related products
        const allProducts = await getAllProducts();
        const filtered = allProducts.data.filter(
          (p) => p.ProductID !== productData.ProductID
        );
        setRelatedProducts(filtered.slice(0, 4));
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm hoặc đánh giá:", error);
        toast.error("Không thể tải sản phẩm hoặc đánh giá", {
          position: "top-center",
        });
      }
    };

    fetchProductAndReviews();
  }, [id]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedWishlist = localStorage.getItem("wishlist");

    if (storedUser && storedUser !== "undefined") {
      setUser(JSON.parse(storedUser));
    }
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  if (!product) {
    return (
      <div className="text-center py-10 text-gray-500 text-lg">
        Đang tải sản phẩm...
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.ProductID);

  const handleToggleWishlist = () => {
    if (!user) {
      toast.error("Bạn cần đăng nhập để yêu thích sản phẩm!", {
        position: "top-center",
      });
      return;
    }

    const updated = isWishlisted
      ? wishlist.filter((id) => id !== product.ProductID)
      : [...wishlist, product.ProductID];

    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));

    toast[isWishlisted ? "info" : "success"](
      isWishlisted
        ? "Đã bỏ yêu thích sản phẩm!"
        : "Đã thêm vào danh sách yêu thích!",
      { position: "top-center" }
    );
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Bạn cần đăng nhập để thêm vào giỏ hàng!", {
        position: "top-center",
      });
      return;
    }

    if (product.StockQuantity <= 0) {
      toast.error("Sản phẩm đã hết hàng!", { position: "top-center" });
      return;
    }

    try {
      await addToCartAPI(
        {
          UserID: user.UserID,
          ProductID: product.ProductID,
          Quantity: 1,
        },
        localStorage.getItem("token")
      );

      toast.success("Đã thêm sản phẩm vào giỏ hàng!", {
        position: "top-center",
      });

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ:", error);
      toast.error("Thêm vào giỏ hàng thất bại!", {
        position: "top-center",
      });
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Bạn cần đăng nhập để đánh giá!", { position: "top-center" });
      return;
    }

    if (newReview.rating < 1 || newReview.rating > 5) {
      toast.error("Điểm đánh giá phải từ 1 đến 5!", { position: "top-center" });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await createReview(
        {
          ProductID: product.ProductID,
          Rating: newReview.rating,
          Comment: newReview.comment,
        },
        token
      );
      toast.success("Đánh giá của bạn đã được gửi!", {
        position: "top-center",
      });
      setNewReview({ rating: 0, comment: "" });
      const reviewRes = await getReviewsByProduct(id);
      setReviews(reviewRes.data || []);
      const totalRating = reviewRes.data.reduce((sum, r) => sum + r.Rating, 0);
      setRating(
        reviewRes.data.length > 0 ? totalRating / reviewRes.data.length : 0
      );
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      toast.error(error.response?.data?.error || "Gửi đánh giá thất bại!", {
        position: "top-center",
      });
    }
  };

  const handleStarClick = (ratingValue) => {
    setNewReview({ ...newReview, rating: ratingValue });
  };

  return (
    <CholimexLayout>
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-[#dd3333] hover:underline text-sm font-medium"
        >
          ← Quay lại
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img
              src={
                product.ImageURL || "https://source.unsplash.com/500x500?food"
              }
              alt={product.ProductName}
              className="w-full rounded-lg object-cover "
            />
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">{product.ProductName}</h1>
            <p className="text-2xl text-[#dd3333] font-semibold">
              {Number(product.Price).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
                minimumFractionDigits: 0,
              })}
            </p>

            <div className="text-sm font-semibold text-gray-700">
              {product.StockQuantity > 0 ? (
                <span>Kho: {product.StockQuantity} sản phẩm</span>
              ) : (
                <span className="text-red-500">Hết hàng</span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  size={20}
                  fill={idx < Math.round(rating) ? "#dd3333" : "#e5e7eb"}
                  stroke="#dd3333"
                />
              ))}
              <span className="text-sm text-gray-600 ml-2">
                {rating.toFixed(1)} / 5
              </span>
            </div>

            <div className="text-gray-700 leading-relaxed space-y-2 whitespace-pre-line">
              {product.Description}
            </div>

            {product.Ingredients && (
              <div className="mt-4">
                <h3 className="font-semibold text-gray-700">Thành phần:</h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {product.Ingredients}
                </p>
              </div>
            )}

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleToggleWishlist}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold border transition ${
                  isWishlisted
                    ? "bg-pink-500 text-white border-pink-500"
                    : "text-pink-500 border-pink-500 hover:bg-pink-500 hover:text-white"
                }`}
              >
                ❤️ {isWishlisted ? "Đã yêu thích" : "Yêu thích"}
              </button>

              <button
                onClick={handleAddToCart}
                disabled={product.StockQuantity <= 0}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold transition ${
                  product.StockQuantity <= 0
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-[#dd3333] text-white hover:bg-red-600"
                }`}
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-[#dd3333]">
            Sản phẩm tương tự
          </h2>

          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <div
                  key={item.ProductID}
                  onClick={() => navigate(`/product/${item.ProductID}`)}
                  className="bg-white rounded-lg overflow-hidden shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
                >
                  <img
                    src={item.ImageURL}
                    alt={item.ProductName}
                    className="w-full h-[150px] object-cover"
                  />
                  <div className="p-4 text-center">
                    <p className="text-sm font-semibold">{item.ProductName}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      {Number(item.Price).toLocaleString("vi-VN")}₫
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Không có sản phẩm tương tự.</p>
          )}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-[#dd3333]">Bình luận</h2>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.ReviewID} className="border-b pb-4">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{review.User.FullName}</p>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          size={16}
                          fill={idx < review.Rating ? "#dd3333" : "#e5e7eb"}
                          stroke="#dd3333"
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">
                        {review.Rating} / 5
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 mt-2">{review.Comment}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(review.CreatedAt).toLocaleString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Chưa có bình luận nào.</p>
          )}

          {user && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-700 mb-2">
                Thêm bình luận của bạn
              </h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Đánh giá:
                  </label>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, idx) => {
                      const starValue = idx + 1;
                      return (
                        <Star
                          key={idx}
                          size={24}
                          fill={
                            starValue <= newReview.rating
                              ? "#dd3333"
                              : "#e5e7eb"
                          }
                          stroke="#dd3333"
                          className="cursor-pointer transition-all duration-200 hover:scale-110"
                          onClick={() => handleStarClick(starValue)}
                        />
                      );
                    })}
                    <span className="text-sm text-gray-600 ml-2">
                      {newReview.rating > 0
                        ? `${newReview.rating} / 5`
                        : "Chọn điểm đánh giá"}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bình luận:
                  </label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview({ ...newReview, comment: e.target.value })
                    }
                    className="mt-1 block w-full border rounded-md p-2"
                    rows="4"
                    placeholder="Viết nhận xét của bạn..."
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-[#dd3333] text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Gửi đánh giá
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </CholimexLayout>
  );
}

export default ProductDetail;