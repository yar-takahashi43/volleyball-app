import React from 'react';
import './GameHead.css';

export default function GameHead() {
  return (
    <div className='titleContainer'>
        <div className="titleComponents">
            <table>
                <thead>
                    <tr className='titleComponentsHead'>
                        <th className="serve">
                            <div className='headTitle'>サーブ</div>
                        </th>
                        <th className="reason">
                            <div className='headTitle'>決定要因</div>
                        </th>
                        <th className="score">
                            <div className='headTitle'>スコア</div>
                        </th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
  )
}
