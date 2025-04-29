import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CholimexLayout from "../Layout/CholimexLayout";
import { useNavigate } from "react-router-dom";

function ProductDetail() {
  const [rating] = useState(4.5);
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [stockQuantity, setStockQuantity] = useState(5); // giả lập có 5 sản phẩm còn trong kho
  const navigate = useNavigate();

  const productId = "P001"; // giả lập ProductID

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

  const isWishlisted = wishlist.includes(productId);

  const handleToggleWishlist = () => {
    if (!user) {
      toast.error("Bạn cần đăng nhập để yêu thích sản phẩm!", {
        position: "top-center",
      });
      return;
    }

    let updatedWishlist = [];

    if (isWishlisted) {
      updatedWishlist = wishlist.filter((id) => id !== productId);
      toast.info("Đã bỏ yêu thích sản phẩm!", { position: "top-center" });
    } else {
      updatedWishlist = [...wishlist, productId];
      toast.success("Đã thêm vào danh sách yêu thích!", {
        position: "top-center",
      });
    }

    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  const handleAddToCart = () => {
    if (stockQuantity <= 0) {
      toast.error("Sản phẩm đã hết hàng!", { position: "top-center" });
      return;
    }
    toast.success("Đã thêm sản phẩm vào giỏ hàng!", { position: "top-center" });
  };

  return (
    <CholimexLayout>
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {/* Nút quay lại */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-[#dd3333] hover:underline text-sm font-medium"
        >
          ← Quay lại
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Hình ảnh sản phẩm */}
          <div>
            <img
              src="https://via.placeholder.com/500"
              alt="Sản phẩm"
              className="w-full rounded-lg object-cover"
            />
          </div>

          {/* Thông tin sản phẩm */}
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Tên Sản Phẩm</h1>
            <p className="text-2xl text-[#dd3333] font-semibold">199.000₫</p>

            {/* Tồn kho */}
            <div className="text-sm font-semibold text-gray-700">
              {stockQuantity > 0 ? (
                <span>Kho: {stockQuantity} sản phẩm</span>
              ) : (
                <span className="text-red-500">Hết hàng</span>
              )}
            </div>

            {/* Đánh giá */}
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  size={20}
                  fill={idx < Math.round(rating) ? "#dd3333" : "#e5e7eb"}
                  stroke="#dd3333"
                />
              ))}
              <span className="text-sm text-gray-600 ml-2">{rating} / 5</span>
            </div>

            {/* Mô tả dài */}
            <div className="text-2xl font-bold text-center">
              Mô Tả Sản Phẩm
            </div>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p>
                Đây là sản phẩm chất lượng cao, được sản xuất theo quy trình
                hiện đại, an toàn thực phẩm. Thích hợp sử dụng hàng ngày cho gia
                đình bạn.
              </p>
              <p>
                Sản phẩm mang hương vị đậm đà, thơm ngon tự nhiên, giúp bữa ăn
                của bạn thêm phần hấp dẫn. Hãy trải nghiệm ngay hôm nay!
              </p>
              <p>
                Thành phần: Bột mì, gia vị, nước tương, ớt, dầu mè và các nguyên
                liệu tự nhiên khác.
              </p>
            </div>

            {/* Nút yêu thích và thêm giỏ hàng */}
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
                disabled={stockQuantity <= 0}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold transition ${
                  stockQuantity <= 0
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-[#dd3333] text-white hover:bg-red-600"
                }`}
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>

        {/* Sản phẩm tương tự */}
        <div className="mt-12">
  <h2 className="text-2xl font-bold mb-6 text-[#dd3333]">Sản phẩm tương tự</h2>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    {[1, 2, 3, 4].map((item) => (
      <div
        key={item}
        className="bg-white rounded-lg overflow-hidden shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
      >
        <img
          src="https://via.placeholder.com/200"
          alt={`Sản phẩm ${item}`}
          className="w-full h-[150px] object-cover"
        />
        <div className="p-4 text-center">
          <p className="text-sm font-semibold">Sản phẩm {item}</p>
          <p className="text-gray-500 text-sm mt-1">99.000₫</p>
        </div>
      </div>
    ))}
  </div>
</div>

        {/* Bình luận */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-[#dd3333]">
            Đánh giá và Bình luận
          </h2>
          <div className="text-gray-600">
            (Phần này sẽ hiển thị sau khi kết nối API và người dùng đã mua hàng)
          </div>
        </div>
      </div>
    </CholimexLayout>
  );
}

export default ProductDetail;
