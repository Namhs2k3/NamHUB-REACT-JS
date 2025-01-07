// CheckoutForm.jsx
import { toast } from "react-toastify";
import styles from "./Checkout.module.css";
import {
  editProfile,
  editUserAddress,
  getCustomerInfo,
  getDiscountCodeForCus,
  getUserAddresses,
  checkout,
} from "../../../api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clsx } from "clsx";
import Loading from "../../Loading/Loading";
import { AddUserAddress, EditUserAddresses } from "../../Profile/Profile";
import OrderSummary from "./OrderSummary/OrderSummary";
import DiscountSelector from "./DiscountSelector/DiscountSelecrtor";
import { Helmet } from "react-helmet";

const Checkout = () => {
  const [userInfo, setUserInfo] = useState({});
  const [userAddresses, setUserAddresses] = useState({
    $id: "1",
    $values: [
      {
        $id: "",
        addressId: 1,
        addressLine1: "",
        addressLine2: null,
        city: "",
        state: null,
        isDefault: true,
        postalCode: null,
        country: "",
      },
    ],
  });

  const [selectedAddress, setSelectedAddress] = useState({
    addressId: "",
    addressLine1: "",
    city: "",
    country: "",
  });

  // Cập nhật giá trị mặc định khi userAddresses thay đổi
  useEffect(() => {
    if (userAddresses.$values.length > 0) {
      const defaultAddress =
        userAddresses.$values.find((item) => item.isDefault) ||
        userAddresses.$values[0];
      setSelectedAddress({
        addressId: defaultAddress.addressId,
        addressLine1: defaultAddress.addressLine1,
        city: defaultAddress.city,
        country: defaultAddress.country,
      });
    }
  }, [userAddresses]);

  const handleSelectChange = (e) => {
    const selectedOption = e.target.selectedOptions[0]; // Lấy <option> được chọn
    setSelectedAddress({
      addressId: selectedOption.value,
      addressLine1: selectedOption.dataset.addressLine1,
      city: selectedOption.dataset.city,
      country: selectedOption.dataset.country,
    });
  };
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [discountCodes, setDiscountCodes] = useState([]);
  const [selectedCode, setSelectedCode] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const handleSelect = (code) => {
    setSelectedCode(code);
    console.log("Selected code: ", code);
  };

  const selectPaymentMethod = (e) => {
    setPaymentMethod(e.target.value);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoading(false);
      try {
        const data = await getCustomerInfo();
        console.log("User Info: ", data);
        setUserInfo(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu: ", err);
        if (err.status === 401) {
          navigate("/unauthenticated");
        } else if (err.status === 403) {
          navigate("/unauthorized");
        } else if (err.response?.data === "Không tìm thấy khách hàng.")
          navigate("/customer/profile/create");
        else navigate("/not-found");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUserCouponCode = async () => {
      setIsLoading(false);
      try {
        const data = await getDiscountCodeForCus();
        console.log("Discount codes Info: ", data);
        setDiscountCodes(data.$values || []);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu: ", err);
        if (err.status === 401) {
          navigate("/unauthenticated");
        } else if (err.status === 403) {
          navigate("/unauthorized");
        } else if (err.response?.data === "Không tìm thấy khách hàng.")
          navigate("/customer/profile/create");
        else navigate("/not-found");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCouponCode();
    fetchUserInfo();
  }, [navigate]);

  useEffect(() => {
    const fetchUserAddresses = async () => {
      setIsLoading(false);
      try {
        const data = await getUserAddresses();
        console.log("User addresses: ", data);
        setUserAddresses(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu: ", err);
        if (err.status === 401) {
          navigate("/unauthenticated");
        } else if (err.status === 403) {
          navigate("/unauthorized");
        } else {
          navigate("/not-found");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAddresses();
  }, [navigate, isOpenAddModal, isOpenEditModal]);

  console.log("selectedAddress: ", selectedAddress);
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setUserInfo({
      ...userInfo,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);
    // Kiểm tra số điện thoại hợp lệ
    const isValidPhone = /^\d{10,15}$/.test(userInfo.phone);
    if (!isValidPhone) {
      toast.error("SĐT không hợp lệ!");
      return;
    }

    // Tạo formData cho thông tin user
    const formData = new FormData();
    formData.append("FullName", userInfo.fullName);
    formData.append("Phone", userInfo.phone);
    formData.append("Email", userInfo.email);
    if (userInfo.userImage) {
      formData.append("UserImageURL", userInfo.userImage);
    }

    // Tạo formData cho địa chỉ user
    const userAddress = new FormData();
    userAddress.append("AddressLine1", selectedAddress.addressLine1);
    userAddress.append("City", selectedAddress.city);
    userAddress.append("Country", selectedAddress.country);
    userAddress.append("IsDefault", true);

    try {
      setIsLoading(true);

      // Gọi đồng thời 2 API
      await Promise.all([
        editProfile(formData),
        editUserAddress(selectedAddress.addressId, userAddress),
      ]);

      const checkoutResponse = await checkout({
        couponCode: selectedCode.code || "",
        paymentMethod: paymentMethod,
        BankCode: "",
        IpAddress: "",
        OrderInfo: "",
      });
      console.log("checkoutResponse: ", checkoutResponse);

      if (paymentMethod === "VNPay") {
        window.location.href = `${checkoutResponse.vnPayUrl}`;
      } else if (paymentMethod === "Cash") {
        if (checkoutResponse.redirectUrl) {
          window.location.href = `${checkoutResponse.redirectUrl}`;
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data || "Có lỗi xảy ra!";
      toast.error(errorMessage);
      console.error(err); // Để dễ dàng debug hơn
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserAddress = (e) => {
    e.preventDefault();
    setIsOpenAddModal(true);
  };

  const handleEditUserAddress = (e) => {
    e.preventDefault();
    setIsOpenEditModal(true);
  };

  return (
    <div className={styles.checkoutContainer}>
      <Helmet>
        <title>Đặt Hàng & Thanh Toán</title>
        <meta name="description" content="" />
        <meta name="keywords" content="" />
        <meta property="og:title" content="" />
        <meta property="og:description" content="" />
        <meta property="og:image" content="" />
      </Helmet>
      <h2 className={styles.title}>THANH TOÁN</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Thông Tin Thanh Toán</h2>
          <div className="d-flex gap-3">
            <div className="mb-3 w-50">
              <label
                htmlFor="fullName"
                className={clsx(styles["form-label"], "form-label")}
              >
                Họ và Tên
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={userInfo.fullName}
                className={clsx(styles["form-control"], "form-control")}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3 w-50">
              <label
                htmlFor="phone"
                className={clsx(styles["form-label"], "form-label")}
              >
                SĐT
              </label>
              <input
                type="number"
                id="phone"
                name="phone"
                value={userInfo.phone}
                className={clsx(styles["form-control"], "form-control")}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label
              htmlFor="address"
              className={clsx(styles["form-label"], "form-label")}
            >
              Địa Chỉ
            </label>
            <div className="d-flex gap-3">
              <select
                name="defaultAddress"
                id="defaultAddress"
                className="form-select"
                value={selectedAddress.addressId}
                onChange={handleSelectChange}
              >
                {userAddresses.$values.map((item, index) => (
                  <option
                    key={index}
                    value={item.addressId}
                    data-address-line1={item.addressLine1}
                    data-city={item.city}
                    data-country={item.country}
                  >
                    {`${item.addressLine1}, ${item.city}, ${item.country}`}
                  </option>
                ))}
              </select>

              <button className="btn btn-success" onClick={handleUserAddress}>
                Thêm
              </button>
              <button
                className="btn btn-warning"
                onClick={handleEditUserAddress}
              >
                Sửa
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 col-12 mt-1 mb-1">
            <OrderSummary discountCode={[selectedCode]} />
          </div>

          <div
            className={clsx(styles.sectionPayment, "col-lg-6 col-12 mt-1 mb-1")}
          >
            <DiscountSelector
              discountCodes={discountCodes}
              selectedCode={selectedCode}
              onSelect={handleSelect}
            />
            <h3 className={styles.sectionTitle}>Phương Thức Thanh Toán</h3>
            <div className={styles.paymentMethods}>
              <label
                className={clsx({
                  [styles.selected]: paymentMethod === "VNPay",
                })}
              >
                <input
                  type="radio"
                  name="payment"
                  value="VNPay"
                  checked={paymentMethod === "VNPay"}
                  onChange={selectPaymentMethod}
                />
                <img
                  src="/src/assets/VNPay-removebg-preview.png"
                  alt=""
                  width={"45px"}
                />{" "}
                Thanh Toán Bằng VNPay
              </label>
              <label
                className={clsx({
                  [styles.selected]: paymentMethod === "Cash",
                })}
              >
                <input
                  type="radio"
                  name="payment"
                  value="Cash"
                  checked={paymentMethod === "Cash"}
                  onChange={selectPaymentMethod}
                />
                <img src="/src/assets/Cash.png" alt="" width={"45px"} /> Trả
                tiền mặt khi nhận hàng
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isDisabled}
        >
          Đặt Hàng
        </button>
      </form>
      {isOpenAddModal && (
        <AddUserAddress
          isOpenModal={isOpenAddModal}
          setIsOpenModal={setIsOpenAddModal}
        />
      )}
      {isOpenEditModal && (
        <EditUserAddresses
          isOpenModal={isOpenEditModal}
          setIsOpenModal={setIsOpenEditModal}
          userName={userInfo.userName}
        />
      )}
      {isLoading && <Loading className={clsx(styles["loading"])}></Loading>}
    </div>
  );
};

export default Checkout;
