
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

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import { ButtonGroup } from '@mui/material';


function AssetPullout() {
  const navigate = useNavigate();

  var userID = ""
  let displayname = ""


    const [success,SetSuccess] = useState("");
    const [errors,setErrors] = useState({})
    const [message,setMessage] = useState("")
    const [colorMessage,setColorMessage] = useState('red')

    const [assetstatus, setAssetStatus] = useState([]); // bind to status options
    const [assetID,setAssetStatID] = useState(""); /// receive selected status
    const [notes,setNotes] = useState(""); // receive notes 

function getUserInfo() {

  if((!window.localStorage.getItem('id') == null) || (window.localStorage.getItem('id') !== "0")) {
      userID = decrypt(window.localStorage.getItem('id'), appSettings.secretkeylocal)
      
  }
  else{ 
      navigate('/login')
  }
}

useEffect(() => {
    getUserInfo()
  }, [])

      
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
const [iselected,SetTotalSelected] = useState(0)

const handleClickOpen = () => {
  try {
  
  let num = 0

    rowselecteddetail.forEach((irow, index) => { 
      num = num + 1;
    })
    
    if(num > 0) {
      setOpen(true);
      SetTotalSelected(num)
    }
    else
    {
      setMessage('No asset selected')
      setColorMessage('red')
    }



}
catch(err) {
  console.log(err)
}
};

useEffect(() => { 
 // console.log()
},[iselected])



/// For Dialog
const handleClose = () => {
  setOpen(false);
};

function handleViewPullout() {
  navigate('/configurations/viewpulloutuser')
}

const handlePullout = () => {
  setOpen(true);
try {
      if(userID == "") 
  {
    getUserInfo()
  }

    rowselecteddetail.forEach((irow, index) => {
      const detailid = irow
     
      const url = 'http://localhost:3001/assets/pulloutasset_selectedbyuser'
      axios.post(url,{userID,detailid,assetID,notes})
      .then(response => {
        const dataResponse = response.data.message;
        if(dataResponse == "Update Success") {

          WriteLog("Message","AssetPullout","handlePullout /assets/pulloutasset_selectedbyuser", 
          " User advice for pullout "
          + "\n AssetID: " + assetID 
          + "\n Detail ID  :  " + detailid 
          + "\n Reason for Pullout :  " + notes
          + "\n User : " + userID ,userID)
        }
        else if (dataResponse == "Update Error") {
          // only capturing the error
          WriteLog("Error","AssetPullout","handlePullout /assets/pulloutasset_selectedbyuser'",
          "AssetID : " + detailid
          + "\n Detail ID  :  " + detailid 
          + "\n Reason for Pullout :  " + notes
          + "\n " + response.data.message2,userID)
        }
      }).catch(err => {
        WriteLog("Error","AssetPullout","handlePullout /assets/pulloutasset_selectedbyuser'","Error in then/catch " + err.message,userID)
      })
    })

    rowselecteddetail.forEach((nrow, index) => {

      try {
        if(userID == "") 
        {
        getUserInfo()
        }

        const detailID = nrow
        const url = 'http://localhost:3001/assets/asset_bydetail'
        axios.post(url,{detailID})
        .then(res => {
      
          const dataResponse = res.data.message;
          
          if(dataResponse == "Record Found") {
            const varasset = res.data.result[0]['assetID']
           
            UpdateMain_Asset(varasset)
          } 
        }).catch(err => {
          WriteLog("Error","AssetPullout","handlePullout /assets/asset_bydetail'"," Error in then/catch(UpdateMain_Asset) " + err.message,userID)
        })
      }catch(err) {
        WriteLog("Error","AssetPullout","handlePullout /assets/asset_bydetail'",err.message,userID)
      }
      
    })

    setOpen(false);
}catch(err) {
  setOpen(false)
  WriteLog("Error","AssetPullout","handlePullout /assets/asset_bydetail'","Error in main try/catch  " + err.message,userID)
}
finally {
  sendEmail()
  navigate('/base/assetbyuser')
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

  const [assets, setAssets] = useState([])
  const [rowselecteddetail,setRowSelecteddetail] = useState({})

  const columns = [
    
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


  useEffect(() => {
    LoadAsset()
  },[])

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
          //SetSuccess("No Assets Deployed")
          //navigate('/500');
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


  function sendEmail() {

    let strDate =   utils_getDate();
    displayname = window.localStorage.getItem('display')
    try {
        var templateParams = {
        email_to: appSettings.ASSET_EMAIL,
        email_sender: appSettings.email_sender,
        reply_to : appSettings.reply_to,
        name: appSettings.ASSET_RECEIVERNAME,
        notes: notes,
        date: strDate,
        user_name: displayname
    };

    emailjs.send(appSettings.USER_SERVICE_ID, appSettings.USER_TEMPLATE_ID, templateParams,appSettings.public_key)
    .then(function(response) {
       console.log('SUCCESS!', response.status, response.text);
    }, function(error) {
       console.log('FAILED...', error);
    });

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
                      <CButton onClick={handleClickOpen} style={{ margin:'5px', width: '120%' }}  color="success"> Pullout</CButton>
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
                            <br></br>
                            Selected : ({ iselected })
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
                        checkboxSelection
                        disableRowSelectionOnClick
                        onRowSelectionModelChange={id => setRowSelecteddetail(id)}
                        
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
