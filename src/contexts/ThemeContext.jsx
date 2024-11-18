import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isChecked, setIsChecked] = useState(() => {
    const storedValue = localStorage.getItem("isChecked");
    return storedValue === "true"; // Convert từ chuỗi về boolean
  });

  const handleChecked = () => {
    setIsChecked((prev) => {
      const newValue = !prev;
      localStorage.setItem("isChecked", newValue);
      return newValue;
    });
  };
  return (
    <ThemeContext.Provider value={{ isChecked, handleChecked }}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node,
};
