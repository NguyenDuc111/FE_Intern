import "../headerfooter/Footer.css";
import "./Footer.css";
import logo from "../../assets/image/chungnhan.png";
import logoo from "../../assets/image/bocongthuong.png";

function Footer() {
  return (
    <footer className="footer bg-gray-100 text-black py-8">
      <div className="footer-container max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {/* Cột 1: Thông tin công ty */}
        <div className="footer-column space-y-2">
          <h3 className="font-bold text-lg mb-2">
            CÔNG TY CỔ PHẦN THỰC PHẨM CHOLIMEX
          </h3>
          <p>
            <strong>Địa chỉ:</strong> Lô C40-43/I, C51-55/II Đường số 7, KCN
            Vĩnh Lộc, Xã Vĩnh Lộc A, Huyện Bình Chánh, TP.HCM, Việt Nam
          </p>
          <p>
            <strong>Điện thoại:</strong> +84 283 765 3389
          </p>
          <p>
            <strong>Email:</strong> cholimexfood@cholimexfood.com.vn
          </p>
          <p>
            <strong>Giấy CN ĐKDN:</strong> 0304475742 - Ngày cấp: 19/07/2006 -
            Nơi cấp: Sở KH&ĐT TP.HCM
          </p>
        </div>

        {/* Cột 2: Chính sách */}
        <div className="footer-column space-y-2">
          <h3 className="font-bold text-lg mb-2">CHÍNH SÁCH VÀ QUY ĐỊNH</h3>
          <ul className="space-y-1">
            <li>
              <a href="#" className="hover:text-red-600">
                Chính sách và quy định chung
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-red-600">
                Chính sách bảo mật
              </a>
            </li>
          </ul>
        </div>

        {/* Cột 3: Chứng nhận */}
        <div className="footer-column space-y-3">
          <h3 className="font-bold text-lg mb-2">CÁC CHỨNG NHẬN</h3>
          <div className="space-y-3">
            <img src={logo} alt="Huân chương" className="w-[200px] mx-auto" />
            <img
              src={logoo}
              alt="Bộ Công Thương"
              className="w-[150px] mx-auto"
            />
          </div>
        </div>
      </div>

      <div className="footer-bottom text-center mt-8 text-sm border-t pt-4">
        <p>
          Copyright 1983 - 2025 © <strong>Cholimex Food</strong>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
