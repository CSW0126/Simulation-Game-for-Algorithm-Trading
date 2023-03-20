import React, {useEffect, useState} from 'react'
import RankingTable from '../components/Table/RankingTable'
import APICall from '../apiCall/API'
import Cookies from 'js-cookie'

const LeaderBoard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [rankingData, setRankingData] = useState([])

  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        const token = Cookies.get('_auth')
        let response = await APICall.AsyncFetchRanking(token)
        if (response.status == 'success') {
          setIsLoading(false)
          setRankingData(response.message)
        } else {
          console.log(response)
        }
      } catch (e) {
        console.log(e)
      }
    }
    fetchRankingData()
  },[])

  useEffect(() => {
    console.log(rankingData)

  }, [rankingData])

  return (
    <div className='mb-10 mx-5 mt-5 ' >
      <div className='shadow-xl rounded-2xl pd-2 bg-white p-5 mx-5'>
        <RankingTable  data={rankingData} isLoading={isLoading}/>
      </div>
  </div>
  )
}

export default LeaderBoard
