import React from "react";

const TWITTER_URL = "https://twitter.com/_ytanaka_";
const GITHUB_URL = "https://github.com/ytanaka-/menthas";

export const Footer = () => {
  return (
    <>
      <div v-show="pages.length > 0" className="footer">
        <div className="footer-container">
          <div className="info1">
            <span>
              Menthas関連リンク:{" "}
              <a href="/privacy_policy">プライバシーポリシー</a>,{" "}
              <a href={TWITTER_URL}>開発者Twitter</a>,{" "}
              <a href={GITHUB_URL}>Github</a>
            </span>
          </div>
          <div className="info2">
            <span>
              Menthasはユーザビリティの改善や分析のためGoogleAnalyticsを使用しています
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
