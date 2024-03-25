import React, { useState } from 'react'
import { useMemo } from 'react'
import "./Reception.css"

export default function Reception({reception, addReception, setAddReception, minusReception, setMinusReception}) {
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
    const data = useMemo(() => reception, []);

    const addRecep = (index) => {
      let newData = [...data];
      newData[index].receptionNum += 1;
      setAddReception(newData);
    };

    const minusRecep =(index) => {
      let newData = [...data];
      newData[index].receptionNum -= 1;
      setMinusReception(newData);
    }

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
