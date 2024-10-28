import clsx from "clsx"
import styles from "./AdminSideBar.module.css"
import Logo from "../../Logo/Logo.jsx"
import PropTypes from "prop-types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBurger, faChartSimple } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"
const AdminSideBar = ({ site }) => {
    return (
        <div className={clsx(styles["main-side-bar"])}>
            <Logo theme="light"></Logo>

            <Link to="/admin/statistic" className={clsx(styles["statistic"], styles[site === "statistic" ? "active" : ""])}>
                Statistic
                <FontAwesomeIcon icon={faChartSimple} />
            </Link>

            <Link to="/admin/products" className={clsx(styles["products"], styles[site === "products" ? "active" : ""])}>
                Products
                <FontAwesomeIcon icon={faBurger} />
            </Link>

        </div>
    )
}
AdminSideBar.propTypes = {
    site: PropTypes.string.isRequired, // xác định kiểu string cho theme
};
export default AdminSideBar