import  { useEffect, useState } from 'react'
import axios from 'axios'
import * as React from 'react'

import { DataGrid } from '@mui/x-data-grid';

import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
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
import { decrypt } from 'n-krypta';
// encrypt, compare
const LogActivity = () => {

    const navigate = useNavigate();
    var userID = ""

    //const [success,SetSuccess] = useState("");
    //const [errors,setErrors] = useState({})
    const [message,setMessage] = useState("")
    const [colorMessage,setColorMessage] = useState('red')

    const [log,setLog] = useState([])
    const [open, setOpen] = React.useState(false);
    //const [rowselected,SetRowSelected] = useState("")


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

//cursor="pointer" onClick={()=> handleClick(params.row.id)}
    const columns = React.useMemo(() => [
      {
        field: 'id',
        headerName: 'Detail',
        type: 'actions',
        disableClickEventBubbling: true,
        renderCell: (params) => {
          return (
            <div >
                
              <ReceiptLongRoundedIcon />
            </div>

          );
        }
      },
      {
        field: 'logtype',
        headerName: 'Activity',
        width: 100,
        editable: false,
      },
      {
        field: 'displayName',
        headerName: 'User',
        width: 100,
        editable: false,
      },
      {
        field: 'dateatecreated',
        headerName: 'Date',
        width: 100,
        editable: false,
      },

        
      ],[]);


       function handleClick(params) {

        // console.log("This " + params)
         navigate('/configurations/log',{state:{params}})
         
       }


  //const handleClickOpen = (param) => {

   ///   setMessage("")
   //   SetRowSelected(param)
      //checkUserPosition(param)
     
//  };

  const handleClose = () => {
    setOpen(false);
  };

  function handleSubmit() {
      LoadData()
  }

useEffect(() => {
    LoadData()
  },[])
    
function LoadData(){
    if(userID == "") 
  {
    getUserInfo()
  }
  
  const url = 'http://localhost:3001/log/viewallLogs'
  axios.post(url)
  .then(res => {
    const dataResponse = res.data.message;
    if(dataResponse == "Record Found") {
        setLog(res.data.result)
    } 
  }).catch(err => {
    WriteLog("Error","LogView","Load log/viewallLogs","Error in try/catch " + err.message,userID)
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
     

      <CForm >
        <CRow >
            <CCol xs={12}>
              <CCardBody>
              <span className="message" style={{ color: colorMessage}}><p>{message}</p></span> 

                <CInputGroup size="sm" className="mb-3">
                        <div style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={log}
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
                          Position
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Are you sure you want to Delete ?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button autoFocus onClick={handleClose}>
                            No
                          </Button>
                          <Button>Yes</Button>
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

export default LogActivity
