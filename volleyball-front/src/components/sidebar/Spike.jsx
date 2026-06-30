import React, { useState, useEffect } from 'react'
import { useMemo } from 'react'
import "./Sidebar.css"
import axios from 'axios'
// import { useTable } from 'react-table'
import { Players } from '../../dummyData'
import { Select } from '@mui/material'

export default function Spike({actions, setSpike, setId, matchId, start, bench, pushScore}) {
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

    // selectedPlayersの初期値をspikeに設定
    const [selectedPlayers, setSelectedPlayers] = useState(Array(5).fill({playerId: null}))
    // const [selectedPlayers, setSelectedPlayers] = useState(spike)

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
            playerId: player.nickname, 
            spikeScore: spikeCounts[player.playerId] || 0
        }))
    }, [selectedPlayers, spikeCounts]);

    // const data = selectedPlayers.map((p) => ({
    //     playerId: p.playerId,
    //     spikeScore: spikeCounts[p.playerId] || 0
    // }));

    // const handlePlayerChange = (index, e) => {
    //     const newSelectedPlayers = [...selectedPlayers]
    //     newSelectedPlayers[index] = {...newSelectedPlayers[index], playerId: e.target.value}
    //     setSelectedPlayers(newSelectedPlayers)
    // }
    const handlePlayerChange = (index, e) => {
        const newSelected = [...selectedPlayers]
        newSelected[index] = {playerId: e.target.value}
        setSelectedPlayers(newSelected)
    }

    const incrementSpike = (index) => {
        const playerId = selectedPlayers[index]?.playerId
        // if (selectedPlayers[index]) {
        if (!playerId) return
        
        // // UIの表示更新
        // const newSelectedPlayers = [...selectedPlayers]
        // // newSelectedPlayers[index].spikeScore = (newSelectedPlayers[index].spikeScore || 0) + 1
        // newSelectedPlayers[index].spikeScore += 1
        // setSelectedPlayers(newSelectedPlayers)
        // // }

        // pushScoreのアクションログ
        pushScore({
            matchId,
            setId,
            action: "spike",
            playerId,
            point: 1,
            timestamp: Date.now()
        })
    };

    const decrementSpike = (index) => {
        const playerId = selectedPlayers[index]?.playerId
        if (!playerId) return

        // if (selectedPlayers[index] && selectedPlayers[index].spikeScore > 0) {
        //     const newSelectedPlayers = [...selectedPlayers]
        //     newSelectedPlayers[index].spikeScore -= 1
        //     setSelectedPlayers(newSelectedPlayers)

        if (data[index].spikeScore <= 0) return

            // pushScoreのアクションログ
            pushScore({
                matchId,
                setId,
                action: "spike",
                playerId,
                point: -1,
                timestamp: Date.now()
            })
        // }
    }

    // useEffect(() => {
    //     const fetchSpike = async () => {
    //         try {
    //             const res = await axios.get(`/set/match/${matchId}/set/${setId}`);
    //             setSelectedPlayers(res.data.spike);
    //         } catch (err) {
    //             console.error(err);
    //         }
    //     }
    //     fetchSpike();
    // }, []);    

    // useEffect(() => {
    //     const updateSpike = async () => {
    //         try {
    //             await axios.put(`/set/match/${matchId}/set/${setId}/spike`, 
    //             {
    //                 spike: selectedPlayers
    //             })
    //         } catch (err) {
    //             console.error(err);
    //         }
    //     }
    //     updateSpike()
    // } , [selectedPlayers])

    return (
        <div className='spikeContainer'>
            <div className="spikeTitle">
                <h3>スパイク統計</h3>
            </div>
            <div className="spikeTable">
                <table>
                    <thead>
                        <tr>
                            {/* <th>選手</th>
                            <th>打数</th> */}
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
                                        // value={selectedPlayers[index] ? selectedPlayers[index].playerId : ""} 
                                        value={selectedPlayers[index]?.playerId ?? ""} 
                                        onChange={(e) => handlePlayerChange(index, e)}>
                                        {/* <option value="">選手選択</option>
                                            {start
                                                .filter(player => !selectedPlayers.includes(player))
                                                .map(player => (
                                                    <option key={player.playerId} value={player.playerId}>
                                                        {player.num}番 {player.nickname}
                                                    </option>
                                                ))} */}
                                        <option value="">選手選択</option>
                                            {start
                                                // .filter(player => !selectedPlayers.includes(player))
                                                .map(player => (
                                                    <option key={player.playerId} value={player.playerId}>
                                                        {player.num}番 {player.nickname}
                                                    </option>
                                                ))}
                                    </select>
                                </td>
                                <td>
                                    <button 
                                        className='minusButton'
                                        onClick={() => decrementSpike(index)}>-</button>
                                    {row.spikeScore}
                                    <button
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