import React from "react";

export const PrivacyPolicy = () => {
  return (
    <>
      <div className="privacy-policy-wrap">
        <div className="privacy-policy-container">
          <h2 className="title">プライバシーポリシー</h2>
          <p className="main">
            Menthasでは以下のプライバシーポリシーに基づき、 Cloudflare Web
            Analyticsで得られた情報を使用します。
          </p>
          <p className="bold">Cloudflare Web Analyticsの利用目的</p>
          <ul>
            <li>
              ユーザビリティやアルゴリズムの改善のために統計情報として、ユーザ数やアクセス分析を行うために使用します。
            </li>
          </ul>
          <p className="bold">その他/取り扱いについて</p>
          <ul>
            <li>
              Cloudflare Web
              AnalyticsはWebビーコンを使用しており、Menthasにはユーザアカウントは存在しないためCloudflare
              Web Analyticsを用いても個人を特定することはできません。
            </li>
            <li>
              Cloudflare Web
              Analyticsにより収集された情報は、以下のcloudflare社が発行するプライバシーポリシーに基づいて管理されます。
            </li>
            <li>
              <a
                href="https://www.cloudflare.com/ja-jp/privacypolicy/"
                target="_blank"
                className="url"
              >
                https://www.cloudflare.com/ja-jp/privacypolicy/
              </a>
            </li>
            <li>
              またCloudflare Web
              Analyticsで収集した情報を、法令に基づく何らかの特別な場合を除いて、第三者に提供することはしないものとします。
            </li>
          </ul>
          <p className="bold">改定</p>
          <ul>
            <li>
              2024/11/8 GoodleAnalyticsからCloudflare Web
              Analyticsに移行したため、内容の改訂を行いました。
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};
