import CholimexLayout from "../Layout/CholimexLayout";
import logo from "../../assets/image/MatTienCty.jpg";

function About() {
  return (
    <CholimexLayout>
      {/* Section Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-800 to-red-700 opacity-90"></div>
        <div className="max-w-screen-xl mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
              GIỚI THIỆU CHUNG
            </h1>
            <p className="text-xl text-red-100 max-w-3xl mx-auto mb-8">
              Hơn 40 năm hình thành và phát triển <br />
              Ẩm Thực Việt
            </p>
            <button className="bg-white text-red-600 font-bold px-8 py-3 rounded-full hover:bg-red-50 transition-all duration-300 shadow-lg hover:shadow-xl">
              CHOLIMEX FOOD
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 opacity-20">
          <svg
            className="h-64 w-64 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
        </div>
      </div>

      {/* Nội dung về công ty */}
      <div className="max-w-screen-xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-red-600 mb-6 text-center">
              Về Cholimex
            </h2>
            <p className="text-gray-700 mb-4">
              Thành lập năm 1983, Cholimex là thương hiệu gia vị và thực phẩm
              hàng đầu Việt Nam , Cholimexfood phấn đấu trở thành nhà sản xuất,
              chế biến, phân phối thực phẩm hàng đầu với chuỗi sản phẩm đa dạng,
              phong phú, đáp ứng đầy đủ các tiêu chuẩn an toàn vệ sinh thực phẩm
              Quốc gia và Quốc tế để phù hợp với thị hiếu tiêu dùng ngày càng
              cao của thị trường nội địa và xuất khẩu.
              <br /> <br />
              Khai thác nguồn lực vốn, công nghệ và kinh nghiệm từ mọi thành
              phần kinh tế trong và ngoài nước dưới nhiều hình thức hợp tác nhằm
              phát triển đồng bộ, xây dựng chuỗi cung ứng khép kín, từ vùng
              nguyên liệu đến chế biến, cung cấp thực phẩm an toàn chất lượng
              cao, đảm bảo quá trình giám sát và truy nguyên nguồn gốc. Nâng cao
              năng lực sản xuất, chế biến sản phẩm xuất khẩu và phát triển kênh
              phân phối. Liên kết đào tạo nguồn nhân lực, đáp ứng nhu cầu phát
              triển của Cholimex food giai đoạn 2018-2025.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-xl">
            <img
              src={logo}
              alt="Nhà máy Cholimex"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Thông tin công ty & Vốn điều lệ */}
        <div className="mt-16 grid md:grid-cols-2 gap-10">
          {/* Thông tin công ty */}
          <div className="bg-gray-200 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-red-600 mb-8 text-center">
              Thông tin công ty
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Thông tin chung
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li>
                    <strong>Tên công ty:</strong> Công ty Cổ Phần Thực Phẩm
                    Cholimex
                  </li>
                  <li>
                    <strong>Tên giao dịch:</strong> Cholimex Food Joint Stock
                    Company
                  </li>
                  <li>
                    <strong>Mã số thuế:</strong> 0304475742
                  </li>
                  <li>
                    <strong>Ngày thành lập:</strong> 1983
                  </li>
                  <li>
                    <strong>Mã chứng khoán:</strong> CMF
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Địa chỉ liên hệ
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li>
                    <strong>Trụ sở chính:</strong> Lô C40-43/I, C51-55/II, Đường
                    số 7, KCN Vĩnh Lộc, Xã Vĩnh Lộc A, Huyện Bình Chánh, TP.HCM
                  </li>
                  <li>
                    <strong>Điện thoại:</strong> (028) 37653389/90/91
                  </li>
                  <li>
                    <strong>Email:</strong> cholimexfood@cholimexfood.com.vn
                  </li>
                  <li>
                    <strong>Website:</strong> https://cholimexfood.com.vn
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Vốn điều lệ, Hội đồng, Ban điều hành */}
          <div className="bg-gray-100 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-red-600 mb-8 text-center">
              Vốn điều lệ
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-gray-800">
              <div>
                <h4 className="text-lg font-semibold mb-2">Vốn điều lệ</h4>
                <p>81.000.000.000 đồng (Tám mươi mốt tỷ đồng)</p>
                <ul className="mt-2 list-disc list-inside text-sm">
                  <li>
                    Công ty Cổ phần XNK và Đầu Tư Chợ Lớn (CHOLIMEX): 40,72%
                  </li>
                  <li>Nhichirei Foods Inc. (Nhật Bản): 19,00%</li>
                  <li>Tonkin Products Ltd. (Anh Quốc): 5,21%</li>
                  <li>Các cổ đông khác: 35,07%</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">
                  Hội đồng quản trị
                </h4>
                <ul className="text-sm space-y-1">
                  <li>Ông Huỳnh An Trung Chủ tịch</li>
                  <li>Ông Diệp Nam Hải Thành viên</li>
                  <li>Ông Thân Ngọc Nghĩa Thành viên</li>
                  <li>
                    Bà Nguyễn Thị Huyền Trang <br /> Thành viên
                  </li>
                  <li>Ông Trần Phương Bắc Thành viên</li>
                </ul>
                <h5 className="font-semibold mt-4">Ban kiểm soát</h5>
                <ul className="text-sm space-y-1">
                  <li>
                    Ông Phạm Văn Tranh <br /> Trưởng ban
                  </li>
                  <li>
                    Ông Võ Văn Đầy <br /> Thành viên
                  </li>
                  <li>Bà Đỗ Thị Hoàng Yến Thành viên</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Ban điều hành</h4>
                <ul className="text-sm space-y-1">
                  <li>
                    <strong>Tổng Giám Đốc:</strong> <br /> Ông Diệp Nam Hải
                  </li>
                  <li>
                    <strong>Phó Tổng Giám Đốc:</strong> Bà Nguyễn Thị Huyền
                    Trang
                  </li>
                  <li>
                    <strong>Phó Tổng Giám Đốc:</strong> Bà Hồ Ngọc Hương
                  </li>
                  <li>
                    <strong>Kế toán trưởng:</strong> <br /> Bà Nguyễn Thị Bích
                    Ngọc
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CholimexLayout>
  );
}

export default About;
