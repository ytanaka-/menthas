import React from "react";
import logo from "../image/logo.svg";

export const Header = () => {
  return (
    <>
      <div className="header">
        <div className="header-container">
          <div className="logo">
            <a href="/">
              <img className="logo-img" src={logo} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
