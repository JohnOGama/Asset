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
import {  decrypt } from 'n-krypta';

const ViewPullout = () => {

    const navigate = useNavigate();
  var userID = ""

    const [message,setMessage] = useState("")
    const [colorMessage,setColorMessage] = useState('red')

    const [pullout,setPullout] = useState([])
    const [open, setOpen] = React.useState(false);
    const [rowselected,setRowSelected] = useState({ })


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


    const columns = React.useMemo(() => [

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
        {
            field: 'pulloutreceive',
            headerName: 'Receive',
            width: 150,
            editable: false,
        },
        {
            field: 'pulloutdatereceive',
            headerName: 'Date Receive',
            width: 150,
            editable: false,
        },
      ],[]);

    
    function CheckAssetReceive(param)
    {
      try{

          if(userID == "") 
  {
    getUserInfo()
  }

        setMessage("")
        let rowId = param
        const url = 'http://localhost:3001/pullout/checkpulloutnotification'
        axios.post(url,{rowId,userID})
        .then(res => {
          const dataResponse = res.data.message;
          if(dataResponse == "Record Found") {
            SingleCheckIn(param)
          }
          else if (dataResponse == "No Record Found") {

            WriteLog("Message","ViewPullout","CheckAssetReceive /pullout/checkpulloutnotification ","Asset previously received ( " + rowId + " )",userID)

          }
        }).catch(err => {
          WriteLog("Error","ViewPullout","CheckAssetReceive /pullout/checkpulloutnotification"," Error then/catch \n " + err.message,userID)
         
        })
      }
      catch(err){
        WriteLog("Error","ViewPullout","CheckAssetReceive /pullout/checkpulloutnotification"," Error try/catch \n " + err.message,userID)
      }
    }

    function SingleCheckIn(param) {
        
        try{
  if(userID == "") 
  {
    getUserInfo()
  }
          let rowId = param
          const url = 'http://localhost:3001/pullout/updatepulloutnotification'
          axios.post(url,{rowId,userID})
          .then(res => {
            const dataResponse = res.data.message;

            if(dataResponse == "Update Success") {
              WriteLog("Message","ViewPullout","SingleCheckIn /pullout/updatepulloutnotification", 
              " Receive Pullout " 
              + "\n Detail ID : " + rowId 
              + " \n Purpose : " + "Mark pullout as receive"
              + "\n User : " + userID ,userID)
            }
            if (dataResponse == "Update Error") {
              WriteLog("Error","ViewPullout","SingleCheckIn /pullout/updatepulloutnotification","Selected asset not updated \n " + 
              "Asset ID : " + rowId 
              + "\n " + res.data.message2,userID)
              
            }
          }).catch(err => {
            WriteLog("Error","ViewPullout","SingleCheckIn /pullout/updatepulloutnotification",err.message,userID)
           
          })
        }
        catch(err){
          WriteLog("Error","ViewPullout","SingleCheckIn /pullout/updatepulloutnotification",err.message,userID)
        }
       
    }

    function ProcessCheckin(event)
    {
      event.preventDefault
      let num = 0;
      try {
      setOpen(false)
      
      rowselected.forEach((irow,index) => {
        num = num + index
        CheckAssetReceive(irow)
      })
      
      
      }
      catch {
        num = 0
      }
      finally {
        navigate('/base/assetview')
      }
    }
      
function handleClose(){
  setOpen(false)
}
function handleOpen(){
  setOpen(true)
}

useEffect(() => {

      LoadData();

  },[])

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
        //setMessage("No Record Found")
        //setColorMessage("red")
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
                                
                                checkboxSelection
                                disableRowSelectionOnClick
                                //onRowSelectionModelChange={id,assetID => setRowSelected({detailid:id,assetid:assetID})}
                                onRowSelectionModelChange={(id) => setRowSelected(id)}
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
                            {"You acknowledge asset will be receive from user \n advice and will be checkin to IT !"}
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

                <div className="d-grid" style={{
                            
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            }} >
                      <CButton style={{   width: '150%' }} onClick={handleOpen} color="success">Process Receive</CButton>
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
