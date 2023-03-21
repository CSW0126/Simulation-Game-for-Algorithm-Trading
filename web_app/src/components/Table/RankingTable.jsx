import React from 'react'
import {useStyletron} from 'baseui';
import TriangleDown from 'baseui/icon/triangle-down';
import {StatefulMenu} from 'baseui/menu';
import {Pagination} from 'baseui/pagination';
import {StatefulPopover, PLACEMENT} from 'baseui/popover';
import moment from "moment"
import {
  TableBuilder,
  TableBuilderColumn,
} from 'baseui/table-semantic';
import {Button, KIND, SIZE} from 'baseui/button';
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';
import IconButton from '@mui/material/IconButton';
import APICall from '../../apiCall/API';
import {Avatar} from 'baseui/avatar';
import champion from '../../data/gold.png'
import second from '../../data/sliver.png'
import third from '../../data/copper.png'

const RankingTable = (props) => {
    const [css, theme] = useStyletron();
    const {rules} = props
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const navigate = useNavigate()
    
    const handlePageChange = (nextPage) => {
      try{
        if (nextPage < 1) {
          return;
        }
        if (nextPage > Math.ceil(props.data.length / limit)) {
          return;
        }
        setPage(nextPage);
      }catch(err){
        console.log(err)
      }

      };
  
    const handleLimitChange = (nextLimit) => {
    try{
        const nextPageNum = Math.ceil(props.data.length / nextLimit);
        if (nextPageNum < page) {
        setLimit(nextLimit);
        setPage(nextPageNum);
        } else {
        setLimit(nextLimit);
        }
    }catch(err){
        console.log(err)
    }

    };
  
    const window = () => {
    try{
        const min = (page - 1) * limit;
        return props.data.slice(min, min + limit);
    }catch(err){
        console.log(err)
    }
    };

    const handleViewClick = (_id) =>{
        // console.log(_id)
        navigate(`/history/${_id}`)
      }

    const ButtonsCell = ({labels, _id}) => {
        const [css, theme] = useStyletron();
        return (
          <div>
            {labels.map((label, index) => {
              return (
                <Button
                  onClick={()=>handleViewClick(_id)}
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

    const returnUSD = (row) =>{
        try{
            if(row.finalInUSD >= row.investment){
                return row.finalInUSD + "$"
            }else{
                return "("+row.finalInUSD+"$)"
            }
        }catch(err){
            console.log(err)
            return 0
        }
    }

    const returnROIInUSD = (row) =>{
        try{
            if(row.finalInUSD >= row.investment){
                return "+" + (row.finalInUSD - row.investment).toFixed(2) + "$"
            }else{
                return "(-" + (row.investment - row.finalInUSD).toFixed(2) + "$)"
            }
        }catch(err){
            console.log(err)
            return 0
        }
    }

  return (
    <React.Fragment>
      <div
        className={css({
          display: 'flex',
          justifyContent: 'space-between',
          paddingBottom: theme.sizing.scale600,
        })}
      >
        <div className={css({...theme.typography.font750, paddingLeft:'1rem'})}>
            Leader Board
        </div>
        <Tooltip title={
            <div>
                Ranking is based on the ROI in USD.
                <br/> * Only the self-make rules  will be ranked.
            </div>} placement="left">
            <IconButton size="small">
                <HelpIcon fontSize='small'/>
            </IconButton>
        </Tooltip>
      </div>

      <div className={css({height: 'auto'})}>
          <TableBuilder
            overrides={{Root: {style: {width: 'auto'}}}}
            data={window()}
          >
            <TableBuilderColumn header="Rank"
                  overrides={{
                      TableHeadCell:{
                          style:{
                          'text-align': 'center',
                          
                          },
                          component: (value) => (
                              <th  className=" text-center border-b-1 w-auto h-auto sticky p-4 z-[1] whitespace-nowrap text-black font-semibold text-sm top-0 bg-white">
                                  {value.$col.header}
                                  {/* <Tooltip title={
                                      <div>
                                          Drawback %: Executed Buy order when the price go down with this %.
                  
                                      </div>} placement="top">
                                      <IconButton size="small">
                                          <HelpIcon fontSize='small'/>
                                      </IconButton>
                                  </Tooltip> */}
                              </th>
                            ),
                      },
                      
                      TableBodyCell:{
                          style:{
                          'vertical-align': 'middle',
                          }
                      }
                  }}
              >
              {(row, index) =>(
              <div className='flex text-gray-700 font-body justify-center parent'>
                {row.rank == 1 ? <Avatar
                                    name={`user`}
                                    size={'scale1200'}
                                    src={champion}
                                    key={row.rank}
                                    />: 
                row.rank == 2 ? <Avatar
                                    name={`user`}
                                    size={'scale1000'}
                                    src={second}
                                    key={row.rank}
                                    />: 
                row.rank == 3 ? <Avatar
                                    name={`user`}
                                    size={'scale1000'}
                                    src={third}
                                    key={row.rank}
                                    />: 
                <div className='px-3 py-2 text-xs bg-gray-200 text-gray-800 rounded-full'>{row.rank}</div>}
              </div>
              )}
            </TableBuilderColumn>

            <TableBuilderColumn header="Username"
                  overrides={{
                      TableHeadCell:{
                          style:{
                          'text-align': 'center',
                          
                          },
                          component: (value) => (
                              <th  className=" text-center border-b-1 w-auto h-auto sticky p-4 z-[1] whitespace-nowrap text-black font-semibold text-sm top-0 bg-white">
                                  {value.$col.header}
                              </th>
                            ),
                      },
                      
                      TableBodyCell:{
                          style:{
                          'vertical-align': 'middle',
                          }
                      }
                  }}
              >
              {(row, index) =>(<div className='flex text-gray-700 font-body justify-center parent'>{row.username}</div>)}
            </TableBuilderColumn>

            <TableBuilderColumn header="Investment"
                  overrides={{
                      TableHeadCell:{
                          style:{
                          'text-align': 'center',
                          
                          },
                          component: (value) => (
                              <th  className=" text-center border-b-1 w-auto h-auto sticky p-4 z-[1] whitespace-nowrap text-black font-semibold text-sm top-0 bg-white">
                                  {value.$col.header}
                              </th>
                            ),
                      },
                      
                      TableBodyCell:{
                          style:{
                          'vertical-align': 'middle',
                          }
                      }
                  }}
              >
              {(row, index) =>(<div className='flex text-gray-700 font-body justify-center parent'>${row.investment}</div>)}
            </TableBuilderColumn>

            <TableBuilderColumn header="Current Value"
                  overrides={{
                      TableHeadCell:{
                          style:{
                          'text-align': 'center',
                          
                          },
                          component: (value) => (
                              <th  className=" text-center border-b-1 w-auto h-auto sticky p-4 z-[1] whitespace-nowrap text-black font-semibold text-sm top-0 bg-white">
                                  {value.$col.header}
                              </th>
                            ),
                      },
                      
                      TableBodyCell:{
                          style:{
                          'vertical-align': 'middle',
                          }
                      }
                  }}
              >
                {row =>(
                <div className={`flex text-gray-700 font-body justify-center ${row.investment <= row.finalInUSD ? "text-[#00B070]":"text-[#FF5252]"}`}>
                    {returnUSD(row)}
                </div>)}
            </TableBuilderColumn>

            <TableBuilderColumn header="Last Update"
                  overrides={{
                      TableHeadCell:{
                          style:{
                          'text-align': 'center',
                          
                          },
                          component: (value) => (
                              <th  className=" text-center border-b-1 w-auto h-auto sticky p-4 z-[1] whitespace-nowrap text-black font-semibold text-sm top-0 bg-white">
                                  {value.$col.header}
                              </th>
                            ),
                      },
                      
                      TableBodyCell:{
                          style:{
                          'vertical-align': 'middle',
                          }
                      }
                  }}
              >
              {(row, index) =>(<div className='flex text-gray-700 font-body justify-center parent'>{row.lastDate}</div>)}
            </TableBuilderColumn>

            <TableBuilderColumn header="Current ROI %"
                  overrides={{
                      TableHeadCell:{
                          style:{
                          'text-align': 'center',
                          
                          },
                          component: (value) => (
                              <th  className=" text-center border-b-1 w-auto h-auto sticky p-4 z-[1] whitespace-nowrap text-black font-semibold text-sm top-0 bg-white">
                                  {value.$col.header}
                              </th>
                            ),
                      },
                      
                      TableBodyCell:{
                          style:{
                          'vertical-align': 'middle',
                          }
                      }
                  }}
              >

                {row =>(<div className={`flex text-gray-700 font-body justify-center ${row.investment <= row.finalInUSD ? "text-[#00B070]":"text-[#FF5252]"}`}>
                    {returnROIInUSD(row)}
                    <span className=' text-xs'>&nbsp; {row.profitRatio}%</span>
                    </div>)}
            </TableBuilderColumn>

            <TableBuilderColumn header="Details"                
                overrides={{
                    TableHeadCell:{
                      style:{
                        'text-align': 'center'
                      }
                    },
                    TableBodyCell:{
                      style:{
                        'vertical-align': 'middle',
                        'text-align': 'center'
                      }
                    }
                  }}
                >
                {row => <ButtonsCell labels={['View']} _id={row.record_id} />}
              </TableBuilderColumn>

      </TableBuilder>
      </div>
      <div
        className={css({
          paddingTop: theme.sizing.scale600,
          paddingBottom: theme.sizing.scale600,
          paddingRight: theme.sizing.scale800,
          paddingLeft: theme.sizing.scale800,
          display: 'flex',
          justifyContent: 'space-between',
        })}
      >
        <StatefulPopover
          content={({close}) => (
            <StatefulMenu
              items={Array.from({length: 100}, (_, i) => ({
                label: i + 1,
              }))}
              onItemSelect={({item}) => {
                handleLimitChange(item.label);
                close();
              }}
              overrides={{
                List: {
                  style: {height: '150px', width: '100px'},
                },
              }}
            />
          )}
          placement={PLACEMENT.bottom}
        >
          <Button kind={KIND.tertiary} endEnhancer={TriangleDown} disabled>
            {`${limit} Rows`}
          </Button>
        </StatefulPopover>
        <Pagination
          currentPage={page}
          numPages={Math.ceil(props.data.length / limit)}
          onPageChange={({nextPage}) => handlePageChange(nextPage)}
        />
      </div>
    </React.Fragment>
  )
}

export default RankingTable