const express = require('express')
const router = express.Router()
const AuthToken = require('../auth/check-token')
const axios = require('axios').default;
const fs = require('fs')
const moment = require('moment')


/* get historical data
URL:localhost:3000//his/getHistoricalData
Method: POST
body:
{
    type: 1,
    ticker: 'X:DOGEUSD',
    from: '2020-12-19',
    to: '2022-12-19',
    token: xxx
}

if data not exists, get from API

(due to the API limitation, Data can only be obtained within 730 days at most,
but if there are already some old data, it will combine them and return more than 730 data to the web)
if latest date of the oldData is == today/yesterday, return oldData
if not, get newData from API and update the oldDate, return newData
*/
router.post('/getHistoricalData',AuthToken, async(req,res)=>{
    try{
        username = req.username
        _id = req._id
        console.log(req.body)

        var filename = 'xx'

        if(req.body.type == 1){
            filename = (req.body.ticker).slice(2)  
        }else if (req.body.type == 2){
            filename = req.body.ticker
        }

        var path = `HisData/${filename}.json`
        if (fs.existsSync(path)){
            console.log("file exists")
            //read old json
            let readData = fs.readFileSync(path)
            let oldJsonData = JSON.parse(readData)

            //if last results == yesterday, return old json file
            let lastDate = moment(oldJsonData.results[oldJsonData.results.length-1].t).format("YYYY-MM-DD")
            let today = req.body.to
            let yesterday = moment().add(-1,'days').format("YYYY-MM-DD")
            if(lastDate == today || lastDate == yesterday){
                console.log('return oldJsonData')
                return res.status(200).json({
                    status: "success",
                    message: oldJsonData
                })
            }else{
                //call api, get new data
                let result = await apiCall(req.body)
                if (result.status != 'fail'){
                    //new json
                    let newJson = result
                    let newFirstData = newJson.results[0]
                    let newFirstDate = moment(newFirstData['t']).format("YYYY-MM-DD")
                    console.log(newFirstDate)

                    let indexForReplace = -1
                    let resultForKeep = []
                    //find exists data index (from start)
                    for (i in oldJsonData.results){
                        let a = moment(oldJsonData.results[i].t).format("YYYY-MM-DD")
                        let b = newFirstDate
                        let matchIndex = a == b
                        if (matchIndex){
                            console.log('match date:')
                            console.log(moment(oldJsonData.results[i].t).format("YYYY-MM-DD"))
                            indexForReplace = i
                            break
                        }else{
                            resultForKeep.push(oldJsonData.results[i]) 
                        }
                    }
                    console.log(indexForReplace)

                    // for (i in oldJsonData.results){
                    //     resultForKeep.push(oldJsonData.results[i])
                    // }
                    // console.log(resultForKeep)
                    resultForKeep = resultForKeep.reverse()
                    for (item of resultForKeep)
                        newJson.results.unshift(item)
                    
                    newJson = JSON.stringify(newJson,null,4)

                    fs.writeFileSync(path, newJson, function (err) {
                        if (err) throw err;
                        console.log('File is overwrite successfully.');
                    });

                    console.log('return newJson')
                    return res.status(200).json({
                        status: "success",
                        message: JSON.parse(newJson)
                    })
                }else{
                    //return old if api error
                    console.log(result)
                    console.log('return old if api error')
                    return res.status(200).json({
                        status: "success",
                        message: oldJsonData
                    })
                }
            }


        }else{
            //call api, get new data
            let result = await apiCall(req.body)
            if (result.status != 'fail'){
                console.log("file not exists")
                let json = JSON.stringify(result,null,4)
                fs.writeFile(path, json, function (err) {
                    if (err) throw err;
                    console.log('File is created successfully.');
                });

                return res.status(200).json({
                    status:'success',
                    message: JSON.parse(json)
                })
            }else{
                console.log(result)
                return res.status(401).json({
                    status: "fail",
                    message: "Get data fail"
                })
            }

        }

    }catch(e){
        console.log(e)
        return res.status(401).json({
            status: "fail",
            message: "Auth fail"
        })
    }
})

const apiCall = async(object) =>{
    try{
        let url = `https://api.polygon.io/v2/aggs/ticker/${object.ticker}/range/1/day/${object.from}/${object.to}?adjusted=true&sort=asc&limit=50000&apiKey=${process.env.POLYGON_KEY}`
        let response = await axios.get(url)
        return response.data
    }catch(err){
        console.log(err)
        return {status:'fail', message: err}
    }

}

module.exports = router
