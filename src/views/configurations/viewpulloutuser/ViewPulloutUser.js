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
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import GeneratePulloutDocPDF from 'src/components/generatereport/GeneratePulloutDocPDF';



const ViewPulloutUser = () => {

    const navigate = useNavigate();
    var userID = ""
    var userRole = ""

    const [message,setMessage] = useState("")
    const [colorMessage,setColorMessage] = useState('red')

    const [pullout,setPullout] = useState([])
    const [open, setOpen] = React.useState(false);
    const [rowselected,setRowSelected] = useState({ })

    const [docRef_Pullout,setDocRef_Pullout] = useState([])
    const [docRef_selected,setdocRef_selected] = useState("")

    function CheckRole() {
      try {
  
        userRole = decrypt(window.localStorage.getItem('Kgr67W@'), appSettings.secretkeylocal)
  
      }
      catch(err) {
        WriteLog("Error","ViewPulloutUser","CheckRole Local Storage is tampered", err.message,userID)
        navigate('/dashboard')
      }
    }


    function getUserInfo() {

      try {
        CheckRole()
   //       if (userRole == "Admin" || userRole == "IT")
    //        {
                if((!window.localStorage.getItem('id') == null) || (window.localStorage.getItem('id') !== "0")) {
                  userID = decrypt(window.localStorage.getItem('id'), appSettings.secretkeylocal)
                
                }else{ 
                  navigate('/login')
             }
   //         }
  //        else {
  //          navigate('/dashboard')
  //        }
            
          }
      catch(err) {
        navigate('/dashboard')
        }
    }

    useEffect(() => {
      getUserInfo();
      LoadData();
      LoadDocPull();
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
              setMessage("Selected asset not updated")
              setColorMessage("red")
              WriteLog("Error","ViewPullout","SingleCheckIn /pullout/updatepulloutnotification","Selected asset not updated ( " + rowId + " )",userID)
              
            }
          }).catch(err => {
            WriteLog("Error","ViewPullout","SingleCheckIn /pullout/updatepulloutnotification",err.message,userID)
           
          })
        }
        catch(err){
          WriteLog("Error","ViewPullout","SingleCheckIn /pullout/updatepulloutnotification",err.message,userID)
        }
       
    }

    function ProcessCheckin()
    {
      let num = 0;
      try {
      setOpen(false)
      
      rowselected.forEach((irow,index) => {
        num = num + index
        CheckAssetReceive(irow)
      })
      
      LoadData();
      }
      catch {
        num = 0
      }
    }
      
function handleClose(){
  setOpen(false)
}
function handleOpen(){
  setOpen(true)
}

function handleInput(e) {
  // setdocRef_selected(e.targ)
   setdocRef_selected(e.target.value.trim())
 }



function LoadData(){
  if(userID == "") 
  {
    getUserInfo()
  }
  const url = 'http://localhost:3001/pullout/viewallpullout'
  axios.post(url,{userID})
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


function LoadDocPull() {

  try {
    if (userID === "") {
      getUserInfo();
    }

    const url = "http://localhost:3001/pullout/viewallpullout_by_docRefPullout";
    axios.post(url, { userID })
      .then((res) => {
        const dataResponse = res.data.message;
     
        if (dataResponse == "Record Found") {
          setDocRef_Pullout(res.data.result);
        }
        else {
          setDocRef_Pullout([])
        }
      })
      .catch((err) => {
        WriteLog(
          "Error",
          "ViewPulloutUser",
          "LoadDocPull /assets/viewallpullout_by_docRefPullout",
          err.message,
          userID
        );
      });
  } catch (err) {
    WriteLog(
      "Error",
      "ViewPulloutUser",
      "LoadDocPull /assets/viewallpullout_by_docRefPullout",
      err.message,
      userID
    );
  }

}

function GeneratePDF() {
  
  try {
    if (userID === "") {
      getUserInfo();
    }
    const docref = docRef_selected
    const url = "http://localhost:3001/pullout/viewallpullout_by_selected_docRefPullout";
    axios.post(url, { userID,docref })
      .then((res) => {
        const dataResponse = res.data.message;

        if (dataResponse == "Record Found") {
         
          console.log(res.data.result)
          console.log('ralph')
          GeneratePulloutDocPDF( res.data.result,docref)
          
        }
      })
      .catch((err) => {
        WriteLog(
          "Error",
          "ViewPulloutUser",
          "GeneratePDF /pullout/viewallpullout_by_selected_docRefPullout",
          err.message,
          userID
        );
      });
  } catch (err) {
    WriteLog(
      "Error",
      "ViewPulloutUser",
      "GeneratePDF /pullout/viewallpullout_by_selected_docRefPullout",
      err.message,
      userID
    );
  }

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
        <strong>User Pullout <span className="message" style={{ color: colorMessage}}><p>{message}</p></span> </strong>
      </CCardHeader>
      <CForm >
      <CCardBody>
      
        <CRow>
      
          <CCol xs={3}>

          <FormControl fullWidth className="mb-3"  size="sm"  >
                  <InputLabel id="docref">CheckIn Document Reference No.</InputLabel>
                    <Select  className="mb-3" aria-label="Small select example"
                      name='docref' onChange={handleInput} value={docRef_selected}
                      error = {
                      docRef_selected
                        ? false
                        : true
                      }
                      label="Checkin Reference No."
                      >
                        { 
                        docRef_Pullout.map((val) => 
                          
                          <MenuItem key={val.docRef_Pullout} value={val.docRef_Pullout} >{val.docRef_Pullout}</MenuItem>

                        )
                        }
                    </Select>
      
          <CButton
          style={{ width: "100%" }}
          onClick={GeneratePDF}
          color="info"
          >
          Print Pullout Document
          </CButton>
          </FormControl>
          </CCol>
         
        </CRow>
        <br></br>
        <CRow >
            <CCol xs={12}>
            
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
        
            </CCol>
        </CRow>
        </CCardBody>
      </CForm>
    </CCard>
  </CCol>

                            
  )
}

export default ViewPulloutUser
