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

    const calProfit = (row) =>{
        try{
            let investment = row.entryInvestment
            let finalValue = row.holdingShares * row.currentPrice + row.holdingUSD
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
        <div className={css({...theme.typography.font750, paddingLeft:'1rem'})}>
            Leader Board
        </div>
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