// eslint-disable-next-line
import  { useEffect, useState } from 'react'
import axios from 'axios'
import * as React from 'react'

//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


// input Mask

import TextField from '@mui/material/TextField';


import { DataGrid } from '@mui/x-data-grid';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';

import { v4 as uuidv4 } from 'uuid';

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  //CAccordion,
  //CAccordionBody,
  //CAccordionHeader,
  //CAccordionItem,
  CForm,
  CButton,
  CFormSelect,
  //CFormInput,
  //CInputGroupText,
  CInputGroup,
  //CFormLabel,
  //CFormFloating
} from '@coreui/react'

/// For sending email imports 
//import {NextResponse} from 'next/server'
//import {CheckoutEmail } from 'src/views/configurations/checkoutemail/CheckoutEmail';
//import { Resend } from 'resend';
import emailjs from '@emailjs/browser'
import utils_getDate from '../../../components/DateFunc';
//import {NextApiRequest,NextApiResponse} from 'next'
/// End of sending email 

import {useNavigate} from 'react-router-dom';

import appSettings from 'src/AppSettings' // read the app config
import {  decrypt } from 'n-krypta';
// encrypt, compare
//import { buildTimeValue } from '@testing-library/user-event/dist/types/utils';

import WriteLog from 'src/components/logs/LogListener';
import WriteUserInfo from '../../../components/logs/LogListenerUser'
import { Alert } from '@coreui/coreui';
import { FormControl } from '@mui/material';
import utils_getDateMMDDHR from 'src/components/DateFuncMMDD';

