import React from 'react'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled';
import "./Player.css"

export default function Player({player}) {
  return (
    <li className="playerList">
        <div className="playerListContainer">
            <div className="eachplayer">
                <span className="playerNum">
                    背番号：{player.num}
                </span>
                <span className="playerName">
                    名前：{player.name}
                </span>
                <span className="playerNickname">
                    表示名：{player.nickname}
                </span>
                <div className="changePlayer">
                    <PersonRemoveIcon className='deletePlayer' htmlColor='green'/>
                    <span className='playerListText'>削除</span>
                    <ReplayCircleFilledIcon className='updatePlayer' htmlColor='blue'/>
                    <span className='playerListText'>更新</span>
                </div>
            </div>
        </div>
    </li>
  )
}
