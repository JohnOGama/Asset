
export default function utils_getDateMMDDHR() {

    let newDate = new Date()
    
    let year = newDate.getFullYear();
    let month = newDate.getMonth() + 1;
    let day = newDate.getDate();
    let hr = newDate.getHours();
    //let minute = newDate.getMinutes();
   // let secs = newDate.getSeconds();
    let now =  month + "" + "" + day + "" + hr
    // year+"/"+month+"/"+day +" " + hr+":"+minute+":"+secs


   return now.toString()

    return now
}


