import PropTypes from "prop-types";
import "./Popup.css";
import clsx from "clsx";
const Popup = ({ className, tag }) => {
  return <div className={clsx("tag-pop-up", className)}>{tag}</div>;
};
Popup.propTypes = {
  tag: PropTypes.string,
  className: PropTypes.string,
};
export default Popup;
