# Testing for Boostnote
Boostnoteには[ava](https://github.com/avajs/ava)と[spectron](https://github.com/electron/spectron)で書かれたe2eテストがあります。

## 実行方法
以下のe2eテストのコマンドがあります。

```
$ yarn run test:e2e
```

もう一つのテストコマンドと分けた理由は、travisCIの都合です。

## On travisCI
travisCIではmasterブランチで飲みe2eテストを実行するようにしています。もし興味がある方は `.travis.yml`をご覧ください。