const AssetUser = () => {

  const navigate = useNavigate();
  
  
  //const [userID,setUserID] = useState("")
  var userID = ""
  var userRole = ""
  

  const [message,setMessage] = useState("")
  const [colorMessage,setColorMessage] = useState('red')
  
  //const bShowConsole = false;
  //const [assetStat,setAssetStat] = useState("");
  const [assetsAvailable, setAssetsAvailable] = useState([])
  const [assetdeploy,setAssetDeploy] = useState("");

  const [users, setUsers] = useState([]);
  const [checkout, setCheckout] = useState("");
  const [rowselected,setRowSelected] = useState({})

  const [userSelected,setUserSelected] = useState ({
    userid: '',
    notes: ''
    })

    const [receiverInfo,setReceiverInfo] = useState ({
      receiverID: '',
      receiveremail: '',
      receivername: '',
      positionID: '',
      deptID: ''
      })
  


  useEffect(() => {
    CheckRole()
    getUserInfo()
    GetUsersActive()
   // GetAssetStatus_Available()
    GetStatus_ForDeploy()
   // GetAllAssets_Available()
    }, [])


    useEffect(() => {
      
      try {

        const url = 'http://localhost:3001/assets/getallassetsavailable'
        axios.post(url)
        .then(response => {
          const dataResponse = response.data.message;
          if(dataResponse == "Record Found") {
            setAssetsAvailable(response.data.result)
            
          } else if (dataResponse == "No Record Found") {
             setMessage("No assets available")
             setColorMessage('red')
          }
        }).catch(err => {
          WriteLog("Error","AssetUser","useEffect /assets/getallassetsavailable","then/catch \n " + err.message,userID)
        })
      }
      catch(err) {
        WriteLog("Error","AssetUser","useEffect /assets/getallassetsavailable","try/catch \n" + err.message,userID)
      }

      }, [])

    function CheckRole() {
      try {
  
        userRole = userID = decrypt(window.localStorage.getItem('Kgr67W@'), appSettings.secretkeylocal)
  
      }
      catch(err) {
        WriteLog("Error","AssetUser","CheckRole Local Storage is tampered", err.message,userID)
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

    function GetUsersActive() {
        try {
        const url = 'http://localhost:3001/getuserbyactive'
        axios.post(url,{userID})
        .then(res => {
          const dataResponse = res.data.message;
          if(dataResponse == "Record Found") {
            setUsers(res.data.result)
          } else if (dataResponse == "No Record Found") {
            WriteLog("Error","AssetUser","useeffect /getuserbyactive'", dataResponse,userID)
          }
        }).catch(err => {
          WriteLog("Error","AssetUser","useeffect /getuserbyactive'","Error in then/catch " + err.message,userID)
        })
      } catch(err) {
        WriteLog("Error","AssetUser","GetUsersActive /getuserbyactive'","Error in try/catch " + err.message,userID)
      }

    }

    /*
    function GetAssetStatus_Available() {
      try {

        const url = 'http://localhost:3001/assets/getAssetStatus'
        axios.post(url)
        .then(response => {
          const dataResponse = response.data.message;
          if(dataResponse == "Record Found") {
            setAssetStat(response.data.result[0].assetStatusID)
           
          } else if (dataResponse == "No Record Found") {
            WriteLog("Error","AssetUser","GetAssetStatus_Available /assets/getAssetStatus",dataResponse,userID)
          }
        }).catch(err => {
          WriteLog("Error","AssetUser","GetAssetStatus_Available /assets/getAssetStatus","Error in then/catch " + err.message,userID)
        })
      }
      catch(err) {
        WriteLog("Error","AssetUser","GetAssetStatus_Available /assets/getAssetStatus","Error in try/catch " + err.message,userID)
      }
    }
*/

    function GetStatus_ForDeploy() {
        try {
          const url = 'http://localhost:3001/assets/getassetfordeploystatus'
          axios.post(url)
          .then(response => {
            const dataResponse = response.data.message;
            if(dataResponse == "Record Found") {
              setAssetDeploy(response.data.result[0].assetStatusID)
              
            } else if (dataResponse == "No Record Found") {
              WriteLog("Error","AssetUser","useeffect /assets/getassetfordeploystatus",response.data.message2,userID)
            }
          }).catch(err => {
            WriteLog("Error","AssetUser","useeffect /assets/getassetfordeploystatus","then/catch \n" + err.message,userID)
          })
      }
      catch(err) {
        WriteLog("Error","AssetUser","useeffect /assets/getassetfordeploystatus","try/catch \n" + err.message,userID)
      }
    }
 
    const GetAllAssets_Available = () =>  {
      try {

        const url = 'http://localhost:3001/assets/getallassetsavailable'
        axios.post(url)
        .then(response => {
          const dataResponse = response.data.message;
          if(dataResponse == "Record Found") {
            setAssetsAvailable(response.data.result)
            
          } else if (dataResponse == "No Record Found") {
             setMessage("No assets available")
             setColorMessage('red')
          }
        }).catch(err => {
          WriteLog("Error","AssetUser","GetAllAssets_Available /assets/getallassetsavailable","then/catch \n " + err.message,userID)
        })
      }
      catch(err) {
        WriteLog("Error","AssetUser","GetAllAssets_Available /assets/getallassetsavailable","try/catch \n" + err.message,userID)
      }
    }


  function handleInput(e){
     // user selected and notes
    setUserSelected({...userSelected,[e.target.name]: e.target.value})
   
  }

useEffect(() => {
  //console.log()
}, [assetsAvailable])

  function handleClick() {
    setOpen(false)
      InsertAssetDetail();
      sendEmail(userSelected.userid);
     
      navigate('/dashboard')
  }

  function handleSubmit(event) {
    try {
      window.localStorage.setItem('Kvsf45_','0')
     event.preventDefault();

   
     if (Object.keys(rowselected).length > 0) {
        const varuserID = userSelected.userid
        const dateCheckout = checkout
        const notes = userSelected.notes
          if((varuserID !== "") && 
            (dateCheckout !== "") && 
            (notes !== ""))
          {

            setMessage("")
            setColorMessage('')
            SetTotalSelected(Object.keys(rowselected).length)
            GetEmailInfo_UserSelected(varuserID)
            setOpen(true)

          } else {
            setOpen(false)
            setMessage(" All Fields must not be Empty")
            setColorMessage("orange") 
          }
  
        } else 
        {
          setMessage("No Asset Selected")
          setColorMessage("orange")
        }


    }
    catch(err) {
      WriteLog("Error","AssetUser","handleSubmit /assets/searchuser",err.message,userID)
    }

  }

  const handleClose = () => {
    setOpen(false);
  };

  function GetEmailInfo_UserSelected(param) {
    try {
      const rowId = param
      const url = 'http://localhost:3001/email/getemailinfo'
      axios.post(url,{rowId})
      .then(response => {
        const dataResponse = response.data.message;
        if(dataResponse == "Record Found") {
      
                //email = response.data.result[0].email
                //name =  response.data.result[0].userName
                setReceiverInfo({...receiverInfo,
                  receiverID: response.data.result[0].userID,
                  receiveremail: response.data.result[0].email,
                  receivername: response.data.result[0].userName,
                  positionID: response.data.result[0].positionID,
                  deptID: response.data.result[0].deptID})
  
        } else if (dataResponse == "No Record Found") {
          WriteLog("Error","AssetUser","GetEmailInfo /email/getemailinfo","then/catch \n " + response.data.message,userID)
        }
      }).catch(err => {
        WriteLog("Error","AssetUser","GetEmailInfo /assets/getemailinfo","then/catch \n " + err.message,userID)
      })
  
    }
    catch(err) {
      WriteLog("Error","AssetUser","GetEmailInfo /assets/getemailinfo","Error in try/catch",userID)
    }
  }

  function InsertAssetDetail() {
  
   
    const varuserid = userSelected.userid
    const varnotes = userSelected.notes
    const positionID = receiverInfo.positionID
    const departmentID = receiverInfo.deptID

   
    const id = uuidv4();
    var docRef_Checkin =  id.slice(0,5).toUpperCase()
    docRef_Checkin = docRef_Checkin + utils_getDateMMDDHR()

    try {
      getUserInfo()
      rowselected.forEach((irow, index) => {

            const assetid = irow
            const url = 'http://localhost:3001/assets/putassetsdetail'
            axios.post(url,{varuserid,assetid,positionID,departmentID,checkout,userID,assetdeploy,varnotes,docRef_Checkin})
            .then(response => {
              const dataResponse = response.data.message;
              if(dataResponse == "Insert Success") {  
              //  console.log(" Assets inserted successful");
                // let update the Assets to status to deploy
               
                var writeOnce = window.localStorage.getItem('Kvsf45_')
                if (writeOnce == '0' ) {
                  window.localStorage.setItem('Kvsf45_','1')
                
                }

                WriteLog("Message","AssetUser","InsertAssetDetail /assets/putassetsdetail", 
                "Asset Checkout "
                + "\n AssetID: " + assetid 
                + "\n Checkout To :  " + varuserid 
                + "\n Status :  " + assetdeploy 
                + "\n Desc : " + varnotes,userID)
                

  
                UpdateAssetDeploy(assetid);
              }else if (dataResponse == "Insert Error") {
                WriteLog("Error","AssetUser","InsertAssetDetail /assets/putassetsdetail",response.data.message2,userID)
                //console.log("Error in Inserting asset ===> " + assetid )
              }
            }).catch(err => {
              WriteLog("Error","AssetUser","InsertAssetDetail /assets/putassetsdetail", " Error in then/catch " + err.message,userID)
            })
  
      })


    }catch(err) {
      WriteLog("Error","AssetUser","InsertAssetDetail /assets/putassetsdetail"," Error in try/catch " +  err.message,userID)
    }
  
  }



  function UpdateAssetDeploy(varassetid) {
    try {
      

      const url = 'http://localhost:3001/assets/updateassetFordeploy'
      axios.post(url,{assetdeploy,varassetid,userID})
      .then(response => { 
        const updateResponse = response.data.message;
        /*
        if (updateResponse == "Update Success") {
          WriteLog("Message","AssetUser","UpdateAssetDeploy /assets/updateassetdeploy",updateResponse,userID)
        }
        */
        if(updateResponse == "Update Error") {
          
        WriteLog("Error","AssetUser","UpdateAssetDeploy /assets/updateassetdeploy",response.data.message2,userID)
        }
  
      }).catch(err => {
        WriteLog("Error","AssetUser","UpdateAssetDeploy /assets/updateassetdeploy",err.message,userID)
      })
  
    }
    catch(err) {
      WriteLog("Error","AssetUser","UpdateAssetDeploy /assets/updateassetdeploy","Error in try/catch" + err.message,userID)
    }
  
  }

  /// For Data Grid 



  const columns = [
    
    {
      field: 'assetCode',
      headerName: 'Code',
      width: 120,
      editable: false,
    },
    {
      field: 'assetCategName',
      headerName: 'Category',
      width: 100,
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
      width: 130,
      editable: false,
    },
  ];

  /////////// End of Datagrid 

  function sendEmail(userid) {

    let strDate = utils_getDate()
    let allow_email_checkout = appSettings.ALLOW_SENDEMAIL_CHECKOUT_BY_IT
    let success_insert = window.localStorage.getItem('Kvsf45_')
    

    try {
      var templateParams = {
      email_to: receiverInfo.receiveremail,
      email_sender: appSettings.email_sender,
      reply_to : appSettings.reply_to,
      name: receiverInfo.receivername,
      notes: userSelected.notes,
      date: strDate
      };

    if(success_insert === "0") {
      if(allow_email_checkout === 'send') {

      emailjs.send(appSettings.YOUR_SERVICE_ID, appSettings.YOUR_TEMPLATE_ID, templateParams,appSettings.public_key)
      .then(function(response) {

        WriteUserInfo("Info","AssetUser",userid,receiverInfo.receivername,receiverInfo.deptID,
        "Asset Check Out by IT "
        + "\nNotes : " + templateParams.notes,userID)

      }, function(error) {
        WriteLog("Error","AssetUser","sendEmail ","Error in sending emailjs \n" +
        "Info : " 
        + "Failed sending email to selected user : " + userid + "\n"
        + "Plan receive asset : " + templateParams.date + "\n "
        + "Notes : " + templateParams.notes + "\n"
        + error.message,
        userID)

      });

      }
      else
      {
        WriteUserInfo("Info","AssetUser",userid,receiverInfo.receivername,receiverInfo.deptID,
        "Asset Check Out by IT "
        + "\nNotes : " + templateParams.notes,userID)
      }

    }
    

  }
  catch(err) {

    WriteLog("Error","AssetUser","send emailjs","Error in try/catch " + err.message,userID)
  }
  }
  
  // For Dialog Box

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

const [open, setOpen] = React.useState(false);
const [iselected,SetTotalSelected] = useState(0)

  return (
    
      <CCol xs={12}>
        <CCard className="mb-3" size="sm"  >
          <CCardHeader>
            <h6>
            <span className="message" style={{ color: '#5da4f5'}}> <> Asset Check Out  </></span> 
            <br></br>
            <strong><span className="message" style={{ color: colorMessage}}><p>{message}</p></span> </strong>
            </h6>
          </CCardHeader>
           <CCardBody>
          <CForm onSubmit={handleSubmit}>
              <CRow >
              
                <CCol xs={4} md={3} xl={3}  >
                    <CFormSelect size="sm" className="mb-3" aria-label="Small select example"
                      name='userid' onChange={handleInput} >
                      {
                           
                          users.map((val,result) => 
                              <option key={val.userDisplayID} value={val.userDisplayID} > {val.fullname} </option>
                          )
                      }
                    </CFormSelect>
                      <CInputGroup size="sm" className="mb-3">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker size="sm"
                              name='checkout  '
                              label="Plan Checkout "
                              fullWidth true
                              onChange={(checkout) => setCheckout(checkout)}
                            />
                        </LocalizationProvider>
                      </CInputGroup>
               
                      <CInputGroup size="sm" className="mb-3" >
                        <TextField onChange={handleInput} name="notes" id="outlined-textarea" 
                        fullWidth label="Notes" placeholder="You have asset(s) to be pickup on schedule date" multiline  rows={5}
      
                        />
                      </CInputGroup>
           
                      <div className="d-grid" style={{
                            
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            }} >
                      <CButton color="success" type='submit' >Assign Asset</CButton>
                    </div>
                
                </CCol>
                      
                <CCol xs={6} md={9} xl={9} >
          
             
               
            

                  <DataGrid
                    rows={assetsAvailable}
                    columns={columns}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 5,
                        },
                      },
                    }}
                    pageSizeOptions={[5]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    onRowSelectionModelChange={id => setRowSelected(id)}
                  />
       
               
           
             
                <Dialog
                        open={open}
                        onClose={handleClose}
                        PaperComponent={PaperComponent}
                        aria-labelledby="draggable-dialog-title"
                      >
                        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                           Checkout  Asset(s)
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Are you sure you want to Checkout  asset(s) ?
                            <br></br>
                            Selected : {iselected}

                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button autoFocus onClick={handleClose}>
                            Cancel
                          </Button>
                          <Button onClick={handleClick}>Checkout</Button>
                        </DialogActions>
                  </Dialog>
                
            
            

              </CCol>
            </CRow>
          </CForm>
          </CCardBody>
        </CCard>
      </CCol>

  )
}

export default AssetUser
