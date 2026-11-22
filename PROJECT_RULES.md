---
alwaysApply: true
---
# Project Rules

## 1. ファイル構成
- HTML と JavaScript は必ず別ファイルに分ける  
  - ※ JSX など、コンポーネント内での記述は例外とする

## 2. HTML 要素の扱い
- 捜査対象となる HTML 要素には、役割がわかる id を付与する  
  - 例: `#submitButton`, `#scoreDisplay`, `#userForm`

## 3. 関数命名
- 関数名は処理内容や目的が明確にわかる名前にする  
  - 例: `calculateScore()`, `fetchUserData()`, `renderResult()`

## 4. 外部の公式ドキュメント
このプロジェクトでは以下の公式ドキュメントを参照すること。

- MongoDB 公式ドキュメント  
  https://www.mongodb.com/docs/

- Express.js 公式ドキュメント  
  https://expressjs.com/

- React 公式ドキュメント  
  https://react.dev/

- Node.js 公式ドキュメント  
  https://nodejs.org/en/docs/


# AI Discussion Logging Rules

## 保存場所（フォルダ構成）
AI とのやり取りは、プロジェクト直下の `/memo/ai/` に保存する。
フェーズごとにフォルダを作成し、タスク単位で md ファイルを配置する。

例：
/memo/ai/phase0
/memo/ai/phase1
/memo/ai/phase2
...

## チケット番号の扱い（必須）
- Cursor で議論を開始する前に、必ず Redmine でタスクチケットを作成する
- md ファイル名には必ずチケット番号を含める
  例：`task-123-user-table-definition-2026-07-06.md`
- Cursor に送る Request の冒頭で「現在のタスクは task-123」と宣言する

## ファイル命名規則（タスク単位）
- 1 タスク = 1 md ファイル
- ファイル名は「task-<番号>-<タスク名>-<初回作成日>」で統一する
  例：`user-table-definition-2026-07-06.md`
       `auth-flow-refactor-2026-07-07.md`

※ チャットが複数あっても、同じタスクなら同じ md に追記する  
※ 日付は「初回作成日」で固定し、後から変更しない

## md ファイル構成（統一フォーマット）
各 md ファイルは以下の構成にする：

# Request
（自分が Cursor に送った指示内容。必要に応じて再構成してよい）

# Response
（Cursor が返した内容。重要な部分だけ抜粋してよい）

# Decisions
（この議論で確定した仕様。Redmine に転記する部分）

## 保存タイミング（チャットと md の関係）
- 新しいタスクを開始したら新規 md を作成する
- 同じタスクに関するチャットは、チャットが複数あっても同じ md に追記する
- フェーズが変わったら、該当フェーズのフォルダに新しい md を作成する
- 過去のチャット内容も必要に応じて md に再構成して保存してよい（後からの保存を許可）

## 運用ルール（フェーズ・タスク・チャットの整理）
- フォルダはフェーズ単位で分ける（phase0〜phase7）
- md はタスク単位で作成する
- チャットはタスク単位で開始する（フェーズ単位では巨大化するため避ける）
- チャット開始時に「現在のフェーズ」を宣言する
- md はチャット単位ではなくタスク単位でまとめる（混乱防止）