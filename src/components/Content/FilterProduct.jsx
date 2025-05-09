function FilterProduct({ onFilterChange }) {
  return (
    <div className="flex items-center gap-4 mb-2 mt-3">
      <label className="font-medium">Sắp xếp:</label>
      <select
        onChange={(e) => onFilterChange(e.target.value)}
        className="border px-3 py-1 rounded"
      >
        <option value="">-- Chọn --</option>
        <option value="name-asc">Tên A-Z</option>
        <option value="name-desc">Tên Z-A</option>
        <option value="price-asc">Giá tăng dần</option>
        <option value="price-desc">Giá giảm dần</option>
      </select>
    </div>
  );
}

export default FilterProduct;
