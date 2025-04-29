import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllProducts,
  addToCartAPI,
  getWishlistAPI,
  addToWishlistAPI,
  removeFromWishlistAPI,
} from "../../api/api";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiFillHeart } from "react-icons/ai"; // nhớ import thêm

function ProductCard({ selectedCategory, sortType }) {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const productsPerPage = 15;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(localStorage.getItem("user")) : null;

  const loadProducts = async () => {
    try {
      const res = await getAllProducts();
      let data = res.data;

      if (selectedCategory) {
        data = data.filter((product) =>
          product.Categories?.some(
            (cat) => cat.CategoryName === selectedCategory
          )
        );
      }

      if (sortType === "name-asc") {
        data.sort((a, b) => a.ProductName.localeCompare(b.ProductName));
      } else if (sortType === "name-desc") {
        data.sort((a, b) => b.ProductName.localeCompare(a.ProductName));
      } else if (sortType === "price-asc") {
        data.sort((a, b) => a.Price - b.Price);
      } else if (sortType === "price-desc") {
        data.sort((a, b) => b.Price - a.Price);
      }

      setProducts(data);
    } catch (error) {
      console.error("Lỗi load sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadWishlist = async () => {
    if (!token) return;
    try {
      const res = await getWishlistAPI(token);
      setWishlist(res.data);
    } catch (err) {
      console.error("Lỗi lấy wishlist:", err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, sortType]);

  useEffect(() => {
    loadWishlist();
  }, [token]);

  const handleAddToCart = async (product) => {
    if (!user) {
      toast.error("Bạn cần đăng nhập để thêm giỏ hàng!", {
        position: "top-center",
      });
      return;
    }
    try {
      await addToCartAPI(
        {
          UserID: user.UserID,
          ProductID: product.ProductID,
          Quantity: 1,
        },
        token
      );
      toast.success("\ud83d\uded2\ufe0f Đã thêm vào giỏ hàng!", {
        position: "top-center",
      });
      const event = new Event("cartUpdated");
      window.dispatchEvent(event);
    } catch (err) {
      console.error("Lỗi thêm vào giỏ hàng:", err);
      toast.error(err.response?.data?.error || "Thêm giỏ hàng thất bại.", {
        position: "top-center",
      });
    }
  };

  const toggleWishlist = async (product) => {
    if (!user) {
      toast.error("Bạn cần đăng nhập để yêu thích sản phẩm!", {
        position: "top-center",
      });
      return;
    }
    const found = wishlist.find(
      (w) => w.Product.ProductID === product.ProductID
    );

    try {
      if (found) {
        await removeFromWishlistAPI(found.WishlistID, token);
        toast.info("\ud83d\udc94 Đã bỏ yêu thích", { position: "top-center" });
      } else {
        await addToWishlistAPI({ ProductID: product.ProductID }, token);
        toast.success("\u2764\ufe0f Đã thêm vào yêu thích", {
          position: "top-center",
        });
      }
      await loadWishlist();
    } catch (err) {
      console.error("Lỗi xử lý yêu thích:", err);
      toast.error(err.response?.data?.error || "Xử lý yêu thích thất bại.", {
        position: "top-center",
      });
    }
  };

  const lastIndex = currentPage * productsPerPage;
  const firstIndex = lastIndex - productsPerPage;
  const currentProducts = products.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(products.length / productsPerPage);

  if (loading)
    return <div className="text-center py-10">Đang tải sản phẩm...</div>;

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10">
      <div className="flex justify-center mb-6">
        <h2 className="text-2xl font-bold text-white text-center px-6 py-3 rounded-md bg-gradient-to-r from-red-600 to-red-700 shadow-md">
          {selectedCategory ? selectedCategory : "Tất cả sản phẩm"}
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {currentProducts.map((p) => {
          const hasDiscount = p.OldPrice && p.OldPrice > p.Price;
          const isFavorite = wishlist.some(
            (w) => w.Product.ProductID === p.ProductID
          );

          return (
            <div
              key={p.ProductID}
              onClick={() => navigate(`/product/${p.ProductID}`)}
              className="cursor-pointer bg-white border rounded-lg p-3 shadow-md hover:shadow-xl transition flex flex-col relative group"
            >
              <div className="relative">
                <img
                  src={p.ImageURL}
                  alt={p.ProductName}
                  className="w-full h-[180px] object-cover rounded mb-2"
                />
                {hasDiscount && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded shadow font-bold z-10">
                    -{Math.round(((p.OldPrice - p.Price) / p.OldPrice) * 100)}%
                  </span>
                )}
                {p.Rating && (
                  <div className="absolute bottom-2 left-2 flex items-center text-yellow-500 text-sm bg-white/80 px-1 rounded z-10">
                    {[...Array(5)].map((_, i) => (
                      <AiFillStar
                        key={i}
                        className={
                          i < p.Rating ? "text-yellow-400" : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                )}
              </div>

              <h3 className="text-sm font-semibold text-gray-800 text-center min-h-[40px] line-clamp-2 mb-1">
                {p.ProductName}
              </h3>

              <div className="text-left text-sm font-bold mb-2">
                {hasDiscount && (
                  <span className="line-through text-gray-400 mr-2 text-xs">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(p.OldPrice)}
                  </span>
                )}
                <span className="text-[#dd3333] text-[16px]">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(p.Price)}
                </span>
              </div>

              <div className="flex justify-end mt-auto gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Ngăn lan sự kiện ra thẻ cha
                    toggleWishlist(p); // Gọi hàm thêm yêu thích
                  }}
                  title="Yêu thích"
                  className={`p-2 rounded-full border transition hover:scale-110 ${
                    isFavorite
                      ? "bg-[#ffe6e6] border-red-400 text-red-500"
                      : "border-gray-300 hover:bg-pink-100"
                  }`}
                >
                  {isFavorite ? (
                    <AiFillHeart size={18} className="text-[#dd3333]" />
                  ) : (
                    <FiHeart size={18} />
                  )}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Ngăn sự kiện lan lên card sản phẩm
                    handleAddToCart(p); // Xử lý thêm vào giỏ
                  }}
                  title="Thêm vào giỏ"
                  className="p-2 rounded-full border border-gray-300 hover:bg-[#dd3333] hover:text-white transition hover:scale-110"
                >
                  <FiShoppingCart size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1
                  ? "bg-[#dd3333] text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductCard;
