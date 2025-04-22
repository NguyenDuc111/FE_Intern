import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

function BannerCarousel() {
  return (
    <Carousel
      autoPlay
      infiniteLoop
      showThumbs={false}
      showStatus={false}
      interval={4000}
      className="mb-8"
    >
      <div>
        <img src="/banners/banner1.jpg" alt="Banner 1" />
      </div>
      <div>
        <img src="/banners/banner2.jpg" alt="Banner 2" />
      </div>
      <div>
        <img src="/banners/banner3.jpg" alt="Banner 3" />
      </div>
    </Carousel>
  );
}

export default BannerCarousel;
