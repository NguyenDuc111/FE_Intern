import { useEffect, useState, useRef } from "react";
import CholimexLayout from "../Layout/CholimexLayout";
import ProductCard from "./ProductCard";
import FilterProduct from "./FilterProduct";
import { getAllCategories } from "../../api/api";

function Categories() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortType, setSortType] = useState("");
  const menuRef = useRef();

  useEffect(() => {
    getAllCategories()
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Lỗi khi lấy danh mục: ", err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <CholimexLayout>
      {/* === BANNER PRO STYLE === */}
      <div className="relative h-[280px] w-full bg-[url('/images/banner-category.jpg')] bg-cover bg-center rounded-md shadow-md mb-10">
        <div className="absolute inset-0 bg-black/30 rounded-md" />
        <div className="absolute inset-0 flex items-center justify-center flex-col text-white text-center px-4">
          <h2 className="text-3xl font-bold mb-2 drop-shadow-lg">
            Khám phá tất cả danh mục Cholimex
          </h2>
          <p className="text-lg drop-shadow-md">
            Chất lượng - An toàn - Ngon chuẩn vị Việt
          </p>
        </div>
      </div>

      {/* === DANH MỤC DROPDOWN === */}
      <div className="relative mb-6 px-4 max-w-screen-xl mx-auto">
        <button
          onClick={() => setOpen(!open)}
          className="bg-[#dd3333] text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Danh mục sản phẩm
        </button>

        {open && (
          <div
            ref={menuRef}
            className="absolute top-14 left-0 w-[240px] bg-white rounded shadow-md border z-50"
          >
            <h3 className="text-lg font-bold p-4 border-b text-[#dd3333]">
              Danh mục
            </h3>
            <ul className="divide-y divide-gray-100">
              <li
                className={`px-4 py-3 cursor-pointer hover:bg-red-50 transition ${
                  !selectedCategory ? "bg-red-50 text-[#dd3333]" : ""
                }`}
                onClick={() => {
                  setSelectedCategory(null);
                  setOpen(false);
                }}
              >
                Tất cả
              </li>
              {categories.map((cat) => (
                <li
                  key={cat.CategoryID}
                  className={`px-4 py-3 cursor-pointer hover:bg-red-50 transition ${
                    selectedCategory === cat.CategoryName
                      ? "bg-red-50 text-[#dd3333]"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedCategory(cat.CategoryName);
                    setOpen(false);
                  }}
                >
                  {cat.CategoryName}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* === LỌC & SẢN PHẨM - GẦN NHAU === */}
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex justify-center mb-6">
  
</div>
          <FilterProduct onFilterChange={setSortType} />
        </div>

        <ProductCard selectedCategory={selectedCategory} sortType={sortType} />
      </div>
    </CholimexLayout>
  );
}

export default Categories;
