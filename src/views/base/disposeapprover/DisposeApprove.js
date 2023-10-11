// eslint-disable-next-line
import  { useEffect, useState } from 'react'
import axios from 'axios'
import * as React from 'react'

//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';



import TextField from '@mui/material/TextField';

import { DataGrid,useGridApiRef} from '@mui/x-data-grid';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';

import DefaulImgDispose from "../../../assets/images/DefaultDispose.png"

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CButton,
  CFormSelect,

  CInputGroup,

} from '@coreui/react'

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
import utils_getDateMMDDHR from 'src/components/DateFuncMMDD';

import { v4 as uuidv4 } from 'uuid';
import { ButtonGroup, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import GenerateDisposeDocPDF from 'src/components/generatereport/GenerateDisposeDocPDF';
import AlertMessages from 'src/components/alertmessages/AlertMessages';
import WriteUserInfo from 'src/components/logs/LogListenerUser';

const DisposeApprove = () => {

  const navigate = useNavigate();
  
  var userID = ""
  var userRole = ""

  const [message,setMessage] = useState("")
  const [colorMessage,setColorMessage] = useState('red')

  const [dispose,setDispose] = useState([])
  const [open, setOpen] = React.useState(false);
  const [rowselected,SetRowSelected] = useState({})
  
  const [iselected,SetTotalSelected] = useState(0)

    const [receiverInfo,setReceiverInfo] = useState ({
      receiveremail: '',
      receivername: ''
      })
  
  const[docRef_Dispose,setdocRef_Dispose] = useState([])
  const[docRef_selected_Dispose,setDocRef_selectedDispose] = useState("")


  const apiRef = useGridApiRef();

function CheckRole() {
  try {

    userRole = decrypt(window.localStorage.getItem('Kgr67W@'), appSettings.secretkeylocal)

  }
  catch(err) {
    WriteLog("Error","DisposeView","CheckRole Local Storage is tampered", err.message,userID)
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
              window.localStorage.removeItem('Kvsf45_')
            
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


useEffect(() => {
  getUserInfo()
  GetEmailInfo()
  LoadDocRef_forApproval()
 // LoadData()
 
 },[])

 
 const LoadDocRef_forApproval = () => {
    try {
      getUserInfo()
      const url = 'http://localhost:3001/dispose/viewallassetdispose_forApproval'
      axios.post(url)
      .then(res => {
      const dataResponse = res.data.message;
      if(dataResponse == "Record Found") {
        setdocRef_Dispose(res.data.result)
      } 
      else
      {
        setdocRef_Dispose([])

      }
      }).catch(err => {
      WriteLog("Error","DisposeView","LoadData /dispose/viewallassetdispose","Error in then/catch \n" + err.message,userID)
      })
  }
  catch(err) {
      WriteLog("Error","DisposeView"," LoadData /dispose/viewallassetdispose","Error in try/catch \n" + err.message,userID)
  }      
  
 }

 /*
 useEffect(() => {
 
      try {
        getUserInfo()
        const url = 'http://localhost:3001/dispose/viewallassetdispose_forApproval'
        axios.post(url)
        .then(res => {
        const dataResponse = res.data.message;
        if(dataResponse == "Record Found") {
          setdocRef_Dispose(res.data.result)
        } 
        else
        {
          setdocRef_Dispose([])

        }
        }).catch(err => {
        WriteLog("Error","DisposeView","LoadData /dispose/viewallassetdispose","Error in then/catch \n" + err.message,userID)
        })
    }
    catch(err) {
        WriteLog("Error","DisposeView"," LoadData /dispose/viewallassetdispose","Error in try/catch \n" + err.message,userID)
    }      
 }, [])
   */ 

 useEffect(() => {
   console.log("")
 }, [dispose])

function LoadData(){
    try {
        getUserInfo()
        
        const url = 'http://localhost:3001/dispose/viewallassetdispose_forApproval_selected'
        axios.post(url,{docRef_selected_Dispose})
        .then(res => {
        const dataResponse = res.data.message;
        if(dataResponse == "Record Found") {
            setDispose(res.data.result)
        } 
        else
        {
          
          setDispose([])

        }
        }).catch(err => {
        WriteLog("Error","DisposeView","LoadData /dispose/viewallassetdispose","Error in then/catch \n" + err.message,userID)
        })
    }
    catch(err) {
        WriteLog("Error","DisposeView"," LoadData /dispose/viewallassetdispose","Error in try/catch \n" + err.message,userID)
    }      
  }

  
  function LoadDispos(){
    try {
        getUserInfo()
        const url = 'http://localhost:3001/dispose/viewallassetdispose_DocRef'
        axios.post(url)
        .then(res => {
        const dataResponse = res.data.message;
        if(dataResponse == "Record Found") {
            setdocRef_Dispose(res.data.result)
        } 
        else
        {
          
          setdocRef_Dispose([])

        }
        }).catch(err => {
        WriteLog("Error","DisposeView","LoadDispos /dispose/viewallassetdispose_DocRef","Error in then/catch \n" + err.message,userID)
        })
    }
    catch(err) {
        WriteLog("Error","DisposeView"," LoadDispos /dispose/viewallassetdispose","Error in try/catch \n" + err.message,userID)
    }      
  }

useEffect(() => {
// console.log
}, [receiverInfo])

function GetEmailInfo(param) {
    getUserInfo()
    
  try {
    const rowId = userID
    const url = 'http://localhost:3001/email/getemailinfo'
    axios.post(url,{rowId})
    .then(response => {
      const dataResponse = response.data.message;
      if(dataResponse == "Record Found") {
    
                setReceiverInfo({...receiverInfo,
                receiveremail: response.data.result[0].email,
                receivername: response.data.result[0].userName})


      } else if (dataResponse == "No Record Found") {
        WriteLog("Error","DisposeView","GetEmailInfo /email/getemailinfo",dataResponse + "\n" + response.data.message,userID)
      }
    }).catch(err => {
      WriteLog("Error","DisposeView","GetEmailInfo /assets/getallassetsavailable","then/catch \n " + err.message,userID)
    })

  }
  catch(err) {
    WriteLog("Error","DisposeView","GetEmailInfo /assets/updateassetdeploy","Error in try/catch",userID)
  }
}

function handleClick() {
try {
  setOpen(false)
  window.localStorage.setItem('Kvsf45_','0')
  const id = uuidv4();
  var docRef_Dispose =  id.slice(0,5).toUpperCase()
  docRef_Dispose = docRef_Dispose + utils_getDateMMDDHR()


    rowselected.forEach((irow, index) => { 
        if(!irow == '') {
        CheckDispose(irow,docRef_Dispose)

      //  const rowIds = apiRef.current.getRowId(irow) 
        //.getAllRowIds();
      //  const rowId = rowIds
        //randomArrayItem(rowIds);
    
      //  apiRef.current.updateRows([{ id: irow, _action: 'delete' }]);

        }
       })

       setDocRef_selectedDispose("")
        SetRowSelected({})
        
          sendEmail()
         LoadDocRef_forApproval()
         LoadData()
        
       /*
       else if((!check_approve_dispose === "1") || (!check_approve_dispose === "0"))
       {
        WriteLog("Error","DisposeView","Get_LocalStorage_Dispose","LocalStorage is tampered \n ",userID)
       }
       else {
        WriteLog("Error","DisposeView","Get_LocalStorage_Dispose","Local Storage issue \n ",userID)
       }
      */


}
catch(err) {
    
    setOpen(false)
    navigate('/dashboard')
}

}

  function handleSubmit(event) {
    try {

      event.preventDefault();

      setMessage("")
      setColorMessage("red")  

      try {
        if(Object.keys(rowselected).length.toString() !== "0") {
        
          SetTotalSelected(Object.keys(rowselected).length.toString())
          GetEmailInfo(userID)
          setOpen(true)

        } else {
          
          AlertMessages('No Asset selected for Dispose !','Warning')
        }
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

  const handleClose = () => {
    setOpen(false);
  };


  function UpdateAssetDisable(paramassetID) {
    try {
      getUserInfo()
     const rowId = paramassetID
    
     GetEmailInfo()
      const url = 'http://localhost:3001/assets/updateAsset_Disable'
      axios.post(url,{rowId,userID})
      .then(res => { 

        const dataResponse = res.data.message 
          
          if(dataResponse == "Update Success") {
            WriteUserInfo("Info","DisposeApprove",userID,receiverInfo.receivername,"","Asset is now Disabled.",userID)

          } else {
            WriteLog("Error","DisposeApprove","UpdateAssetDisable dispose/updateAsset_Disable", dataResponse,userID)
          }

      })
      .catch(err => {
      WriteLog("Error","DisposeApprove","UpdateAssetDisable /dispose/updateAsset_Disable","Error in then/catch \n" + err.message,userID)
      })
    }
    catch(err) {
      WriteLog("Error","DisposeApprove","UpdateAssetDisable /dispose/updateAsset_Disable","Error in try/catch \n" + err.message,userID)
    }
  }


  function CheckDispose(params,params_docRef_Dispose) {

    getUserInfo()
    try {
  
      const rowId = params
      WriteLog("For Testing","Checkdispose details : ",params)
        const url = 'http://localhost:3001/dispose/checkassetdispose_approve_exist'
        axios.post(url,{rowId})
        .then(res => { 
          const dataResponse = res.data.message 
          
          if(dataResponse == "Record Found"){ 

            AssetDispose(rowId,res.data.result[0].assetID,params_docRef_Dispose)
            UpdateAssetDisable(res.data.result[0].assetID)

          } else if(dataResponse == "No Record Found") {
            setMessage("Asset already mark as Dispose contact Support Team")
            setColorMessage('red')
            WriteLog("Error","DisposeView","CheckDispose /dispose/checkassetdispose_approve_exist", dataResponse + "\n Asset already mark as Dispose contact Support Team",userID)
          } 
        })
        .catch(err => {
        WriteLog("Error","DisposeView","CheckDispose /dispose/checkassetdispose_approve_exist","Error in then/catch \n" + err.message,userID)
        //navigate('/500');
        //navigate('/page/Page404')
        })
      
    }
    catch(err) {
      WriteLog("Error","DisposeView","CheckDispose","Error in try/catch \n" + err.message,userID)
    }
  
    
  }

  function AssetDispose(disposeid,assetid,params_docRef_Dispose) {
    try {



      getUserInfo()
      const docRef_Dispose = params_docRef_Dispose
      const url = 'http://localhost:3001/dispose/AssetDispose_Approve'
      axios.post(url,{userID,disposeid,assetid,docRef_Dispose})
      .then(res => {
        const dataResponse = res.data.message 
        
        if(dataResponse == "Update Error") {
          WriteLog("Error","DisposeView","AssetDispose_Single /dispose/AssetDispose_Approve", res.message2,userID)
          //window.localStorage.setItem('Kvsf45_','0')
        } else if( dataResponse === "Update Success") {
          window.localStorage.setItem('Kvsf45_','1')
          WriteLog("Message","DisposeView","AssetDispose /dispose/AssetDispose_Approve", 
          "Asset Dispose "
          + "\n AssetID: " + assetid
          + "\n Dispose ID: " + disposeid ,userID)
        }
      })
      .catch(err => {
      WriteLog("Error","DisposeView","AssetDispose_Single /dispose/AssetDispose_Approve","Error in then/catch \n" + err.message,userID)
      
      })
    }
    catch(err) {
      WriteLog("Error","DisposeView"," AssetDispose_Single /dispose/AssetDispose_Approve","Error in try/catch \n" + err.message,userID)
    }
  }


/////////// For Data Grid 

const columns = React.useMemo(() => [
    {
        field: 'isApprove',
        headerName: 'Approve',
        width: 70,
        editable: false,
    },
    {
    field: 'serialNo',
    headerName: 'Serial No',
    width: 100,
    editable: false,
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
        field: 'boxName',
        headerName: 'Box',
        width: 150,
        editable: false,
    },
    {
    field: 'suppliername',
    headerName: 'Supplier',
    width: 200,
    editable: false,
    },
    
    {
        field: 'statfrom',
        headerName: 'Status From',
        width: 150,
        editable: false,
    },
    {
        field: 'statto',
        headerName: 'Status Dispose',
        width: 150,
        editable: false,
    },
    {
        field: 'displayName',
        headerName: 'User',
        width: 150,
        editable: false,
    },
    {
        field: 'disposedate',
        headerName: 'Date',
        width: 150,
        editable: false,
    },

],[]);

/////////// End of Datagrid 

  function sendEmail() {

    let strDate =   utils_getDate();
   
    try {
    var templateParams = {
    email_to: receiverInfo.receiveremail,
    email_sender: appSettings.email_sender,
    reply_to : appSettings.reply_to,
    name: receiverInfo.receivername,
    notes: "Asset is now approve for Dispose",
    date: strDate
};
 
  const allow_send_email_approve_dispose = appSettings.ALLOW_SENDEMAIL_APPROVE_DISPOSE
  if(allow_send_email_approve_dispose === "send")
  {
    emailjs.send(appSettings.YOUR_SERVICE_ID, appSettings.YOUR_TEMPLATE_ID, templateParams,appSettings.public_key)
    .then(function(response) {
       
      WriteUserInfo("Info","DisposeView",userID,
      "Email sent Approve Asset Dispose : "
      + `\nNotes : ` + templateParams.notes,userID)

    }, function(error) {
      WriteUserInfo("Error","DisposeView",userID,
      "Info : " 
      + "Failed sending email Approve Dispose : " + userID + "\n"
      + "Notes : " + templateParams.notes + "\n "
      + "Response : " + error
      ,userID)
    });
  }
  else {
    WriteUserInfo("Info","DisposeView",userID,
    "Approve Asset Dispose : "
    + `\nNotes : ` + templateParams.notes,userID)
  }

  }
  catch(err) {
    console.log(err)
  }
  }

  const handleViewDispose =() => 
  {
    LoadData()
  }
  
  const handleInput =(event) => {
    setDocRef_selectedDispose(event.target.value.trim())
  }
////////// For Dialog Box

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

     
        <CCard className="mb-3" size="sm" >
          <CCardHeader className="mb-3" size="sm">
            <AlertMessages/>
                <h6>
                <span className="message" style={{ color: '#5da4f5'}}> <> Approve Dispose </></span> 
                <br></br>
                <strong><span className="message" style={{ color: colorMessage}}><p>{message}</p></span> </strong>
                </h6>
          </CCardHeader>
          <CCardBody>
          <CForm onSubmit={handleSubmit}>
            <CRow>
                <CCol xs={3} className='mb-3'>
                  <FormControl fullWidth  size="sm" >
                      
                      <InputLabel id="docref">Dispose Reference No.</InputLabel>
                        <Select  className="mb-1" aria-label="Small select example"
                          name='docref' onChange={handleInput} value={docRef_selected_Dispose}
                          error = {
                          docRef_selected_Dispose
                            ? false
                            : true
                          }
                          label="Select Reference No."
                          >
                            { 
                            docRef_Dispose.map((val) => 
                              
                              <MenuItem key={val.docRef_Dispose} value={val.docRef_Dispose} >{val.docRef_Dispose}</MenuItem>

                            )
                            }
                        </Select>
                        <div className="d-grid" style={{
                                display: 'flex',
                                alignItems: 'left',
                                justifyContent: 'left',
                              
                                }}>
                    

                          <CButton onClick={handleViewDispose} style={{  margin:'5px', width: '115%' }} color="info"> Load Dispose Document  </CButton>
                        </div>
                        <div className="d-grid" style={{
                          display: 'flex',
                          alignItems: 'left',
                          justifyContent: 'left',
                          }} >
                          <CButton style={{  margin:'5px', width: '150%' }} color="success" onClick={handleSubmit}>Approve Disposal</CButton>
                        </div>
                  </FormControl>
                </CCol>
                
                <CCol xs={9}>
                <div className="formInput" width='100px' >
                      <img src={
                        DefaulImgDispose
                      }
                      alt="" width={'100%'} height={'200px'} 
                         />
                    </div>
                </CCol>               
            </CRow>
  
          <CRow>
     
                  <CCol >
                
                      <div style={{ height: 400, width: '100%' }}>

                          <DataGrid
                           apiRef={apiRef}
                              rows={dispose}
                              columns={columns}
                              initialState={{
                              pagination: {
                                  paginationModel: {
                                  pageSize: 10,
                                  },
                              },
                              }}
                              checkboxSelection
                              pageSizeOptions={[10]}
                             // rowSelection={true}
                              //getRowId={(row) => row.id}
                              onRowSelectionModelChange={id => SetRowSelected(id)}
                          />
                      </div>
                      
                
                  </CCol>
          </CRow>
              <CRow>

              <Dialog
                      open={open}
                      onClose={handleClose}
                      PaperComponent={PaperComponent}
                      aria-labelledby="draggable-dialog-title"
                    >
                      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                          Dispose
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Are you sure you want to Dispose Asset(s) ?
                          <br></br>
                          <br></br>
                          Selected : {iselected}
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button autoFocus onClick={handleClose}>
                          Cancel
                        </Button>
                        <Button onClick={handleClick}>Approve</Button>
                      </DialogActions>
                </Dialog>
              </CRow>

        </CForm>

          </CCardBody>

        </CCard>
    
    </CCol>
    
    
  )
}

export default DisposeApprove
