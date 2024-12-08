import clsx from "clsx";
import AdminSideBar from "../AdminSideBar/AdminSideBar";
import styles from "./AdminUser.module.css";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import Loading from "../../Loading/Loading";
import { format } from "date-fns";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { ToggleSidebarContext } from "../../../contexts/ToggleSidebarContext";
import "react-datepicker/dist/react-datepicker.css";
import { addEmployee, getUserList, updateUserRoles } from "../../../api";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { toast, ToastContainer } from "react-toastify";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faUserPlus,
  faX,
} from "@fortawesome/free-solid-svg-icons";

const AdminUser = () => {
  const { isSidebarCollapsed, toggleSidebar } =
    useContext(ToggleSidebarContext);

  const { isChecked } = useContext(ThemeContext);

  const [userList, setUserList] = useState();

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);

  const fetchUserListByName = useCallback(async () => {
    setIsLoading(false);
    try {
      const data = await getUserList();
      console.log("User List: ", data);
      setUserList(data);
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
  }, [navigate]);

  useEffect(() => {
    fetchUserListByName();
  }, [fetchUserListByName, isOpenModal, isOpenAddModal]);
  console.log("user List:", userList);

  const [currentUserId, setCurrentUserId] = useState(null); // Lưu trữ userId
  const [currentUserName, setCurrentUserName] = useState(null); // Lưu trữ userId
  const handleRoleChange = (userId, username) => {
    setCurrentUserId(userId); // Lưu userId
    setCurrentUserName(username);
    setIsOpenModal(true); // Mở modal
  };

  const handleAddEmployee = () => {
    setIsOpenAddModal(true);
  };

  return (
    <div className={clsx(styles["main-users"])}>
      <AdminSideBar
        site="users"
        className={clsx(styles["side-bar"])}
        isSidebarCollapsed={isSidebarCollapsed}
      ></AdminSideBar>
      <div className={clsx(styles["user"])}>
        <AdminNavbar
          toggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <div className={clsx(styles[isChecked ? "main-light" : "main-dark"])}>
          <div
            className={clsx(
              styles[isChecked ? "list-product-light" : "list-product-dark"]
            )}
          >
            <div className={clsx(styles["title"])}>
              DANH SÁCH TÀI KHOẢN NGƯỜI DÙNG
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <button
                className="btn btn-success text-white mb-3"
                onClick={handleAddEmployee}
              >
                <FontAwesomeIcon icon={faUserPlus} /> Thêm Nhân Viên
              </button>
            </div>
            <div className={clsx(styles["div-table"])}>
              <table
                className={clsx(
                  styles["custom-table"],
                  "table table-striped table-hover"
                )}
              >
                <thead className={clsx(styles["custom-thead"])}>
                  <tr>
                    <th scope="col" style={{ verticalAlign: "middle" }}>
                      #
                    </th>
                    <th scope="col" style={{ verticalAlign: "middle" }}>
                      Username
                    </th>
                    <th scope="col" style={{ verticalAlign: "middle" }}>
                      Email
                    </th>
                    <th scope="col" style={{ verticalAlign: "middle" }}>
                      Verified
                    </th>
                    <th scope="col" style={{ verticalAlign: "middle" }}>
                      Full Name
                    </th>
                    <th scope="col" style={{ verticalAlign: "middle" }}>
                      Role
                    </th>
                    <th scope="col" style={{ verticalAlign: "middle" }}>
                      Update At
                    </th>
                    <th scope="col" style={{ verticalAlign: "middle" }}>
                      Create At
                    </th>
                    <th scope="col" style={{ verticalAlign: "middle" }}>
                      Thao Tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userList?.$values?.map((item, index) => (
                    <tr key={item.userId}>
                      <th style={{ verticalAlign: "middle" }} scope="row">
                        {index + 1}
                      </th>
                      <td style={{ verticalAlign: "middle" }}>
                        {item.username}
                      </td>
                      <td
                        style={{
                          maxWidth: "150px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          verticalAlign: "middle",
                        }}
                      >
                        {item.email || "Không có email"}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        <span
                          className={clsx(
                            styles["badge"],
                            styles[
                              item.emailVerified
                                ? "badge-success"
                                : "badge-secondary"
                            ]
                          )}
                        >
                          {item.emailVerified ? "Rồi" : "Chưa"}
                        </span>
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        {item.fullName}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        {item.roles?.$values
                          ?.map((role) => role.roleName)
                          .join(", ")}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        {format(new Date(item.updatedAt), "MM/dd/yyyy")}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        {format(new Date(item.createdAt), "MM/dd/yyyy")}
                      </td>
                      <td
                        style={{ textAlign: "center", verticalAlign: "middle" }}
                      >
                        <button
                          onClick={() =>
                            handleRoleChange(item.userId, item.username)
                          }
                          className="btn btn-warning btn-sm me-1"
                        >
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {isOpenModal && (
        <OpenModal
          isOpenModal={isOpenModal}
          setIsOpenModal={setIsOpenModal}
          userId={currentUserId}
          userName={currentUserName}
        />
      )}

      {isOpenAddModal && (
        <AddEmployee
          isOpenModal={isOpenAddModal}
          setIsOpenModal={setIsOpenAddModal}
        />
      )}
      {isLoading && <Loading className={clsx(styles["loading"])}></Loading>}
      <ToastContainer></ToastContainer>
    </div>
  );
};

const OpenModal = ({ isOpenModal, setIsOpenModal, userId, userName }) => {
  const [selectedRoles, setSelectedRoles] = useState([]); // State lưu trữ các vai trò đã chọn

  console.log("userId đc truyền vào: ", userId);
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      // Nếu checkbox được chọn, thêm vào danh sách
      setSelectedRoles((prevRoles) => [...prevRoles, value]);
    } else {
      // Nếu checkbox bị bỏ chọn, loại bỏ khỏi danh sách
      setSelectedRoles((prevRoles) =>
        prevRoles.filter((role) => role !== value)
      );
    }
  };

  console.log(selectedRoles);

  const handleClick = () => {
    setIsOpenModal(false); // Đóng modal khi nhấn vào phần nền
  };

  const handleModalClick = (e) => {
    e.stopPropagation(); // Ngừng sự kiện lan truyền, không tắt modal
  };

  const handleSave = async () => {
    try {
      await updateUserRoles(userId, selectedRoles); // Gọi API với userId và selectedRoles
      toast.success("Cập nhật vai trò thành công!");
      setIsOpenModal(false);
    } catch (error) {
      console.error("Cập nhật vai trò thất bại:", error);
      toast.error("Có lỗi xảy ra khi cập nhật vai trò!");
    }
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
              <h2 className="text-secondary fw-bold">PHÂN QUYỀN</h2>
              <div onClick={handleClick} className={clsx(styles["btn-x"])}>
                <FontAwesomeIcon icon={faX} />
              </div>
            </div>

            <div className="d-flex flex-wrap gap-3 justify-content-center align-items-center py-4">
              <p className="w-100 text-center">
                Tài khoản: <span className="text-success">{userName}</span>
              </p>
              <label>
                <input
                  type="checkbox"
                  value="ADMIN"
                  onChange={handleCheckboxChange}
                />
                ADMIN
              </label>
              <label>
                <input
                  type="checkbox"
                  value="EMPLOYEE"
                  onChange={handleCheckboxChange}
                />
                EMPLOYEE
              </label>
              <label>
                <input
                  type="checkbox"
                  value="DELIVER"
                  onChange={handleCheckboxChange}
                />
                DELIVER
              </label>
              <label>
                <input
                  type="checkbox"
                  value="USER"
                  onChange={handleCheckboxChange}
                />
                USER
              </label>
            </div>

            <div className="d-flex justify-content-center align-items-center">
              <button className="btn btn-info w-75" onClick={handleSave}>
                Lưu
              </button>
            </div>
          </div>
        </Fragment>
      )}
    </>
  );
};

