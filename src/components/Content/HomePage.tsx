import React, { useEffect, useState } from 'react';
import Header from '../headerfooter/Header';
import Footer from '../headerfooter/Footer';
import BannerCarousel from './BannerCarousel';
import ProductCard from './ProductCard';
import { getAllProducts } from "../../api/api";

type Category = {
  CategoryID: number;
  CategoryName: string;
};

type Product = {
  ProductID: number;
  ProductName: string;
  Description: string;
  Price: number;
  StockQuantity: number;
  ImageURL: string;
  Category: Category;
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);

        const res = await getAllProducts(); // ✅ gọi từ api.js
        const data = res.data;

        if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          throw new Error('Dữ liệu sản phẩm không hợp lệ');
        }
      } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
        setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <>
      <Header />
      <div className="px-4 py-6">
        <BannerCarousel />

        <h2 className="text-2xl font-bold my-6">Tất cả sản phẩm</h2>

        {loading && <p className="text-center">Đang tải sản phẩm...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && products.length === 0 && (
          <p className="text-center">Không có sản phẩm nào.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.ProductID} product={product} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
