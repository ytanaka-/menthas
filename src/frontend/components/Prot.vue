<template>
  <div class="list">
    <div class="top-main">
      <div class="one">
      </div>
      <div class="two-wrap">
        <div class="two">
        </div>
        <div class="two two2">
        </div>
      </div>
    </div>
    <div class="top-sub">
      <div class="three">
        <div class="title">
          <a target="_blank" rel="noopener">
            <p>ITエンジニアの副業あれこれ</p>
          </a>
        </div>
        <div class="meta-info">
          <p class="meta-info-text">
            from: hogehoge}      
          </p>
        </div>
        <div class="description">
          <p class="description-text">いろいろやってみた知見が溜まったのでまとめ。 開発 時間給で労働を売る古き良きスタイルの副業。副業として機能開発とかバグ修正とかやったりする。 自分はUIがいい感じだったからという理由でOffersを使って副業を探した。 offers.jp 注意点として、日中まともに会社員やっている人だと、稼働時間が自ずと平日夜か</p>
        </div>
      </div>
      <div class="three">
        <div class="title">
          <a target="_blank" rel="noopener">
            <p>ITエンジニアの副業あれこれ</p>
          </a>
        </div>
        <div class="meta-info">
          <p class="meta-info-text">
            from: hogehoge}      
          </p>
        </div>
        <div class="description">
          <p class="description-text">いろいろやってみた知見が溜まったのでまとめ。 開発 時間給で労働を売る古き良きスタイルの副業。副業として機能開発とかバグ修正とかやったりする。 自分はUIがいい感じだったからという理由でOffersを使って副業を探した。 offers.jp 注意点として、日中まともに会社員やっている人だと、稼働時間が自ずと平日夜か</p>
        </div>
      </div>
      <div class="three">
        <div class="title">
          <a target="_blank" rel="noopener">
            <p>ITエンジニアの副業あれこれ</p>
          </a>
        </div>
        <div class="meta-info">
          <p class="meta-info-text">
            from: hogehoge}      
          </p>
        </div>
        <div class="description">
          <p class="description-text">いろいろやってみた知見が溜まったのでまとめ。 開発 時間給で労働を売る古き良きスタイルの副業。副業として機能開発とかバグ修正とかやったりする。 自分はUIがいい感じだったからという理由でOffersを使って副業を探した。 offers.jp 注意点として、日中まともに会社員やっている人だと、稼働時間が自ずと平日夜か</p>
        </div>
      </div>
       <div class="three">
        <div class="title">
          <a target="_blank" rel="noopener">
            <p>ITエンジニアの副業あれこれ</p>
          </a>
        </div>
        <div class="meta-info">
          <p class="meta-info-text">
            from: hogehoge}      
          </p>
        </div>
        <div class="description">
          <p class="description-text">いろいろやってみた知見が溜まったのでまとめ。 開発 時間給で労働を売る古き良きスタイルの副業。副業として機能開発とかバグ修正とかやったりする。 自分はUIがいい感じだったからという理由でOffersを使って副業を探した。 offers.jp 注意点として、日中まともに会社員やっている人だと、稼働時間が自ずと平日夜か</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "Prot",
  data: () => ({
  })
}
</script>

<style>
:root {
  --w0: min(100vw, 1050px);
  --w1: calc(var(--w0) * 6/10);
  --w2: calc(var(--w0) * 4/10);
  --h1: calc(var(--w1) * 6/10);
  --h2: calc(var(--w1) * 4/10);
  --h0: calc(var(--h1) + var(--h2));
  --h3: calc(var(--h0) * 1/4);
}

.list{
  width: var(--w0);
  margin: 0 auto;
  padding-top: 20px;
  display: flex;
}

.top-main{
  width: var(--w1);
  height: 720px;
}

.one{
  width: 100%;
  height: var(--h1);
  margin-bottom: 15px;
}

.two-wrap {
  display: flex;
  height: var(--h2);
}

.two {
  width: calc(100% * 1/2);
  background-color: #EEE;
}

.two2 {
  background-color: #DDD;
}

.top-sub {
  width: var(--w2);
  height: var(--h0);
  /*background-color: #AAA;*/
}

.three {
  width: var(--w2);
  height: var(--h3);
  /*background-color: #AAA;*/
  margin-bottom: 5px;
  padding: 5px 8px;
}
.three > .title {
  max-height: calc(17px * 1.4 * 3);
  margin-top: 0px;
  margin-bottom: 3px;
}
.three > .title > a {
  font-size: 17px
  line-height 1.4
}
.three > .meta-info {
  margin: 2px 0px;
}

</style>