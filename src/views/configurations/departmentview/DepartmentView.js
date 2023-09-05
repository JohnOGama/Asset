import  { useEffect, useState } from 'react'
import axios from 'axios'
import * as React from 'react'

import { DataGrid } from '@mui/x-data-grid';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';

import {useNavigate} from 'react-router-dom';
import {useLocation} from 'react-router-dom';
import appSettings from 'src/AppSettings' // read the app config
import { encrypt, decrypt, compare } from 'n-krypta';
import WriteLog from 'src/components/logs/LogListener';

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

  const DepartmentView = () => {

    const navigate = useNavigate();
    var userID = ""
    var userRole = ""

    const [message,setMessage] = useState("")
    const [colorMessage,setColorMessage] = useState('red')

    const [department,setDepartment] = useState([])
    const [open, setOpen] = React.useState(false);
    const [rowselected,SetRowSelected] = useState("")


    function CheckRole() {
      try {
  
        userRole = decrypt(window.localStorage.getItem('Kgr67W@'), appSettings.secretkeylocal)
  
      }
      catch(err) {
        WriteLog("Error","DepartmentView","CheckRole Local Storage is tampered", err.message,userID)
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
           
              <EditTwoToneIcon cursor="pointer" onClick={()=> handleClick(params.row.id)}/>
              <DeleteOutlineTwoToneIcon cursor="pointer" onClick={()=> handleClickOpen(params.row.id)}/>
              
            </div>

          );
        }
      },
        {
          field: 'departmentName',
          headerName: 'Status Name',
          width: 200,
          editable: false,
        },
        {
          field: 'description',
          headerName: 'Description',
          width: 300,
          editable: false,
        },
      ],[]);

function handleNew(params) {
  params = ""
  navigate('/configurations/department',{state:{params}})
    
  }

  function handleClick(params) {

    navigate('/configurations/department',{state:{params}})
    
  }

  useEffect(() => {
    //setOpen(true);
  }, [rowselected])

  const handleClickOpen = (param) => {

      setMessage("")
      checkDepartment(param)
      SetRowSelected(param)
  };

  const handleClose = () => {
    setOpen(false);
    setMessage("")
  };


  function checkDepartment(param) {
  try {
    if(userID == "") 
    {
      getUserInfo()
    }
    let rowId = param
    const url = 'http://localhost:3001/department/checkDepartmentfordelete'
    axios.post(url,{rowId})
    .then(res => {
      const dataResponse = res.data.message;
      if(dataResponse == "Record Found") {
        setMessage("Department selected still in use")
        setColorMessage('red')
        setOpen(false);
      } else if (dataResponse == "No Record Found") {
        setOpen(false);
      }
    }).catch(err => {
      WriteLog("Error","DepartmentView","checkDepartment /assets/checkDepartmentfordelete",err.message,userID)
      setMessage("Error in checking Department ")
      setColorMessage('red')
    })

  }
  catch(err) {
    WriteLog("Error","DepartmentView","checkDepartment /assets/checkDepartmentfordelete","Error in try/catch \n" + err.message,userID)
  }
    }

  function handleDelete() {
  try {
    if(userID == "") 
    {
      getUserInfo()
    }

    let rowId = rowselected
  const url = 'http://localhost:3001/department/deleteDepartment'
  axios.post(url,{rowId})
  .then(res => {
    const dataResponse = res.data.message;
    if(dataResponse == "Record Deleted") {
      setOpen(false)
      LoadData()
      //window.location.reload();
    } else if (dataResponse == "No Record Deleted") {
      WriteLog("Error","DepartmentView","handleDelete /assets/deleteDepartment",res.data.message2,userID)
      setMessage("No record deleted")
      setColorMessage("red")
    }
  }).catch(err => {
    WriteLog("Error","DepartmentView","handleDelete /assets/deleteDepartment",err.message,userID)
  
  })

  }
  catch(err) {
    WriteLog("Error","DepartmentView","handleDelete /assets/deleteDepartment","Error in try/catch \n" + err.message,userID)
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
      
      const url = 'http://localhost:3001/department/viewalldepartment'
      axios.post(url)
      .then(res => {
        const dataResponse = res.data.message;
        if(dataResponse == "Record Found") {
          setDepartment(res.data.result)
        } else if (dataResponse == "No Record Found") {
            setMessage("No Record Found")
            setColorMessage("red")
            WriteLog("Error","DepartmentView","handleDelete /assets/viewalldepartment",dataResponse,userID)
        }
      }).catch(err => {
        WriteLog("Error","DepartmentView","handleDelete /assets/viewalldepartment",err.message,userID)
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
        <span className="message" style={{ color: '#5da4f5'}}> <> Department </></span> 
        <br></br>
        <strong><span className="message" style={{ color: colorMessage}}><p>{message}</p></span> </strong>
        </h6>
      </CCardHeader>
     
      <CForm >
        <CRow >
            <CCol xs={12}>
              <CCardBody>
              <CButton className="text-right" onClick={handleNew} >Create New </CButton>
                <CInputGroup size="sm" className="mb-3">
                        <div style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={department}
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
                          Status
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

export default DepartmentView
