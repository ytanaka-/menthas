<template>
  <div class="privacy-policy-container">
    <h2 class="title">プライバシーポリシー</h2>
    <p class="main">Menthasでは以下に記載するプライバシーポリシーに基づき、Google Analyticsで得られた情報を使用しています</p>
    <p class="bold">Google Analyticsの利用目的</p>
    <ul>
      <li>ユーザビリティやアルゴリズムの改善のために統計情報として、ユーザ数やどんなニュースが多くクリックされているかといった分析を行うために使用します</li>
      <li>Google Analyticsがどのように情報を収集するかは以下の公式記事を参照してください</li>
      <li>
        <a href='https://policies.google.com/privacy?hl=ja' target='_blank' class='url'>https://policies.google.com/privacy?hl=ja</a>
      </li>
    </ul>
    <p class="bold">その他/取り扱いについて</p>
    <ul>
      <li>Menthasにはアカウントは存在しないため、Google Analyticsを用いても個人を特定することはできません</li>
      <li>Google Analyticsにより収集された情報は、Google社のプライバシーポリシーに基づいて管理されます</li>
      <li>またGoogle Analyticsで収集した情報を、法令に基づく何らかの特別な場合を除いて、第三者に提供することはしないものとします</li>
    </ul>
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
.privacy-policy-container
  width 650px
  height 100%
  margin 0 auto
  padding 12px
  font-size 13px
  
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

</style>