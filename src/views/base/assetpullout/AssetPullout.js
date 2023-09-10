
import React, { useLayoutEffect } from 'react'
import  { useEffect, useState } from 'react'
import axios from 'axios'

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
    //CFormLabel,
    //CFormFloating
    //CInputGroupText,
    CInputGroup,

  } from '@coreui/react'

  import TextField from '@mui/material/TextField';
  import { DataGrid } from '@mui/x-data-grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
//import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
//import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import {useNavigate} from 'react-router-dom';

import appSettings from 'src/AppSettings' // read the app config
import { encrypt, decrypt, compare } from 'n-krypta';
import WriteLog from 'src/components/logs/LogListener';
import emailjs from '@emailjs/browser'
import utils_getDate from '../../../components/DateFunc';


import { v4 as uuidv4 } from 'uuid';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import { ButtonGroup } from '@mui/material';
import WriteUserInfo from 'src/components/logs/LogListenerUser';

import ChecklistIcon from '@mui/icons-material/Checklist';
import utils_getDateMMDDHR from 'src/components/DateFuncMMDD';

function AssetPullout() {
  const navigate = useNavigate();

  var userID = ""
  var userRole = ""
  let displayname = ""

  var receiver_detailID = ""
  var receiver_assetID = ""
  var receiver_name = ""
  var receiver_deptID = ""
  var receiver_userID = ""
  var checkin_success = ""
  var receiver_assetName = ""


    const [success,SetSuccess] = useState("");
    const [errors,setErrors] = useState({})
    const [message,setMessage] = useState("")
    const [colorMessage,setColorMessage] = useState('red')


  const [assets, setAssets] = useState([])
    const [assetstatus, setAssetStatus] = useState([]); // bind to status options
    const [assetID,setAssetStatID] = useState(""); /// receive selected status
    const [notes,setNotes] = useState(""); // receive notes 


    useEffect(() => {
      getUserInfo();
      LoadAsset();
    }, [])

  function CheckRole() {
    try {
 
              userRole = decrypt(window.localStorage.getItem('Kgr67W@'), appSettings.secretkeylocal)
        
    }
    catch(err) {
      WriteLog("Error","AssetPullout","CheckRole Local Storage is tampered", err.message,userID)
      navigate('/dashboard')
    }

  }
    
function getUserInfo() {
try {
    CheckRole()

      if (userRole === "User")
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


function handleSubmit(event) {
    try {

      event.preventDefault();

      setMessage("")
      setColorMessage("red")  
      
    }
    catch(err) {
      console.log(err)
    }
}

/// select / option 

useEffect(() => {

    if(userID == "") 
  {
    getUserInfo()
  }
  const url = 'http://localhost:3001/status/getasset_status_users'
  axios.post(url)
  .then(res => {
    const dataResponse = res.data.message;
    if(dataResponse == "Record Found") {
      setAssetStatus(res.data.result)
    } else if (dataResponse == "No Record Found") {
      WriteLog("Message","AssetPullout","useEffect /assets/getasset_status_users'",dataResponse,userID)
      navigate('/500');
    }
  }).catch(err => {
    WriteLog("Error","AssetPullout","useEffect /assets/getasset_status_users'",err.message,userID)
  })
},[])

/// EO select / option


/// For Dialog Box

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


function handle_Asset_Detail(detailID,assetname)
{

  if((!assetID == "") && (notes !== "")) { 
 

  try  {
    window.localStorage.removeItem('0ghds-134U')
    window.localStorage.removeItem('bbg54WQ')
    window.localStorage.removeItem('125df')
    window.localStorage.removeItem('8786bgd')
    window.localStorage.removeItem("Kvsf45_")
    setMessage('')
    setColorMessage('')
    GetAssetByDetail(detailID,assetname)
    setOpen(true)
  }
  catch(err) {
   setOpen(false)
    WriteLog("Error","AssetUserAssign","handle_Asset_Detail","No localsotrage for processing asstassign checkin")
  }

}
else {
  setMessage('All fields must not be empty')
  setColorMessage('orange')
}

 

}
/// For Dialog
const handleClose = () => {
  setOpen(false);
};

function handleViewPullout() {
  navigate('/configurations/viewpulloutuser')
}

const handlePullout = (event) => {

  event.preventDefault;
  setOpen(false)

try {
      if(userID === "") 
  {
    getUserInfo()
  }

  
  const id = uuidv4();
  var docRef_Pullout =  id.slice(0,5).toUpperCase()
  docRef_Pullout = docRef_Pullout + utils_getDateMMDDHR()
  

    window.localStorage.setItem('Kvsf45_','0')
    receiver_detailID = decrypt(window.localStorage.getItem('0ghds-134U'),appSettings.secretkeylocal)
    receiver_name = decrypt(window.localStorage.getItem('bbg54WQ'),appSettings.secretkeylocal)
    receiver_deptID = decrypt(window.localStorage.getItem('125df'),appSettings.secretkeylocal)
    receiver_userID = decrypt(window.localStorage.getItem('8786bgd'),appSettings.secretkeylocal)
    receiver_assetID = decrypt(window.localStorage.getItem('uuer474'),appSettings.secretkeylocal) 
    receiver_assetName = decrypt(window.localStorage.getItem('ooe34d'),appSettings.secretkeylocal) 

    const detailid = receiver_detailID
      const url = 'http://localhost:3001/assets/pulloutasset_selectedbyuser'
      axios.post(url,{userID,detailid,assetID,notes,docRef_Pullout})
      .then(response => {
        const dataResponse = response.data.message;
        if(dataResponse == "Update Success") {

          const writeOnce = window.localStorage.getItem('Kvsf45_')
          if (writeOnce === "0" ) {
            window.localStorage.setItem('Kvsf45_','1')
            checkin_success = window.localStorage.getItem('Kvsf45_');

          }

          WriteLog("Message","AssetPullout","handlePullout /assets/pulloutasset_selectedbyuser", 
          " User advice for pullout "
          + "\n AssetID: " + assetID 
          + "\n Detail ID  :  " + detailid 
          + "\n Reason for Pullout :  " + notes
          + "\n User : " + userID ,userID)

          sendEmail(checkin_success)
          LoadAsset();

        }
        else if (dataResponse == "Update Error") {
          // only capturing the error
          WriteLog("Error","AssetPullout","handlePullout /assets/pulloutasset_selectedbyuser'",
          "AssetID : " + detailid
          + "\n Detail ID  :  " + detailid 
          + "\n Reason for Pullout :  " + notes
          + "\n " + response.data.message2,userID)

          window.localStorage.removeItem('0ghds-134U')
              window.localStorage.removeItem('bbg54WQ')
              window.localStorage.removeItem('125df')
              window.localStorage.removeItem('8786bgd')
              window.localStorage.removeItem('ooe34d')
              window.localStorage.setItem('Kvsf45_','0')

        }
      }).catch(err => {
        WriteLog("Error","AssetPullout","handlePullout /assets/pulloutasset_selectedbyuser'","Error in then/catch " + err.message,userID)


        window.localStorage.removeItem('0ghds-134U')
        window.localStorage.removeItem('bbg54WQ')
        window.localStorage.removeItem('125df')
        window.localStorage.removeItem('8786bgd')
        window.localStorage.removeItem('ooe34d')
        window.localStorage.setItem('Kvsf45_','0')


      })

    
}catch(err) {
  setOpen(false)
  WriteLog("Error","AssetPullout","handlePullout /assets/asset_bydetail'","Error in main try/catch  " + err.message,userID)


  window.localStorage.removeItem('0ghds-134U')
  window.localStorage.removeItem('bbg54WQ')
  window.localStorage.removeItem('125df')
  window.localStorage.removeItem('8786bgd')
  window.localStorage.removeItem('ooe34d')
  window.localStorage.setItem('Kvsf45_','0')

}

};

function UpdateMain_Asset(varassetid) {
  try {
           if(userID == "") 
        {
        getUserInfo()
        }
    const assetdeploy = assetID
    const url = 'http://localhost:3001/assets/updateassetdeploy'
    axios.post(url,{assetdeploy,userID,varassetid})
    .then(res => {
      const dataResponse = res.data.message;
    if (dataResponse == "Update Error") {
      WriteLog("Error","AssetPullout","UpdateMain_Asset /assets/updateassetdeploy'"," Error in updating \n " + 
        "AssetID : " + varassetid 
        + "\nAssetDeploy : " + assetdeploy ,res.data.message2,userID)
      }
    }).catch(err => {
      WriteLog("Error","AssetPullout","UpdateMain_Asset /assets/updateassetdeploy'",err.message,userID)
    })

  }
  catch(err) {
    WriteLog("Error","AssetPullout","UpdateMain_Asset /assets/updateassetdeploy'","Error in try/catch " + err.message,userID)
  }

}


/// EO for Dialog Box


/// For Data Grid 


  const columns = [
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
    {
      field: 'assetCategName',
      headerName: 'Category',
      width: 130,
      editable: false,
    },
    {
      field: 'displayName',
      headerName: 'Release By',
      width: 100,
      editable: false,
    },
    {
      field: 'datecheckin',
      headerName: 'Date Received',
      width: 130,
      editable: false,
    },
  ];

  function LoadAsset()
  {
    try {
        if(userID == "") 
        {
        getUserInfo()
        }
      const url = 'http://localhost:3001/assets/viewallassetsassigndeployed_user'
      axios.post(url,{userID})
      .then(res => {
        const dataResponse = res.data.message;
        if(dataResponse == "Record Found") {
          setAssets(res.data.result)
        } else if (dataResponse == "No Record Found") {
          setAssets([]);
        }
      }).catch(err => {
        WriteLog("Error","AssetPullout","LoadAsset /assets/viewallassetsassigndeployed_user'","Error in then/catch \n" + err.message,userID)
      })

    }
    catch(err) {
      WriteLog("Error","AssetPullout","LoadAsset /assets/viewallassetsassigndeployed_user'","Error in try/catch \n" + err.message,userID)
    }
  }

  /////////// End of Datagrid 

  useEffect(() => {
    //console.log("")
  }, [assetID])

  useEffect(() => {
   // console.log("")
  }, [notes])

  function handleInput(e) {
    try {
     
      if (e.target.name == "assetID") {
      
        setAssetStatID(e.target.value.trim())
    
      }else if(e.target.name == "notes") {
        setNotes(e.target.value.trim())
      }

      setMessage("")
      setColorMessage("red")  
      
    }
    catch(err) {
      console.log(err)
    }
  }

  function GetAssetByDetail(paramdetailID,assetName) {
    try {
      if (userID === "") {
        getUserInfo();
      }

      window.localStorage.setItem('0ghds-134U',encrypt(paramdetailID,appSettings.secretkeylocal))
      window.localStorage.setItem('ooe34d',encrypt(assetName,appSettings.secretkeylocal))
      
      const url = "http://localhost:3001/assets/getAssetID_By_detailID";
      axios.post(url, {paramdetailID})
        .then((res) => {
          const dataResponse = res.data.message;
          if (dataResponse == "Record Found") {
          
          window.localStorage.setItem('bbg54WQ',encrypt(res.data.result[0].firstname,appSettings.secretkeylocal))
          window.localStorage.setItem('125df',encrypt(res.data.result[0].departmentID,appSettings.secretkeylocal))
          window.localStorage.setItem('8786bgd',encrypt(res.data.result[0].userid,appSettings.secretkeylocal))
          window.localStorage.setItem('uuer474',encrypt(res.data.result[0].assetID,appSettings.secretkeylocal))
          window.localStorage.setItem('ooe34d',encrypt(assetName,appSettings.secretkeylocal))
          
          } else if (dataResponse == "No Record Found") {

            window.localStorage.removeItem('0ghds-134U')
            window.localStorage.removeItem('bbg54WQ')
            window.localStorage.removeItem('125df')
            window.localStorage.removeItem('8786bgd')
            window.localStorage.removeItem('uuer474')
            window.localStorage.removeItem('ooe34d')
            window.localStorage.setItem('Kvsf45_','0')

            WriteLog(
              "Message",
              "AssetPullout",
              "GetAssetbyDetail /assets/getAssetID_By_detailID",
              dataResponse,
              userID
            );

          } 
          else {
            WriteLog(
              "Error",
              "AssetPullout",
              "GetAssetbyDetail /assets/getAssetID_By_detailID",
              " Suppose to be a success or error only, need tocheck this!!",
              userID
            );
          }
        })
        .catch((err) => {
          WriteLog(
            "Error",
            "AssetPullout",
            "GetAssetByDetail /assets/getAssetID_By_detailID",
            " Error in then/catch " + err.message,
            userID
          );
         
          window.localStorage.removeItem('0ghds-134U')
          window.localStorage.removeItem('bbg54WQ')
          window.localStorage.removeItem('125df')
          window.localStorage.removeItem('8786bgd')
          window.localStorage.removeItem('uuer474')
          window.localStorage.removeItem('ooe34d')
          window.localStorage.setItem('Kvsf45_','0')
        });
      
    }
    catch(err) {
      WriteLog(
        "Error",
        "AssetPullout",
        "GetAssetByDetail /assets/getAssetID_By_detailID",
        " Error in try/catch " + err.message,
        userID
      );

      window.localStorage.removeItem('0ghds-134U')
      window.localStorage.removeItem('bbg54WQ')
      window.localStorage.removeItem('125df')
      window.localStorage.removeItem('8786bgd')
      window.localStorage.removeItem('uuer474')
      window.localStorage.removeItem('ooe34d')
      window.localStorage.removeItem("Kvsf45_")

    }
  }


  function sendEmail(paramcheckin_success) {

    let strDate =   utils_getDate();
    displayname = window.localStorage.getItem('display')
    const allow_send_email_pullout_asset_by_user = appSettings.ALLOW_SENDEMAIL_PULLOUT_BY_USER
      
     

    try {
        var templateParams = {
        email_to: appSettings.ASSET_EMAIL,
        email_sender: appSettings.email_sender,
        reply_to : appSettings.reply_to,
        name: appSettings.ASSET_RECEIVERNAME,
        notes: "Pullout Asset (" + receiver_assetName + ") \n" + notes,
        date: strDate,
        user_name: displayname
    };

    if(paramcheckin_success === "1") {

          if(allow_send_email_pullout_asset_by_user === "send") {

          emailjs.send(appSettings.USER_SERVICE_ID, appSettings.USER_TEMPLATE_ID, templateParams,appSettings.public_key)
          .then(function(response) {

            WriteUserInfo("Info", "AssetPullout", receiver_userID,
            receiver_name,receiver_deptID,
            templateParams.notes,userID)

          }, function(error) {
            

            WriteLog(
              "Error",
              "AssetPullout",
              "Failed sending pullout email",
              error.message,
              userID
            );

          });
        }
        else {
          
          WriteUserInfo("Info", "AssetPullout", receiver_userID,
          receiver_name,receiver_deptID,
          templateParams.notes,userID)
        }
    }
    

  }
  catch(err) {
   WriteLog("Error","AssetPullout","sendEmail not successful","Error in try/catch \n" + err.message,userID)
  }
  }
  
  return (

    <CCol >
         <CCard className="mb-3" size="sm"  >
         <CCardHeader>
            <h6>
              
            <span className="message" style={{ color: '#5da4f5'}}> <> Current Asset(s) </></span>
            <br></br>
            <strong><span className="message" style={{ color: colorMessage}}><p>{message}</p></span> </strong>
            </h6>
          </CCardHeader>
          <CForm onSubmit={handleSubmit}>
            <CRow  >
                <CCol xs={3} >
                    <CCardBody> 
                    
                      <CFormSelect size="sm" className="mb-3" aria-label="Small select example"
                        name='assetID' onChange={handleInput} >
                        {
                            
                            assetstatus.map((val) => 
                                <option key={val.assetStatusID} value={val.assetStatusID} > {val.statusName} </option>
                            )
                        }
                      </CFormSelect>
                    <CInputGroup size="sm" className="mb-3" >
                      <TextField onChange={handleInput} name="notes" id="outlined-textarea" fullWidth label="Notes" placeholder="Notes" multiline  rows={5} />
                    </CInputGroup>
                   
                      <ButtonGroup style={{
                            
                            display: 'flex',
                            alignItems: 'left',
                            justifyContent: 'left',
                          
                            }}>

                      <CButton onClick={handleViewPullout} style={{  margin:'5px', width: '120%' }} color="success"> View  </CButton>
                      </ButtonGroup>

                    
                      <Dialog
                        open={open}
                        onClose={handleClose}
                        PaperComponent={PaperComponent}
                        aria-labelledby="draggable-dialog-title"
                      >
                        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                          Checkout / Pullout Assets
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Are you sure you want to Pullout  asset(s) ?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button autoFocus onClick={handleClose}>
                            Cancel
                          </Button>
                          <Button onClick={handlePullout}>Pullout</Button>
                        </DialogActions>
                      </Dialog>
                    
                    </CCardBody>
                </CCol>
                <CCol xs={9}>
                <CCardBody>
                    <CInputGroup size="sm" className="mb-3">
                    <div style={{ height: 400, width: '100%' }}>

                      <DataGrid
                        rows={assets}
                        columns={columns}
                        initialState={{
                          pagination: {
                            paginationModel: {
                              pageSize: 5,
                            },
                          },
                        }}
                        pageSizeOptions={[5]}
                      //  checkboxSelection
                        disableRowSelectionOnClick
                       // onRowSelectionModelChange={id => setRowSelecteddetail(id)}
                        
                      />

                    </div>
                    </CInputGroup>
                    </CCardBody>
                </CCol>
            </CRow>
          </CForm>
         </CCard>
    </CCol>
  )
}

export default AssetPullout
