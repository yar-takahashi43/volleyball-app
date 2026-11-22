# Request

現在のタスクは Redmine #4（Phase 3 — Sidebar UI）。

設計書 phase0.md §6 / §8-1 を参照。Phase 0 / 1 / 2 は Complete。バックエンド疎通確認済み。

スコープ:
- normalizeMember 新規実装と Match での適用
- Member の ID 参照を playerId に統一
- Spike の nickname lookup / 表示修正
- Reception 集計を point 符号対応に修正
- 作業ログ作成

動作確認後の追加（同 Phase 内）:
- Spike スロットを actions から復元（リロード後も選手・打数が残る）
- Spike セレクトから他スロットで選択済みの選手を除外

スコープ外:
- Scorebar（Phase 5）
- ルーティング（Phase 4）
- バックエンド変更なし
- Spike 選択スロット自体の DB 永続化（不要。actions から derive）

# Response

volleyball-front のみを変更し、上記スコープと追加 UX を実装した。

主な変更ファイル:
- volleyball-front/src/utils/normalizeMember.js（新規）
- volleyball-front/src/pages/match/Match.jsx（load / flush 時に normalizeMembers）
- volleyball-front/src/components/sidebar/Member.jsx（playerId 統一）
- volleyball-front/src/components/sidebar/Spike.jsx（nickname lookup）
- volleyball-front/src/components/sidebar/Reception.jsx（+= a.point）

# Decisions

- normalizeMember の解決順は backend serializeMember と同じ: playerId._id → playerId → _id。
- start / bench state は Match で正規化してから Sidebar へ渡す。
- Member の PUT は starPlayerIds / benchMemIds に player.playerId を送る。
- Spike の表示名は selectedPlayers の playerId をキーに start / bench から lookup。
- Spike の選択スロットは DB に持たない。空スロットへ `actions` の spike playerId（出現順・一意）を埋めて復元する。手動選択でまだ点数がない選手は維持する。
- Spike セレクトは、他スロットで選択中の選手を option から除外する（自スロットの現在値は残す）。
- Reception 集計は件数加算ではなく `+= a.point`（マイナスで減る）。

# Status

- Phase 3（Redmine #4）: **Complete**
- 動作確認済み（Member / Spike / Reception / リロード復元 / 重複選択除外）
- 次: Phase 4 — ルーティング（Redmine #5）※新しいチャットで開始

# Phase 3 まとめ

## 目的

API の `{ playerId, num, nickname }` 契約に Sidebar を揃え、Member 入替・Spike・Reception の不整合を解消する（phase0.md §6 / §8-1）。あわせて Spike のリロード時クリアと重複選択の UX を改善する。

## 実装内容

| 項目 | 内容 |
|------|------|
| normalizeMember | 入力を `{ playerId, num, nickname }` に正規化 |
| Match | GET / flush 後に normalizeMembers で setStart / setBench |
| Member | 全 `_id` 参照を `playerId` に統一。PUT も playerId |
| Spike（基本） | option value = playerId、nickname は start/bench lookup |
| Spike（復元） | actions の spike playerId を空スロットへ埋めてリロード後も表示 |
| Spike（UX） | 他スロット選択済み選手をセレクトから除外 |
| Reception | `counts[result] += a.point` |

## 変更ファイル

- `volleyball-front/src/utils/normalizeMember.js`（新規）
- `volleyball-front/src/pages/match/Match.jsx`
- `volleyball-front/src/components/sidebar/Member.jsx`
- `volleyball-front/src/components/sidebar/Spike.jsx`
- `volleyball-front/src/components/sidebar/Reception.jsx`

## Phase 3 動作確認（DoD）

1. リロード後もスタメン・ベンチが表示される
2. ベンチ ↔ スタメン入替が消えずに動く（PUT に正しい playerId が載る）
3. スパイクで選手が選べ、+/- で打数が増減する
4. リロード後も spike がある選手スロットと打数が残る（actions から復元）
5. スパイクセレクトで、他スロット選択済みの選手が出ない
6. レセプションのマイナスで件数が減る（0 未満にはしない）
7. バックエンド変更なし

## Phase 2 から持ち越した疑問点の解消

| 疑問点 | 対応 |
|--------|------|
| ベンチ→スタメンで他選手が消える | Member を playerId 契約に統一 |
| リロード後に選手が全て消える | normalizeMember + Member playerId |
| レセプションのマイナスが増える | `+= a.point` |
| スパイクに選手名が出ない / 増減しない | playerId + nickname lookup |
| リロードでスパイク UI が空になる | actions からスロット復元（追加） |

## 次フェーズ

Phase 4（Redmine #5）: ルーティング

- 試合一覧（日付）: App に `/matches/:date` を追加
- 試合画面: `/match/:id` 固定
- セット切替: URL 変更せず `selectedSetId` state で管理
- Topbar 次ページ: `/score/...` への navigate は使わない

参照: phase0.md §9
