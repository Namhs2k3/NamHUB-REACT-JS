import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const AddToCartContext = createContext();

export const AddToCartProvider = ({ children }) => {
  const [addNew, setAddNew] = useState(false);

  const handleAddNew = () => {
    setAddNew((prev) => {
      const newValue = !prev;
      return newValue;
    });
  };
  return (
    <AddToCartContext.Provider value={{ addNew, handleAddNew, setAddNew }}>
      {children}
    </AddToCartContext.Provider>
  );
};

AddToCartProvider.propTypes = {
  children: PropTypes.node,
};
