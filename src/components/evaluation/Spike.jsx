import React from 'react'
import { useMemo } from 'react'
import "./Spike.css"
// import { useTable } from 'react-table'
import { Players } from '../../dummyData'

export default function Spike({spike, playerData, addSpike ,setAddSpike, minusSpike, setMinusSpike}) {
  const Column = [
    {
        header: "背番号",
        accessorKey: "playerId",
    },
    {
        header: "打数",
        accessorKey: "spikeScore",
    },
]

const columns = useMemo(() => Column, []);
const data = useMemo(() => spike, []);

const addScpikeScore = (index) => {
  let newData = [...data];
  newData[index].spikeScore += 1;
  setAddSpike(newData);
};

const minusSpikeScore =(index) => {
  let newData = [...data];
  newData[index].spikeScore -= 1;
  setMinusSpike(newData);
}

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
            {data.map((row, index) => {
                // row.playerIdに対応する選手のデータをPlayersから検索
                const player = Players.find((player) => player.id === row.playerId);
                return (
                <tr key={index}>
                    <td>{player ? player.num : '-'}</td>  {/* 選手が見つかった場合はその背番号を表示し、見つからなかった場合は'-'を表示 */}
                    <td>
                        <button 
                            className='minusSpike'
                            onClick={() => minusSpikeScore(index)}
                        >-
                        </button>
                        {row.spikeScore}
                        <button 
                            className='addSpike'
                            onClick={() => addScpikeScore(index)}
                        >+
                        </button>
                    </td>
                </tr>
                );
            })}
        </tbody>
        {/* <tbody>
            {data.map((row, index) => (
                <tr key={index}>
                    <td>{playerData.player ? playerData.player.num : 'N/A'}</td>
                    <td>
                        <button 
                            className='addSpike'
                            onClick={() => addScpikeScore(index)}
                        >+
                        </button>
                        {row.spikeScore}
                        <button 
                            className='minusSpike'
                            onClick={() => minusSpikeScore(index)}
                        >-
                        </button>
                    </td>
                </tr>
            ))}
        </tbody> */}
    </table>
    </div>
</div>
)
}
