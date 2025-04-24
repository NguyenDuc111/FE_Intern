import { useEffect, useState } from "react";
import { getAllProducts } from "../../api/api";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";

function ProductCard({ filterSubCategory, sortType }) {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(stored);

    getAllProducts()
      .then((res) => {
        let filtered = res.data;

        // Lọc theo danh mục con nếu có
        if (filterSubCategory) {
          filtered = filtered.filter((p) => p.Category === filterSubCategory);
        }

        // Sắp xếp theo loại lọc
        switch (sortType) {
          case "name-asc":
            filtered.sort((a, b) => a.ProductName.localeCompare(b.ProductName));
            break;
          case "name-desc":
            filtered.sort((a, b) => b.ProductName.localeCompare(a.ProductName));
            break;
          case "price-asc":
            filtered.sort((a, b) => a.Price - b.Price);
            break;
          case "price-desc":
            filtered.sort((a, b) => b.Price - a.Price);
            break;
          default:
            break;
        }

        setProducts(filtered);
      })
      .catch(console.error);
  }, [filterSubCategory, sortType]);

  const toggleWishlist = (product) => {
    const updated = wishlist.some(p => p.ProductID === product.ProductID)
      ? wishlist.filter(p => p.ProductID !== product.ProductID)
      : [...wishlist, product];
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {products.map((p) => {
        const hasDiscount = p.OldPrice && p.OldPrice > p.Price;
        const isFavorite = wishlist.some((w) => w.ProductID === p.ProductID);

        return (
          <div key={p.ProductID} className="bg-white border rounded-lg p-3 shadow-md hover:shadow-xl transition flex flex-col relative group">
            <div className="relative">
              <img src={p.ImageURL} alt={p.ProductName} className="w-full h-[160px] object-cover rounded mb-2" />
              {hasDiscount && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded shadow font-bold z-10">
                  -{Math.round(((p.OldPrice - p.Price) / p.OldPrice) * 100)}%
                </span>
              )}
              {p.Rating && (
                <div className="absolute bottom-2 left-2 flex items-center text-yellow-500 text-sm bg-white/80 px-1 rounded z-10">
                  {[...Array(5)].map((_, i) => (
                    <AiFillStar key={i} className={i < p.Rating ? "text-yellow-400" : "text-gray-300"} />
                  ))}
                </div>
              )}
            </div>

            <h3 className="text-sm font-semibold text-gray-800 text-center min-h-[40px] line-clamp-2 mb-1">{p.ProductName}</h3>

            <div className="text-left text-sm font-bold mb-2">
              {hasDiscount && (
                <span className="line-through text-gray-400 mr-2 text-xs">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p.OldPrice)}
                </span>
              )}
              <span className="text-[#dd3333] text-[16px]">
                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p.Price)}
              </span>
            </div>

            <div className="flex justify-end mt-auto gap-2">
              <button onClick={() => toggleWishlist(p)} title="Yêu thích" className={`p-2 rounded-full border ${isFavorite ? "border-pink-400 text-pink-500" : "border-gray-300"} hover:bg-pink-100 transition hover:scale-110`}>
                <FiHeart size={18} />
              </button>
              <button title="Thêm vào giỏ" className="p-2 rounded-full border border-gray-300 hover:bg-[#dd3333] hover:text-white transition hover:scale-110">
                <FiShoppingCart size={18} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProductCard;
