import React from 'react'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled';
import "../../components/player/Player.css"

export default function Game({match, id, date}) {
    console.log(date)
    

  return (
    <li className="playerList">
        <div className="playerListContainer">
            <div className="eachplayer">
                <span className="playerNum">
                    日付：{date}
                </span>
                <span className="playerName">
                    対戦相手：{}
                </span>
                {/* <span className="playerNickname">
                    表示名：{}
                </span> */}
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
