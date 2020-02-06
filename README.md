## Menthas: プログラマのためのニュースキュレーションサービス

[Menthas](https://menthas.com)(メンタス)は、プログラマ向けニュースキュレーションサービスです。各カテゴリごとにWeb上から優秀なCuratorを選別しニュースを収集します。

### 機能

- 様々なカテゴリ
 - JavaScriptやデザインなどのフロントエンドからサーバーサイド、インフラまで多様なカテゴリのニュースを配信
- はてなブックマークの優秀なCuratorによるニュース選出
 - 各々のカテゴリごとに専門度の高いユーザを算出してニュースを選出

### 仕組み

[約3年かけてプログラマ向けニュース推薦アプリを作り直した話](https://qiita.com/ytanaka/items/6cfad69a4c000c05be40)

仕組みやアルゴリズム、インフラ構成についてはこちらの記事にまとめました。

### Requirements

MongoDB, Node.js etc...

### Contributing

```
$ mongorestore --host localhost --db menthas-example examples/data
$ npm install
$ npm run start
```