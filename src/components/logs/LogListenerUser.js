import axios from 'axios'

function WriteUserInfo(logtype,module,userNotifID,receiver_name,receiver_dept,logvalues,userID) {
    let notif = false

    try {

        const url = 'http://localhost:3001/log/putUserNotif'
        axios.post(url,{logtype,module,userNotifID,receiver_name,receiver_dept,logvalues,userID})
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


export default WriteUserInfo;