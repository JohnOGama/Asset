import  { useEffect, useState } from 'react'
import axios from 'axios'
import * as React from 'react'

import { DataGrid } from '@mui/x-data-grid';

import {useNavigate} from 'react-router-dom';


import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CForm,
    CButton,
    CInputGroup,

  } from '@coreui/react'

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';

import WriteLog from 'src/components/logs/LogListener';

import appSettings from 'src/AppSettings' // read the app config
import {  decrypt, encrypt } from 'n-krypta';


import ChecklistIcon from '@mui/icons-material/Checklist';

const ViewPullout = () => {

  const navigate = useNavigate();
  var userID = ""
  var userRole = ""

  var receiver_detailID = ""
  var receiver_assetID = ""
  var receiver_name = ""
  var receiver_deptID = ""
  var receiver_userID = ""
  var checkin_success = ""
  var receiver_assetName = ""
  var receiver_statusID = ""


    const [message,setMessage] = useState("")
    const [colorMessage,setColorMessage] = useState('red')

    const [pullout,setPullout] = useState([])
    const [open, setOpen] = React.useState(false);
    const [rowselected,setRowSelected] = useState({ })


    useEffect(() => {
  
      getUserInfo()
      LoadData();
    }, [])


    function CheckRole() {
      try {
  
        userRole = userID = decrypt(window.localStorage.getItem('Kgr67W@'), appSettings.secretkeylocal)
  
      }
      catch(err) {
        WriteLog("Error","ViewPullout","CheckRole Local Storage is tampered", err.message,userID)
        navigate('/dashboard')
      }
    }

function getUserInfo() {

  try {

    CheckRole()
      if (userRole == "Admin" || userRole == "IT")
        {
            if((!window.localStorage.getItem('id') == null) || (window.localStorage.getItem('id') !== "0")) {
              userID = decrypt(window.localStorage.getItem('id'), appSettings.secretkeylocal)
            
            }else{ 
              navigate('/login')
          }
        }
      else {
        navigate('/dashboard')
      }
        
      }
    catch(err) {
      navigate('/dashboard')
    }

}

const GetAssetDetail_ByUserPullout = (paramdetailID,assetName) => {
  try {

    if (userID === "") {
      getUserInfo();
    }

    WriteLog("For Testing","ViewPullout","GetAssetDetail "," param detailID : " + paramdetailID + " (------------)  assetname " + assetName )

    const url = "http://localhost:3001/pullout/getAssetID_By_UserPullout";
      axios.post(url, {paramdetailID})
        .then((res) => {
          const dataResponse = res.data.message;
          if (dataResponse == "Record Found") {
          
          window.localStorage.setItem('0ghds-134U',encrypt(paramdetailID,appSettings.secretkeylocal))
          window.localStorage.setItem('bbg54WQ',encrypt(res.data.result[0].firstname,appSettings.secretkeylocal))
          window.localStorage.setItem('125df',encrypt(res.data.result[0].departmentID,appSettings.secretkeylocal))
          window.localStorage.setItem('8786bgd',encrypt(res.data.result[0].userid,appSettings.secretkeylocal))
          window.localStorage.setItem('uuer474',encrypt(res.data.result[0].assetID,appSettings.secretkeylocal))
          window.localStorage.setItem('ooe34d',encrypt(assetName,appSettings.secretkeylocal))
          window.localStorage.setItem('jkfrf34',encrypt(res.data.result[0].assetStatusID,appSettings.secretkeylocal))
          
          } else if (dataResponse == "No Record Found") {

            window.localStorage.removeItem('0ghds-134U')
            window.localStorage.removeItem('bbg54WQ')
            window.localStorage.removeItem('125df')
            window.localStorage.removeItem('8786bgd')
            window.localStorage.removeItem('uuer474')
            window.localStorage.removeItem('ooe34d')
            window.localStorage.removeItem('jkfrf34')

            window.localStorage.setItem('Kvsf45_','0')

            WriteLog(
              "Message",
              "ViewPullout",
              "GetAssetDetail_ByUserPullout /pullout/getAssetID_By_UserPullout",
              dataResponse,
              userID
            );

          } 
          else {
            WriteLog(
              "Error",
              "ViewPullout",
              "GetAssetDetail_ByUserPullout /pullout/getAssetID_By_UserPullout",
              " Suppose to be a success or error only, need tocheck this!!",
              userID
            );
          }
        })
        .catch((err) => {
          WriteLog(
            "Error",
            "ViewPullout",
            "GetAssetDetail_ByUserPullout /pullout/getAssetID_By_UserPullout",
            " Error in then/catch " + err.message,
            userID
          );
         
          window.localStorage.removeItem('0ghds-134U')
          window.localStorage.removeItem('bbg54WQ')
          window.localStorage.removeItem('125df')
          window.localStorage.removeItem('8786bgd')
          window.localStorage.removeItem('uuer474')
          window.localStorage.removeItem('ooe34d')
          window.localStorage.removeItem('jkfrf34')
          window.localStorage.setItem('Kvsf45_','0')
        });
      
    }
    catch(err) {
      WriteLog(
        "Error",
        "ViewPullout",
        "GetAssetDetail_ByUserPullout /pullout/getAssetID_By_UserPullout",
        " Error in try/catch " + err.message,
        userID
      );

      window.localStorage.removeItem('0ghds-134U')
      window.localStorage.removeItem('bbg54WQ')
      window.localStorage.removeItem('125df')
      window.localStorage.removeItem('8786bgd')
      window.localStorage.removeItem('uuer474')
      window.localStorage.removeItem('ooe34d')
      window.localStorage.removeItem('jkfrf34')
      window.localStorage.removeItem("Kvsf45_")

    }

}

const handle_Asset_Detail = (detailid,assetname) => {


  try  {

    window.localStorage.removeItem('0ghds-134U')
    window.localStorage.removeItem('bbg54WQ')
    window.localStorage.removeItem('125df')
    window.localStorage.removeItem('8786bgd')
    window.localStorage.removeItem('uuer474')
    window.localStorage.removeItem('ooe34d')
    window.localStorage.removeItem('jkfrf34')
    window.localStorage.removeItem("Kvsf45_")

    setMessage('')
    setColorMessage('')
  
    GetAssetDetail_ByUserPullout(detailid,assetname)
    setOpen(true)
  }
  catch(err) {
    setOpen(false)
    WriteLog("Error","ViewPullout","handle_Asset_Detail","No localsotrage for processing asstassign checkin")
  }



}


    const columns = React.useMemo(() => [
      {
        field: 'id',
        headerName: 'Actions',
        type: 'actions',
        disableClickEventBubbling: true,
        renderCell: (params) => {
          return (
              <div>
                
              <ChecklistIcon cursor="pointer" onClick={()=> handle_Asset_Detail(params.row.id,params.row.assetName)}/>
  
              </div>
          );
        }
      },
      {
        field: 'assetCode',
        headerName: 'Code',
        width: 150,
        editable: false,
      },
      {
        field: 'assetName',
        headerName: 'Name',
        width: 200,
        editable: false,
      },
      {
        field: 'statusName',
        headerName: 'Status',
        width: 150,
        editable: false,
      },
        {
          field: 'assetCategName',
          headerName: 'Category',
          width: 150,
          editable: false,
        },
        {
          field: 'pulloutby',
          headerName: 'Pullout User',
          width: 150,
          editable: false,
        },
        {
            field: 'pulloutdate',
            headerName: 'Pullout Date',
            width: 150,
            editable: false,
        },
      ],[]);

    
    const UpdateAssetBy_User_PulloutStatus = (assetid) =>
    {

      try {

       
           
        receiver_detailID = decrypt(window.localStorage.getItem('0ghds-134U'),appSettings.secretkeylocal)
        receiver_name = decrypt(window.localStorage.getItem('bbg54WQ'),appSettings.secretkeylocal)
        receiver_deptID = decrypt(window.localStorage.getItem('125df'),appSettings.secretkeylocal)
        receiver_userID = decrypt(window.localStorage.getItem('8786bgd'),appSettings.secretkeylocal)
        receiver_assetID = decrypt(window.localStorage.getItem('uuer474'),appSettings.secretkeylocal) 
        receiver_assetName = decrypt(window.localStorage.getItem('ooe34d'),appSettings.secretkeylocal)
        receiver_statusID = decrypt(window.localStorage.getItem('jkfrf34'),appSettings.secretkeylocal) 

     

        const rowId = assetid
        const statusID = receiver_statusID
          const url = 'http://localhost:3001/pullout/updateAsset_ByUser_pulloutnotificationstatus'
          axios.post(url,{rowId,userID,statusID})
          .then(res => {
            const dataResponse = res.data.message;
  
            if(dataResponse == "Update Success") {

          
              WriteLog("Message","ViewPullout","UpdateAssetBy_User_PulloutStatus /pullout/updateAsset_ByUser_pulloutnotificationstatus", 
              " Receive Pullout " 
              + "\n Detail ID : " + rowId 
              + " \n Purpose : " + "Mark pullout as receive"
              + "\n User : " + userID ,userID)

            }
            if (dataResponse == "Update Error") {
              WriteLog("Error","ViewPullout","UpdateAssetBy_User_PulloutStatus /pullout/updateAsset_ByUser_pulloutnotificationstatus","Selected asset not updated \n " + 
              "Asset ID : " + rowId 
              + "\n " + res.data.message2,userID)
              
            }
          }).catch(err => {
            WriteLog("Error","ViewPullout","UpdateAssetBy_User_PulloutStatus /pullout/updateAsset_ByUser_pulloutnotificationstatus","Error in then/catch " + err.message,userID)
           
          })

      }
      catch(err) {
        WriteLog("Error","ViewPullout","UpdateAssetBy_User_PulloutStatus /pullout/updateAsset_ByUser_pulloutnotificationstatus","Error in then/catch " + err.message,userID)
      }


    }

    const SingleCheckIn = () => 
    {
      try {
     
     
        
        try{
  
          if(userID == "") 
          {
            getUserInfo()
          }
  
          receiver_detailID = decrypt(window.localStorage.getItem('0ghds-134U'),appSettings.secretkeylocal)
          receiver_name = decrypt(window.localStorage.getItem('bbg54WQ'),appSettings.secretkeylocal)
          receiver_deptID = decrypt(window.localStorage.getItem('125df'),appSettings.secretkeylocal)
          receiver_userID = decrypt(window.localStorage.getItem('8786bgd'),appSettings.secretkeylocal)
          receiver_assetID = decrypt(window.localStorage.getItem('uuer474'),appSettings.secretkeylocal) 
          receiver_assetName = decrypt(window.localStorage.getItem('ooe34d'),appSettings.secretkeylocal) 


          const rowId = receiver_detailID
          const url = 'http://localhost:3001/pullout/updatepulloutnotification'
          axios.post(url,{rowId,userID})
          .then(res => {
            const dataResponse = res.data.message;
  
            if(dataResponse == "Update Success") {

            

              WriteLog("Message","ViewPullout","SingleCheckin /pullout/updatepulloutnotification", 
              " Receive Pullout " 
              + "\n Detail ID : " + rowId 
              + " \n Purpose : " + "Mark pullout as receive"
              + "\n User : " + userID ,userID)
  
              UpdateAssetBy_User_PulloutStatus(receiver_assetID)
  
  
            }
            if (dataResponse == "Update Error") {
              WriteLog("Error","ViewPullout","SingleCheckin /pullout/updatepulloutnotification","Selected asset not updated \n " + 
              "Asset ID : " + rowId 
              + "\n " + res.data.message2,userID)
              
            }
          }).catch(err => {
            WriteLog("Error","ViewPullout","SingleCheckin /pullout/updatepulloutnotification","Error in then/catch " + err.message,userID)
           
          })
        }
        catch(err){
          WriteLog("Error","ViewPullout","SingleCheckin /pullout/updatepulloutnotification","Error in try/catch " + err.message,userID)
        }
       
  
  
        }
        catch(err) {
          WriteLog("Error","ViewPullout","SingleCheckin ", "Error in try/catch " +  err.message,userID)
        }
       

    }


    const sendEmail= () => 
    {
      let strDate =   utils_getDate();
    displayname = window.localStorage.getItem('display')
    const allow_send_email_checkin_by_IT = appSettings.ALLOW_SENDEMAIL_CHECKIN_BY_IT
      
     

    try {
        var templateParams = {
        email_to: appSettings.IT_ASSETCHECKIN_EMAIL,
        email_sender: appSettings.IT_ASSETCHECKIN_EMAIL,
        reply_to : appSettings.IT_ASSETCHECKIN_REPLY_TO,
        name: appSettings.IT_ASSETCHECKIN_ASSET_RECEIVERNAME,
        notes: "Receive Asset (" + receiver_assetName + ") \n" + notes,
        date: strDate,
        user_name:  appSettings.IT_ASSETCHECKIN_ASSET_RECEIVERNAME
    };


          if(allow_send_email_checkin_by_IT === "send") {

          emailjs.send(appSettings.IT_ASSETCHECKIN_USER_SERVICE_ID, appSettings.IT_ASSETCHECKIN_USER_TEMPLATE_ID, templateParams,appSettings.public_key)
          .then(function(response) {

            WriteUserInfo("Info", "IT Checkin", receiver_userID,
            receiver_name,receiver_deptID,
            templateParams.notes,userID)

          }, function(error) {
            

            WriteLog(
              "Error",
              "ViewPullout",
              "Failed sending Asseet Receive by User email",
              error.message,
              userID
            );

          });
        }
        else {
          
          WriteUserInfo("Info", "ViewPullout", receiver_userID,
          receiver_name,receiver_deptID,
          templateParams.notes,userID)
        }

    

  }
  catch(err) {
   WriteLog("Error","ViewPullout","sendEmail not successful","Error in try/catch \n" + err.message,userID)
  }

    }

    const  CheckAssetReceive = () =>
    {
      try{

          if(userID == "") 
          {
            getUserInfo()
          }

        
          receiver_detailID = decrypt(window.localStorage.getItem('0ghds-134U'),appSettings.secretkeylocal)
          receiver_name = decrypt(window.localStorage.getItem('bbg54WQ'),appSettings.secretkeylocal)
          receiver_deptID = decrypt(window.localStorage.getItem('125df'),appSettings.secretkeylocal)
          receiver_userID = decrypt(window.localStorage.getItem('8786bgd'),appSettings.secretkeylocal)
          receiver_assetID = decrypt(window.localStorage.getItem('uuer474'),appSettings.secretkeylocal) 
          receiver_assetName = decrypt(window.localStorage.getItem('ooe34d'),appSettings.secretkeylocal) 
      
        
        setMessage("")
        let rowId = receiver_detailID
        const url = 'http://localhost:3001/pullout/checkpulloutnotification'
        axios.post(url,{rowId})
        .then(res => {
          const dataResponse = res.data.message;
          if(dataResponse == "Record Found") {

           
            SingleCheckIn()
              sendEmail()
              LoadData()
          }
          else if (dataResponse == "No Record Found") {

            WriteLog("Message","ViewPullout","CheckAssetReceive /pullout/checkpulloutnotification ","Asset previously received ( " + receiver_detailID + " )",userID)

          }
        }).catch(err => {
          WriteLog("Error","ViewPullout","CheckAssetReceive /pullout/checkpulloutnotification"," Error then/catch \n " + err.message,userID)
         
        })
      }
      catch(err){
        WriteLog("Error","ViewPullout","CheckAssetReceive /pullout/checkpulloutnotification"," Error try/catch \n " + err.message,userID)
      }
    }



    function ProcessCheckin()
    {
      //event.preventDefault();
      setOpen(false)
      CheckAssetReceive()

    }
      
function handleClose(){
  setOpen(false)
}



  useEffect(() => {
    //setOpen(true);
  }, [pullout])

function LoadData(){
    if(userID == "") 
  {
    getUserInfo()
  }
  const url = 'http://localhost:3001/pullout/viewallpullout'
  axios.post(url)
  .then(res => {
    const dataResponse = res.data.message;
    if(dataResponse == "Record Found") {
      console.log(userID)
        setPullout(res.data.result)
    } else if (dataResponse == "No Record Found") {
      setPullout([])
    }
  }).catch(err => {
    WriteLog("Error","ViewPullout","LoadData pullout/viewallpullout", err.message,userID)
  })
}


      /// For Dialog
  function PaperComponent(props) {
    return (
      <Draggable
        handle="#draggable-dialog-title"
        cancel={'[class*="MuiDialogContent-root"]'}
      >
        <Paper {...props} />
      </Draggable>
    );
  }

  return (

    <CCol xs={12}>
    <CCard className="mb-3" size="sm"  >
      <CCardHeader>
        <strong>View Pullout <span className="message" style={{ color: colorMessage}}><p>{message}</p></span> </strong>
      </CCardHeader>
     
      <CForm >
        <CRow >
            <CCol xs={12}>
              <CCardBody>
                <CInputGroup size="sm" className="mb-3">
                        <div style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={pullout}
                                columns={columns}
                                initialState={{
                                pagination: {
                                    paginationModel: {
                                    pageSize: 10,
                                    },
                                },
                                }}
                                pageSizeOptions={[10]}
                                rowSelection={true}
                                
                                getRowId={(row) => row.id}
                                
                                disableRowSelectionOnClick
                                //onRowSelectionModelChange={id,assetID => setRowSelected({detailid:id,assetid:assetID})}
                             
                            />
                        </div>
                </CInputGroup>
                <div className="d-grid">
                      <Dialog
                        open={open}
                        onClose={handleClose}
                        PaperComponent={PaperComponent}
                        aria-labelledby="draggable-dialog-title"
                      >
                        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                          Receive Asset
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            {"Acknowledge receive asset and will be checkin to IT !"}
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button autoFocus onClick={handleClose}>
                            Cancel
                          </Button>
                          <Button onClick={ProcessCheckin}> Receive</Button>
                        </DialogActions>
                      </Dialog>
                </div>

              </CCardBody>
            </CCol>
        </CRow>
      </CForm>
    </CCard>
  </CCol>

                            
  )
}

export default ViewPullout
