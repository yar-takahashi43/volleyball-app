import React from 'react';
import './ScoreDetail.css';
import Select from 'react-select';

const OPTION_ATTACK = [
  { value: "spike", label: "スパイク" },
  { value: "block", label: "ブロック" },
  { value: "attack", label: "アタック" }
];

const OPTION_LOSE = [
  { value: "receive", label: "レシーブ" },
  { value: "toss", label: "トス等" },
  { value: "spike_lose", label: "スパイク（失点）" },
  { value: "block_lose", label: "ブロック（失点）" },
  { value: "foul_serve", label: "反則（サーブ）" },
  { value: "foul_rotation", label: "反則（ローテ）" },
  { value: "foul_net", label: "反則（ネット）" },
  { value: "foul_double", label: "反則（ダブルコンタクト）" },
  { value: "foul_four_hits", label: "反則（4 回打）" },
  { value: "foul_other", label: "反則（その他）" }
];

const POINT_REASONS_MY = ["spike", "block", "attack"];

/* タブレット向け: サイドバー(14px)より少し大きめ・タッチしやすい高さ */
const TABLET_SELECT_STYLES = {
  control: function (base) {
    return {
      ...base,
      minHeight: 36,
      height: 36,
      borderRadius: 4
    };
  },
  valueContainer: function (base) {
    return {
      ...base,
      padding: "0 6px",
      height: 34
    };
  },
  indicatorsContainer: function (base) {
    return {
      ...base,
      height: 34
    };
  },
  dropdownIndicator: function (base) {
    return {
      ...base,
      padding: 4
    };
  },
  clearIndicator: function (base) {
    return {
      ...base,
      padding: 4
    };
  },
  indicatorSeparator: function () {
    return {
      display: "none"
    };
  },
  singleValue: function (base) {
    return {
      ...base,
      fontSize: 15,
      margin: 0,
      maxWidth: "100%",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    };
  },
  placeholder: function (base) {
    return {
      ...base,
      fontSize: 14,
      margin: 0
    };
  },
  input: function (base) {
    return {
      ...base,
      margin: 0,
      padding: 0,
      fontSize: 15
    };
  },
  option: function (base) {
    return {
      ...base,
      fontSize: 15,
      padding: "8px 12px"
    };
  },
  menu: function (base) {
    return {
      ...base,
      fontSize: 15,
      zIndex: 20,
      minWidth: 160
    };
  }
};

/**
 * start / bench から react-select 用 option を作る。
 * 選択中は背番号+表示名が見えるラベルにする。
 */
function buildPlayerOptions(start, bench) {
  const players = [].concat(start || [], bench || []);

  return players
    .filter(function (player) {
      return player && player.playerId;
    })
    .map(function (player) {
      const numText = player.num ? String(player.num) : "";
      const nicknameText = player.nickname ? String(player.nickname) : "";
      const label = numText && nicknameText
        ? numText + " " + nicknameText
        : (nicknameText || numText || player.playerId);

      return {
        value: player.playerId,
        label: label
      };
    });
}

/**
 * option 一覧から value に一致する option を探す。
 */
function findOptionByValue(options, value) {
  if (value === null || value === undefined) {
    return null;
  }

  return options.find(function (option) {
    return option.value === value;
  }) || null;
}

/**
 * Scorebar の 1 行を表示・編集する。
 * 確定行は read-only、下書き行のみ編集可。
 */
