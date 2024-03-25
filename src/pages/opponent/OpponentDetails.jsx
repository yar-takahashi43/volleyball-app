import React from 'react'
import "../home/Container.css"
import OpponentDetail from './OpponentDetail.jsx';
import OpponentDetailsTop from './OpponentDetailsTop.jsx';

export default function OpponentDetails() {
  return (
    <div className="details">
        <div className='container'>
            <OpponentDetailsTop />
        </div>
            <OpponentDetail />
    </div>
  )
}
