import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const Navigation = ({currentChannel, channels}) => {
  return (
    <>
      <div className="navigation">
        <div className="navigation-wrap">
          <ul className="navigation-container">
            {channels.map((channel) => {
              return (
                <li className="channel-section" key={channel.name}>
                  <NavigationItem currentChannel={currentChannel} channel={channel} />
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

const NavigationItem = ({currentChannel, channel}) => {
  const isActive = currentChannel == channel.name;
  const to = channel.name === "all" ? "/" : channel.name;
  return (
    <>
      <NavLink to={to} className={isActive ? 'router-link-active' : ''}>
        <span className="navigation-channel-text">{channel.title}</span>
      </NavLink>
    </>
  );
}

export default Navigation;