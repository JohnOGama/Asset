import  { useEffect, useState } from 'react'
import axios from 'axios'
import * as React from 'react'

import { DataGrid } from '@mui/x-data-grid';

import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

import {useNavigate} from 'react-router-dom';

import WriteLog from 'src/components/logs/LogListener';
import appSettings from 'src/AppSettings' // read the app config
import {  decrypt } from 'n-krypta';

import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CForm,
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

  const UserView = () => {

    const navigate = useNavigate();
     var userID = ""
     var rowSelectedID = "" // user selected
     const [irowSelectedID,setRowSelected] = useState("")
    

    const [message,setMessage] = useState("")
    const [colorMessage,setColorMessage] = useState('red')

    const [users,setUsers] = useState([])
    const [open, setOpen] = React.useState(false);
    

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
        field: 'id',
        headerName: 'Actions',
        type: 'actions',
        disableClickEventBubbling: true,
        renderCell: (params) => {
          return (
            <div >
            { /* <EditTwoToneIcon cursor="pointer" onClick={()=> handleClick(params.row.id,"For Edit")}/>
             */ }
              <DeleteOutlineTwoToneIcon cursor="pointer" onClick={()=> handleClick(params.row.id)}/>
            </div>

          );
        }
      },
        {
          field: 'categoryName',
          headerName: 'Category',
          width: 100,
          editable: false,
        },
        {
          field: 'departmentName',
          headerName: 'Department',
          width: 150,
          editable: false,
        },
        
        {
          field: 'positionName',
          headerName: 'Position',
          width: 250,
          editable: false,
        },
        {
          field: 'fullname',
          headerName: 'Employee',
          width: 250,
          editable: false,
        },
        {
          field: 'displayName',
          headerName: 'Display',
          width: 150,
          editable: false,
        },
        {
          field: 'email',
          headerName: 'Email',
          width: 100,
          editable: false,
        },
        {
          field: 'active',
          headerName: 'Active',
          width: 50,
          editable: false,
          boolean: true,
        },

      ],[]);


  function handleClick(paramID) {

    try {
      setRowSelected(paramID);
      CheckUserfordelete(paramID)
    
    }
    catch(err) {
      WriteLog("Error","UserView","handleClick /users/checkUserfordelete",err.message,userID)
    }

  };



  function CheckUserfordelete(rowId)  {
    
    try {

      const  url ='http://localhost:3001/users/checkUserfordelete'
       axios.post(url,{rowId})
       
      .then(response => {
        const dataResponse = response.data.message;
      
        if(dataResponse == "Record Found") {
           setMessage('User still with asset(s) tag')
           setColorMessage('re')
        } else {
          rowSelectedID = rowId
          setOpen(true);
          setMessage("")
          setColorMessage('')
        }

      })
      .catch(err => {
        WriteLog("Error","UserView","CheckUserAssets /users/checkUserfordelete","Error in try/catch " + err.message,userID)
      })

     
     

    }
    catch(err) {
      WriteLog("Error","UserView","CheckUserAssets /users/checkUserfordelete","Error in try/catch " + err.message,userID)
    }
  
  
  }


  const handleClose = () => {
    setOpen(false);
    setMessage("")
  };



  function handleDelete() {
  try {
    if(userID == "") 
    {
      getUserInfo()
    }

      console.log(irowSelectedID)
      const url = 'http://localhost:3001/users/deleteUser'
      axios.post(url,{irowSelectedID})
      .then(res => {
        const dataResponse = res.data.message;
        if(dataResponse == "Record Deactivated") {
          setOpen(false)
          WriteLog("Message","UserView","handleDelete /users/deleteUser", 
          " Deactivated Employee "
          + "\n EmployeeID: " + irowSelectedID
          + "\n Deleted By  : " + userID ,userID)
          setOpen(false)
          LoadData()
          
        } else if (dataResponse == "No Record Deactivated") {
          setOpen(false)
          setMessage("No record deactivated")
          setColorMessage("red")
          WriteLog("Error","UserView","handleDelete /users/deleteUser","No Record Deactivated \n" + res.data.message,userID)
          
        }
      }).catch(err => {
        WriteLog("Error","UserView","handleDelete /users/deleteUser","Error in then/catch \n" + err.message,userID)
        setOpen(false)
      })

  }
  catch(err) {
    WriteLog("Error","UserView","handleDelete /users/deleteUser",err.message,userID)
    setOpen(false)
  }
    }


  useEffect(() => {
      LoadData()
    },[])
    
    function LoadData(){
        if(userID == "") 
        {
          getUserInfo()
        }
  
      const url = 'http://localhost:3001/users/viewallusers'
      axios.post(url)
      .then(res => {
        const dataResponse = res.data.message;
        if(dataResponse == "Record Found") {
          setUsers(res.data.result)
        } else if (dataResponse == "No Record Found") {
            setMessage("No Record Found")
            setColorMessage("red")
            WriteLog("Message","UserView","LoadData /users/viewallusers",res.data.message,userID)
        }
      }).catch(err => {
        WriteLog("Error","UserView","LoadData /users/viewallusers",err.message,userID)
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
        <h6>
        <span className="message" style={{ color: '#5da4f5'}}> <> Employee(s) </></span> 
        <br></br>
        <strong><span className="message" style={{ color: colorMessage}}><p>{message}</p></span> </strong>
        </h6>
      </CCardHeader>
     
      <CForm >
        <CRow >
            <CCol xs={12}>
              <CCardBody>
             
                <CInputGroup size="sm" className="mb-3">
                        <div style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={users}
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
                          Employee
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
                          <Button onClick={handleDelete}>Yes</Button>
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

export default UserView
