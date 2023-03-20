//in History page
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

const PaginatedTable = (props) => {
    const [css, theme] = useStyletron();
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(5);
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

    const handleViewClick = (_id) =>{
      // console.log(_id)
      navigate(`/history/${_id}`)
    }

    const AlgoType = ({type}) =>{
      let result = ""
      switch (type){
        case 1:
          result = "Martingale"
          break
        case 2:
          result = "Dollar Cost Average"
          break
        case 3:
          result = "Custom Indicator"
          break
        default:
          result = "Error Type"
          break
      }
      return (
        <div className='flex justify-center text-gray-700 font-body'>{result}</div>
      )
    }

    const getInvestmentValue = (row) =>{
      // console.log("row")
      // console.log(row)
      let resultStr = ""
      if (row.algoType == 1){
        resultStr = "$" + row.investment
      }else if (row.algoType == 2){
        if (row.type == 1){
          resultStr = "$" + (row.DCAInvestAmount * Math.ceil(row.validDate/row.period))
        }else if (row.type == 2){
          resultStr = (row.DCAInvestAmount * Math.ceil(row.validDate/row.period)) + " Shares"
        }
      }else{
        return "$"+row.investment
      }
      return resultStr
    }

    function ButtonsCell({labels, _id}) {
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


    return (
      <React.Fragment>
        <div
          className={css({
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: theme.sizing.scale600,
            paddingBottom: theme.sizing.scale600,
          })}
        >
          <div className={css({...theme.typography.font750, paddingLeft:'1rem'})}>
            Records
          </div>
        </div>
        <div className={css({height: 'auto'})}>
            <TableBuilder
              isLoading={props.isLoading}
              // overrides={{Root: {style: {maxHeight: '500px'}}}}
              data={window()}
            >
              <TableBuilderColumn header="Record Time"
                overrides={{
                  TableHeadCell:{
                    style:{
                      'text-align': 'center'
                    }
                  },
                  TableBodyCell:{
                    style:{
                      'vertical-align': 'middle'
                    }
                  }
                }}
              >
                {row =>(<div className='flex text-gray-700 font-body justify-center'>{moment(row.recordTime).format("YYYY-MM-DD HH:mm:ss")}</div>)}
              </TableBuilderColumn>

              <TableBuilderColumn header="Algorithm Type"                
                overrides={{
                    TableHeadCell:{
                      style:{
                        'text-align': 'center'
                      }
                    },
                    TableBodyCell:{
                      style:{
                        'vertical-align': 'middle'
                      }
                    }
                  }}
                >
              {row =>(<AlgoType type={row.algoType}/>)}
              </TableBuilderColumn>

              <TableBuilderColumn header="Trading Pair"
                overrides={{
                  TableHeadCell:{
                    style:{
                      'text-align': 'center'
                    }
                  },
                  TableBodyCell:{
                    style:{
                      'vertical-align': 'middle'
                    }
                  }
                }}
              >
              {row =>(<div className='flex text-gray-700 font-body justify-center'>{row.pair}</div>)}
                {/* {row => (
                  <NumberCell value={row.largeNumber} delta={-0.51} />
                )} */}
              </TableBuilderColumn>

              <TableBuilderColumn header="Investment" 
                  overrides={{
                    TableHeadCell:{
                      style:{
                        'text-align': 'center'
                      }
                    },
                    TableBodyCell:{
                      style:{
                        'vertical-align': 'middle'
                      }
                    }
                  }}
                >
              {row =>(<div className='flex text-gray-700 font-body justify-center '>{getInvestmentValue(row)}</div>)}
                {/* {row => <TagsCell tags={row.list} />} */}
              </TableBuilderColumn>

              <TableBuilderColumn header="Profit Movement"
                overrides={{
                  TableHeadCell:{
                    style:{
                      'text-align': 'center'
                    }
                  },
                  TableBodyCell:{
                    style:{
                      'vertical-align': 'middle'
                    }
                  }
                }}
              >
              {row =>(
                <div className='flex'>
                  <ProfitMove data={row}/>
                </div>
              )}
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
                {row => <ButtonsCell labels={['View']} _id={row._id} />}
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
    );
}

export default PaginatedTable