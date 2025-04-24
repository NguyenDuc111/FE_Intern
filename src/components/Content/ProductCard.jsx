import { useEffect, useState } from "react";
import { getAllProducts } from "../../api/api";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";

function ProductCard({ selectedCategory, sortType }) {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(stored);

    getAllProducts()
      .then((res) => {
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
        setCurrentPage(1); // reset khi lọc
      })
      .catch(console.error);
  }, [selectedCategory, sortType]);

  const lastIndex = currentPage * productsPerPage;
  const firstIndex = lastIndex - productsPerPage;
  const currentProducts = products.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const toggleWishlist = (product) => {
    const updated = wishlist.some((p) => p.ProductID === product.ProductID)
      ? wishlist.filter((p) => p.ProductID !== product.ProductID)
      : [...wishlist, product];
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

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
          const isFavorite = wishlist.some((w) => w.ProductID === p.ProductID);

          return (
            <div key={p.ProductID} className="bg-white border rounded-lg p-3 shadow-md hover:shadow-xl transition flex flex-col relative group">
              <div className="relative">
                <img src={p.ImageURL} alt={p.ProductName} className="w-full h-[180px] object-cover rounded mb-2" />
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

              <h3 className="text-sm font-semibold text-gray-800 text-center min-h-[40px] line-clamp-2 mb-1">
                {p.ProductName}
              </h3>

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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-[#dd3333] text-white" : "hover:bg-gray-100"}`}
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
