import React, { useState } from 'react';
import './GameSubHead.css';

export default function ScoreDetail({actions, setMatch, playerMap}) {
  return (
    <div className='detailContainer'>
        <div className="detailComponents">
            <table>
                <thead>
                    <tr className='detailComponentsBottom'>
                        <th className="serve2">
                            <td className='first'>背番号</td>
                            <td>エース</td>
                            <td>ミス</td>
                        </th>
                        <th className="reason2">
                            <td className='first'>背番号</td>
                            <td>得点</td>
                            <td>失点</td>
                        </th>
                        <th className="score2">
                            <td className='first'>自チーム</td>
                            <td>相手</td>
                        </th>
                    </tr>
                </thead>
                </table>
        </div>
    </div>
  )
}
