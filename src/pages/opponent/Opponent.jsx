import React from 'react'
import "./Opponent.css"
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled';

export default function Opponent({opponent}) {
  return (
    <li className="opponentList">
        <div className="opponentListContainer">
            <div className="eachopponent">
                <span className="opponentName">
                    名前：{opponent.name}
                </span>
                <span className="opponentNickname">
                    表示名：{opponent.nickname}
                </span>
                <div className="changeOpponent">
                   <PersonRemoveIcon className='deleteOpponent' htmlColor='green'/>
                    <span className='opponentListText'>削除</span>
                    <ReplayCircleFilledIcon className='updateOpponent' htmlColor='blue'/>
                    <span className='opponentListText'>更新</span>
                </div>
            </div>
        </div>
    </li>
  )
}
