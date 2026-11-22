# User Rules

## 1. コメントの付与
- すべての関数には、処理内容を説明するコメントを必ず付ける  
  - 例:
    ```js
    // ユーザーのスコアを計算する
    function calculateScore() { ... }
    ```

## 2. README の作成
- プロジェクトには必ず README を作成し、以下を記載する  
  - プロジェクト概要  
  - セットアップ方法  
  - 使用技術  
  - ディレクトリ構成  
  - 開発ルール（Project Rules / Agents.md へのリンク）

# My AI Interaction Style

## 指示の送り方
- Cursor への指示は md 形式で送る
- 必要な背景情報、目的、制約条件を明記する
- 議論開始前に Redmine でチケット番号を作成し、Request 冒頭で task-番号 を宣言する

## ログの扱い
- Cursor とのやり取りは必ず `/memo/ai/` に保存する
- 保存形式は Project Rules の構成に従う
- md ファイル名には必ず Redmine のチケット番号を含める
- 過去チャットの内容も必要に応じて md に再構成して保存する

## Redmine への反映
- Redmine のフェーズチケットには「Decisions」だけを反映する
- 議論ログは Redmine のコメント欄に必要な部分だけ貼る
- 実装タスクは別チケットで管理する

## Git / GitHub（詳細は `.cursor/rules/git-safety.mdc`）
- push / commit / PR 作成・merge / force / hard reset / rebase は明示同意が必要
- status / diff / log / fetch / pull / clone（依頼時）/ 読み取り系 gh は同意なしで可
- 衝突や hook 失敗時は勝手に force / amend しない
- `.env` など秘密情報は commit / push しない