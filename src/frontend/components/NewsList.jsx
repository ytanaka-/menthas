import React, { useEffect, useState, useContext } from "react";
import ReactLoading from "react-loading";
import dayjs from 'dayjs';
import { getChannel } from '../libs/api-client';
import { MenthasContext } from "./App";
import "../css/news-list.css";

const NewsList = ({ category, isActive }) => {
  const { state, dispatch } = useContext(MenthasContext);
  const { news } = state;
  const [loading, setLoading] = useState(true);
  const [contents, setContents] = useState({
    top: {
      main: null,
      sub: [],
      sections: []
    },
    pages: []
  });

  useEffect(() => {
    if (news.has(category)) {
      const { top, pages } = createTopAndListNews(news.get(category));
      setContents({
        top, pages
      });
    } else if (isActive) {
      (async () => {
        const result = await getChannel(category);
        const status = result.status;
        if (status === 200) {
          const data = await result.json();
          const { top, pages } = createTopAndListNews(data.pages);
          setContents({
            top, pages
          });
          dispatch({
            type: 'setNews', payload: {
              channel: category,
              pages: data.pages
            }
          });
        }
        setLoading(false);
      })();
    }
  }, [category, isActive]);

  const imageLoadError = (el) => {
    el.target.src = "/images/no-image.png";
  }

  const listImageLoadError = (el) => {
    el.target.src = "/images/no-image-big.png";
  }

  if (loading) {
    return (
      <div className="news-list">
        <div className="loading">
          <ReactLoading type={"bars"} color={"#333"} height={"24px"} width={"24px"} />
        </div>
      </div>
    )
  }
  return (
    <>
      <div className="news-list" >
        <div className="news-container">
          <div className="top-container-wrap">
            {contents.top.main !== null && (
              <>
                <div className="top-left-container">
                  <div className="top-main-container">
                    <div className="top-box">
                      <NewsLink page={contents.top.main} >
                        <Thumbnail page={contents.top.main} onLoadError={imageLoadError} />
                        <MetaInfo page={contents.top.main} isDescription={false} />
                      </NewsLink>
                    </div>
                  </div>
                  <div className="top-sub-container-wrap">
                    {contents.top.sub.map((page) => {
                      return (
                        <div className="top-sub-container" key={page._id}>
                          <NewsLink page={page} >
                            <Thumbnail page={page} onLoadError={imageLoadError} />
                            <MetaInfo page={page} isDescription={false} />
                          </NewsLink>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="top-section-container-wrap">
                  {contents.top.sections.map((page) => {
                    return (
                      <div className="top-section-container" key={page._id}>
                        <NewsLink page={page} >
                          <MetaInfo page={page} />
                        </NewsLink>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          {contents.pages.map((page) => {
            return (
              <div className="list-container" key={page._id}>
                <NewsLink page={page} >
                  <Thumbnail page={page} onLoadError={listImageLoadError} />
                  <MetaInfo page={page} />
                </NewsLink>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

const NewsLink = ({ page, children }) => {
  return (
    <div className="news-link-box" >
      <a className="news-link-wrap" href={page.url} target="_blank" rel="noopener">
        {children}
      </a>
    </div>
  );
}

const Thumbnail = ({ page, onLoadError }) => {
  return (
    <div className="thumbnail-box">
      <img src={page.thumbnail} onError={onLoadError} />
    </div>
  );
}

const MetaInfo = ({ page, isDescription = true }) => {
  return (
    <div className="text-box">
      <div className="title">
        {page.title}
      </div>
      <div className="meta-info">
        <div className="meta-info-text">
          from: {page.host_name}, {page.categoriesStr}
          {page.isInfluential && (
            <span>, <span className="highly-influential">Highly Influential News</span></span>
          )}
          {page.isNew && (
            <span>, <span className="new">New!</span></span>
          )}
        </div>
      </div>
      {isDescription && (
        <div className="description">
          <div className="description-text">{page.description}</div>
        </div>
      )}
    </div>
  );
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
        } else if (!page.categoriesStr.includes(page.categoriesStr)) {
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

export default NewsList;