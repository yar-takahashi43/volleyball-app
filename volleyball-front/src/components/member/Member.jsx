import React, {useState, useEffect, useCallback} from 'react'
import { useMemo } from 'react'
// import { Players } from '../../dummyData'
import "./Member.css"
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
    // const startingPlayers = useMemo(() => start ||[], [start]);
    // const benchPlayers = useMemo(() => member.benchMem || [], [member]);

    // const updatePlayerStatus = async () => {
    //     try {
    //         await axios.put(`/set/match/${matchId}/set/${setId}/starPlayer`, 
    //         {
    //             starPlayerId: start,
    //             benchMemId: bench
    //         })
    //     } catch (err) {
    //         console.error(err)
    //     }
    // }

    const handlePlayerChange = (selectedOption) => {
        const player = start.find(player => player.playerId.toString() === selectedOption.value) || 
        bench.find(player => player.playerId.toString() === selectedOption.value);
        setSeletedPlayer(player);
    }
    
    useEffect(() => {
        if (selectedPlayer && selectedPlayer.playerId) {
            const playerId = selectedPlayer.playerId.toString()
            const isStarting = start.some(player => player.playerId.toString() === playerId)
            if (!isStarting && start.length >= 7) {
                // 先発メンバーがすでに7名いる場合は何もしない
                return;
            }
            const playerToMove = start.find(player => player.playerId.toString() === playerId);
            const newBench = isStarting ? 
                [...bench.filter(player => player.playerId.toString() !== playerId), ...(playerToMove ? [playerToMove] : [])] :
                bench.filter(player => player.playerId.toString() !== playerId);
            const newStart = isStarting ? 
                start.filter(player => player.playerId.toString() !== playerId) :
                [...start.filter(player => player.playerId.toString() !== playerId), ...(bench.find(player => player.playerId.toString() === playerId) ? [bench.find(player => player.playerId.toString() === playerId)] : [])]
            setBench(newBench)
            setStart(newStart)
            setSeletedPlayer(null)
        }

        let queue = Promise.resolve()
    
        const updatePlayerStatus = () => {
            queue = queue.then(async() => {
                try {
                    await axios.put(`/set/match/${matchId}/set/${setId}/starPlayer`, 
                    {
                        starPlayerId: start,
                        benchMemId: bench
                    })
                } catch (err) {
                    console.error(err)
                }
            })
        }
        updatePlayerStatus()
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
                            <button onClick={() => handlePlayerChange({value: player.playerId, label: player.nickname})}>
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
                            <button onClick={() => handlePlayerChange({value: player.playerId, label: player.nickname})}>
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

// import React, { useState } from 'react';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// const Member = ({ member }) => {
//   const [starting, setStarting] = useState(member.starPlayer);
//   const [bench, setBench] = useState(member.benchMem);
  
//   //     const columns1 = useMemo(() => ColumnStarting, []);
// //     const columns2 = useMemo(() => ColumnBench, []);
// //     const start = useMemo(() => member.starPlayer, []);
// //     const bench = useMemo(() => member.benchMem, []);

//   const handleDragEnd = (result) => {
//     if (!result.destination) return;
//     if (result.source.droppableId === result.destination.droppableId) {
//       if (result.source.droppableId === 'starting') {
//         const newStarting = Array.from(starting);
//         const [removed] = newStarting.splice(result.source.index, 1);
//         newStarting.splice(result.destination.index, 0, removed);
//         setStarting(newStarting);
//       } else {
//         const newBench = Array.from(bench);
//         const [removed] = newBench.splice(result.source.index, 1);
//         newBench.splice(result.destination.index, 0, removed);
//         setBench(newBench);
//       }
//     } else {
//       if (result.source.droppableId === 'starting') {
//         const newStarting = Array.from(starting);
//         const newBench = Array.from(bench);
//         const [removed] = newStarting.splice(result.source.index, 1);
//         newBench.splice(result.destination.index, 0, removed);
//         setStarting(newStarting);
//         setBench(newBench);
//       } else {
//         const newStarting = Array.from(starting);
//         const newBench = Array.from(bench);
//         const [removed] = newBench.splice(result.source.index, 1);
//         newStarting.splice(result.destination.index, 0, removed);
//         setStarting(newStarting);
//         setBench(newBench);
//       }
//     }
//   };

// console.log(starting)
// console.log(bench)

//   return (
//     <DragDropContext onDragEnd={handleDragEnd}>
//         <Droppable droppableId="starting">
//           {(provided) => (
//             <div ref={provided.innerRef} {...provided.droppableProps}>
//                 {starting.map((player, index) => (
//                     // <div key={player.id}>  {/* ここにkeyプロパティを追加 */}
//                         <Draggable key={player.id} draggableId={String(player.id)} index={index}>
//                         {(provided) => (
//                             <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
//                                 {player.num}
//                                 {player.nickname}
//                             {/* 選手の情報を表示 */}
//                             </div>
//                         )}
//                         </Draggable>
//                     // </div>
//                 ))}
//                 {provided.placeholder}
//             </div>
//             )}
//         </Droppable>

//       <Droppable droppableId="bench">
//         {(provided) => (
//           <div ref={provided.innerRef} {...provided.droppableProps}>
//             {bench.map((player, index) => (
//               <Draggable key={player.id} draggableId={String(player.id)} index={index}>
//                 {(provided) => (
//                   <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
//                     {/* 選手の情報を表示 */}
//                     {player.num}
//                     {player.nickname}
//                   </div>
//                 )}
//               </Draggable>
//             ))}
//             {provided.placeholder}
//           </div>
//         )}
//       </Droppable>
//     </DragDropContext>
//   );
// };

// export default Member;
