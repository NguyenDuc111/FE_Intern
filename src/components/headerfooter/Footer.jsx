import "../headerfooter/Footer.css";
import "./Footer.css";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

import logo from "../../assets/image/chungnhan.png";
import logoo from "../../assets/image/bocongthuong.png";

function Footer() {
  return (
    <footer className="bg-gray-100 text-black mt-auto">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-8 border-t border-gray-300 text-sm">
        {/* Cột 1: Thông tin công ty */}
        <div className="space-y-2 pr-4 border-r border-gray-300">
          <div className="relative mb-2">
            <h3 className="font-bold text-sm uppercase">
              CÔNG TY CỔ PHẦN THỰC PHẨM CHOLIMEX
            </h3>
            <div className="absolute left-0 -bottom-1 w-6 h-[3px] bg-gray-400"></div>
          </div>
          <p className="flex items-start gap-2">
            <FaMapMarkerAlt className="mt-1 text-red-600" />
            Lô C40-43/I, C51-55/II Đường số 7, KCN Vĩnh Lộc, Bình Chánh, TP.HCM,
            Việt Nam
          </p>
          <p className="flex items-center gap-2">
            <FaPhoneAlt className="text-green-600" />
            +84 283 765 3389
          </p>
          <p className="flex items-center gap-2">
            <FaEnvelope className="text-blue-600" />
            cholimexfood@cholimex.com
          </p>
          <p>
            <strong>Giấy CN ĐKDN:</strong> 0304475742 - Ngày cấp: 19/07/2006 -
            Sở KH&ĐT TP.HCM
          </p>
          <p>
            <strong>Nơi Cấp:</strong> Sở kế hoạch và đầu tư Thành Phố Hồ Chí
            Minh
          </p>
        </div>

        {/* Cột 2: Chính sách + Google Maps */}
        <div className="px-4 border-r border-gray-300 flex flex-col gap-4 min-w-0">
          {/* Phần tiêu đề và danh sách chính sách */}
          <div className="mb-2">
            <div className="relative inline-block">
              <h3 className="font-bold text-sm uppercase ">
                CHÍNH SÁCH VÀ QUY ĐỊNH
              </h3>
              <div className="absolute left-0 -bottom-1 w-6 h-[3px] bg-gray-400"></div>
            </div>
            <ul className="space-y-1 mt-4 text-left">
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

          {/* Phần Google Maps */}
          <div className="flex justify-center items-center w-full">
            <div className="w-full max-w-md overflow-hidden rounded-md shadow-md mr-5">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1875.1977651593286!2d106.59195091900934!3d10.828092515736714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752bddd650c5a3%3A0xa2ab17e197b4331a!2zQ1R5IEPhu5UgUGjhuqduIFRo4buxYyBQaOG6qW0gQ2hvbGltZXggKENob2xpbWV4IEZvb2Qp!5e1!3m2!1svi!2s!4v1745457961893!5m2!1svi!2s"
                className="w-full h-[200px]"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Bản đồ Cholimex"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Cột 3: Chứng nhận */}
        <div className="space-y-3 text-left pl-4">
          <div className="relative mb-2">
            <h3 className="font-bold text-sm uppercase">CÁC CHỨNG NHẬN</h3>
            <div className="absolute left-0 -bottom-1 w-6 h-[3px] bg-gray-400"></div>
          </div>
          <div className="flex flex-col items-start gap-3">
            <img src={logo} alt="Huân chương" className="w-3/4 max-w-[300px]" />
            <a
              href="http://online.gov.vn/Home/WebDetails/89834?AspxAutoDetectCookieSupport=1"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-90 transition-opacity"
            >
              <img
                src={logoo}
                alt="Bộ Công Thương"
                className="w-[160px] max-w-full"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Line copyright */}
      <div className="text-center text-white text-sm bg-[#dd3333] py-6 mt-8">
        Copyright 1983 - 2025 © <strong>Cholimex Food</strong>
      </div>
    </footer>
  );
}

export default Footer;
