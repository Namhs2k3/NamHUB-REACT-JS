import clsx from "clsx";
import styles from "./Loading.module.css";
import PropTypes from "prop-types";
const Loading = ({ className }) => {
  return (
    <div className={clsx(styles["big-div"], className)}>
      <div className={clsx("text-center")}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
};
Loading.propTypes = {
  className: PropTypes.string,
};
export default Loading;
