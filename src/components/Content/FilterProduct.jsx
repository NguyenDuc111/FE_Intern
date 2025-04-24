import { useState } from "react";

function FilterProduct({ onFilterChange }) {
  const [sortType, setSortType] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSortType(value);
    onFilterChange(value); // Gửi loại lọc về parent (Categories)
  };

  return (
    <div className="mb-4 flex justify-end">
      <select
        value={sortType}
        onChange={handleChange}
        className="border border-gray-300 px-3 py-2 rounded text-sm"
      >
        <option value="">-- Sắp xếp theo --</option>
        <option value="name-asc">Tên A-Z</option>
        <option value="name-desc">Tên Z-A</option>
        <option value="price-asc">Giá tăng dần</option>
        <option value="price-desc">Giá giảm dần</option>
      </select>
    </div>
  );
}

export default FilterProduct;
