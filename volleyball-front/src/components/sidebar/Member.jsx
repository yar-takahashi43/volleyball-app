import React, {useState, useEffect, useCallback} from 'react'
import { useMemo } from 'react'
// import { Players } from '../../dummyData'
import "./Sidebar.css"
import axios from 'axios'
import Select from 'react-select';
// import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

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

    const handlePlayerChange = (selectedOption) => {
        console.log("selectedOption.value:", selectedOption.value, typeof selectedOption.value);
        console.log("start[0]:", start[0]);   // ★ ここに入れる
    console.log("bench[0]:", bench[0]);   // ★ bench も見たい
        const value = selectedOption.value
        const player = 
            start.find(player => player._id === value) || 
            bench.find(player => player._id === value);
        console.log("player structure:", player); 
        setSeletedPlayer(player);
    }
    
    useEffect(() => {
        // ①selectedPlayer が null のときは何もしない
        if (!selectedPlayer) return;
        const playerId = selectedPlayer._id
        const isStarting = start.some(player => player._id === playerId)

        // ②先発メンバーがすでに7名いる場合は何もしない
        if (!isStarting && start.length >= 7) {
            setSeletedPlayer(null)
            return;
        }

        // ③ 移動元のプレイヤーを取得
        const movedFromStart = start.find(p => p._id === playerId);
        const movedFromBench = bench.find(p => p._id === playerId);

        // ④ 新しい start / bench を作成
        const newStart = isStarting 
            ? start.filter(player => player._id !== playerId) 
            : [...start, movedFromBench]
        const newBench = isStarting 
            ? [...bench, movedFromStart] 
            : bench.filter(player => player._id !== playerId);
        console.log("newStart: " + newStart)
        console.log("newBench: " + newBench)

        // ⑤ UI 更新
        setStart(newStart)
        setBench(newBench)
        setSeletedPlayer(null)

        // if (start.length === 0 && bench.length === 0) return;

        // let queue = Promise.resolve()
    
        // const updatePlayerStatus = () => {
        //     queue = queue.then(async() => {
        //         try {
        //             await axios.put(`/set/match/${matchId}/set/${setId}/starPlayer`, 
        //             {
        //                 starPlayerId: start,
        //                 benchMemId: bench
        //             })
        //             console.log("bench: " + bench)
        //         } catch (err) {
        //             console.error(err)
        //         }
        //     })
        // }
        // updatePlayerStatus()

        axios.put(`/set/match/${matchId}/set/${setId}/starPlayer`, {
            starPlayerIds: newStart.map(p => p._id),
            benchMemIds: newBench.map(p => p._id)
        }).catch(err => console.error(err))
    }, [selectedPlayer])

    return (
    <div className='memberContainer'>
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
                    <tr key={index}>
                        <td>
                            <button onClick={() => handlePlayerChange({
                                value: player._id, 
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
                    <tr key={index}>
                        <td>
                            <button onClick={() => handlePlayerChange({
                                value: player._id, 
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