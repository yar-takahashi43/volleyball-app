import React, { useEffect, useState } from 'react'
import { useMemo } from 'react'
import "./Reception.css"
import axios from 'axios'

export default function Reception({
    reception, setReception, setId, matchId
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
    const data = useMemo(() => 
        Object.entries(reception).map(([key, value]) => (
            {receptionId: key, receptionNum: value}
            )), [reception]);

    const addRecep = (index) => {
      let newData = [...data];
      newData[index].receptionNum += 1;
    //   setReception(newData);
      setReception(prevState => (
        {...prevState, [newData[index].receptionId]: newData[index].receptionNum}));
    };

    const minusRecep =(index) => {
      let newData = [...data];
      if (newData[index].receptionNum > 0 ){
        newData[index].receptionNum -= 1
        //   setReception(newData);
        setReception(prevState => (
            {...prevState, [newData[index].receptionId]: 
                newData[index].receptionNum}))  
      }
    }

    useEffect(() => {
        const updateReception = async () => {
            try {
                await axios.put(`/set/match/${matchId}/set/${setId}/reception`, 
                {
                    reception
                })
            } catch (err) {
                console.error(err);
            }
        }
        updateReception()
    } , [reception])

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
                                className='minusReception'
                                onClick={() => minusRecep(index)}
                                // disabled={row.receptionNum === 0}
                            >-
                            </button>
                            {row.receptionNum}
                            <button 
                                className='addReception'
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
