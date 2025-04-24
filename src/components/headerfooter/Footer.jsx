import "../headerfooter/Footer.css";
import "./Footer.css";
import logo from "../../assets/image/chungnhan.png";
import logoo from "../../assets/image/bocongthuong.png";

function Footer() {
  return (
    <footer className="footer bg-gray-100 text-black py-8">
      <div className="footer-container max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {/* Cột 1: Thông tin công ty */}
        <div className="footer-column space-y-2">
          <h3 className="font-bold text-lg mb-2 text-left tracking-wide uppercase">
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
            <strong>Email:</strong> cholimexfood@cholimexfood.com
          </p>
          <p>
            <strong>Giấy CN ĐKDN:</strong> 0304475742 - Ngày cấp: 19/07/2006 - Nơi cấp: Sở KH&ĐT TP.HCM
          </p>
        </div>

        {/* Cột 2: Chính sách + Google Maps */}
        <div className="footer-column flex flex-col gap-4">
          <div>
            <h3 className="font-bold text-lg mb-2 text-center">CHÍNH SÁCH VÀ QUY ĐỊNH</h3>
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
          <div className=" border-2 border-black overflow-hidden shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1875.1977651593286!2d106.59195091900934!3d10.828092515736714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752bddd650c5a3%3A0xa2ab17e197b4331a!2zQ1R5IEPhu5UgUGjhuqduIFRo4buxYyBQaOG6qW0gQ2hvbGltZXggKENob2xpbWV4IEZvb2Qp!5e1!3m2!1svi!2s!4v1745457961893!5m2!1svi!2s"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bản đồ Cholimex"
            ></iframe>
          </div>
        </div>

        {/* Cột 3: Chứng nhận */}
        <div className="footer-column space-y-3">
          <h3 className="font-bold text-lg mb-2 text-center">CÁC CHỨNG NHẬN</h3>
          <div className="space-y-3 flex flex-col items-center">
            <img src={logo} alt="Huân chương" className="w-3/4 max-w-[300px]" />
            <a 
  href="http://online.gov.vn/Home/WebDetails/89834?AspxAutoDetectCookieSupport=1"
  target="_blank"
  rel="noopener noreferrer"
>
  <img 
    src={logoo} 
    alt="Bộ Công Thương" 
    className="w-1/2 max-w-[700px] hover:opacity-90 transition-opacity ml-20" 
  />
</a>
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
