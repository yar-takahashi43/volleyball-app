import React, {useState, useEffect} from 'react'
import "./OpponentList.css"
import Opponent from '../../components/opponent/Opponent'
import OpponentListTop from './OpponentListTop'
import "../home/Container.css"
import api from '../../Api';

export default function OpponentList() {
  const[opponents, setOpponents] = useState([])

  useEffect(() => {
    const fetchOpponents = async() => {
      try {
        const res = await api.get("opponent/opponents")
        setOpponents(res.data)
      } catch(err) {
        console.error(err)
      }
    }
  fetchOpponents()
}, [])

  const handleDeleteOpponent = async (id) => {
    try {
      await api.delete(`/opponent/${id}`);
      console.log("削除が完了しました。")
      setOpponents(prev => prev.filter(o => o._id !== id));
    } catch (err) {
      console.log("削除中にエラーが発生しました。" ,err)
    }
  };
  
  const handleUpdateOpponent = (updated) => {
    try {
      setOpponents(prev => 
        prev.map(o => o._id === updated._id ? updated : o));
    } catch (err) {
      console.log("更新中にエラーが発生しました。" ,err)
    }
  };

  return (
    <div className="container">
      <div className='bar'>
        <OpponentListTop />
            <div className="opponentList">
                {opponents.map((opponent) => (
                  <Opponent 
                    key={opponent._id + opponent.name + opponent.label}
                    opponent={opponent} 
                    // number={opponent.num}
                    onDelete={handleDeleteOpponent}
                    onUpdate={handleUpdateOpponent}/>
                ))}
            </div>
      </div>
    </div>
  )
}
