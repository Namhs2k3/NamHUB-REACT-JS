import clsx from "clsx";
import styles from "./Switch.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

const Switch = ({ isChecked, handleCheck }) => {
  return (
    <div>
      <div
        className={clsx(
          isChecked ? styles["big-div-light"] : styles["big-div-dark"],
          "d-flex justify-content-center align-items-center"
        )}
        onClick={handleCheck}
      >
        <FontAwesomeIcon
          icon={faSun}
          className={clsx(styles[isChecked ? "icon" : "icon-checked"])}
        />
        <FontAwesomeIcon
          icon={faMoon}
          className={clsx(styles[isChecked ? "icon" : "icon-checked"])}
        />
        <div
          className={clsx(
            isChecked && styles["div-switch"],
            !isChecked && styles["div-switch-clicked"]
          )}
        >
          <FontAwesomeIcon
            icon={isChecked ? faSun : faMoon}
            className={clsx(
              styles[isChecked ? "switch-default" : "switch-changed"]
            )}
          />
        </div>
      </div>
    </div>
  );
};

Switch.propTypes = {
  isChecked: PropTypes.bool,
  handleCheck: PropTypes.func,
};

export default Switch;
