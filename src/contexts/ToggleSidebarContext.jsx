import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const ToggleSidebarContext = createContext();

export const ToggleSidebarProvider = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const storedValue = localStorage.getItem("isSidebarCollapsed");
    return storedValue === "true";
  });
  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const newValue = !prev;
      localStorage.setItem("isSidebarCollapsed", newValue);
      return newValue;
    });
  };

  return (
    <ToggleSidebarContext.Provider
      value={{ isSidebarCollapsed, toggleSidebar }}
    >
      {children}
    </ToggleSidebarContext.Provider>
  );
};

ToggleSidebarProvider.propTypes = {
  children: PropTypes.node,
};
