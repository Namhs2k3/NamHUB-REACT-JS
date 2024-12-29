import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const CartAmountContext = createContext();

export const CartAmountProvider = ({ children }) => {
  const [totalAmount, setTotalAmount] = useState(false);

  return (
    <CartAmountContext.Provider value={{ totalAmount, setTotalAmount }}>
      {children}
    </CartAmountContext.Provider>
  );
};

CartAmountProvider.propTypes = {
  children: PropTypes.node,
};
