# Request

現在のタスクは Redmine #2（Phase 1 — DB/API 契約の確立）。

設計書 phase0.md を参照。Phase 0 は Complete。フロント変更は行わない（バックエンドのみ）。

Phase 1 Definition of Done:
- POST /scores/batch が Set.actions に永続化
- レスポンス { set: Set }
- GET /match/:id が populate なし playerId: string 形式
- starPlayer PUT レスポンス形式が GET と一致
- PUT .../reception, PUT .../spike 削除
- Match.js / Player.js typo 修正

実装順序:
1. utils/serializeMember.js（新規）
2. models/Match.js, Player.js, Set.js
3. validators/batchSchema.js（新規）
4. routes/scores.js（batch 実装）
5. routes/match.js（populate 廃止）
6. routes/set.js（デッド API 削除、serialize 適用）

# Response

volleyball-back のみを変更し、上記 DoD を満たす実装を完了した。

主な変更ファイル:
- volleyball-back/utils/serializeMember.js（新規）
- volleyball-back/validators/batchSchema.js（新規）
- volleyball-back/models/Set.js（ActionSchema: reason 追加、out/in 削除、action enum）
- volleyball-back/models/Match.js / Player.js（require → required）
- volleyball-back/routes/scores.js（batch 永続化）
- volleyball-back/routes/match.js（nested populate 廃止、serializeMatch）
- volleyball-back/routes/set.js（reception/spike 削除、serializeSet）

# Decisions

- SSOT は Set.actions[]。batch は $push + $each で追記し、レスポンスは { set } のみ。
- populate は sets ドキュメント取得のみ。playerId の nested populate はしない。
- API 返却の member 形式は { playerId: string, num, nickname }（serializeMember）。
- Action 種別は reception / spike / serve / point。out/in 廃止、reason 追加。
- バリデーションは外部ライブラリなしの素の JS（batchSchema.js）。
- デッド API（PUT reception / spike）を削除。

# Status

- Phase 1（Redmine #2）: **Complete**
- 手動 API 確認済み（register / GET match / batch / 400 系 / reception・spike 404）
- フロント未変更（Phase 2 以降）
- 次: Phase 2 — scoreBuffer + setMatch merge（Redmine #3、phase0.md §8-3 / §8-4）
