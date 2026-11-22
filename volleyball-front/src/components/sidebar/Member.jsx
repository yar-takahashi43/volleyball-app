import React, {useState, useEffect, useMemo} from 'react'
import "./Sidebar.css"
import api from '../../Api'

export default function Member({
    member, matchId, setId,
    start, setStart, bench, setBench
}) {
    const ColumnStarting = [
        {
            header: "削除",
            accessorKey: "button",
        },
        {
            header: "サーブ",
            accessorKey: "serveId",
        },
        {
            header: "番号",
            accessorKey: "playerId",
        },
        {
            header: "選手名",
            accessorKey: "nickname",
        },
    ]

    const ColumnBench = [
        {
            header: "追加",
            accessorKey: "playerId",
        },
        {
            header: "番号",
            accessorKey: "playerId",
        },
        {
            header: "選手名",
            accessorKey: "nickname",
        },
    ]

    const serveOrder = [1, 2, 3, 4, 5, 6, "L"];
    const [selectedPlayer, setSeletedPlayer] = useState(null)

    const columns1 = useMemo(() => ColumnStarting, []);
    const columns2 = useMemo(() => ColumnBench, []);

    /**
     * 選択された選手を start / bench から探し、入替対象としてセットする。
     */
    const handlePlayerChange = (selectedOption) => {
        const value = selectedOption.value
        const player =
            start.find(player => player.playerId === value) ||
            bench.find(player => player.playerId === value);
        setSeletedPlayer(player);
    }

    useEffect(() => {
        // ①selectedPlayer が null のときは何もしない
        if (!selectedPlayer) return;
        const playerId = selectedPlayer.playerId
        const isStarting = start.some(player => player.playerId === playerId)

        // ②先発メンバーがすでに7名いる場合は何もしない
        if (!isStarting && start.length >= 7) {
            setSeletedPlayer(null)
            return;
        }

        // ③ 移動元のプレイヤーを取得
        const movedFromStart = start.find(p => p.playerId === playerId);
        const movedFromBench = bench.find(p => p.playerId === playerId);

        // ④ 新しい start / bench を作成
        const newStart = isStarting
            ? start.filter(player => player.playerId !== playerId)
            : [...start, movedFromBench]
        const newBench = isStarting
            ? [...bench, movedFromStart]
            : bench.filter(player => player.playerId !== playerId);

        // ⑤ UI 更新
        setStart(newStart)
        setBench(newBench)
        setSeletedPlayer(null)

        api.put(`/set/match/${matchId}/set/${setId}/starPlayer`, {
            starPlayerIds: newStart.map(p => p.playerId),
            benchMemIds: newBench.map(p => p.playerId)
        }).catch(err => console.error(err))
    }, [selectedPlayer])

    return (
    <div className='memberContainer' id="memberContainer">
        <div className="startingTitle">
            <h3>スターティング</h3>
        </div>
        <div className="startingTable">
        <table>
            <thead>
                <tr>
                    {columns1.map((column, index) => (
                    <th key={index}>{column.header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
            {start && start.length >= 0 && start.map((player, index) => {
                return (
                    <tr key={player.playerId || index}>
                        <td>
                            <button
                                id={`member-move-to-bench-${player.playerId}`}
                                onClick={() => handlePlayerChange({
                                value: player.playerId,
                                label: player.nickname})}>
                            ベンチへ
                            </button>
                        </td>
                        <td>{serveOrder[index]}</td>
                        <td>{player ? player.num : '-'}</td>
                        <td>{player ? player.nickname : '-'}</td>
                    </tr>
                );
            })}
        </tbody>
        </table>
        </div>

        <div className="benchTitle">
            <h3>ベンチ</h3>
        </div>
        <div className="benchTable">
        <table>
            <thead>
                <tr>
                    {columns2.map((column, index) => (
                    <th key={index}>{column.header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {bench && bench.length >= 0 && bench.map((player, index) => {
                    return (
                    <tr key={player.playerId || index}>
                        <td>
                            <button
                                id={`member-move-to-start-${player.playerId}`}
                                onClick={() => handlePlayerChange({
                                value: player.playerId,
                                label: player.nickname})}>
                            先発に追加
                            </button>
                        </td>
                        <td>{player ? player.num : '-'}</td>
                        <td>{player ? player.nickname : '-'}</td>
                    </tr>
                    );
                })}
            </tbody>
        </table>
        </div>
    </div>
    )
    }