export default function ScoreDetail({ row, start, bench, onUpdateDraft }) {
  const isCommitted = row.committed === true;
  const playerOptions = buildPlayerOptions(start, bench);

  const servePlayerValue = findOptionByValue(playerOptions, row.servePlayerId);
  const pointPlayerValue = findOptionByValue(playerOptions, row.pointPlayerId);

  const isAce = row.serveResult === "ace";
  const isMiss = row.serveResult === "miss";
  const isAceOrMiss = isAce || isMiss;

  const attackValue = row.reason && POINT_REASONS_MY.indexOf(row.reason) !== -1
    ? findOptionByValue(OPTION_ATTACK, row.reason)
    : null;

  const loseValue = row.reason && POINT_REASONS_MY.indexOf(row.reason) === -1
    ? findOptionByValue(OPTION_LOSE, row.reason)
    : null;

  /**
   * 下書きのサーブ選手を更新する。
   */
  function handleServePlayerChange(selectedOption) {
    if (isCommitted) {
      return;
    }

    onUpdateDraft({
      servePlayerId: selectedOption ? selectedOption.value : null
    });
  }

  /**
   * エース checkbox を切り替える。
   */
  function handleAceChange() {
    if (isCommitted) {
      return;
    }

    const nextIsAce = !isAce;

    onUpdateDraft({
      serveResult: nextIsAce ? "ace" : null,
      pointPlayerId: nextIsAce ? null : row.pointPlayerId,
      pointResult: nextIsAce ? null : row.pointResult,
      reason: nextIsAce ? null : row.reason
    });
  }

  /**
   * ミス checkbox を切り替える。
   */
  function handleMissChange() {
    if (isCommitted) {
      return;
    }

    const nextIsMiss = !isMiss;

    onUpdateDraft({
      serveResult: nextIsMiss ? "miss" : null,
      pointPlayerId: nextIsMiss ? null : row.pointPlayerId,
      pointResult: nextIsMiss ? null : row.pointResult,
      reason: nextIsMiss ? null : row.reason
    });
  }

  /**
   * 決定要因の選手を更新する。
   */
  function handlePointPlayerChange(selectedOption) {
    if (isCommitted || isAceOrMiss) {
      return;
    }

    onUpdateDraft({
      pointPlayerId: selectedOption ? selectedOption.value : null,
      serveResult: null
    });
  }

  /**
   * 得点側 reason を更新する。
   */
  function handleAttackChange(selectedOption) {
    if (isCommitted || isAceOrMiss) {
      return;
    }

    if (!selectedOption) {
      onUpdateDraft({
        reason: null,
        pointResult: null,
        serveResult: null
      });
      return;
    }

    onUpdateDraft({
      reason: selectedOption.value,
      pointResult: "my",
      serveResult: null
    });
  }

  /**
   * 失点側 reason を更新する。
   */
  function handleLoseChange(selectedOption) {
    if (isCommitted || isAceOrMiss) {
      return;
    }

    if (!selectedOption) {
      onUpdateDraft({
        reason: null,
        pointResult: null,
        serveResult: null
      });
      return;
    }

    onUpdateDraft({
      reason: selectedOption.value,
      pointResult: "opponent",
      serveResult: null
    });
  }

  return (
    <div className="row detailRow" id={"score-detail-" + row.key}>
      <div className="cell serveCell">
        {isCommitted ? (
          <span
            className="scoreReadonlyPlayer"
            id={"score-serve-player-text-" + row.key}
          >
            {servePlayerValue ? servePlayerValue.label : ""}
          </span>
        ) : (
          <Select
            className="serveSelect selectPlayer"
            classNamePrefix="scoreSelect"
            inputId={"score-serve-player-" + row.key}
            options={playerOptions}
            isClearable={false}
            value={servePlayerValue}
            onChange={handleServePlayerChange}
            styles={TABLET_SELECT_STYLES}
            title={servePlayerValue ? servePlayerValue.label : ""}
          />
        )}

        <input
          type="checkbox"
          id={"score-ace-" + row.key}
          className="bigCheckbox"
          checked={isAce}
          disabled={isCommitted || !row.servePlayerId}
          onChange={handleAceChange}
        />

        <input
          type="checkbox"
          id={"score-miss-" + row.key}
          className="bigCheckbox"
          checked={isMiss}
          disabled={isCommitted || !row.servePlayerId}
          onChange={handleMissChange}
        />
      </div>

      <div className="cell reasonCell">
        {isCommitted ? (
          <span
            className="scoreReadonlyPlayer"
            id={"score-point-player-text-" + row.key}
          >
            {pointPlayerValue ? pointPlayerValue.label : ""}
          </span>
        ) : (
          <Select
            className="scoreSelect selectPlayer"
            classNamePrefix="scoreSelect"
            inputId={"score-point-player-" + row.key}
            options={playerOptions}
            isClearable={false}
            isDisabled={isAceOrMiss}
            value={pointPlayerValue}
            onChange={handlePointPlayerChange}
            styles={TABLET_SELECT_STYLES}
            title={pointPlayerValue ? pointPlayerValue.label : ""}
          />
        )}

        {isCommitted ? (
          <span
            className="scoreReadonlyText"
            id={"score-attack-text-" + row.key}
          >
            {attackValue ? attackValue.label : ""}
          </span>
        ) : (
          <Select
            className="scoreSelect selectAttack"
            classNamePrefix="scoreSelect"
            inputId={"score-attack-" + row.key}
            options={OPTION_ATTACK}
            isClearable={true}
            isDisabled={isAceOrMiss || !row.pointPlayerId}
            value={attackValue}
            onChange={handleAttackChange}
            styles={TABLET_SELECT_STYLES}
          />
        )}

        {isCommitted ? (
          <span
            className="scoreReadonlyText"
            id={"score-lose-text-" + row.key}
          >
            {loseValue ? loseValue.label : ""}
          </span>
        ) : (
          <Select
            className="scoreSelect selectAttack"
            classNamePrefix="scoreSelect"
            inputId={"score-lose-" + row.key}
            options={OPTION_LOSE}
            isClearable={true}
            isDisabled={isAceOrMiss || !row.pointPlayerId}
            value={loseValue}
            onChange={handleLoseChange}
            styles={TABLET_SELECT_STYLES}
          />
        )}
      </div>

      <div className="cell scoreCell" id={"score-totals-" + row.key}>
        <div>{row.myScore ?? 0}</div>
        <div>{row.opponentScore ?? 0}</div>
      </div>
    </div>
  );
}
