import '../headerfooter/Footer.css'
import './Footer.css';
import logo from '../../assets/image/chungnhan.png';
import logoo from '../../assets/image/bocongthuong.png';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Cột 1: Thông tin công ty */}
        <div className="footer-column">
          <h3>CÔNG TY CỔ PHẦN THỰC PHẨM CHOLIMEX</h3>
          <p><strong>Địa chỉ:</strong> Lô C40-43/I, C51-55/II Đường số 7, KCN Vĩnh Lộc, Xã Vĩnh Lộc A, Huyện Bình Chánh, TP.HCM, Việt Nam</p>
          <p><strong>Điện thoại:</strong> +84 283 765 3389</p>
          <p><strong>Email:</strong> cholimexfood@cholimexfood.com.vn</p>
          <p><strong>Số giấy chứng nhận đăng ký doanh nghiệp:</strong> 0304475742</p>
          <p><strong>Ngày cấp:</strong> 19/07/2006.</p>
          <p><strong>Nơi cấp:</strong> Sở Kế hoạch và Đầu tư thành phố Hồ Chí Minh</p>
        </div>

        {/* Cột 2: Chính sách */}
        <div className="footer-column">
          <h3>CHÍNH SÁCH VÀ QUY ĐỊNH</h3>
          <ul>
            <li><a href="#">Chính sách và quy định chung</a></li>
            <li><a href="#">Chính sách bảo mật</a></li>
          </ul>
        </div>

        {/* Cột 3: Chứng nhận */}
        <div className="footer-column">
          <h3>CÁC CHỨNG NHẬN</h3>
          <div className="footer-images">
            <img src={logo} alt="Huân chương" />
            
          <img src={logoo}alt="Đã thông báo BCT" />

          </div>
          
        </div>
      </div>
      <div className="footer-bottom">
        <p>Copyright 1983 - 2025 © <strong>Cholimex Food</strong></p>
      </div>
    </footer>
  );
}

export default Footer;
