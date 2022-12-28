import React, { useEffect, useContext, useRef } from "react";
import { NavLink } from "react-router-dom";
import { MenthasContext } from "./App";

const Navigation = () => {
  const { state } = useContext(MenthasContext);
  const { channels, currentChannel } = state;
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

const NavigationItem = ({ currentChannel, channel }) => {
  const isActive = currentChannel == channel.name;
  const to = channel.name === "all" ? "/" : channel.name;
  const ref = useRef();
  useEffect(() => {
    if (isActive && ref.current) {
      ref.current.scrollIntoView();
    }
  }, [currentChannel, isActive]);
  return (
    <>
      <NavLink to={to} ref={ref} className={isActive ? 'router-link-active' : ''}>
        <span className="navigation-channel-text">{channel.title}</span>
      </NavLink>
    </>
  );
}

export default Navigation;