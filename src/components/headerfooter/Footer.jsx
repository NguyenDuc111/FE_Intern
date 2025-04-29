import "../headerfooter/Footer.css";
import "./Footer.css";
import logo from "../../assets/image/chungnhan.png";
import logoo from "../../assets/image/bocongthuong.png";

function Footer() {
  return (
    <footer className="bg-gray-100 text-black mt-auto">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 py-8">
        {/* Cột 1: Thông tin công ty */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg mb-2 uppercase">
            CÔNG TY CỔ PHẦN THỰC PHẨM CHOLIMEX
          </h3>
          <p><strong>Địa chỉ:</strong> Lô C40-43/I, C51-55/II Đường số 7, KCN Vĩnh Lộc, Bình Chánh, TP.HCM, Việt Nam</p>
          <p><strong>Điện thoại:</strong> +84 283 765 3389</p>
          <p><strong>Email:</strong> cholimexfood@cholimexfood.com</p>
          <p><strong>Giấy CN ĐKDN:</strong> 0304475742 - Ngày cấp: 19/07/2006 - Sở KH&ĐT TP.HCM</p>
        </div>

        {/* Cột 2: Chính sách + Google Maps */}
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="font-bold text-lg mb-2 text-center">CHÍNH SÁCH VÀ QUY ĐỊNH</h3>
            <ul className="space-y-1 text-center">
              <li>
                <a href="#" className="hover:text-red-600">Chính sách và quy định chung</a>
              </li>
              <li>
                <a href="#" className="hover:text-red-600">Chính sách bảo mật</a>
              </li>
            </ul>
          </div>
          <div className="border-2 border-black overflow-hidden rounded-md shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1875.1977651593286!2d106.59195091900934!3d10.828092515736714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752bddd650c5a3%3A0xa2ab17e197b4331a!2zQ1R5IEPhu5UgUGjhuqduIFRo4buxYyBQaOG6qW0gQ2hvbGltZXggKENob2xpbWV4IEZvb2Qp!5e1!3m2!1svi!2s!4v1745457961893!5m2!1svi!2s"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Bản đồ Cholimex"
            ></iframe>
          </div>
        </div>

        {/* Cột 3: Chứng nhận */}
        <div className="space-y-3 text-center">
          <h3 className="font-bold text-lg mb-2">CÁC CHỨNG NHẬN</h3>
          <div className="flex flex-col items-center gap-3">
            <img src={logo} alt="Huân chương" className="w-3/4 max-w-[250px]" />
            <a 
              href="http://online.gov.vn/Home/WebDetails/89834?AspxAutoDetectCookieSupport=1"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-90 transition-opacity"
            >
              <img src={logoo} alt="Bộ Công Thương" className="w-1/2 max-w-[200px]" />
            </a>
          </div>
        </div>
      </div>

      {/* Line copyright */}
      <div className="text-center text-white text-sm bg-[#dd3333] py-9 mt-8 ">
        Copyright 1983 - 2025 © <strong>Cholimex Food</strong>
      </div>
    </footer>
  );
}

export default Footer;
