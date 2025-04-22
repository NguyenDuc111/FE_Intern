// ProductPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [categories, setCategories] = useState(["Tất cả"]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get("/products");
        const fetchedProducts = res.data.products || [];

        const extractedCategories = [
          "Tất cả",
          ...new Set(fetchedProducts.map((p) => p.Category.CategoryName)),
        ];

        setProducts(fetchedProducts);
        setCategories(extractedCategories);
      } catch (err) {
        console.error("Lỗi khi lấy sản phẩm:", err);
      }
    }

    fetchProducts();
  }, []);

  const filteredProducts =
    activeCategory === "Tất cả"
      ? products
      : products.filter((p) => p.Category.CategoryName === activeCategory);

  return (
    
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Sản phẩm</h1>

      <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 border rounded-full text-sm font-medium ${
              activeCategory === cat
                ? "bg-[#dd3333] text-white"
                : "bg-white text-black border-gray-300"
            } hover:bg-[#dd3333] hover:text-white transition`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.ProductID} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductPage;
