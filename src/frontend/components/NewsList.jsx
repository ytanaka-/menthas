import React, { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import { getChannel } from '../libs/api-client';
import dayjs from 'dayjs';
import ReactLoading from "react-loading";
import "../css/news-list.css";

const delayMs = 100;

const sendGAClick = (url, pos) => {
  if (window.gtag != undefined) {
    let position;
    if (pos == 1) {
      position = "position_top";
    } else if (pos == 2) {
      position = "position_side";
    } else {
      position = "position_list";
    }
    window.gtag('event', 'click', {
      'event_category': position,
      'event_label': url,
      'transport_type': 'beacon'
    });
  }
}

function reduce(state, action) {
  switch (action.type) {
    case "setChannelPages":
      return { ...state, pages: action.payload.pages, top: action.payload.top }
    case "setLoading":
      return { ...state, loading: action.payload.loading }
    default:
      throw new Error();
  }
}

function createTopAndListNews(pages) {
  const now = dayjs();
  const top = {
    main: null,
    sub: [],
    sections: []
  };
  const selections = [];
  pages.forEach((page, i) => {
    const curatedTime = dayjs(page.curated_at)
    const diff = now.diff(curatedTime, 'hours')
    if (diff < 8) {
      page.isNew = true;
    }
    const scores = page.scores
    scores.forEach((score) => {
      if (score.score > 6) {
        page.isInfluential = true;
      }
      if (score.score >= 3) {
        if (!page.categoriesStr) {
          page.categoriesStr = score.category.title
        } else {
          page.categoriesStr = page.categoriesStr + ", " + score.category.title
        }
      }
    })
  });
  // 上位7つをtop領域に割り当てるための処理
  pages.some((page, i) => {
    if (i >= 7) {
      return true;
    }
    selections.push(i);
  })
  selections.forEach((index, i) => {
    // サムネイルが設定されていない場合はここで代替
    if (!pages[index].thumbnail) {
      pages[index].thumbnail = "/images/no-image.png";
    }
    if (i == 0) {
      top.main = pages[index]
    } else if (i < 3) {
      top.sub.push(pages[index])
    } else {
      top.sections.push(pages[index])
    }
  });
  const _pages = [];
  pages.forEach((page, i) => {
    if (!selections.includes(i)) {
      if (!page.thumbnail) {
        page.thumbnail = "/images/no-image-big.png";
      }
      _pages.push(page)
    }
  });
  return { top, pages: _pages };
}

const NewsList = () => {
  const params = useParams();
  const [state, dispatch] = useReducer(reduce, {
    loading: false,
    top: {
      main: null,
      sub: [],
      sections: []
    },
    pages: []
  });

  useEffect(() => {
    (async () => {
      const channelName = !params.channel ? "all" : params.channel;
      // ProgressTimeLatchを導入する。delayMsが経つまではtrueにしない
      const timeoutID = setTimeout(() => {
        dispatch({ type: 'setLoading', payload: { loading: true } });
      }, delayMs);
      const result = await getChannel(channelName);
      const status = result.status;
      if (status === 200) {
        const data = await result.json();
        const { top, pages } = createTopAndListNews(data.pages);
        dispatch({
          type: 'setChannelPages', payload: {
            top, pages
          }
        });
      }
      clearTimeout(timeoutID);
      dispatch({ type: 'setLoading', payload: { loading: false } });
    })();
  }, [params.channel]);

  const imageLoadError = (el) => {
    el.target.src = "/images/no-image.png";
  }
  
  const listImageLoadError = (el) => {
    el.target.src = "/images/no-image-big.png";
  }

  return (
    <>
      <div className="newslist">
        <div className="news-container">
          <div className="top-container-wrap">
            {state.top.main !== null && (
              <>
                <div className="top-left-container">
                  <div className="top-main-container">
                    <div className="top-box">
                      <Thumbnail page={state.top.main} onClick={() => sendGAClick(state.top.main.url, 1)} onLoadError={() => imageLoadError()} />
                      <MetaInfo page={state.top.main} isDescription={false} />
                    </div>
                  </div>
                  <div className="top-sub-container-wrap">
                    {state.top.sub.map((page) => {
                      return (
                        <div className="top-sub-container" key={page._id}>
                          <Thumbnail page={page} onClick={() => sendGAClick(page.url, 1)} onLoadError={() => imageLoadError()} />
                          <MetaInfo page={page} isDescription={false} />
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="top-section-container-wrap">
                  {state.top.sections.map((page) => {
                    return (
                      <div className="top-section-container" key={page._id} onClick={() => sendGAClick(page.url, 2)} >
                        <MetaInfo page={page} />
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          {state.pages.map((page) => {
            return (
              <div className="list-container" key={page._id}>
                <Thumbnail page={page} onClick={() => sendGAClick(page.url)} onLoadError={() => listImageLoadError()} />
                <MetaInfo page={page} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

const Thumbnail = ({ page, onClick, onLoadError }) => {
  return (
    <div className="thumbnail-box">
      <a href={page.url} onClick={onClick} target="_blank" rel="noopener">
        <img src={page.thumbnail} onError={onLoadError} />
      </a>
    </div>
  );
}

const MetaInfo = ({ page, isDescription = true }) => {
  return (
    <div className="text-box">
      <div className="title">
        <a href={page.url} onClick={sendGAClick(page.url)} target="_blank" rel="noopener">
          <p>{page.title}</p>
        </a>
      </div>
      <div className="meta-info">
        <p className="meta-info-text">
          from: {page.host_name}, {page.categoriesStr}
          {page.isInfluential && (
            <span>, <span className="highly-influential">Highly Influential News</span></span>
          )}
          {page.isNew && (
            <span>, <span className="new">New!</span></span>
          )}
        </p>
      </div>
      {isDescription && (
        <div className="description">
          <p className="description-text">{page.description}</p>
        </div>
      )}
    </div>
  );
}

export default NewsList;