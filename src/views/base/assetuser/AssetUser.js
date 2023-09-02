// eslint-disable-next-line
import  { useEffect, useState } from 'react'
import axios from 'axios'
import * as React from 'react'

//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


// input Mask

//import PropTypes, { bool } from 'prop-types';
//import { IMaskInput } from 'react-imask';
//import { NumericFormat } from 'react-number-format';
//import Box from '@mui/material/Box';
//import Input from '@mui/material/Input';
//import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
//import FormControl from '@mui/material/FormControl';

import { DataGrid } from '@mui/x-data-grid';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';


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

const AssetUser = () => {

  const navigate = useNavigate();
  
  
  //const [userID,setUserID] = useState("")
  var userID = ""
  

  const [message,setMessage] = useState("")
  const [colorMessage,setColorMessage] = useState('red')
  
  //const bShowConsole = false;
  const [assetStat,setAssetStat] = useState("");
  const [assetdeploy,setAssetDeploy] = useState("");

  const [users, setUsers] = useState([]);
  const [checkout, setCheckout] = useState("");
 // const [notes, setNotes] = useState("");
  const [rowselected,setRowSelected] = useState({})
  const [bValue,setbValue] = useState(false)

  const [userSelected,setUserSelected] = useState ({
    userid: '',
    notes: ''
    })

    const [receiverInfo,setReceiverInfo] = useState ({
      receiverID: '',
      receiveremail: '',
      receivername: ''
      })
  

  //var email = ""
  //var name = ""
  //var notes = ""


    useEffect(() => {
      //console.log("")
    },[userSelected]);

  useEffect(() => {
    //console.log("")
  },[checkout]);




  useEffect(() => {
   // console.log("")
  },[rowselected]);

  useEffect(() => {
   // console.log("")
  },[bValue]);


  useEffect(() => {
    
      getUserInfo()

    }, [])

    function getUserInfo() {
      let id = "";
      let display = "";
      
      if((!window.localStorage.getItem('id') == null) || (window.localStorage.getItem('id') !== "0")) {
          userID = decrypt(window.localStorage.getItem('id'), appSettings.secretkeylocal)
          
      }
      else
      { 
          navigate('/login')
      }
      }

  useEffect(() => {
    getUserInfo()
    const url = 'http://localhost:3001/getuserbyactive'
    axios.post(url,{userID})
    .then(res => {
      const dataResponse = res.data.message;
      if(dataResponse == "Record Found") {
        setUsers(res.data.result)
      } else if (dataResponse == "No Record Found") {
        //setMessage("No users active")
        //navigate('/500');
      }
    }).catch(err => {
      WriteLog("Error","AssetUser","useeffect /getuserbyactive'",err.message,userID)
    })
  },[])

  useEffect(() => {
    getUserInfo()
    try {

    const url = 'http://localhost:3001/assets/getAssetStatus'
    axios.post(url)
    .then(response => {
      const dataResponse = response.data.message;
      if(dataResponse == "Record Found") {
        setAssetStat(response.data.result[0]['assetStatusID'])
       
      } else if (dataResponse == "No Record Found") {
        //SetSuccess("No Category")
        //navigate('/500');
      }
    }).catch(err => {
      WriteLog("Error","AssetUser","useeffect /assets/getAssetStatus",err.message,userID)
    })
  }
  catch(err) {
    WriteLog("Error","AssetUser","useeffect /assets/getAssetStatus",err.message,userID)
  }
  },[])
 
useEffect(() => {
  getUserInfo()
  try {
  const url = 'http://localhost:3001/assets/getassetfordeploystatus'
  axios.post(url)
  .then(response => {
    const dataResponse = response.data.message;
    if(dataResponse == "Record Found") {
      setAssetDeploy(response.data.result[0]['assetStatusID'])
      
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
},[])

  
  useEffect(() => {
    getUserInfo()
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
      WriteLog("Error","AssetUser","useeffect /assets/getallassetsavailable","then/catch \n " + err.message,userID)
    })
  }
  catch(err) {
    WriteLog("Error","AssetUser","useeffect /assets/getallassetsavailable","try/catch \n" + err.message,userID)
  }
  },[])


  function handleInput(e){

    setUserSelected({...userSelected,[e.target.name]: e.target.value})
    
  }


function UpdateAssetDeploy(varassetid) {
  try {
    
  
    getUserInfo()
    const url = 'http://localhost:3001/assets/updateassetdeploy'
    axios.post(url,{assetdeploy,varassetid,userID})
    .then(response => { 
      const updateResponse = response.data.message;
    if (updateResponse == "Update Error") {
        
      WriteLog("Error","AssetUser","UpdateAssetDeploy /assets/updateassetdeploy",response.data.message2,userID)
      }

    }).catch(err => {
      WriteLog("Error","AssetUser","UpdateAssetDeploy /assets/updateassetdeploy",err.message,userID)
    })

  }
  catch(err) {
    WriteLog("Error","AssetUser","UpdateAssetDeploy /assets/updateassetdeploy","Error in try/catch",userID)
  }

}

useEffect(() => {
// console.log
}, [receiverInfo])


function GetEmailInfo(param) {
  getUserInfo()
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
                receivername: response.data.result[0].userName})


      } else if (dataResponse == "No Record Found") {
        WriteLog("Error","AssetUser","GetEmailInfo /email/getemailinfo","then/catch \n " + response.data.message,userID)
      }
    }).catch(err => {
      WriteLog("Error","AssetUser","GetEmailInfo /assets/getallassetsavailable","then/catch \n " + err.message,userID)
    })

  }
  catch(err) {
    WriteLog("Error","AssetUser","GetEmailInfo /assets/updateassetdeploy","Error in try/catch",userID)
  }
}

  function handleClick() {
    try {

      if((!checkout == "") && 
      (!userSelected.userid) == "") 
      {
         
          
          InsertAssetDetail();
          sendEmail(userSelected.userid);
      }else {
        setMessage(" All Fields must not be Empty")
        setColorMessage("red")  
      }


      
    }
    catch(err) {
      console.log(err.message)
    }
    finally {
      setOpen(false)
      navigate('/base/assetview')
    }
  }

  function handleSubmit(event) {
    try {

      event.preventDefault();

      setMessage("")
      setColorMessage("red")  

      try {
 
        let num = 0
        rowselected.forEach((irow, index) => { 
          num = num + 1;
        })
        SetTotalSelected(num)
        
        GetEmailInfo(userSelected.userid)
        setOpen(true)
      }
      catch(err) {
        console.log(err)
        setOpen(false);
      }

    }
    catch(err) {
      WriteLog("Error","AssetUser","handleSubmit /assets/searchuser",err.message,userID)
    }

  }

  function InsertAssetDetail() {
    getUserInfo()
    const varuserid = userSelected.userid
    const varnotes = userSelected.notes
  
    try {
      
      rowselected.forEach((irow, index) => {
            const assetid = irow
            const url = 'http://localhost:3001/assets/putassetsdetail'
            axios.post(url,{varuserid,assetid,checkout,userID,assetdeploy,varnotes})
            .then(response => {
              const dataResponse = response.data.message;
              if(dataResponse == "Insert Success") {  
              //  console.log(" Assets inserted successful");
                // let update the Assets to status to deploy
  
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
              WriteLog("Error","AssetUser","InsertAssetDetail /assets/putassetsdetail",err.message,userID)
            })
  
      })
    }catch(err) {
      WriteLog("Error","AssetUser","InsertAssetDetail /assets/putassetsdetail",err.message,userID)
    }
  
  }


  /// For Data Grid 

  const [assetsAvailable, setAssetsAvailable] = useState([])


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

    let strDate =   utils_getDate();
    
    try {
    var templateParams = {
    email_to: receiverInfo.receiveremail,
    email_sender: appSettings.email_sender,
    reply_to : appSettings.reply_to,
    name: receiverInfo.receivername,
    notes: userSelected.notes,
    date: strDate
};
 
    emailjs.send(appSettings.YOUR_SERVICE_ID, appSettings.YOUR_TEMPLATE_ID, templateParams,appSettings.public_key)
    .then(function(response) {
      WriteUserInfo("Info","AssetUser",userid,
                  "Email sent : " 
                  + "Checkout Date : " + templateParams.date + "\n "
                  + "Notes : " + templateParams.notes + "\n "
                  + "Response : " + response.text + "\n "
                  + "Status : " + response.status ,userID)
       //console.log('SUCCESS!', response.status, response.text);
    }, function(error) {
      WriteUserInfo("Error","AssetUser",userid,
      "Info : " 
      + "Failed sending email to selected user : " + userid + "\n"
      + "Plan receive asset : " + templateParams.date + "\n "
      + "Notes : " + templateParams.notes + "\n "
      + "Response : " + error
      ,userID)
      // console.log('FAILED...', error);
    });

  }
  catch(err) {
    console.log(err)
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


const handleClose = () => {
  setOpen(false);
};

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
          <CForm onSubmit={handleSubmit}>
              <CRow >
                <CCol >
                  <CCardBody>
                    
                    <CFormSelect size="sm" className="mb-3" aria-label="Small select example"
                      name='userid' onChange={handleInput} >
                        <option> Select User </option>
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
                      <TextField onChange={handleInput} name="notes" id="outlined-textarea" fullWidth label="Notes" placeholder="Notes" multiline  rows={5} />
                    </CInputGroup>
                    <div className="d-grid" style={{
                            
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            }} >
                      <CButton color="success"  type='submit' >Assign Asset</CButton>
                    </div>

                  </CCardBody>
                </CCol>
                <CCol>
                  <CCardBody>

                <CInputGroup size="sm" className="mb-3">
                <div style={{ height: 400, width: '100%' }}>

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

                </div>
                </CInputGroup>
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
                            <br></br>
                            <br></br>
                            Note : Selected user will receive email notification
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button autoFocus onClick={handleClose}>
                            Cancel
                          </Button>
                          <Button onClick={handleClick}>Checkout</Button>
                        </DialogActions>
                  </Dialog>
                  </CCardBody>

              </CCol>
            </CRow>
          </CForm>
        </CCard>
      </CCol>

  )
}

export default AssetUser
