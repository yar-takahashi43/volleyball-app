import React from 'react'
import { useMemo } from 'react'
import { Players } from '../../dummyData'
import "./Member.css"
// import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

export default function Member({member}) {
    const ColumnStarting = [
        {
            header: "サーブ順",
            accessorKey: "serveId",
        },
        {
            header: "背番号",
            accessorKey: "playerId",
        },
        {
            header: "選手名",
            accessorKey: "nickname",
        },
    ]

    const ColumnBench = [
        {
            header: "背番号",
            accessorKey: "playerId",
        },
        {
            header: "選手名",
            accessorKey: "nickname",
        },
    ]

    // サーブ順のデータ
    const serveOrder = [1, 2, 3, 4, 5, 6, "L"];

    const columns1 = useMemo(() => ColumnStarting, []);
    const columns2 = useMemo(() => ColumnBench, []);
    const start = useMemo(() => member.starPlayer, []);
    const bench = useMemo(() => member.benchMem, []);

    // const onDragEnd =(result) =>{
    //     const remove = items.splice(result.source.index, 1);
    //     console.log(remove)
    //     items.splice(result.destination.index, 0, remove[0])
    // }

    return (
    <div className='memberContainer'>
        {/* <DragDropContext onDragEnd={onDragEnd}> */}
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
                {start.map((row1, index) => {
                    // row.playerIdに対応する選手のデータをPlayersから検索
                    const player = Players.find((player) => player.id === row1.playerId);
                    return (
                    <tr key={index}>
                        <td>{serveOrder[index]}</td>  {/* サーブ順を表示 */}
                        <td>{player ? player.num : '-'}</td>  {/* 選手が見つかった場合はその背番号を表示し、見つからなかった場合は'-'を表示 */}
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
                {bench.map((row2, index2) => {
                    // row.playerIdに対応する選手のデータをPlayersから検索
                    const player = Players.find((player) => player.id === row2.playerId);
                    return (
                    <tr key={index2}>
                        <td>{player ? player.num : '-'}</td>  {/* 選手が見つかった場合はその背番号を表示し、見つからなかった場合は'-'を表示 */}
                        <td>{player ? player.nickname : '-'}</td>
                    </tr>
                    );
                })}
            </tbody>
        </table>
        </div>
        {/* </DragDropContext> */}
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
