import CholimexLayout from "../Layout/CholimexLayout";
import BannerCarousel from "./BannerCarousel";
import logo from "../../assets/image/imageCholimex.jpg";
import image1 from "../../assets/image/image1.jpg";
import image2 from "../../assets/image/image2.jpg";
import image3 from "../../assets/image/image3.png";
import { useEffect, useState } from "react";
import { getAllProducts } from "../../api/api";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllProducts()
      .then((res) => {
        const sorted = res.data
          .filter(product => product.CreatedAt)
          .sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
        setProducts(sorted.slice(0, 8));
      })
      .catch((err) => console.error("Lỗi khi tải sản phẩm:", err));
  }, []);

  return (
    <CholimexLayout>
      <BannerCarousel />

      {/* Giới thiệu Cholimex */}
      <section className="py-10">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-[#dd3333]">
            Giới thiệu Cholimex
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Công ty Cổ phần Thực phẩm Cholimex là một trong những thương hiệu
            hàng đầu trong lĩnh vực chế biến thực phẩm tại Việt Nam. Với hơn 40
            năm phát triển, Cholimex luôn mang đến các sản phẩm gia vị, nước
            chấm và thực phẩm tiện lợi chất lượng cao, phù hợp với khẩu vị người
            Việt.
          </p>
          <div className="max-w-screen-xl mx-auto px-4 w-150 mt-4 mb-4">
            <img src={logo} alt="Giới thiệu Cholimex" className="rounded-lg" />
          </div>
          <p className="text-gray-700 leading-relaxed">
            Qua 40 năm xây dựng và phát triển, Công ty Cổ phần Thực phẩm
            Cholimex (Cholimex Food) đã và đang khẳng định vị thế của mình trong
            ngành thực phẩm ở trong và ngoài nước, với sản phẩm đạt thương hiệu
            quốc gia và có năng lực cạnh tranh cao trên thị trường quốc tế, góp
            phần lan tỏa hương vị Việt hội nhập sâu rộng với thế giới.
          </p>
        </div>
      </section>

      {/* Hình ảnh và mô tả */}
      <section className="py-10 bg-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 space-y-12">
          {[{ img: image1, text: "Đa dạng sản phẩm chất lượng" },
            { img: image2, text: "Công nghệ hiện đại" },
            { img: image3, text: "Thương hiệu quốc gia" }].map((item, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row ${index % 2 === 0 ? "md:flex-row-reverse" : ""} items-center gap-6`}
            >
              <img
                src={item.img}
                alt="info"
                className="w-full md:w-1/2 rounded-lg shadow-md"
              />
              <div className="w-full md:w-1/2 text-lg text-gray-700 font-medium">
                {item.text}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sản phẩm mới */}
      <section className="py-10">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-[#dd3333]">
            Sản phẩm mới
          </h2>
          <div className="flex overflow-x-auto gap-4 pb-4">
            {products.map((product) => (
              <div
                key={product.ProductID}
                className="min-w-[200px] bg-white rounded shadow-md p-4 flex-shrink-0"
              >
                <img
                  src={product.ImageURL}
                  alt={product.ProductName}
                  className="mb-2 rounded w-full h-[150px] object-cover"
                />
                <p className="text-center text-sm font-semibold">
                  {product.ProductName}
                </p>
                <p className="text-center text-sm text-gray-500">
                  {product.Price?.toLocaleString()} VND
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </CholimexLayout>
  );
}

export default Home;
