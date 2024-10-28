import clsx from "clsx";
import styles from "./Logo.module.css";
import PropTypes from "prop-types";

const Logo = ({ theme }) => {
    return (
        <div className={clsx(styles["div-logo"])}>
            <div className={clsx(styles[theme === "dark" ? "big-logo-dark" : "big-logo-light"])}>
                <span className={clsx(styles["child-logo-1"])}>Nam</span>
                <span className={clsx(styles["child-logo-2"])}>HUB</span>
            </div>
        </div>
    );
};

Logo.propTypes = {
    theme: PropTypes.string, // xác định kiểu string cho theme
};

export default Logo;
