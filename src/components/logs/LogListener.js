import React from "react";
import axios from 'axios'

function WriteLog(logtype,module,logfunction,logvalues,userID) {
    let notif = false

    try {

        const url = 'http://localhost:3001/log/putLog'
        axios.post(url,{logtype,module,logfunction,logvalues,userID})
        .then(res => {
        const dataResponse = res.data.message;
        if(dataResponse == "Insert Success") {

            notif = true
         }
         else
         {
            console.log(dataResponse)
         }
        })
        .catch(err => {
            console.log(err)
            
        })
       
    }
    catch(err) {
        console.log("Writing error -- " + err)
    }

}
export default WriteLog;