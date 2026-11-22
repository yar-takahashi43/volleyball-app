# Phase 0 設計書 — UI / DB 整合性（確定版）

| 項目 | 内容 |
|------|------|
| Redmine チケット | #1 |
| フェーズ | Phase 0 — 設計確定 |
| ステータス | Complete |
| 初回作成日 | 2026-07-07 |
| 次フェーズ | Phase 0〜8 リポジトリ準備 Complete。次はユーザー側の Render/Atlas 本番公開 → Phase 9 |
| 最終更新 | 2026-11-22（Phase 8 リポジトリ側 Done） |

---

## 目次

1. 背景と目的
2. Single Source of Truth
3. Scorebar 行 derive ルール（§1.6）
4. Action 構造（§2-1）
5. batch API（§2-2 / §2-4）
6. populate 方針（§2-3）
7. Member 入替（§2-5）
8. UI データフロー（§3）
9. ルーティング（§4）
10. DB スキーマ方針
11. フェーズ分け
12. Phase 0 確定事項一覧

---

## 1. 背景と目的

### 1-1. 現状の問題

アプリ内に 2 つのデータモデルが混在している。

| 領域 | モデル | 問題 |
|------|--------|------|
| Sidebar | actions[] ベース | pushScore → batch だが API が未実装 |
| Scorebar | 行ベースのローカル state | DB と非連動、props 不一致 |

これが UI のズレ・DB のズレ・API のズレを生んでいる。

### 1-2. 設計の上流工程

1. データモデルの正を決める（actions[] に統一）
2. API 契約を固定する（ID・populate・batch）
3. UI データフローを設計する（props・state・遷移）

### 1-3. Phase 0 の成果

- 上記 1〜2 を確定（コード変更なし）
- Phase 1 以降の実装前提を固定

---

## 2. Single Source of Truth

### 2-1. 採用方針

| 選択肢 | 内容 | 判定 |
|--------|------|------|
| A | Set.actions[] に統一 | 採用 |
| B | Scorebar 用に scoreRows[] を新設 | 不採用 |
| C | Scorebar は非永続 | 不採用 |

### 2-2. 採用理由

- Sidebar と Scorebar の不整合が解消される
- scoreBuffer の flush がそのまま永続化になる
- API がシンプルになる

### 2-3. SSOT の範囲

| データ | 保存先 | 備考 |
|--------|--------|------|
| スコア関連イベント | Set.actions[] | reception / spike / serve / point |
| スタメン・ベンチ | Set.starPlayer / Set.benchMem | actions 外。別 API で更新 |

### 2-4. 廃止する概念

- Scorebar 旧 UI の out / in（競技用語として不適切、actions モデルと不整合）
- action 種別 score（serve / point に分割済み）

---

## 3. Scorebar 行 derive ルール（§1.6）

### 3-1. 基本

| 項目 | ルール |
|------|--------|
| 1 行の意味 | セット内の 1 点 の記録 |
| 行の開始 | serve イベントが発生した瞬間 |
| 行の終了 | 次の serve イベントが来たとき |
| 空行 | DB に保存しない（UI のみ） |

### 3-2. 1 行のイベント構成

| パターン | 含める events | 説明 |
|----------|---------------|------|
| エース | serve のみ | result: ace — point は不要（二重記録防止） |
| サーブミス | serve のみ | result: miss — point は不要 |
| ラリー決着 | serve + point | serve.result: null + point 1 件 |

**確定理由（R-1）**

- エースは「サーブで直接得点」→ point を追加すると二重記録
- ミスは「サーブで直接失点」→ point を追加すると二重記録
- ラリー決着だけが serve + point の 2 イベント
- これが「1 行 = 1 点」モデルと完全一致する

### 3-3. 行内ブロック構造

**① サーブ側（action: serve）**

| フィールド | 意味 |
|-----------|------|
| playerId | サーブした選手 |
| result | ace / miss / null |

**② 決定要因側（action: point）— ラリー決着時のみ**

