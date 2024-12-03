import clsx from "clsx";
import styles from "./Profile.module.css";
import { Fragment, useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  addUserAddress,
  editProfile,
  editUserAddress,
  getUserAddresses,
  getUserInfo,
  removeUserAddress,
} from "../../api";
import Loading from "../Loading/Loading";
import { toast, ToastContainer } from "react-toastify";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash, faX } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet";

const Profile = () => {
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
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoading(false);
      try {
        const data = await getUserInfo();
        console.log("User Info: ", data);
        setUserInfo(data);
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
    fetchUserInfo();
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

      toast.success("Cập Nhật Thành Công");

      // Chuyển hướng sau khi hiển thị thông báo
      setTimeout(() => {
        toast.dismiss();
        navigate("/home");
      }, 1000);
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
    <div className={clsx("pt-5", styles["big-container"])}>
      <Helmet>
        <title>Thông Tin Cá Nhân</title>
        <meta name="description" content="Chỉnh Sửa Thông Tin Cá Nhân" />
        <meta
          name="keywords"
          content="thông tin cá nhân, profile, chỉnh sửa thông tin"
        />
        <meta property="og:title" content="Thông Tin Cá Nhân" />
        <meta property="og:description" content="Chỉnh Sửa Thông Tin Cá Nhân" />
        <meta property="og:image" content="/src/assets/Logo.png" />
      </Helmet>
      <form className={styles.container} onSubmit={handleSubmit}>
        <h1 className="text-center">Chỉnh Sửa Thông Tin Cá Nhân</h1>
        <div className="mb-3">
          <label
            htmlFor="userName"
            className={clsx(styles["form-label"], "form-label")}
          >
            Tên Tài Khoản
          </label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={userInfo.userName}
            className={clsx(styles["form-control"], "form-control")}
            onChange={handleChange}
            readOnly
            disabled
          />
        </div>
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
            htmlFor="email"
            className={clsx(styles["form-label"], "form-label")}
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={userInfo.email}
            className={clsx(styles["form-control"], "form-control")}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="userImage"
            className={clsx(styles["form-label"], "form-label")}
          >
            Ảnh
          </label>
          <input
            type="file"
            id="userImage"
            name="userImage"
            className={clsx(styles["form-control"], "form-control")}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="address"
            className={clsx(styles["form-label"], "form-label")}
          >
            Địa Chỉ Giao Hàng
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
            <button className="btn btn-warning" onClick={handleEditUserAddress}>
              Sửa
            </button>
          </div>
        </div>
        <button
          type="submit"
          className={clsx(styles["btn-primary"], "btn text-light")}
        >
          Lưu Thay Đổi
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
      <ToastContainer></ToastContainer>
    </div>
  );
};

export const AdminProfile = () => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoading(false);
      try {
        const data = await getUserInfo();
        console.log("User Info: ", data);
        setUserInfo(data);
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

    fetchUserInfo();
  }, [navigate]);

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
    if (userInfo.phone < 0) {
      toast.error("SĐT không hợp lệ!");
      return;
    }

    const formData = new FormData();
    formData.append("FullName", userInfo.fullName);
    formData.append("Phone", userInfo.phone);
    formData.append("Email", userInfo.email);
    if (userInfo.userImage) {
      formData.append("UserImageURL", userInfo.userImage);
    }

    try {
      setIsLoading(true);
      await editProfile(formData);
      toast.success("Cập Nhật Thành Công");
      setTimeout(() => {
        toast.dismiss();
        navigate("/admin");
      }, 1000); // Đợi 1 giây trước khi chuyển trang
    } catch (err) {
      toast.error(err.response.data);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={clsx("pt-5", styles["big-container"])}>
      <form className={styles.container} onSubmit={handleSubmit}>
        <h1 className="text-center">Chỉnh Sửa Thông Tin Cá Nhân</h1>
        <div className="mb-3">
          <label
            htmlFor="userName"
            className={clsx(styles["form-label"], "form-label")}
          >
            Tên Tài Khoản
          </label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={userInfo.userName}
            className={clsx(styles["form-control"], "form-control")}
            onChange={handleChange}
            readOnly
            disabled
          />
        </div>
        <div className="mb-3">
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
        <div className="mb-3">
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
        <div className="mb-3">
          <label
            htmlFor="email"
            className={clsx(styles["form-label"], "form-label")}
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={userInfo.email}
            className={clsx(styles["form-control"], "form-control")}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="userImage"
            className={clsx(styles["form-label"], "form-label")}
          >
            Ảnh
          </label>
          <input
            type="file"
            id="userImage"
            name="userImage"
            className={clsx(styles["form-control"], "form-control")}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className={clsx(styles["btn-primary"], "btn text-light")}
        >
          Lưu Thay Đổi
        </button>
      </form>
      {isLoading && <Loading className={clsx(styles["loading"])}></Loading>}
      <ToastContainer></ToastContainer>
    </div>
  );
};

