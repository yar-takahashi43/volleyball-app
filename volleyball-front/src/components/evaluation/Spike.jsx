import React, { useState, useEffect } from 'react'
import { useMemo } from 'react'
import "./Spike.css"
import axios from 'axios'
// import { useTable } from 'react-table'
import { Players } from '../../dummyData'
import { Select } from '@mui/material'

export default function Spike({spike, setSpike, setId, matchId, start, bench}) {
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

    // selectedPlayersの初期値をspikeに設定
    const [selectedPlayers, setSelectedPlayers] = useState(Array(5).fill({playerId: null, spikeScore:0}))
    // const [selectedPlayers, setSelectedPlayers] = useState(spike)

    const columns = useMemo(() => Column, []);
    const data = useMemo(() => 
        selectedPlayers.map((player, index) => (
            {playerId: player ? player.nickname : null, spikeScore: player ? player.spikeScore || 0 : 0}
            )), [selectedPlayers, spike]);

    const handlePlayerChange = (index, e) => {
        const newSelectedPlayers = [...selectedPlayers]
        newSelectedPlayers[index] = {...newSelectedPlayers[index], playerId: e.target.value}
        setSelectedPlayers(newSelectedPlayers)
    }

    const incrementSpike = (index) => {
        if (selectedPlayers[index]) {
            const newSelectedPlayers = [...selectedPlayers]
            newSelectedPlayers[index].spikeScore = (newSelectedPlayers[index].spikeScore || 0) + 1
            setSelectedPlayers(newSelectedPlayers)
        }
    };

    const decrementSpike = (index) => {
        if (selectedPlayers[index] && selectedPlayers[index].spikeScore > 0) {
            const newSelectedPlayers = [...selectedPlayers]
            newSelectedPlayers[index].spikeScore -= 1
            setSelectedPlayers(newSelectedPlayers)
        }
    }

    useEffect(() => {
        const fetchSpike = async () => {
            try {
                const res = await axios.get(`/set/match/${matchId}/set/${setId}`);
                setSelectedPlayers(res.data.spike);
            } catch (err) {
                console.error(err);
            }
        }
        fetchSpike();
    }, []);    

    useEffect(() => {
        const updateSpike = async () => {
            try {
                await axios.put(`/set/match/${matchId}/set/${setId}/spike`, 
                {
                    spike: selectedPlayers
                })
            } catch (err) {
                console.error(err);
            }
        }
        updateSpike()
    } , [selectedPlayers])

    return (
        <div className='spikeContainer'>
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
                                        value={selectedPlayers[index] ? selectedPlayers[index].playerId : ""} 
                                        onChange={(e) => handlePlayerChange(index, e)}>
                                        <option value="">選手選択</option>
                                            {start.filter(player => 
                                            !selectedPlayers.includes(player)).map(player => (
                                        <option key={player.playerId} value={player.playerId}>{player.nickname}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <button 
                                        className='minusSpike'
                                        onClick={() => decrementSpike(index)}>-</button>
                                    {row.spikeScore}
                                    <button
                                        className='addSpike'
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



// export default function Spike(
//     {spike, setSpike, setId, matchId, start, bench}
//     ) {
//   const Column = [
//     {
//         header: "背番号",
//         accessorKey: "playerId",
//     },
//     {
//         header: "打数",
//         accessorKey: "spikeScore",
//     },
// ]

// const [selectedPlayers, setSelectedPlayers] = useState(Array(5).fill(null))

// useEffect(() => {
//     const fetchPlayers = async () => {
//         try {
//             const res = await axios.get(`/set/match/${matchId}/set/${setId}`);
//             const fetchedSet = res.data;
//             const selectedPlayer = start.find(player => player._id === fetchedSet.starPlayer.playerId)
//             if (selectedPlayer) {
//                 setSelectedPlayers(prevPlayers => {
//                     const newPlayers = [...prevPlayers]
//                     newPlayers[0] = selectedPlayer
//                     return newPlayers
//                 })
//             }
//         } catch (err) {
//             console.error(err);
//         }
//     };
//     fetchPlayers();
// }, []);

// const columns = useMemo(() => Column, []);

// const handlePlayerChange = (index, e) => {
//     const newSelectedPlayers = [...selectedPlayers]
//     newSelectedPlayers[index] = start.find(player => player.playerId === e.target.value)
//     setSelectedPlayers(newSelectedPlayers)
// }

// const incrementSpike = (index) => {
//     if (selectedPlayers[index]) {
//         setSpike(prevState => ({
//             ...prevState,
//             [selectedPlayers[index]]: (prevState[selectedPlayers[index]] || 0) + 1,
//         }));
//     }
// };

// const decrementSpike = (index) => {
//     if (selectedPlayers[index] && spike[selectedPlayers[index]] > 0) {
//         setSpike(prevState => ({
//             ...prevState,
//             [selectedPlayers[index]]: prevState[selectedPlayers[index]] - 1,
//         }));
//     }
// }

// useEffect(() => {
//     const updateSpike = async () => {
//         try {
//             await axios.put(`/set/match/${matchId}/set/${setId}/spike`, 
//             {
//                 spike
//             })
//         } catch (err) {
//             console.error(err);
//         }
//     }
//     updateSpike()
// } , [spike])

// console.log(spike)
// console.log(selectedPlayers)

// return (
// <div className='spikeContainer'>
//       <div className="spikeTitle">
//         <h3>スパイク統計</h3>
//       </div>
//     <div className="spikeTable">
//     <table>
//         <thead>
//             <tr>
//                 {columns.map((column, index) => (
//                 <th key={index}>{column.header}</th>
//                 ))}
//             </tr>
//         </thead>
//         <tbody>
//             {Array.from({ length: 5 }, (_, index) => (
//                 <tr key={index}>
//                 <td>
//                     <select 
//                         value={selectedPlayers[index] ? selectedPlayers[index].playerId: ""} 
//                         onChange={(e) => handlePlayerChange(index, e)}
//                     >
//                         <option value="">選手選択</option>
//                         {start.filter(player => 
//                         !selectedPlayers.includes(player.playerId)).map(player => (
//                         <option key={player.playerId} value={player.playerId}>{player.nickname}</option>
//                         ))}
//                     </select>
//                 </td>
//                 <td>
//                 <button 
//                     className='minusSpike'
//                     onClick={() => decrementSpike(index)}>-</button>
//                 {spike[selectedPlayers[index]] || 0}
//                 <button
//                     className='addSpike'
//                     onClick={() => incrementSpike(index)}>+</button>
//                     </td>
//             </tr>
//             ))}
//         </tbody>
//     </table>
//     </div>
// </div>
// )
// }