| フィールド | 意味 |
|-----------|------|
| playerId | 得点 → 得点者 / 失点 → 失点原因者 |
| result | my（自チーム得点）/ opponent（相手得点） |
| reason | 決定要因（§4-2 reason enum 参照） |

### 3-4. playerId の意味

| 状況 | playerId |
|------|----------|
| serve ace | サーブした選手（得点者） |
| serve miss | サーブした選手（失点原因） |
| point + result=my | 得点に関わった選手 |
| point + result=opponent | 失点原因の選手 |

**補足（UI 文脈）**

- エース・得点 → 得点した人
- ミス・失点 → 失点した人

### 3-5. 得点の derive（行 → スコア）

| 条件 | 自チーム | 相手 |
|------|----------|------|
| serve.result === ace | +1 | 0 |
| serve.result === miss | 0 | +1 |
| point.result === my | +1 | 0 |
| point.result === opponent | 0 | +1 |

---

## 4. Action 構造（§2-1）

### 4-1. 共通フィールド

各 Action は以下のフィールドを持つ。

- action: reception / spike / serve / point（いずれか必須）
- playerId: string または null（reception は null）
- point: number（reception/spike/point は ±1、serve は 0）
- result: string（action 種別ごとに意味が異なる。下表参照）
- reason: string または null（point のみ使用）
- timestamp: number（必須）

**重要:** action 種別 score は使用しない。serve / point に分割する。

### 4-2. action 種別ごとの必須フィールド

| action | playerId | point | result | reason |
|--------|----------|-------|--------|--------|
| reception | null | ±1 | A / B / C / D | 不要 |
| spike | 必須 | ±1 | 不要 | 不要 |
| serve | 必須 | 0 | ace / miss / null | 不要 |
| point | 必須 | ±1 | my / opponent | 必須 |

### 4-3. reason enum（案 A — flatten）

**得点側（point.result === my のとき）**

- spike
- block
- attack

**失点側（point.result === opponent のとき）**

- receive
- toss
- spike_lose
- block_lose
- foul_serve
- foul_rotation
- foul_net
- foul_double
- foul_four_hits
- foul_other

**reason と UI 表示の対応**

| reason | UI 表示例 |
|--------|-----------|
| spike | スパイク |
| block | ブロック |
| attack | アタック |
| receive | レシーブ |
| toss | トス等 |
| spike_lose | スパイク（失点） |
| block_lose | ブロック（失点） |
| foul_serve | 反則（サーブ） |
| foul_rotation | 反則（ローテ） |
| foul_net | 反則（ネット） |
| foul_double | 反則（ダブルコンタクト） |
| foul_four_hits | 反則（4 回打） |
| foul_other | 反則（その他） |

**反則実装方針（確定）**

- 案 A（flatten enum）を採用
- Phase 1 の実装が最も軽い
- バリデーション・derive が単純
- 反則種類の追加可能性は低い（固定で十分）

---

## 5. batch API（§2-2 / §2-4）

### 5-1. リクエスト

- メソッド: POST
- パス: /api/scores/batch
- Content-Type: application/json

ボディ:

    {
      "matchId": "string",
      "setId": "string",
      "scores": [ Action, ... ]
    }

### 5-2. レスポンス（確定 — R-2）

- HTTP ステータス: 200
- ボディ: 更新後の Set（actions 含む）を set キーで返す

    {
      "set": { ... }
    }

**採用理由**

- batch の責務は Set.actions の更新のみ
- match 全体を返すと payload が重い
- フロントは既存 match を merge するだけで十分

### 5-3. バリデーション

| 項目 | ルール |
|------|--------|
| matchId / setId | 必須 |
| setId の所属 | match.sets に含まれること |
| scores 空配列 | 400 |
| 各 action | §4-1 / §4-2 の必須表に従う |
| トランザクション | 全件成功 or 全件失敗 |

### 5-4. 永続化（Phase 1 実装方針）

Set.findByIdAndUpdate で actions に $push: { $each: scores } する。

---

## 6. populate 方針（§2-3）

