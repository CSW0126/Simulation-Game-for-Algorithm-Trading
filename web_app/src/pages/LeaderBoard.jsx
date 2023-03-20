import React, {useState} from 'react'
import RankingTable from '../components/Table/RankingTable'

const LeaderBoard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const record = []
  return (
    <div className='mb-10 mx-5 mt-5 ' >
      <div className='shadow-xl rounded-2xl pd-2 bg-white p-5 mx-5'>
        <RankingTable  data={record} isLoading={isLoading}/>
      </div>
  </div>
  )
}

export default LeaderBoard
