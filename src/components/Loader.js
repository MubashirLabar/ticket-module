import React, { FC } from "react";

const Loader = ({ size, thin, backgroundColor, color }) => {
  return (
    <div
      className="sp-circle"
      style={{
        height: `${size}px`,
        width: `${size}px`,
        borderWidth: `${thin}px`,
        borderTopWidth: `${thin}px`,
        borderColor: `${backgroundColor}`,
        borderTopColor: `${color}`,
      }}
    />
  );
};

export default Loader;