| 項目 | 方針 |
|------|------|
| populate | 使用しない |
| API 返却形式 | playerId: string, num, nickname |
| フロント | normalizeMember() で統一（Phase 3 で実装） |

### normalizeMember 仕様（Phase 3）

- 入力: API の starPlayer / benchMem 要素
- 出力: playerId: string, num: string, nickname: string
- playerId の解決: entry.playerId._id → entry.playerId → entry._id の順で string 化

---

## 7. Member 入替（§2-5）

| 項目 | 方針 |
|------|------|
| actions への記録 | 含めない |
| API | PUT /set/match/:matchId/set/:setId/starPlayer を維持 |
| リクエスト | starPlayerIds: string[], benchMemIds: string[] |
| ID 契約 | Player コレクションの _id（string）のみ |
| 成功後 | フロントで setMatch 再取得 or merge（Phase 2/3） |

---

## 8. UI データフロー（§3）

Phase 0 では方針確定のみ。実装は Phase 2 以降。

### 8-1. Member / Spike の ID 参照

- 全て playerId（string）に統一
- option の value は playerId
- nickname は start / bench から lookup

### 8-2. Scorebar の props

- match
- setId（selectedSetId）
- start
- bench
- pushScore

### 8-3. flushBuffer 後の同期（Phase 2）

1. batch レスポンス set を受け取る
2. 既存 match 内の該当 set を merge
3. setMatch(updatedMatch) を呼ぶ
4. selectedSet の start / bench / actions を同期

### 8-4. 楽観的更新（Phase 2）

| タイミング | 動作 |
|-----------|------|
| pushScore 直後 | ローカル actions に append |
| flush 成功 | サーバー値で上書き |
| flush 失敗 | バッファに戻す + 楽観的分を rollback |

---

## 9. ルーティング（§4）

Phase 0 方針確定。実装は Phase 4。

| 項目 | 方針 |
|------|------|
| 試合一覧（日付） | App に /matches/:date を追加 |
| 試合画面 | /match/:id 固定 |
| セット切替 | URL 変更せず selectedSetId state で管理 |
| Topbar 次ページ | /score/... への navigate は使わない |

---

## 10. DB スキーマ方針

Phase 1 で実施。

| 項目 | 方針 |
|------|------|
| Set.actions | ActionSchema を §4 に合わせる |
| out / in | 削除（Scorebar 用途では不使用） |
| reason | 追加（type: String, default: null） |
| action enum | reception, spike, serve, point |
| Match.js / Player.js | require → required typo 修正 |
| デッド API | PUT .../reception, PUT .../spike を削除 |

---

## 11. フェーズ分け

### 11-1. 当初計画（Phase 0〜6）— Complete

| Phase | 内容 | Redmine 目安 | 状態 |
|-------|------|-------------|------|
| 0 | 設計確定（本ドキュメント） | #1 | Complete |
| 1 | DB/API（batch, serialize, typo, デッド API 削除） | #2 | Complete |
| 2 | scoreBuffer + setMatch merge | #3 | Complete |
| 3 | Sidebar UI（normalizeMember, Member, Spike） | #4 | Complete |
| 4 | ルーティング | #5 | Complete |
| 5 | Scorebar derive + pushScore 接続 | #6 | Complete |
| 6 | 認証セキュリティ（bcrypt + JWT + CORS/helmet） | #7 | Complete |

Phase 0〜6 で「UI / DB 整合 + 認証」の当初スコープは完了。  
残件は各 Phase でスコープ外にした項目と、本番・タブレット体験向けの後続フェーズ。

### 11-2. 後続ロードマップ（Phase 7〜10）— 2026-11-15 確定

本番想定は **タブレットでブラウザ / ホーム画面追加して使う**。  
そのため **先に PWA + タブレット UI で使い心地を試し、改善点を出してからリリース** する。

