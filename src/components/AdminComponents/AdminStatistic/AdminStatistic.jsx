import clsx from "clsx"
import AdminSideBar from "../AdminSideBar/AdminSideBar"
import styles from "./AdminStatistic.module.css"
const AdminStatistic = () => {
    return (
        <div className={clsx(styles["main-statistic"])}>
            <AdminSideBar site="statistic"></AdminSideBar>
            <div>helo</div>
        </div>
    )
}
export default AdminStatistic