import React, { useState, useRef, useContext } from "react";
import styles from "./DiscountSelector.module.css";
import PropTypes from "prop-types";
import { CartAmountContext } from "../../../../contexts/CartAmountContext";

const DiscountDropdown = ({ discountCodes, selectedCode, onSelect }) => {
  const { totalAmount } = useContext(CartAmountContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (code) => {
    if (code.minOrderValue <= totalAmount) {
      onSelect(code);
      setIsOpen(false);
    }
  };

  // Đóng dropdown khi click bên ngoài
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.discountDropdown} ref={dropdownRef}>
      <h3 className={styles.sectionTitle}>Mã Giảm Giá</h3>
      <div className={styles.selected} onClick={toggleDropdown}>
        <span>
          {selectedCode && selectedCode.code !== undefined
            ? `Mã giảm giá: ${selectedCode.code}`
            : "Chọn mã giảm giá"}
        </span>
        <span className={`${styles.arrow} ${isOpen ? styles.up : styles.down}`}>
          ▼
        </span>
      </div>
      {isOpen && (
        <div className={styles.dropdown}>
          {discountCodes.length > 0 ? (
            discountCodes.map((code) => (
              <div
                key={code.discountId}
                className={`${styles.codeCard} ${
                  code.minOrderValue > totalAmount ? styles.disabledCard : ""
                }`}
                onClick={() => handleSelect(code)}
              >
                <p className={styles.code}>
                  {code.code}
                  {code.minOrderValue > totalAmount && (
                    <span className={styles.warning}>
                      * Không đủ điều kiện để sử dụng mã này
                    </span>
                  )}
                </p>
                <p className={styles.description}>
                  Áp dụng cho đơn hàng từ {code.minOrderValue.toLocaleString()}₫
                </p>
                <p className={styles.value}>
                  {code.discountType === "amount"
                    ? `Giảm ${code.discountValue.toLocaleString()}₫`
                    : `Giảm ${code.discountValue}%`}
                </p>
              </div>
            ))
          ) : (
            <p className={styles.noCodes}>Không có mã giảm giá khả dụng</p>
          )}
        </div>
      )}
    </div>
  );
};

DiscountDropdown.propTypes = {
  discountCodes: PropTypes.array.isRequired,
  selectedCode: PropTypes.object,
  onSelect: PropTypes.func.isRequired,
};

export default DiscountDropdown;
