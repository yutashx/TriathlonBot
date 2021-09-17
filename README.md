# University of Aizu Triathlon Club Activity Mail Sender Bot
## 目的
日々の部活のためのメール配信を自動化する。

## 構成
TypeScriptで書かれており、`clasp`を使用することでTypeScriptをコンパイルしてGoogle Apps Scriptに変換し、それを連携しているGASのサーバに投げることでこのBotを運用している。
設定に関してはSpreadSheetのconfigとmemberシートを参照のこと。

## 自動化内容
このBotはSpreadSheetのmenuシートを参照して下記の仕事を自動化する。
- 明日の練習メニューのメールの送信
- 今週の練習メニューのメールの送信
- 上記2つのメールの事前確認メールの送信
- バイク練の出欠確認用のメールの送信
- バイク練の出欠確認用のフォームの生成
- バイク練の出席者の集計
- SpreadSheetへの祝日の更新
- 翌週の練習メニューが埋めてあるか検証し、責任者への催促メールの送信
- 部活の月間予定ページ用のHTMLの生成とそのHTMLを取得するためのWebサーバの運用

## 設定
configシートはメールのタイトル、追加するコメント、パースする範囲などを指定できる。
またmemberシートではこのBotの運営メンバーや送信先の情報をまとめておく。
どちらのシートも基本的に触れないことを推奨する。

## SpreadSheetの記述の仕方
|Date|Day|Event|Detail|Time|Place|Prevent to Send|Additional Comment for Mail|Remarks for SpreadSheet|
|-|-|-|-|-|-|-|-|-|
|YYYY-MM-DD形式で記述する|曜日||||||||