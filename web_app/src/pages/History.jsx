import React, { useEffect,useState } from 'react'
import {Avatar} from 'baseui/avatar';
import {Button, KIND, SIZE} from 'baseui/button';
import {Tag} from 'baseui/tag';
import {useStyletron} from 'baseui';
import ArrowUp from 'baseui/icon/arrow-up';
import ArrowDown from 'baseui/icon/arrow-down';
import Cookies from 'js-cookie'
import APICall from '../apiCall/API';
import PaginatedTable from '../components/PaginatedTable';

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

  const COLUMNS = Array.from({length: 5}, () => 'Label');
  const DATA = Array.from({length: 45}, (_, i) =>
    Array.from({length: 5}, () => `row: ${i + 1}`),
  );

  const ROW = {
    foo: 10,
    bar: 'banana',
    url: 'https://example.com/b',
    largeNumber: 1000000,
    avatarSrc:
      'https://avatars.dicebear.com/api/human/3.svg?width=285&mood=happy',
    name: 'User Name',
    title: 'Job Title',
    list: ['One', 'Two', 'Three'],
  };
  
  //const DATA = Array.from(new Array(20)).fill(ROW);

  function AvatarCell({src, title, subtitle}) {
    const [css, theme] = useStyletron();
    return (
      <div className={css({display: 'flex', alignItems: 'center'})}>
        <Avatar size="48px" src={src} />
        <div
          className={css({
            paddingLeft: theme.sizing.scale550,
            whiteSpace: 'nowrap',
          })}
        >
          <p
            className={css({
              ...theme.typography.LabelSmall,
              margin: 0,
            })}
          >
            {title}
          </p>
          <p
            className={css({
              ...theme.typography.ParagraphSmall,
              marginBottom: 0,
              marginTop: '4px',
            })}
          >
            {subtitle}
          </p>
        </div>
      </div>
    );
  }
  function NumberCell({value, delta}) {
    const [css, theme] = useStyletron();
    const positive = delta >= 0;
    return (
      <div className={css({display: 'flex', alignItems: 'center'})}>
        <span
          className={css({...theme.typography.MonoParagraphSmall})}
        >
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(value)}
        </span>
        <div
          className={css({
            alignItems: 'center',
            display: 'flex',
            paddingLeft: theme.sizing.scale300,
            color: positive
              ? theme.colors.contentPositive
              : theme.colors.contentNegative,
          })}
        >
          {positive ? <ArrowUp /> : <ArrowDown />}
          <span
            className={css({
              ...theme.typography.MonoLabelSmall,
              paddingLeft: '2px',
            })}
          >
            {delta}%
          </span>
        </div>
      </div>
    );
  }
  function TagsCell({tags}) {
    const [css] = useStyletron();
    return (
      <div className={css({display: 'flex', alignItems: 'center'})}>
        {tags.map(tag => {
          return (
            <Tag key={tag} closeable={false}>
              {tag}
            </Tag>
          );
        })}
      </div>
    );
  }
  function ButtonsCell({labels}) {
    const [css, theme] = useStyletron();
    return (
      <div className={css({display: 'flex', alignItems: 'center'})}>
        {labels.map((label, index) => {
          return (
            <Button
              kind={KIND.secondary}
              size={SIZE.compact}
              overrides={{
                BaseButton: {
                  style: {
                    marginLeft: index > 0 ? theme.sizing.scale300 : 0,
                  },
                },
              }}
              key={label}
            >
              {label}
            </Button>
          );
        })}
      </div>
    );
  }
  
  return (
    <div className='mb-10 mx-5 mt-5' >
      <div className='shadow-xl rounded-2xl pd-2 bg-white p-5 mx-5'>
        <PaginatedTable columns={COLUMNS} data={record} isLoading={isLoading}/>
      </div>
    </div>


    
  )
}

export default History