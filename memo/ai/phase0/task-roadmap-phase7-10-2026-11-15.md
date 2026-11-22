# Request

Phase 0〜6 完了後の残タスク整理。別チャットで Phase 7〜10 を実施したいので、これまでの方針と残件を記録する。あわせて phase0.md のフェーズ分けを更新する。

確認事項:
1. PWA / レスポンシブとリリースのどちらを先にするか
2. Git 操作のグローバルルール案の承認

# Response

## Phase 0〜6 の位置づけ

phase0.md 当初計画（UI/DB 整合 + 認証）は **Complete**。差分はほぼなし。残るのは各 Phase でスコープ外にした項目と、本番・タブレット向け後続作業。

## 順序の確定（2026-11-15）

本番はタブレット利用想定。端末側の特別設定は不要だが、**アプリ側の PWA + 画面幅対応がないと使い心地を検証できない**ため、**PWA をリリースより先**にする。

| Phase | 内容 | 状態 |
|-------|------|------|
| 7 | PWA + タブレット向けレスポンシブ（試合画面・Sidebar 等） | Complete（#40） |
| 8 | リリース / デプロイ準備 | リポジトリ側 Complete（#41）。Render/Atlas 実設定・通し確認はユーザー |
| 9 | スコア確定後の訂正・削除（API + UI） | 未着手・別チャット |
| 10 | 認証発展・細かい UX | 未着手・別チャット |

## Git ルール

承認済み案を `.cursor/rules/git-safety.mdc`（alwaysApply）に保存。  
push / commit / force 系は同意必須。pull / fetch / clone / 読み取りは可。

# Decisions

- Phase 0〜6 は当初スコープ完了とみなす。
- 後続は Phase 7（PWA+タブレット UI）→ 8（リリース）→ 9（スコア訂正）→ 10（認証発展/UX）。
- 理由: タブレット実戦の使い心地検証を、本番デプロイより優先する。
- Git: push は同意必須。pull / clone / fetch / status 系は同意なし可（衝突時は報告）。
- phase0.md §11 を上記ロードマップで更新済み。

# Status

- 記録・phase0 更新・プロジェクト Git ルール作成: **Done**
- Phase 7: **Complete**（Redmine #40。ログ: memo/ai/phase7/task-8-pwa-tablet-ui-2026-11-15.md）
- Phase 8: **リポジトリ側 Complete**（Redmine #41。ログ: memo/ai/phase8/task-9-release-deploy-2026-11-22.md）。Render/Atlas 実設定と本番通し確認はユーザー作業
- 次: 本番公開後 → Phase 9（スコア訂正）。Phase 9〜10 は新規チケットが必要なら作成
