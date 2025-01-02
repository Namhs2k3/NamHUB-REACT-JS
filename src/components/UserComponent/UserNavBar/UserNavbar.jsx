import { CSSTransition } from "react-transition-group";
import clsx from "clsx";
import styles from "./UserNavbar.module.css";
import Logo from "../../Logo/Logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faKey,
  faMagnifyingGlass,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { format } from "date-fns";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import {
  forgotPassword,
  getCartCount,
  getCategoryListForCus,
  getCustomerInfo,
} from "../../../api";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import SearchResult from "./SearchResult";
import CartItems from "./CartItems";
import AllCategory from "./AllCategory";
import { AddToCartContext } from "../../../contexts/AddToCartContext";
import RecentProducts from "./RecentProduct";

const UserNavbar = () => {
  const { addNew } = useContext(AddToCartContext);
  const date = new Date();
  const beUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    userName: "",
    userImage: "",
    email: "",
  });
  const [cateList, setCateList] = useState([]);
  const [isHide, setIsHide] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [isOpenResult, setOpenResult] = useState(false);
  const [isOpenCart, setOpenCart] = useState(false);
  const [isOpenCategory, setOpenCategory] = useState(false);
  const [isOpenRecent, setOpenRecent] = useState(false);
  const [isReload, setReload] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const handleHiddenOnclick = () => {
    setIsHide((prev) => !prev);
  };
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
  });
  const isTokenExist = localStorage.getItem("token");
  const confirmRemove = async () => {
    try {
      if (isTokenExist) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      }
      setConfirmDelete({ isOpen: false });
      window.location.href = "/home";
    } catch (err) {
      console.log(err);
    }
  };

  const cancelRemove = () => setConfirmDelete({ isOpen: false });

  const handleCateChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const main = document.getElementById("root");
  const handleOpenResult = () => {
    setOpenResult(true);
    main.classList.add("body-no-scroll");
  };

  const handleOpenCart = () => {
    setOpenCart(true);
    main.classList.add("body-no-scroll");
  };

  const handleOpenCategory = () => {
    setOpenCategory(true);
    main.classList.add("body-no-scroll");
  };
  const handleOpenRecentProd = () => {
    setOpenRecent(true);
    setOpenCategory(false);
    setOpenResult(false);
    main.classList.add("body-no-scroll");
  };

  const handleBlur = (e) => {
    // Kiểm tra nếu click xảy ra bên trong popup, không ẩn popup
    if (e.relatedTarget && e.relatedTarget.closest(`.${styles.searchResult}`)) {
      return;
    }
    setOpenResult(false);
    main.classList.remove("body-no-scroll");
  };

  const handleCartBlur = (e) => {
    // Kiểm tra nếu click xảy ra bên trong popup, không ẩn popup
    if (e.relatedTarget && e.relatedTarget.closest(`.${styles.cartItems}`)) {
      return;
    }
    setOpenCart(false);
    main.classList.remove("body-no-scroll");
  };
  const handleCategoryBlur = (e) => {
    // Kiểm tra nếu click xảy ra bên trong popup, không ẩn popup
    if (e.relatedTarget && e.relatedTarget.closest(`.${styles.categories}`)) {
      return;
    }
    setOpenCategory(false);
    main.classList.remove("body-no-scroll");
  };
  const handleRecentProdBlur = (e) => {
    // Kiểm tra nếu click xảy ra bên trong popup, không ẩn popup
    if (
      e.relatedTarget &&
      e.relatedTarget.closest(`.${styles.recentProducts}`)
    ) {
      return;
    }
    setOpenRecent(false);
    main.classList.remove("body-no-scroll");
  };

  useEffect(() => {
    // Clean up class when component is unmounted or when modal is closed
    return () => {
      main.classList.remove("body-no-scroll");
    };
  }, [main]);

  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getCustomerInfo();
        if (data) {
          setUserData(data);
          console.log(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchCategory = async () => {
      try {
        const data = await getCategoryListForCus();
        if (data) {
          setCateList(data.$values || []);
          console.log(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategory();
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const data = await getCartCount();
        if (data) {
          setCartCount(data);
          console.log(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCartCount();
  }, [isReload, addNew]);
  return (
    <>
      <header>
        {/* Topbar */}
        <div className={styles.topbar}>
          <div
            className={clsx(styles.topbar, "container", "align-items-center")}
          >
            <span>
              Miễn phí vận chuyển trong{" "}
              <strong className={styles.highlight}>
                Ngày {format(date, "dd/MM")}
              </strong>
            </span>
            {isTokenExist ? (
              <>
                <div className="gap-4 d-flex justify-content-between align-items-center">
                  <span>
                    <Link to="/my-orders" className={clsx(styles["cus-order"])}>
                      Theo dõi đơn hàng
                    </Link>
                  </span>
                  <span className={clsx(styles["hi-user"])}>
                    {" "}
                    Hi <strong>{userData.userName || "..."}</strong>
                  </span>
                  <span>
                    <img
                      src={
                        userData.userImage
                          ? `${beUrl}${userData.userImage}`
                          : "/src/assets/png-clipart-man-wearing-blue-shirt-illustration-computer-icons-avatar-user-login-avatar-blue-child.png"
                      }
                      alt=""
                      className={clsx(styles.avatar)}
                      onMouseLeave={handleHiddenOnclick}
                      onMouseEnter={handleHiddenOnclick}
                    />
                  </span>
                </div>
              </>
            ) : (
              <span>
                <Link to="/login" className={clsx(styles["login"])}>
                  Đăng Nhập
                </Link>
              </span>
            )}
          </div>
        </div>

        {/* Navbar chính */}
        <nav className={styles.navbar}>
          {/* Logo */}
          <div className={clsx(styles.navbar, "container")}>
            <div
              className={styles.logo}
              onClick={() => {
                navigate("/home");
              }}
            >
              <Logo></Logo>
            </div>

            {/* Thanh tìm kiếm */}
            <div className={styles.searchBar}>
              <select
                className={styles.searchSelect}
                value={selectedCategory}
                onChange={handleCateChange}
              >
                <option value="">Tất cả</option>
                {cateList.map((item) => (
                  <option key={item.categoryID} value={item.categoryID}>
                    {item.categoryName}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Tìm món ăn mà bạn muốn..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={handleSearchTerm}
                onFocus={handleOpenResult}
                onBlur={handleBlur}
              />
              <button className={styles.searchButton}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </div>

            {/* Icon */}
            <div
              className={styles.icons}
              onClick={handleOpenCart}
              onBlur={handleCartBlur}
              tabIndex={0} // Cho phép <div> nhận focus và kích hoạt onBlur
            >
              <span>Giỏ Hàng</span>
              <div className={styles.icon}>
                <ShoppingCartOutlinedIcon />
                <span className={styles.badge}>{cartCount}</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Menu liên kết */}
        <div className={styles.menuBar}>
          <div className={clsx(styles.menuBar, "container")}>
            <button
              className={styles.menuButton}
              onClick={handleOpenCategory}
              onBlur={handleCategoryBlur}
              tabIndex={1}
            >
              <MenuIcon className={styles.menuIcon} /> Tất cả danh mục
            </button>
            <ul className={clsx(styles.menuList)}>
              <li>
                <Link to="/home" className={styles.menuLink}>
                  Trang Chủ
                </Link>
              </li>
              <li>
                <Link to="/products" className={styles.menuLink}>
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="#" className={styles.menuLink}>
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link href="#" className={styles.menuLink}>
                  Món khuyến mãi
                </Link>
              </li>
            </ul>
            <div className={clsx(styles.menuLink, styles.recent)}>
              <Link
                className={styles.link}
                onMouseEnter={handleOpenRecentProd}
                onMouseLeave={handleRecentProdBlur}
              >
                Đã xem gần đây <ExpandMoreIcon />
              </Link>
            </div>
          </div>
        </div>
        <div
          className={clsx(
            styles["popup-light"],
            styles[isHide ? "popup-hidden" : ""]
          )}
          onMouseLeave={handleHiddenOnclick}
          onMouseEnter={handleHiddenOnclick}
        >
          <Popup
            email={userData.email}
            isHide={confirmDelete.isOpen}
            setIsHide={setConfirmDelete}
          />
        </div>
        {confirmDelete.isOpen && (
          <div
            className={clsx(styles["my-confirm-delete-modal"])}
            onClick={cancelRemove}
          >
            <div
              className={clsx(styles["my-main-confirm-modal"])}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-danger">Xác nhận đăng xuất</h3>
              <p>Bạn có chắc chắn muốn đăng xuất không?</p>
              <div className="d-flex justify-content-between">
                <button className="btn btn-danger" onClick={confirmRemove}>
                  Đăng Xuất
                </button>
                <button className="btn btn-secondary" onClick={cancelRemove}>
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
      {/* SearchResult */}
      <CSSTransition
        in={isOpenResult}
        timeout={300}
        classNames={{
          enter: styles["popup-enter"],
          enterActive: styles["popup-enter-active"],
          exit: styles["popup-exit"],
          exitActive: styles["popup-exit-active"],
        }}
        unmountOnExit
      >
        <SearchResult
          name={searchTerm}
          cateId={selectedCategory}
          isOpenResult={isOpenResult}
        />
      </CSSTransition>

      {/* CartItems */}
      <CSSTransition
        in={isOpenCart}
        timeout={300}
        classNames={{
          enter: styles["popup-enter"],
          enterActive: styles["popup-enter-active"],
          exit: styles["popup-exit"],
          exitActive: styles["popup-exit-active"],
        }}
        unmountOnExit
      >
        <CartItems setReload={setReload} isOpenCart={isOpenCart} />
      </CSSTransition>

      {/* AllCategory */}
      <CSSTransition
        in={isOpenCategory}
        timeout={300}
        classNames={{
          enter: styles["popup-enter"],
          enterActive: styles["popup-enter-active"],
          exit: styles["popup-exit"],
          exitActive: styles["popup-exit-active"],
        }}
        unmountOnExit
      >
        <AllCategory isOpenCategory={isOpenCategory} />
      </CSSTransition>

      {/* RecentProducts */}
      <CSSTransition
        in={isOpenRecent}
        timeout={300}
        classNames={{
          enter: styles["popup-enter"],
          enterActive: styles["popup-enter-active"],
          exit: styles["popup-exit"],
          exitActive: styles["popup-exit-active"],
        }}
        unmountOnExit
      >
        <RecentProducts
          setOpenRecent={setOpenRecent}
          isOpenRecent={isOpenRecent}
        />
      </CSSTransition>
    </>
  );
};

const Popup = ({ email, setIsHide }) => {
  const navigate = useNavigate("");

  const handleLogout = () => {
    setIsHide({ isOpen: true });
  };

  const handlePwdChange = async () => {
    try {
      toast.info("Vui lòng đợi, chúng tôi đang gửi mã đến email của bạn!");
      await forgotPassword(email);
      navigate("/input-token-reset-pwd");
    } catch (error) {
      console.log("lỗi khi đổi mk: ", error);
      toast.error("Có Lỗi Xảy Ra!");
    }
  };
  return (
    <>
      <div className={clsx(styles["setting-light"])}>Settings</div>
      <Link
        to="/customer/profile/edit"
        className={clsx(styles["profile-light"])}
      >
        Profile
        <FontAwesomeIcon icon={faUser} />
      </Link>
      <Link to="/admin/statistic" className={clsx(styles["profile-light"])}>
        DashBoard
        <FontAwesomeIcon icon={faUser} />
      </Link>
      <Link to="/deliver/order-list" className={clsx(styles["profile-light"])}>
        For Deliver
        <FontAwesomeIcon icon={faUser} />
      </Link>

      <Link className={clsx(styles["logout-light"])} onClick={handlePwdChange}>
        Đổi Mật Khẩu
        <FontAwesomeIcon icon={faKey} />
      </Link>
      <Link className={clsx(styles["logout-light"])} onClick={handleLogout}>
        Logout
        <FontAwesomeIcon
          icon={faRightFromBracket}
          className={clsx(styles["turn-left"])}
        />
      </Link>
    </>
  );
};

Popup.propTypes = {
  email: PropTypes.string,
  isHide: PropTypes.bool,
  setIsHide: PropTypes.func,
};

export default UserNavbar;
