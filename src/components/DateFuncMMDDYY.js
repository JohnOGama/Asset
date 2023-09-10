
const  utils_getDateMMDDYY =() => {

    let newDate = new Date()
   
    let year = newDate.getFullYear();
    let month = newDate.getMonth() + 1;
    let day = newDate.getDate();
    let hr = newDate.getHours();
    let minute = newDate.getMinutes();
    let secs = newDate.getSeconds();
   // let now =  year+"/"+month+"/"+day +" " + hr+":"+minute+":"+secs
     now =  month +"_" + day + "_" + year 
    // year+"/"+month+"/"+day 
   // console.log(newDate)
   // console.log(day)

    return now
}
