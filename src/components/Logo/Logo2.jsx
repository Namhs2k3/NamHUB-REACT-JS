import clsx from "clsx"
import styles from "./Logo2.module.css"
import PropTypes from "prop-types";
const Logo2 = ({ theme }) => {
    return (
        <div className={clsx(styles[theme === "light" ? "big-div-light" : "big-div-dark"])}>
            N
        </div>
    )
}
Logo2.propTypes = {
    theme: PropTypes.string
};
export default Logo2