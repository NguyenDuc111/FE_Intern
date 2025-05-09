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
import { AiFillStar, AiFillHeart } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductCard({ selectedCategory, sortType, searchQuery }) {
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

      // Lọc theo danh mục
      if (selectedCategory) {
        data = data.filter((product) =>
          product.Categories?.some(
            (cat) => cat.CategoryName === selectedCategory
          )
        );
      }

      // Lọc theo từ khóa tìm kiếm
      if (searchQuery) {
        data = data.filter((product) =>
          product.ProductName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Sắp xếp sản phẩm
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
  }, [selectedCategory, sortType, searchQuery]);

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
      <div className="flex justify-center mb-8">
        <h2 className="text-3xl font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
          {selectedCategory ? selectedCategory : "Tất cả sản phẩm"}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {currentProducts.length === 0 ? (
          <strong className="text-center text-white col-span-full text-3xl">
            Không tìm thấy sản phẩm nào.
          </strong>
        ) : (
          currentProducts.map((p) => {
            const hasDiscount = p.OldPrice && p.OldPrice > p.Price;
            const isFavorite = wishlist.some(
              (w) => w.Product.ProductID === p.ProductID
            );

            return (
              <div
                key={p.ProductID}
                onClick={() => navigate(`/product/${p.ProductID}`)}
                className="bg-white border border-gray-100 rounded-xl p-4 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 transform group cursor-pointer overflow-hidden flex flex-col min-h-[360px]"
              >
                <div className="relative w-full h-48">
                  <img
                    src={p.ImageURL || "/default.jpg"}
                    alt={p.ProductName}
                    className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
                  />
                  {hasDiscount && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md animate-pulse-once">
                      -{Math.round(((p.OldPrice - p.Price) / p.OldPrice) * 100)}%
                    </span>
                  )}
                  {p.Rating && (
                    <div className="absolute bottom-2 left-2 flex items-center bg-white/90 px-2 py-1 rounded-lg shadow-sm">
                      {[...Array(5)].map((_, i) => (
                        <AiFillStar
                          key={i}
                          className={
                            i < p.Rating
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>

                <h3 className="text-base font-semibold text-gray-900 mt-3 line-clamp-2 hover:text-[#dd3333] transition-colors min-h-[48px]">
                  {p.ProductName}
                </h3>

                <div className="flex items-center justify-between mt-2 min-h-[24px]">
                  <span className="text-lg font-bold text-[#dd3333]">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(p.Price)}
                  </span>
                  {hasDiscount && (
                    <span className="text-gray-500 line-through text-sm">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(p.OldPrice)}
                    </span>
                  )}
                </div>

                <div className="flex justify-end items-center mt-auto pt-4 gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(p);
                    }}
                    title="Yêu thích"
                    className={`p-2 rounded-full border transition-all duration-300 hover:bg-red-100 hover:scale-110 ${
                      isFavorite
                        ? "bg-red-50 border-red-300 text-[#dd3333]"
                        : "border-gray-200"
                    }`}
                  >
                    {isFavorite ? (
                      <AiFillHeart size={20} className="text-[#dd3333]" />
                    ) : (
                      <FiHeart size={20} />
                    )}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(p);
                    }}
                    title="Thêm vào giỏ"
                    className="bg-[#dd3333] text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                  >
                    <FiShoppingCart size={18} />
                    <span>Thêm</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 border rounded-lg transition-all duration-300 ${
                currentPage === i + 1
                  ? "bg-[#dd3333] text-white shadow-md"
                  : "bg-white hover:bg-gray-100 border-gray-300"
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