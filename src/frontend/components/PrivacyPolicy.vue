<template>
  <div class="privacy-policy-wrap">
    <div class="privacy-policy-container">
      <h2 class="title">プライバシーポリシー</h2>
      <p class="main">Menthasでは以下に記載するプライバシーポリシーに基づき、Google Analyticsで得られた情報を使用しています</p>
      <p class="bold">Google Analyticsの利用目的</p>
      <ul>
        <li>ユーザビリティやアルゴリズムの改善のために統計情報として、ユーザ数やどんなニュースが多くクリックされているかといった分析を行うために使用します</li>
        <li>Google AnalyticsはCookieを使用します。その詳細については以下の公式記事を参照してください</li>
        <li>
          <a href='https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage?hl=ja' target='_blank' class='url'>https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage?hl=ja</a>
        </li>
      </ul>
      <p class="bold">その他/取り扱いについて</p>
      <ul>
        <li>Menthasにはユーザアカウントは存在しないため、Google Analyticsを用いても個人を特定することはできません</li>
        <li>Google Analyticsにより収集された情報は、以下のGoogle社が発行するプライバシーポリシーに基づいて管理されます</li>
        <li>
          <a href='https://policies.google.com/technologies/partner-sites?hl=ja' target='_blank' class='url'>https://policies.google.com/technologies/partner-sites?hl=ja</a>
        </li>
        <li>またGoogle Analyticsで収集した情報を、法令に基づく何らかの特別な場合を除いて、第三者に提供することはしないものとします</li>
      </ul>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Footer',

  data: () => ({
  }),
}
</script>

<style lang="stylus">
.privacy-policy-wrap
  width 650px
  height 100%
  margin 0 auto
  font-size 13px

.privacy-policy-container
  padding 12px
  .title
    padding 12px 0
  .main
    padding-left 6px
  .bold
    font-weight bold

  ul
    list-style-type disc
    li
      margin-left 20px

  p
    font-size 14px
    padding-top 12px
    padding-bottom 4px

  a
    word-break break-all

@media screen and (max-width: 650px)
  .privacy-policy-wrap
    width 100%

</style>