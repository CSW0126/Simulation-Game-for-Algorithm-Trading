import React, { useEffect,useState } from 'react'
import {Avatar} from 'baseui/avatar';
import {Button, KIND, SIZE} from 'baseui/button';
import {Tag} from 'baseui/tag';
import {useStyletron} from 'baseui';
import ArrowUp from 'baseui/icon/arrow-up';
import ArrowDown from 'baseui/icon/arrow-down';
import Cookies from 'js-cookie'
import APICall from '../apiCall/API';
import PaginatedTable from '../components/Table/PaginatedTable';

const History = () => {
  const [record, setRecord] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(()=>{
    const fetchUserRecord = async()=>{
      try{
        const token = Cookies.get("_auth")
        console.log(token)
        let response = await APICall.AsyncFetchUser(token)
        if(response.status == "success"){
          setIsLoading(false)
          let reverseRecord = response.user.record.reverse()
          setRecord(reverseRecord)
          console.log(response.user.record)
        }else{
          console.log(response)
        }
      }catch(e){
        console.log(e)
      }
    }

    fetchUserRecord()
  },[])


  return (
    <div className='mb-10 mx-5 mt-5 ' >
      <div className='shadow-xl rounded-2xl pd-2 bg-white p-5 mx-5'>
        <PaginatedTable  data={record} isLoading={isLoading}/>
      </div>
    </div>
  )
}

export default History