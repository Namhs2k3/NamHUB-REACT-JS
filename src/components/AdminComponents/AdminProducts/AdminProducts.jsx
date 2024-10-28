import clsx from "clsx"
import AdminSideBar from "../AdminSideBar/AdminSideBar"
import styles from "./AdminProducts.module.css"
const AdminProducts = () => {
    return (
        <div className={clsx(styles["main-products"])}>
            <AdminSideBar site="products"></AdminSideBar>
            <div>helo</div>
        </div>
    )
}
export default AdminProducts