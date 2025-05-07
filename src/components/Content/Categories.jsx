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
      <div className="min-h-screen bg-gradient-to-b from-[#fc00001b] to-[#f60000d8] transition-colors duration-300">
        {/* === BANNER PRO STYLE === */}
        <div className="relative h-[350px] w-full bg-[url('./assets/image/Cholimexb3.jpg')] bg-cover bg-center mb-8 shadow-lg transition-all duration-300 hover:shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent rounded-lg" />
          <div className="absolute inset-0 flex items-center justify-center flex-col text-white text-center px-4 animate-fadeIn">
            <h2 className="text-5xl font-semibold mb-4 drop-shadow-2xl bg-[#dd3333]/80 px-6 py-3 rounded-lg">
              KHÁM PHÁ DANH MỤC CHOLIMEX
            </h2>
            <p className="text-xl drop-shadow-lg bg-white/20 px-4 py-2 rounded-lg tracking-wide">
              CHẤT LƯỢNG - AN TOÀN - CHUẨN VỊ VIỆT
            </p>
          </div>
        </div>

        {/* === DANH MỤC DROPDOWN === */}
        <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-sm py-4 shadow-md mb-8 px-4 max-w-screen-xl mx-auto rounded-lg transition-all duration-300">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setOpen(!open)}
              className="bg-[#dd3333] text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <span>Danh mục sản phẩm</span>
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div className="hidden md:block">
              <FilterProduct onFilterChange={setSortType} />
            </div>
          </div>

          {open && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <div
                ref={menuRef}
                className="bg-white w-[90%] max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slideDown"
              >
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-[#dd3333]">
                    Danh mục sản phẩm
                  </h3>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-gray-500 hover:text-red-600 text-2xl transition-colors"
                  >
                    ×
                  </button>
                </div>
                <ul className="max-h-[60vh] overflow-y-auto divide-y divide-gray-100">
                  <li
                    className={`px-6 py-4 cursor-pointer hover:bg-red-50/80 transition-all duration-200 ${
                      !selectedCategory
                        ? "bg-red-50 text-[#dd3333] font-medium"
                        : ""
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
                      className={`px-6 py-4 cursor-pointer hover:bg-red-50/80 transition-all duration-200 ${
                        selectedCategory === cat.CategoryName
                          ? "bg-red-50 text-[#dd3333] font-medium"
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
            </div>
          )}
        </div>

        {/* === LỌC & SẢN PHẨM - GẦN NHAU === */}
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="block md:hidden mb-6">
            <FilterProduct onFilterChange={setSortType} />
          </div>

          <div className="animate-fadeIn">
            <ProductCard
              selectedCategory={selectedCategory}
              sortType={sortType}
            />
          </div>
        </div>
      </div>
    </CholimexLayout>
  );
}

export default Categories;