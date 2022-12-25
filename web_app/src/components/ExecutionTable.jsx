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
import ProfitMove from './Charts/ProfitMove';
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';
import IconButton from '@mui/material/IconButton';

const ExecutionTable = (props) => {
    const [css, theme] = useStyletron();
    const {rules} = props
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const navigate = useNavigate()

    const handlePageChange = (nextPage) => {
        if (nextPage < 1) {
          return;
        }
        if (nextPage > Math.ceil(props.data.length / limit)) {
          return;
        }
        setPage(nextPage);
      };
  
      const handleLimitChange = (nextLimit) => {
        const nextPageNum = Math.ceil(props.data.length / nextLimit);
        if (nextPageNum < page) {
          setLimit(nextLimit);
          setPage(nextPageNum);
        } else {
          setLimit(nextLimit);
        }
      };
  
      const window = () => {
        const min = (page - 1) * limit;
        return props.data.slice(min, min + limit);
      };

      const handleToFixed = (value) =>{
        try{
            let pair = rules.pair
            if(pair == "X:BTCUSD"){
                return value.toFixed(0)
            }else if(pair == "X:DOGEUSD"){
                return value.toFixed(5)
            }else if(pair == "X:MATICUSD"){
                return value.toFixed(4)
            }else if(pair == "X:ETHUSD"){
                return value.toFixed(0)
            }

        }catch(e){
            console.log(e)
            return value
        }
      }

      const handleGetCoinToFixed = (value) =>{
        try{
            let pair = rules.pair
            if(pair == "X:BTCUSD"){
                return value.toFixed(6) + " BTC"
            }else if(pair == "X:DOGEUSD"){
                return value.toFixed(2) + " DOGE"
            }else if(pair == "X:MATICUSD"){
                return value.toFixed(2) + " MATIC"
            }else if(pair == "X:ETHUSD"){
                return value.toFixed(5) + " ETH"
            }

        }catch(e){
            return value
        }
      }

      const calProfit = (row) =>{
        try{
            let investment = row.entryInvestment
            let finalValue = row.holdingCoin * row.currentPrice + row.holdingUSD
            let profit = (finalValue - investment).toFixed(2)
            if(isNaN(profit)){
                return "/"
            }else{
                return "+$" + profit
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
              // overrides={{Root: {style: {maxHeight: '500px'}}}}
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
                                            Drawback %: Executed Buy order when the price go down with this %.
                    
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
                                    Drawback %: Executed Buy order when the price go down with this %.
            
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
                                    Drawback %: Executed Buy order when the price go down with this %.
            
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
                                    Drawback %: Executed Buy order when the price go down with this %.
            
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
                {row =>(<div className='flex text-gray-700 font-body justify-center'>${handleToFixed(row.currentPrice)}</div>)}
              </TableBuilderColumn>

              <TableBuilderColumn header="Get/Sell Coin"
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
                                    Drawback %: Executed Buy order when the price go down with this %.
            
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
                row.getCoin ? 
                "+" + handleGetCoinToFixed(row.getCoin)
                : 
                "-" + handleGetCoinToFixed(row.sellValue/row.currentPrice)}</div>)}
              </TableBuilderColumn>

              <TableBuilderColumn header="Coin Avg Price"
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
                                    Drawback %: Executed Buy order when the price go down with this %.
            
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
                "$" + handleToFixed(row.holdingAvg) : "/"}</div>)}
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
                                    Drawback %: Executed Buy order when the price go down with this %.
            
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

              <TableBuilderColumn header="Coin Balance"
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
                                    Drawback %: Executed Buy order when the price go down with this %.
            
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
                {row =>(<div className='flex text-gray-700 font-body justify-center'>{handleGetCoinToFixed(row.holdingCoin)}</div>)}
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
                                    Drawback %: Executed Buy order when the price go down with this %.
            
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
                {row =>(<div className='flex text-gray-700 font-body justify-center'>${(row.holdingCoin * row.currentPrice + row.holdingUSD).toFixed(2)}</div>)}
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
                                    Drawback %: Executed Buy order when the price go down with this %.
            
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
                {row =>(<div className={`flex text-gray-700 font-body justify-center ${row.entryInvestment ? "text-[#00B070]":""}`}>{calProfit(row)}</div>)}
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