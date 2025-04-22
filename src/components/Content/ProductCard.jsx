function ProductCard({ product }) {
    return (
        <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
          <img
            src={product.ImageURL}
            alt={product.ProductName}
            className="w-full h-48 object-cover rounded mb-4"
          />
          <h3 className="text-lg font-semibold">{product.ProductName}</h3>
          <p className="text-sm text-gray-500 mb-2">{product.Description}</p>
          <span className="text-red-500 font-semibold">
            {product?.Price != null ? `${product.Price.toLocaleString()}₫` : 'Đang cập nhật'}
          </span>
        </div>
      );
}

export default ProductCard;
