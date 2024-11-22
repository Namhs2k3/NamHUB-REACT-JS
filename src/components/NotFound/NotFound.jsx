import clsx from "clsx";
import styles from "./NotFound.module.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceFrown } from "@fortawesome/free-solid-svg-icons";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className={clsx(styles["big-div"])}>
      <div className={clsx(styles["not-found"])}>
        <FontAwesomeIcon
          icon={faFaceFrown}
          className={clsx(styles["sad"], "mb-5")}
        />
        404 - Page Not Found
        <button
          className={clsx(styles["go-home"])}
          onClick={() => navigate("/home")}
        >
          Quay Lại Trang Chủ
        </button>
      </div>
    </div>
  );
};

export default NotFound;