| Phase | 内容 | 目的 | Redmine |
|-------|------|------|---------|
| 7 | PWA + タブレット向けレスポンシブ（試合画面・Sidebar 等） | 実機で使い心地検証。改善点を早期に出す | #40 Complete |
| 8 | リリース / デプロイ準備（env・ホスト・Atlas・HTTPS・通し確認） | 本番公開 | #41 リポジトリ側 Complete（Render/Atlas 実設定・通し確認はユーザー） |
| 9 | スコア確定後の訂正・削除（API + UI） | 誤入力への耐性 | 新規 |
| 10 | 認証発展・細かい UX（登録制限、RBAC、`/gamelist` リネーム等） | 運用固め | 新規 |

**順序の理由（確定）**

- PWA / レスポンシブをリリースより前にする: 端末側の特別設定は不要だが、**アプリ側の PWA 対応と画面幅対応がないとタブレット実戦の使い心地が検証できない**ため。
- リリースを Phase 8 にする: Phase 7 の改善を入れた状態で本番 env・HTTPS・ホストを固める。
- 訂正 API と認証発展は、出荷後でも機能追加可能なため後段。

**Phase 7 のスコープ案**

- `manifest.json` / アイコン / Service Worker（キャッシュ方針はチャットで確定）
- HTTPS 前提の動作確認（本番相当 URL またはトンネル可）
- 試合画面・Sidebar・Scorebar のタブレット幅対応（Phase 5 で見送った Sidebar レスポンシブを含む）
- 実機（利用予定タブレット）での操作確認と改善ログ

**Phase 6 時点でスコープ外だったものとの対応**

| 項目 | 振り分け |
|------|----------|
| PWA（manifest / SW） | Phase 7 |
| Sidebar レスポンシブ | Phase 7 |
| デプロイ（JWT_SECRET / CLIENT_ORIGIN / REACT_APP_API_URL 等） | Phase 8 |
| 確定行の訂正・削除 | Phase 9 |
| リフレッシュトークン / パスワードリセット / RBAC / 登録制限 | Phase 10 |
| `/gamelist` → `/matches` リネーム | Phase 10 |

### Phase 1 の Definition of Done（参考・完了済み）

- POST /scores/batch が Set.actions に永続化する
- レスポンスが set: Set 形式
- GET /match/:id が populate なし playerId: string 形式を返す
- starPlayer PUT レスポンス形式が GET と一致
- reception / spike PUT が削除されている
- Match.js / Player.js typo 修正済み

---

## 12. Phase 0 確定事項一覧

| ID | 内容 | 状態 |
|----|------|------|
| SSOT | Set.actions[] に統一 | 確定 |
| C-1 | score 廃止 → serve / point | 確定 |
| C-2 | Scorebar 行 derive ルール | 確定 |
| C-3 | reception の playerId = null | 確定 |
| C-4 | out/in 廃止 → reason | 確定 |
| C-5 | batch レスポンス Set only | 確定 |
| R-1 | ace/miss は serve のみ（point 不要） | 確定 |
| R-2 | batch set: Set | 確定 |
| 反則 | 案 A（flatten enum） | 確定 |

Phase 0 未確定事項: なし

---

## 付録 A: Redmine 転記用（Decisions 抜粋）

Phase 0 確定。SSOT = Set.actions[]。action 種別は reception / spike / serve / point。Scorebar 1 行 = 1 点。ace/miss は serve のみ、ラリー決着は serve(null) + point。out/in 廃止、reason flatten enum。batch は matchId + setId + scores[] → レスポンス set のみ。populate 不使用。Member は別 PUT。Phase 1 着手可。

---

## 付録 B: 関連ドキュメント

- PROJECT_RULES.md
- USER_RULES.md
- Agents.md
- memo/ai/phase0/task-roadmap-phase7-10-2026-11-15.md（Phase 7〜10 決定ログ）
- memo/ai/phase7/task-8-pwa-tablet-ui-2026-11-15.md（Phase 7 実装ログ）
- memo/ai/phase8/task-9-release-deploy-2026-11-22.md（Phase 8 デプロイ準備ログ）
- .cursor/rules/git-safety.mdc（Git 操作の同意ルール）