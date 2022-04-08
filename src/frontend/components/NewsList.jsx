import React, { useState, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import { getChannel } from '../libs/api-client'
import dayjs from 'dayjs'
import "../css/news-list.css";

const delayMs = 100;

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

const NewsList = () => {
  const params = useParams();
  const [state, dispatch] = useReducer(reduce, {
    loading: false,
    pages: [],
    top: {
      main: null,
      sub: [],
      sections: []
    }
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
        const now = dayjs();
        const data = await result.json();
        const top = {
          main: null,
          sub: [],
          sections: []
        };
        const selections = [];
        const pages = data.pages;
        pages.forEach((page, i) => {
          const curatedTime = dayjs(page.curated_at)
          const diff = now.diff(curatedTime, 'hours')
          if (diff < 8) {
            page.isNew = true
          }
          const scores = page.scores
          scores.forEach((score) => {
            if (score.score > 6) {
              page.isInfluential = true
            }
            if (score.score >= 3) {
              if (!page.categoriesStr) {
                page.categoriesStr = score.category.title
              } else {
                page.categoriesStr = page.categoriesStr + ", " + score.category.title
              }
            }
          })
        })
        // 上位7つをtop領域に割り当てるための処理
        pages.some((page, i) => {
          if (i >= 7) {
            return true
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
        dispatch({
          type: 'setChannelPages', payload: {
            pages: _pages, top
          }
        });
      }
      dispatch({ type: 'setLoading', payload: { loading: false } });
    })();
  }, []);

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
                      <div className="thumbnail-box">
                        <a href={state.top.main.url} target="_blank" rel="noopener">
                          <img src={state.top.main.thumbnail} error="imageLoadError" />
                        </a>
                      </div>
                      <div className="title">
                        <a href={state.top.main.url} onClick="sendGAClick(top.main.url, 1)" target="_blank" rel="noopener">
                          <p>{state.top.main.title}</p>
                        </a>
                      </div>
                      <div className="meta-info">
                        <p className="meta-info-text">
                          from: {state.top.main.host_name}, {state.top.main.categoriesStr}
                          {state.top.main.isInfluential && (
                            <span className="highly-influential">,Highly Influential News</span>
                          )}
                          {state.top.main.isNew && (
                            <span className="new">,New!</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="top-sub-container-wrap">
                    {state.top.sub.map((item) => {
                      return (
                        <div className="top-sub-container" key={item._id}>
                          <div className="thumbnail-box">
                            <a href={item.url} onClick="sendGAClick(sub.url, 1)" target="_blank" rel="noopener">
                              <img src={item.thumbnail} error="imageLoadError" />
                            </a>
                          </div>
                          <div className="text-box">
                            <div className="title">
                              <a href={item.url} onClick="sendGAClick(sub.url, 2)" target="_blank" rel="noopener">
                                <p>{item.title}</p>
                              </a>
                            </div>
                            <div className="meta-info">
                              <p className="meta-info-text">
                                from: {item.host_name}, {item.categoriesStr}
                                {item.isInfluential && (
                                  <span className="highly-influential">,Highly Influential News</span>
                                )}
                                {item.isNew && (
                                  <span className="new">,New!</span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="top-section-container-wrap">
                  {state.top.sections.map((item) => {
                    return (
                      <div className="top-section-container" key={item._id}>
                        <div className="text-box">
                          <div className="title">
                            <a href={item.url} onClick="sendGAClick(item.url, 2)" target="_blank" rel="noopener">
                              <p>{item.title}</p>
                            </a>
                          </div>
                          <div className="meta-info">
                            <p className="meta-info-text">
                              from: {item.host_name}, {item.categoriesStr}
                              {item.isInfluential && (
                                <span className="highly-influential">,Highly Influential News</span>
                              )}
                              {item.isNew && (
                                <span className="new">,New!</span>
                              )}
                            </p>
                          </div>
                          <div className="description">
                            <p className="description-text">{item.description}</p>
                          </div>
                        </div>
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
                <div className="thumbnail-box">
                  <a href={page.url} onClick="sendGAClick(page.url)" target="_blank" rel="noopener">
                    <img src={page.thumbnail} error="listImageLoadError" />
                  </a>
                </div>
                <div className="text-box">
                  <div className="title">
                    <a href={page.url} onClick="sendGAClick(page.url)" target="_blank" rel="noopener">
                      <p>{page.title}</p>
                    </a>
                  </div>
                  <div className="meta-info">
                    <p className="meta-info-text">
                      from: {page.host_name}, {page.categoriesStr}
                      {page.isInfluential && (
                        <span className="highly-influential">,Highly Influential News</span>
                      )}
                      {page.isNew && (
                        <span className="new">,New!</span>
                      )}
                    </p>
                  </div>
                  <div className="description">
                    <p className="description-text">{page.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default NewsList;