import { Helmet } from "react-helmet";
import BannerHome from "./BannerHome/BannerHome";
import clsx from "clsx";
import styles from "./Home.module.css";
import FoodCategory from "./FoodCategory/FoodCategory";
import DiscountedProducts from "./DiscountedFood/DiscountedProducts";

import PopularFood from "./PoppularFood/PopularFood";
import { useEffect } from "react";
import { calculateLocalStorageSize } from "../../../CalculateLocalStorage";

const Home = () => {
  useEffect(() => {
    calculateLocalStorageSize();
  }, []);
  return (
    <>
      <Helmet>
        <title>Trang Chủ</title>
        <meta name="description" content="trang chủ" />
        <meta name="keywords" content="trang chủ" />
        <meta property="og:title" content="trang chủ" />
        <meta property="og:description" content="trang chủ" />
        <meta property="og:image" content="/src/assets/Logo.png" />
      </Helmet>
      <div className={styles["main-home"]}>
        <div className={clsx(styles["banner"], "container")}>
          <BannerHome></BannerHome>
        </div>
        <div className="container">
          <FoodCategory></FoodCategory>
          <DiscountedProducts></DiscountedProducts>
          <PopularFood></PopularFood>
        </div>
      </div>
    </>
  );
};

export default Home;
