import React, { useState, useMemo, useEffect } from 'react'
import "./Sidebar.css"

const SPIKE_SLOT_COUNT = 5;

/**
 * start / bench から playerId に対応する nickname を探す。
 */
function findNicknameByPlayerId(playerId, start, bench) {
    if (!playerId) {
        return null;
    }

    const fromStart = (start || []).find(function (player) {
        return player.playerId === playerId;
    });

    if (fromStart) {
        return fromStart.nickname;
    }

    const fromBench = (bench || []).find(function (player) {
        return player.playerId === playerId;
    });

    if (fromBench) {
        return fromBench.nickname;
    }

    return null;
}

/**
 * actions から spike の playerId を出現順で一意に取り出す。
 */
function collectSpikePlayerIds(actions) {
    const playerIds = [];
    const seen = new Set();

    (actions || []).forEach(function (action) {
        if (action.action !== "spike" || !action.playerId) {
            return;
        }

        if (seen.has(action.playerId)) {
            return;
        }

        seen.add(action.playerId);
        playerIds.push(action.playerId);
    });

    return playerIds;
}

/**
 * 空スロットへ、まだ選択されていない spike 選手を埋める。
 * 既存の手動選択は維持する（リロード時は全スロット空なので actions から復元される）。
 */
function fillEmptySlotsFromActions(prevSelected, actions) {
    const selectedIds = new Set(
        prevSelected
            .map(function (slot) {
                return slot.playerId;
            })
            .filter(Boolean)
    );

    const missingIds = collectSpikePlayerIds(actions).filter(function (playerId) {
        return !selectedIds.has(playerId);
    });

    if (missingIds.length === 0) {
        return prevSelected;
    }

    const nextSelected = prevSelected.map(function (slot) {
        return { playerId: slot.playerId };
    });

    missingIds.forEach(function (playerId) {
        const emptyIndex = nextSelected.findIndex(function (slot) {
            return !slot.playerId;
        });

        if (emptyIndex === -1) {
            return;
        }

        nextSelected[emptyIndex] = { playerId: playerId };
    });

    return nextSelected;
}

export default function Spike({actions, setId, matchId, start, bench, pushScore}) {
    const Column = [
        {
            header: "選手",
            accessorKey: "playerId",
        },
        {
            header: "打数",
            accessorKey: "spikeScore",
        },
    ]
    const columns = useMemo(() => Column, []);

    // selectedPlayers の初期値（5スロット）
    const [selectedPlayers, setSelectedPlayers] = useState(
        Array.from({ length: SPIKE_SLOT_COUNT }, function () {
            return { playerId: null };
        })
    )

    /**
     * 永続化された spike actions から選手スロットを復元する。
     */
    useEffect(() => {
        setSelectedPlayers(function (prev) {
            return fillEmptySlotsFromActions(prev, actions);
        });
    }, [actions]);

    const spikeCounts = useMemo(() => {
        const counts = {};
        actions
          .filter(a => a.action === "spike")
          .forEach(a => {
            counts[a.playerId] = (counts[a.playerId] || 0) + a.point;
          });
        return counts;
    }, [actions]);

    const data = useMemo(() => {
        return selectedPlayers.map((player) => ({
            nickname: findNicknameByPlayerId(player.playerId, start, bench),
            spikeScore: spikeCounts[player.playerId] || 0
        }))
    }, [selectedPlayers, spikeCounts, start, bench]);

    /**
     * スパイク行の選手セレクトを更新する。
     */
    const handlePlayerChange = (index, e) => {
        const newSelected = [...selectedPlayers]
        newSelected[index] = {playerId: e.target.value || null}
        setSelectedPlayers(newSelected)
    }

    /**
     * 選択中選手のスパイク打数を +1 する。
     */
    const incrementSpike = (index) => {
        const playerId = selectedPlayers[index]?.playerId
        if (!playerId) return

        pushScore({
            matchId,
            setId,
            action: "spike",
            playerId,
            point: 1,
            timestamp: Date.now()
        })
    };

    /**
     * 選択中選手のスパイク打数を -1 する。
     */
    const decrementSpike = (index) => {
        const playerId = selectedPlayers[index]?.playerId
        if (!playerId) return

        if (data[index].spikeScore <= 0) return

        pushScore({
            matchId,
            setId,
            action: "spike",
            playerId,
            point: -1,
            timestamp: Date.now()
        })
    }

    return (
        <div className='spikeContainer' id="spikeContainer">
            <div className="spikeTitle">
                <h3>スパイク統計</h3>
            </div>
            <div className="spikeTable">
                <table>
                    <thead>
                        <tr>
                            {columns.map((column, index) => (
                            <th key={index}>{column.header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                <td>
                                    <select
                                        id={`spike-player-select-${index}`}
                                        value={selectedPlayers[index]?.playerId ?? ""}
                                        onChange={(e) => handlePlayerChange(index, e)}>
                                        <option value="">選手選択</option>
                                            {(start || [])
                                                .filter(function (player) {
                                                    const isSelectedElsewhere = selectedPlayers.some(
                                                        function (slot, slotIndex) {
                                                            if (slotIndex === index) {
                                                                return false;
                                                            }
                                                            return slot.playerId === player.playerId;
                                                        }
                                                    );
                                                    return !isSelectedElsewhere;
                                                })
                                                .map(player => (
                                                    <option key={player.playerId} value={player.playerId}>
                                                        {player.num}番 {player.nickname}
                                                    </option>
                                                ))}
                                    </select>
                                </td>
                                <td>
                                    <button
                                        id={`spike-minus-${index}`}
                                        className='minusButton'
                                        onClick={() => decrementSpike(index)}>-</button>
                                    {row.spikeScore}
                                    <button
                                        id={`spike-plus-${index}`}
                                        className='addButton'
                                        onClick={() => incrementSpike(index)}>+</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
