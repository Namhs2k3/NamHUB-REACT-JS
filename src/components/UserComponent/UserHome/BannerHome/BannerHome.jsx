import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { useState } from "react";
import { useEffect } from "react";
import { getBannerListForCus } from "../../../../api";

const BannerHome = () => {
  const [bannerList, setBannerList] = useState([]);
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await getBannerListForCus();
        setBannerList(data.$values || []);
        console.log("banner result: ", data);
      } catch (error) {
        console.log("co loi xay ra: ", error);
      }
    };
    fetchResult();
  }, []);
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={30}
      slidesPerView={1}
      allowTouchMove={true}
      navigation
      loop={bannerList.length > 1}
      pagination={{ clickable: true }}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
      }}
      breakpoints={{
        640: {
          slidesPerView: 1,
        },
        1024: {
          slidesPerView: 1,
        },
      }}
    >
      {bannerList.map((item) => (
        <SwiperSlide key={item.bannerId}>
          <img src={item.imgUrl} alt={item.title} className="w-100" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default BannerHome;
