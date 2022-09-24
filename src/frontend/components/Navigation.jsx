import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const Navigation = ({channels}) => {
  
  return (
    <>
      <div className="navigation">
        <div className="navigation-wrap">
          <ul className="navigation-container">
            {channels.map((channel) => {
              return (
                <li className="channel-section" key={channel.name}>
                  {channel.name === 'all' && (
                    <NavLink to="/" className={({ isActive }) => (isActive ? 'router-link-active' : '')}>
                      <span className="navigation-channel-text">{channel.title}</span>
                    </NavLink>
                  )}
                  {channel.name !== 'all' && (
                    <NavLink to={channel.name} className={({ isActive }) => (isActive ? 'router-link-active' : '')}>
                      <span className="navigation-channel-text">{channel.title}</span>
                    </NavLink>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Navigation;