const AddUserAddress = ({ isOpenModal, setIsOpenModal }) => {
  const [userAddressInfo, setuserAddressInfo] = useState({
    addressLine1: "",
    city: "",
    country: "",
    isDefault: false,
  });

  const handleClick = () => {
    setIsOpenModal(false); // Đóng modal khi nhấn vào phần nền
  };

  const handleModalClick = (e) => {
    e.stopPropagation(); // Ngừng sự kiện lan truyền, không tắt modal
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("AddressLine1", userAddressInfo.addressLine1);
    formData.append("City", userAddressInfo.city);
    formData.append("Country", userAddressInfo.country);
    formData.append("IsDefault", userAddressInfo.isDefault);

    try {
      await addUserAddress(formData); // Gọi API với userId và selectedRoles
      toast.success("Thêm địa chỉ mới thành công");
      setIsOpenModal(false);
    } catch (error) {
      console.error("Thêm địa chỉ mới thất bại:", error);
      toast.error(error.response.data);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setuserAddressInfo((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <>
      {isOpenModal && (
        <Fragment>
          <div
            onClick={handleClick}
            className={clsx(styles["my-big-modal"])}
          ></div>

          <div
            className={clsx(styles["my-main-modal"])}
            onClick={handleModalClick}
          >
            <div className={clsx(styles["update-title"])}>
              <h2 className="text-secondary fw-bold">THÊM ĐỊA CHỈ</h2>
              <div onClick={handleClick} className={clsx(styles["btn-x"])}>
                <FontAwesomeIcon icon={faX} />
              </div>
            </div>

            <form className={clsx(styles["form-container"])}>
              <div className="d-flex flex-column gap-3">
                <input
                  type="text"
                  name="addressLine1"
                  value={userAddressInfo.addressLine1}
                  placeholder="Số nhà + tên đường, Phường, Quận"
                  onChange={handleInputChange}
                  className={clsx(styles["input-field"])}
                />
                <input
                  type="text"
                  name="city"
                  value={userAddressInfo.city}
                  placeholder="Tên Thành Phố"
                  onChange={handleInputChange}
                  className={clsx(styles["input-field"])}
                />
                <input
                  type="text"
                  name="country"
                  value={userAddressInfo.country}
                  placeholder="Quốc Gia"
                  onChange={handleInputChange}
                  className={clsx(styles["input-field"])}
                />
                <div>
                  <label
                    htmlFor="isDefault"
                    className={clsx(styles["custom-label"])}
                  >
                    <input
                      type="checkbox"
                      name="isDefault"
                      id="isDefault"
                      checked={userAddressInfo.isDefault}
                      onChange={handleInputChange}
                      className={clsx(styles["custom-input-field"])}
                    />
                    Địa Chỉ Mặc Định
                  </label>
                </div>
              </div>

              <div className="d-flex justify-content-center align-items-center mt-4">
                <button
                  className={clsx(styles["btn-submit"])}
                  onClick={handleSave}
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </Fragment>
      )}
    </>
  );
};

const EditUserAddresses = ({ isOpenModal, setIsOpenModal, userName }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    addressId: null,
  });

  const [userAddresses, setUserAddresses] = useState({
    $id: "1",
    $values: [],
  });

  const handleClick = () => setIsOpenModal(false); // Đóng modal
  const handleModalClick = (e) => e.stopPropagation(); // Ngừng lan truyền sự kiện

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updatePromises = userAddresses.$values.map(async (item) => {
        const formData = new FormData();
        formData.append("AddressLine1", item.addressLine1);
        formData.append("City", item.city);
        formData.append("Country", item.country);
        formData.append("IsDefault", item.isDefault);

        try {
          await editUserAddress(item.addressId, formData);
        } catch (error) {
          console.error(
            `Cập nhật thất bại cho địa chỉ ID: ${item.addressId}`,
            error
          );
          throw new Error(`Lỗi cập nhật địa chỉ với ID: ${item.addressId}`);
        }
      });

      await Promise.all(updatePromises); // Thực hiện tất cả các cập nhật song song
      toast.success("Cập nhật tất cả địa chỉ thành công!");
      setIsOpenModal(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật địa chỉ:", error);
      toast.error("Có lỗi xảy ra khi cập nhật địa chỉ!");
    }
  };

  const handleInputChange = (e, addressId) => {
    const { name, value } = e.target;

    setUserAddresses((prev) => ({
      ...prev,
      $values: prev.$values.map((item) =>
        name === "isDefault"
          ? { ...item, isDefault: item.addressId === addressId } // Cập nhật isDefault
          : item.addressId === addressId
            ? { ...item, [name]: value }
            : item
      ),
    }));
  };
  useEffect(() => {
    const fetchUserAddresses = async () => {
      setIsLoading(true);
      try {
        const data = await getUserAddresses();
        if (!data.$values) throw new Error("Dữ liệu trả về không hợp lệ");
        setUserAddresses(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu: ", err);
        if (err.response?.status === 401) navigate("/unauthenticated");
        else if (err.response?.status === 403) navigate("/unauthorized");
        else navigate("/not-found");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAddresses();
  }, [navigate]);

  const handleEdit = async (addressId) => {
    setUserAddresses((prev) => ({
      ...prev,
      $values: prev.$values.map((item) =>
        item.addressId === addressId
          ? { ...item, editable: !item.editable }
          : item
      ),
    }));
  };

  const handleRemove = (addressId) =>
    setConfirmDelete({ isOpen: true, addressId });

  const confirmRemove = async () => {
    try {
      await removeUserAddress(confirmDelete.addressId);
      setUserAddresses((prev) => ({
        ...prev,
        $values: prev.$values.filter(
          (item) => item.addressId !== confirmDelete.addressId
        ),
      }));
      setConfirmDelete({ isOpen: false, addressId: null });
      toast.success("Xóa Thành Công!");
    } catch (err) {
      console.log(err);
      toast.error("xóa Thất Bại!");
    }
  };

  const cancelRemove = () =>
    setConfirmDelete({ isOpen: false, addressId: null });

  const getClassName = (isEditable) =>
    clsx("form-control", { [styles["input-editing"]]: isEditable });

  return (
    <>
      {isOpenModal && (
        <Fragment>
          <div
            onClick={handleClick}
            className={clsx(styles["my-big-edit-modal"])}
          ></div>

          <div
            className={clsx(styles["my-main-edit-modal"])}
            onClick={handleModalClick}
          >
            <div className={clsx(styles["update-title"])}>
              <h2 className="text-secondary fw-bold">
                Danh Sách Địa Chỉ Của Tài Khoản: {userName}
              </h2>
              <div onClick={handleClick} className={clsx(styles["btn-x"])}>
                <FontAwesomeIcon icon={faX} />
              </div>
            </div>

            <form className={clsx(styles["form-container"])}>
              <div className={clsx(styles["header"], "w-100")}>
                <div className="w-75 d-flex justify-content-between p-1">
                  <div>Chọn</div>
                  <div>Địa Chỉ</div>
                  <div>Thành Phố</div>
                  <div>Quốc Gia</div>
                </div>
              </div>
              <div
                className={clsx(
                  styles["div-addresses"],
                  "d-flex flex-column gap-3"
                )}
              >
                {userAddresses.$values.map((item, index) => (
                  <div
                    key={index}
                    className="form-check mb-3 d-flex align-items-center gap-3"
                  >
                    <input
                      type="radio"
                      name="isDefault"
                      checked={item.isDefault}
                      onChange={(e) => handleInputChange(e, item.addressId)}
                      className="form-check-input"
                    />
                    <input
                      type="text"
                      placeholder="Số Nhà + Tên Đường, Phường"
                      value={item.addressLine1}
                      onChange={(e) => handleInputChange(e, item.addressId)}
                      name="addressLine1"
                      readOnly={!item.editable}
                      className={getClassName(item.editable)}
                    />
                    <input
                      type="text"
                      placeholder="Thành Phố"
                      value={item.city}
                      onChange={(e) => handleInputChange(e, item.addressId)}
                      name="city"
                      readOnly={!item.editable}
                      className={getClassName(item.editable)}
                    />
                    <input
                      type="text"
                      placeholder="Quốc Gia"
                      value={item.country}
                      onChange={(e) => handleInputChange(e, item.addressId)}
                      name="country"
                      readOnly={!item.editable}
                      className={getClassName(item.editable)}
                    />
                    <button
                      className="btn btn-warning"
                      onClick={(e) => {
                        e.preventDefault();
                        handleEdit(item.addressId);
                      }}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemove(item.addressId);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-center align-items-center mt-4">
                <button
                  className={clsx(styles["btn-submit"])}
                  onClick={handleSave}
                >
                  Lưu
                </button>
              </div>
            </form>
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
                <h3 className="text-danger">Xác nhận xóa</h3>
                <p>Bạn có chắc chắn muốn xóa địa chỉ này không?</p>
                <div className="d-flex justify-content-between">
                  <button className="btn btn-danger" onClick={confirmRemove}>
                    Xóa
                  </button>
                  <button className="btn btn-secondary" onClick={cancelRemove}>
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          )}
          {isLoading && <Loading className={clsx(styles["loading"])}></Loading>}
        </Fragment>
      )}
    </>
  );
};

AddUserAddress.propTypes = {
  isOpenModal: PropTypes.bool,
  setIsOpenModal: PropTypes.func,
};
EditUserAddresses.propTypes = {
  isOpenModal: PropTypes.bool,
  setIsOpenModal: PropTypes.func,
  userName: PropTypes.string,
};
export default Profile;
