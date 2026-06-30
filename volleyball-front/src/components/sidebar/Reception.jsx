import React, { useEffect, useState } from 'react'
import { useMemo } from 'react'
import "./Sidebar.css"
import axios from 'axios'

export default function Reception({
    // reception, setReception, 
    actions, setId, matchId, pushScore
}) {
    const Column = [
        {
            header: "評価",
            accessorKey: "receptionId",
        },
        {
            header: "評価数",
            accessorKey: "receptionNum",
        },
    ]

    const columns = useMemo(() => Column, []);

    // actions[] からレセプション評価を集計
    const receptionCounts = useMemo(() => {
        const counts = { A: 0, B: 0, C: 0, D: 0 };
        actions
            .filter(a => a.action === "reception")
            .forEach(a => {
                if (counts[a.result] !== undefined) {
                counts[a.result] += 1;
                }
            });
        return counts;
    }, [actions]);

    const data = useMemo(() => {
        return Object.entries(receptionCounts).map(([key, value]) => ({
            receptionId: key, 
            receptionNum: value
        }))
    }, [receptionCounts]);

    const addRecep = (index) => {
        const grade = data[index].receptionId

        // // UI の表示更新
        // let newData = [...data];
        // newData[index].receptionNum += 1;
        // // setReception(newData);
        // setReception(prev => ({
        //     ...prev, 
        //     [grade]: newData[index].receptionNum
        // }));

        // pushScore（アクションログ）
        pushScore({
            matchId,
            setId,
            action: "reception",
            result: grade,
            point: 1,
            timestamp: Date.now()
        });
    };

    const minusRecep =(index) => {
        const grade = data[index].receptionId

        if(data[index].receptionNum <= 0) return
        // if (data[index].receptionNum > 0 ){
        //     let newData = [...data];
        //     newData[index].receptionNum -= 1
        //     setReception(prev => ({
        //         ...prev,
        //         [grade]: newData[index].receptionNum
        //     }))
            // pushScore（アクションログ）
            pushScore({
                matchId,
                setId,
                action: "reception",
                result: grade,
                point: -1,
                timestamp: Date.now()
            });
        // }
    }

    // useEffect(() => {
    //     const updateReception = async () => {
    //         try {
    //             await axios.put(`/set/match/${matchId}/set/${setId}/reception`, 
    //             {
    //                 reception
    //             })
    //         } catch (err) {
    //             console.error(err);
    //         }
    //     }
    //     updateReception()
    // } , [reception])

    // // レセプションを送る
    // const handleReception = (grade) => {
    //     pushScore({
    //         matchId,
    //         setId,
    //         action: "reception",
    //         result: grade,   // "A" | "B" | "C" | "D"
    //         timestamp: Date.now()
    //     });
    // };

  return (
    <div className='receptionContainer'>
      <div className="receptionTitle">
        <h3>レセプション評価</h3>
      </div>
        <div className="receptionTable">
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
                        <td>{row.receptionId}</td>
                        <td>
                            <button 
                                className='minusButton'
                                onClick={() => minusRecep(index)}
                                // disabled={row.receptionNum === 0}
                            >-
                            </button>
                            {row.receptionNum}
                            <button 
                                className='addButton'
                                onClick={() => addRecep(index)}
                            >+
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    </div>
  )
}
