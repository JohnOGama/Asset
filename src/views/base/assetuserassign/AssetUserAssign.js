// eslint-disable-next-line
import  { useEffect, useState } from 'react'
import axios from 'axios'
import * as React from 'react'

//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
//import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
//import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
//import { DatePicker } from '@mui/x-date-pickers/DatePicker';


// input Mask

//import PropTypes, { bool } from 'prop-types';
//import { IMaskInput } from 'react-imask';
//import { NumericFormat } from 'react-number-format';
//import Box from '@mui/material/Box';
//import Input from '@mui/material/Input';
//import InputLabel from '@mui/material/InputLabel';
//import TextField from '@mui/material/TextField';
//import FormControl from '@mui/material/FormControl';

import { DataGrid } from '@mui/x-data-grid';


//

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
  //CFormSelect,
  //CFormInput,
  //CInputGroupText,
  CInputGroup,
  //CFormLabel,
  //CFormFloating
} from '@coreui/react'

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';


import {useNavigate} from 'react-router-dom';

import appSettings from 'src/AppSettings' // read the app config
import {  decrypt } from 'n-krypta';
//encrypt, compare

import WriteLog from 'src/components/logs/LogListener';

const AssetUserAssign = () => {

  const navigate = useNavigate();

  let userID = ""

  //const [success,SetSuccess] = useState("");
  //const [errors,setErrors] = useState({})
  const [message,setMessage] = useState("")
  const [colorMessage,setColorMessage] = useState('red')
  
  const [assets,setAssets] = useState([])
  const [assetstat,setAssetStat] = useState("") // deployed
  const [assetstatfordeploy,setAssetForDeploy] = useState("") // for deploy
  const [rowselected,setRowSelected] = useState({})

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


  useEffect(() => {
    //console.log
    }, [assets])
    
    useEffect(() => {
     
      try {
        if(userID == "") 
        {
        getUserInfo()
        }
        const url = 'http://localhost:3001/assets/viewallassetsassignfordeploy'
        axios.post(url,{userID})
       
        .then(res => {
          const dataResponse = res.data.message;
         
          if(dataResponse == "Record Found") {
            
            setAssets(res.data.result)
          } 
        }).catch(err => {
          WriteLog("Error","AssetUserAssign","useEffect /assets/viewallassetsassignfordeploy",err.message,userID)
        })
    
      }catch(err) {
        WriteLog("Error","AssetUserAssign","useEffect /assets/viewallassetsassignfordeploy",err.message,userID)
      }
      
    }, [])
  


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

  const handleClickOpen = (event) => {
    try {
      event.preventdefault
    setOpen(true);
    let num = 0
      rowselected.forEach((irow, index) => { 
      //num = num + 1;
      num = index + 1
    })
    SetTotalSelected(num)
  }
  catch(err) {
    console.log(err)
  }
  };

  useEffect(() => { 
    console.log()
  },[iselected])
  

  /// For Dialog
  const handleClose = () => {
    setOpen(false);
  };

  const handleCheckin = (event) => {

    event.preventdefault
    setOpen(true);
  try {

      if(userID == "") 
  {
    getUserInfo()
  }
       rowselected.forEach((irow) => {
     
        const assetid = irow
        const url = 'http://localhost:3001/assets/checkinassetsdetail'
        axios.post(url,{userID,assetid,assetstatfordeploy,assetstat})
        .then(response => {
          const dataResponse = response.data.message;
          if(dataResponse == "Update Success")
          {

            UpdateAssetDeployed(assetid)
            // Then write sa History for markings
            WriteLog("Message","AssetUserAssign","handleCheckin /assets/checkinassetsdetail", 
                    "User asset received or checkin "
                    + "\n AssetID: " + assetid 
                    + "\n Status From :  " + assetstatfordeploy 
                    + "\n Status To :  " + assetstat
                    + "\n Receive by : " + userID ,userID)
          }
          else if (dataResponse == "Update Error") {
            WriteLog("Error","AssetUserAssign","handleCheckin /assets/checkinassetsdetail'",response.data.message2,userID)
          }
        }).catch(err => {
          WriteLog("Error","AssetUserAssign","handleCheckin /assets/checkinassetsdetail'",err.message,userID)
      })
    })
   
      
  }catch(err) {
    setOpen(false)

  }
  finally {
    setOpen(false);
    navigate('/dashboard')
  }

  };

  function UpdateAssetDeployed(assetid) {
    try {

        if(userID == "") 
  {
    getUserInfo()
  }

      const assetdeploy = assetstat
      
      const varassetid = assetid
    const url = 'http://localhost:3001/assets/updateassetdeploy'
    axios.post(url,{assetdeploy,userID,varassetid})
    .then(res => {
      const dataResponse = res.data.message;
      if(dataResponse == "Record Found") {
        setAssets(res.data.result)
      } else if (dataResponse == "No Record Found") {
        WriteLog("Message","AssetUserAssign","UpdateAssetDeployed /assets/updateassetdeploy",dataResponse,userID)
        //navigate('/500');
      }
    }).catch(err => {
      WriteLog("Error","AssetUserAssign","UpdateAssetDeployed /assets/updateassetdeploy",err.message,userID)
    })

    }catch(err) {
      WriteLog("Error","AssetUserAssign","UpdateAssetDeployed /assets/updateassetdeploy",err.message,userID)
    }

  }

  /// End of Dialog

function LoadData() {
  try {
     if(userID == "") 
  {
    getUserInfo()
  }
    const url = 'http://localhost:3001/assets/viewallassetsassignfordeploy'
    axios.post(url,{userID})
    .then(res => {
      const dataResponse = res.data.message;
     
      if(dataResponse == "Record Found") {

        setAssets(res.data.result)
      } 
    }).catch(err => {
      WriteLog("Error","AssetUserAssign","LoadData /assets/viewallassetsassignfordeploy",err.message,userID)
    })

  }catch(err) {
    WriteLog("Error","AssetUserAssign","LoadData /assets/viewallassetsassignfordeploy",err.message,userID)
  }
}



  useEffect(() => {
  if(userID == "") 
  {
    getUserInfo()
  }
    const url = 'http://localhost:3001/assets/getassetfordeploystatus'
    axios.post(url)
    .then(response => {
      const dataResponse = response.data.message;
      if(dataResponse == "Record Found") {
        setAssetForDeploy(response.data.result[0]['assetStatusID'])
       
      } else if (dataResponse == "No Record Found") {
        WriteLog("Message","AssetUserAssign","useEffect /assets/getassetfordeploystatus",dataResponse,userID)
        //navigate('/500');
      }
    }).catch(err => {
      WriteLog("Error","AssetUserAssign","useEffect /assets/getassetfordeploystatus",err.message,userID)
    })
  },[])


  useEffect(() => {
      if(userID == "") 
  {
    getUserInfo()
  }
    const url = 'http://localhost:3001/assets/getassetstatdeploy'
    axios.post(url)
    .then(res => {
      const deployResponse = res.data.message;
      if(deployResponse == "Record Found") {
        setAssetStat(res.data.result[0]['assetStatusID'])
      } else if (deployResponse == "No Record Found") {
        WriteLog("Message","AssetUserAssign","useEffect /assets/getassetstatdeploy",deployResponse,userID)
        //navigate('/500');
      }
    }).catch(err => {
      WriteLog("Message","AssetUserAssign","useEffect /assets/getassetstatdeploy",err.message,userID)
    })
  },[])


/// For Data Grid 

const columns = [
    
  {
    field: 'assetCode',
    headerName: 'Asset Code',
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
    field: 'statusName',
    headerName: 'Status',
    width: 100,
    editable: false,
  },
  {
    field: 'assetCategName',
    headerName: 'Category',
    width: 150,
    editable: false,
  },
  {
    field: 'displayName',
    headerName: 'Checkout By',
    width: 130,
    editable: false,
  },
  {
    field: 'datecheckout',
    headerName: 'Date Checkout',
    width: 130,
    editable: false,
  },
];

/////// end of DGrid

  return (
    
      <CCol xs={12}>
        <CCard className="mb-3" size="sm"  >
          <CCardHeader>
            <h6>
            <span className="message" style={{ color: '#5da4f5'}}> <> Asset Checkin</></span> 
            <br></br>
            <strong><span className="message" style={{ color: colorMessage}}><p>{message}</p></span> </strong>
            </h6>
          </CCardHeader>
          <CForm   >
            <CRow >
                <CCol xs={12}>
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
                                    onRowSelectionModelChange={id => setRowSelected(id)}
                                />
                            </div>
                        </CInputGroup>
                  </CCardBody>
                </CCol>
                <div className="d-grid" style={{
                            
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            }} >
                      <CButton style={{   width: '150%' }} onClick={handleClickOpen} color="success">Checkin</CButton>
                </div>
                      <Dialog
                        open={open}
                        onClose={handleClose}
                        PaperComponent={PaperComponent}
                        aria-labelledby="draggable-dialog-title"
                      >
                        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                          CheckIn
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Are you sure you want to Checkin / Receive  asset(s) ?
                            <br></br>
                            Selected : ({ iselected })
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button autoFocus onClick={handleClose}>
                            Cancel
                          </Button>
                          <Button onClick={handleCheckin}>CheckIn</Button>
                        </DialogActions>
                      </Dialog>
                
            </CRow>
          </CForm>
        </CCard>
      </CCol>

  )
}

export default AssetUserAssign
