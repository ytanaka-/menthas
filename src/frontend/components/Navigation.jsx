import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getChannels } from '../libs/api-client';

const Navigation = () => {
  const [channels, setChannels] = useState([]);
  useEffect(() => {
    (async () => {
      const result = await getChannels();
      const status = result.status;
      if (status === 200) {
        const data = await result.json();
        setChannels(data.channels);
      }
    })();
  }, []);

  return (
    <>
      <div className="navigation">
        <div className="navigation-wrap">
          <ul className="navigation-container">
            {channels.map((channel) => {
              return (
                <li className="channel-section" key={channel.name}>
                  {channel.name === 'all' && (
                    <Link to="/">
                      <span className="navigation-channel-text">{channel.title}</span>
                    </Link>
                  )}
                  {channel.name !== 'all' && (
                    <Link to={channel.name}>
                      <span className="navigation-channel-text">{channel.title}</span>
                    </Link>
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