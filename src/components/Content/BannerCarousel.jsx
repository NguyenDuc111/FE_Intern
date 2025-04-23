import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import logo from "../../assets/image/Cholimexb1.jpg";
import logo2 from "../../assets/image/Cholimexb2.jpg";
import logo3 from "../../assets/image/Cholimexb3.jpg";

function BannerCarousel() {
  return (
    <Carousel
      autoPlay
      infiniteLoop
      showThumbs={false}
      showStatus={false}
      interval={4000}
      className="mb-15 mt-0 "
    >
      <div>
        <img src={logo} style={{width:"1200px"}} alt="Banner 1" />
      </div>
      <div>
        <img src={logo2} style={{width:"1200px"}} alt="Banner 2" />
      </div>
      <div>
        <img src={logo3} style={{width:"1200px"}} alt="Banner 3" />
      </div>

    </Carousel>

  );
}

export default BannerCarousel;
