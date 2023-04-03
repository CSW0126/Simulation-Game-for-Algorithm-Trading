//in record page
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
import ProfitMove from '../Charts/ProfitMoveChart/SmallProfitMove';
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';
import IconButton from '@mui/material/IconButton';
import APICall from '../../apiCall/API';

const ExecutionTable = (props) => {
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

      const calProfit = (row) =>{
        try{
            let investment = row.entryInvestment
            let finalValue = row.holdingShares * row.currentPrice + row.holdingUSD
            let profit = (finalValue - investment).toFixed(2)
            if(isNaN(profit)){
                return "/"
            }else{
              if(profit < 0){
                return "-$" + Math.abs(profit)
              }else{
                return "+$" + profit
              }
            }
        }catch(e){
            return "/"
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
      </div>
      <div className={css({height: 'auto'})}>
          <TableBuilder
            overrides={{Root: {style: {width: 'auto'}}}}
            data={window()}
          >
            <TableBuilderColumn header="Round"
                  overrides={{
                      TableHeadCell:{
                          style:{
                          'text-align': 'center',
                          
                          },
                          component: (value) => (
                              <th  className=" text-center border-b-1 w-auto h-auto sticky p-4 z-[1] whitespace-nowrap text-black font-semibold text-sm top-0 bg-white">
                                  {value.$col.header}
                                  <Tooltip title={
                                      <div>
                                        Every time when the bot execute a buy order then sell , it count as 1 round.
                                      </div>} placement="top">
                                      <IconButton size="small">
                                          <HelpIcon fontSize='small'/>
                                      </IconButton>
                                  </Tooltip>
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
              {row =>(<div className='flex text-gray-700 font-body justify-center parent'>{row.round}</div>)}
            </TableBuilderColumn>

            <TableBuilderColumn header="Time"
              overrides={{
                TableHeadCell:{
                  style:{
                    'text-align': 'center'
                  },
                  component: (value) => (
                      <th  className=" text-center border-b-1 w-auto h-auto sticky p-4 z-[1] whitespace-nowrap text-black font-semibold text-sm top-0 bg-white">
                          {value.$col.header}
                          <Tooltip title={
                              <div>
                                  Time when the bot execute the order.
                              </div>} placement="top">
                              <IconButton size="small">
                                  <HelpIcon fontSize='small'/>
                              </IconButton>
                          </Tooltip>
                      </th>
                    ),
                },
                TableBodyCell:{
                  style:{
                    'vertical-align': 'middle'
                  }
                }
              }}
            >
              {row =>(<div className='flex text-gray-700 font-body justify-center'>{moment(row.time).format("YYYY-MM-DD")}</div>)}
            </TableBuilderColumn>

            <TableBuilderColumn header="Type"
              overrides={{
                TableHeadCell:{
                  style:{
                    'text-align': 'center'
                  },
                  component: (value) => (
                      <th  className=" text-center border-b-1 w-auto h-auto sticky p-4 z-[1] whitespace-nowrap text-black font-semibold text-sm top-0 bg-white">
                          {value.$col.header}
                          <Tooltip title={
                              <div>
                                  Type of the order.
                              </div>} placement="top">
                              <IconButton size="small">
                                  <HelpIcon fontSize='small'/>
                              </IconButton>
                          </Tooltip>
                      </th>
                    ),
                },
                TableBodyCell:{
                  style:{
                    'vertical-align': 'middle'
                  }
                }
              }}
            >
              {row =>(
              <div className={`flex text-white font-body justify-center p-1 rounded-xl ${row.order == "Buy" ? "bg-[#4CAF50]":"bg-[#FF5252]"}`}>
                  {row.order}
              </div>)}
            </TableBuilderColumn>

            <TableBuilderColumn header="Price"
              overrides={{
                TableHeadCell:{
                  style:{
                    'text-align': 'center'
                  },
                  component: (value) => (
                      <th  className=" text-center border-b-1 w-auto h-auto sticky p-4 z-[1] whitespace-nowrap text-black font-semibold text-sm top-0 bg-white">
                          {value.$col.header}
                          <Tooltip title={
                              <div>
                                  Price of when execute the order.
                              </div>} placement="top">
                              <IconButton size="small">
                                  <HelpIcon fontSize='small'/>
                              </IconButton>
                          </Tooltip>
                      </th>
                    ),
                },
                TableBodyCell:{
                  style:{
                    'vertical-align': 'middle'
                  }
                }
              }}
            >
              {row =>(<div className='flex text-gray-700 font-body justify-center'>${APICall.HandleToFixed(row.currentPrice, rules.pair)}</div>)}
            </TableBuilderColumn>

            <TableBuilderColumn header={rules.type == 1 ? "Get/Sell Coin" : "Get/Sell Shares"}
              overrides={{
                TableHeadCell:{
                  style:{
                    'text-align': 'center'
                  },
                  component: (value) => (
                      <th  className=" text-center border-b-1 w-auto h-auto sticky p-4 z-[1] whitespace-nowrap text-black font-semibold text-sm top-0 bg-white">
                          {value.$col.header}
                          <Tooltip title={
                              <div>
                                  Get/Sell Coin/Shares when execute the order.
                              </div>} placement="top">
                              <IconButton size="small">
                                  <HelpIcon fontSize='small'/>
                              </IconButton>
                          </Tooltip>
                      </th>
                    ),
                },
                TableBodyCell:{
                  style:{
                    'vertical-align': 'middle'
                  }
                }
              }}
            >
              {row =>(<div className={`flex text-gray-700 font-body justify-center ${row.order == "Buy" ? "text-[#00B070]" : "text-[#FF5252]"}`}>{
              row.getShares ? 
              "+" + APICall.HandleGetCoinToFixed(row.getShares, rules.pair)
              : 
              "-" + APICall.HandleGetCoinToFixed(row.sellValue/row.currentPrice , rules.pair)}</div>)}
            </TableBuilderColumn>

            <TableBuilderColumn header={rules.type == 1 ? "Coin Avg Price" : "Shares Avg Price"}
              overrides={{
                TableHeadCell:{
                  style:{
                    'text-align': 'center'
                  },
                  component: (value) => (
                      <th  className=" text-center border-b-1 w-auto h-auto sticky p-4 z-[1] whitespace-nowrap text-black font-semibold text-sm top-0 bg-white">
                          {value.$col.header}
                          <Tooltip title={
                              <div>
                                  Coin/Shares Average Price of all holding.
                              </div>} placement="top">
                              <IconButton size="small">
                                  <HelpIcon fontSize='small'/>
                              </IconButton>
                          </Tooltip>
                      </th>
                    ),
                },
                TableBodyCell:{
                  style:{
                    'vertical-align': 'middle'
                  }
                }
              }}
            >
              {row =>(<div className='flex text-gray-700 font-body justify-center'>{
              row.holdingAvg ? 
              "$" + APICall.HandleToFixed(row.holdingAvg, rules.pair) : "/"}</div>)}
            </TableBuilderColumn>

            <TableBuilderColumn header="USD Balance"
              overrides={{
                TableHeadCell:{
                  style:{
                    'text-align': 'center'
                  },
                  component: (value) => (
                      <th  className=" text-center border-b-1 w-auto h-auto sticky p-4 z-[1] whitespace-nowrap text-black font-semibold text-sm top-0 bg-white">
                          {value.$col.header}
                          <Tooltip title={
                              <div>
                                  USD Balance.
                              </div>} placement="top">
                              <IconButton size="small">
                                  <HelpIcon fontSize='small'/>
                              </IconButton>
                          </Tooltip>
                      </th>
                    ),
                },
                TableBodyCell:{
                  style:{
                    'vertical-align': 'middle'
                  }
                }
              }}
            >
              {row =>(<div className='flex text-gray-700 font-body justify-center'>${row.holdingUSD.toFixed(2)}</div>)}
            </TableBuilderColumn>

            <TableBuilderColumn header={rules.type == 1 ? "Coin Balance" : "Shares Balance"}
              overrides={{
                TableHeadCell:{
                  style:{
                    'text-align': 'center'
                  },
                  component: (value) => (
                      <th  className=" text-center border-b-1 w-auto h-auto sticky p-4 z-[1] whitespace-nowrap text-black font-semibold text-sm top-0 bg-white">
                          {value.$col.header}
                          <Tooltip title={
                              <div>
                                  Holding Coin/Shares Balance.
                              </div>} placement="top">
                              <IconButton size="small">
                                  <HelpIcon fontSize='small'/>
                              </IconButton>
                          </Tooltip>
                      </th>
                    ),
                },
                TableBodyCell:{
                  style:{
                    'vertical-align': 'middle'
                  }
                }
              }}
            >
              {row =>(<div className='flex text-gray-700 font-body justify-center'>{APICall.HandleGetCoinToFixed(row.holdingShares, rules.pair)}</div>)}
            </TableBuilderColumn>

            <TableBuilderColumn header="Holding Value"
              overrides={{
                TableHeadCell:{
                  style:{
                    'text-align': 'center'
                  },
                  component: (value) => (
                      <th  className=" text-center border-b-1 w-auto h-auto sticky p-4 z-[1] whitespace-nowrap text-black font-semibold text-sm top-0 bg-white">
                          {value.$col.header}
                          <Tooltip title={
                              <div>
                                  Holding Coin/Shares + holding USD balance (in USD).
          
                              </div>} placement="top">
                              <IconButton size="small">
                                  <HelpIcon fontSize='small'/>
                              </IconButton>
                          </Tooltip>
                      </th>
                    ),
                },
                TableBodyCell:{
                  style:{
                    'vertical-align': 'middle'
                  }
                }
              }}
            >
              {row =>(<div className='flex text-gray-700 font-body justify-center'>${(row.holdingShares * row.currentPrice + row.holdingUSD).toFixed(2)}</div>)}
            </TableBuilderColumn>

            <TableBuilderColumn header="Profit"
              overrides={{
                TableHeadCell:{
                  style:{
                    'text-align': 'center'
                  },
                  component: (value) => (
                      <th  className=" text-center border-b-1 w-auto h-auto sticky p-4 z-[1] whitespace-nowrap text-black font-semibold text-sm top-0 bg-white">
                          {value.$col.header}
                          <Tooltip title={
                              <div>
                                  Profit get when executing Sell Order.
                              </div>} placement="top">
                              <IconButton size="small">
                                  <HelpIcon fontSize='small'/>
                              </IconButton>
                          </Tooltip>
                      </th>
                    ),
                },
                TableBodyCell:{
                  style:{
                    'vertical-align': 'middle'
                  }
                }
              }}
            >
              {row =>(<div className={`flex text-gray-700 font-body justify-center ${row.order == "Buy" ? "text-[#00B070]" : "text-[#FF5252]"}`}>{calProfit(row)}</div>)}
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

export default ExecutionTable