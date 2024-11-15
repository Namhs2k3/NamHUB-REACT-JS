import clsx from "clsx"
import styles from "./Loading.module.css"
const Loading = () => {
    return (
        <div className={clsx(styles["big-div"])}>
            <div className={clsx(styles["loading"])}>

            </div>
        </div>
    )
}

export default Loading;