const AddEmployee = ({ isOpenModal, setIsOpenModal }) => {
  const [userInfo, setuserInfo] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
  });

  const handleClick = () => {
    setIsOpenModal(false); // Đóng modal khi nhấn vào phần nền
  };

  const handleModalClick = (e) => {
    e.stopPropagation(); // Ngừng sự kiện lan truyền, không tắt modal
  };

  const handleSave = async () => {
    try {
      await addEmployee(userInfo); // Gọi API với userId và selectedRoles
      toast.success("Thêm nhân viên mới thành công!");
      setIsOpenModal(false);
    } catch (error) {
      console.error("Thêm nhân viên mới thất bại:", error);
      toast.error(error.response.data);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setuserInfo((prev) => ({
      ...prev,
      [name]: value,
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
              <h2 className="text-secondary fw-bold">THÊM NHÂN VIÊN</h2>
              <div onClick={handleClick} className={clsx(styles["btn-x"])}>
                <FontAwesomeIcon icon={faX} />
              </div>
            </div>

            <form className={clsx(styles["form-container"])}>
              <div className="d-flex flex-column gap-3">
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    name="username"
                    value={userInfo.username}
                    id="username"
                    placeholder="Tên Đăng Nhập"
                    onChange={handleInputChange}
                    className="form-control"
                  />
                  <label htmlFor="username">Tên Đăng Nhập</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="password"
                    name="password"
                    value={userInfo.password}
                    id="password"
                    placeholder="Mật Khẩu"
                    onChange={handleInputChange}
                    className="form-control"
                  />
                  <label htmlFor="password">Mật Khẩu</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="email"
                    name="email"
                    value={userInfo.email}
                    id="email"
                    placeholder="Email"
                    onChange={handleInputChange}
                    className="form-control"
                  />
                  <label htmlFor="email">Email</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="text"
                    name="fullName"
                    value={userInfo.fullName}
                    id="fullName"
                    placeholder="Họ Tên"
                    onChange={handleInputChange}
                    className="form-control"
                  />
                  <label htmlFor="fullName">Họ Tên</label>
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

OpenModal.propTypes = {
  isOpenModal: PropTypes.bool,
  setIsOpenModal: PropTypes.func,
  userId: PropTypes.number,
  userName: PropTypes.string,
};

AddEmployee.propTypes = {
  isOpenModal: PropTypes.bool,
  setIsOpenModal: PropTypes.func,
};
export default AdminUser;
