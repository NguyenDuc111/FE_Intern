import { useState } from "react";
import CholimexLayout from "../Layout/CholimexLayout";
import ProductCard from "./ProductCard";
import FilterProduct from "./FilterProduct";

const categories = [
  "Gia Vị - Nước Chấm",
  "Thực Phẩm Chế Biến",
  "Xốt & Sauce",
  "Thực Phẩm Đông Lạnh",
  "Tương Ớt",
  "Tương Cà",
  "Sa Tế",
];

function Categories() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortType, setSortType] = useState("");

  return (
    <CholimexLayout>
      {/* Danh mục đơn giản */}
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold text-[#dd3333] mb-4">Danh mục sản phẩm</h2>
        <div className="flex flex-wrap gap-3 mb-6">
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 border rounded-full text-sm ${
                selectedCategory === cat
                  ? "bg-[#dd3333] text-white"
                  : "bg-white text-gray-800 border-gray-300"
              } hover:bg-red-100 transition`}
            >
              {cat}
            </button>
          ))}
        </div>

        <FilterProduct onFilterChange={setSortType} />
        <ProductCard filterSubCategory={selectedCategory} sortType={sortType} />
      </div>
    </CholimexLayout>
  );
}

export default Categories;
