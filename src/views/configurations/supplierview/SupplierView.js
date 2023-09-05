import  { useEffect, useState } from 'react'
import axios from 'axios'
import * as React from 'react'

import { DataGrid } from '@mui/x-data-grid';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';

import appSettings from 'src/AppSettings' // read the app config
import {  decrypt } from 'n-krypta';
// encrypt, compare
import WriteLog from 'src/components/logs/LogListener';

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

function SupplierView() {

    const navigate = useNavigate();
 
    var userID = ""
    var userRole = ""
    //const [success,SetSuccess] = useState("");
    //const [errors,setErrors] = useState({})
    const [message,setMessage] = useState("")
    const [colorMessage,setColorMessage] = useState('red')

    const [supplier,setSupplier] = useState([])
    const [open, setOpen] = React.useState(false);
    const [rowselected,SetRowSelected] = useState("")

    function CheckRole() {
      try {
  
        userRole = decrypt(window.localStorage.getItem('Kgr67W@'), appSettings.secretkeylocal)
  
      }
      catch(err) {
        WriteLog("Error","SupplierView","CheckRole Local Storage is tampered", err.message,userID)
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
           
              <EditTwoToneIcon cursor="pointer" onClick={()=> handleEdit(params.row.id)}/>
              <DeleteOutlineTwoToneIcon cursor="pointer" onClick={()=> handleClickOpen(params.row.id)}/>
              
            </div>

          );
        }
      },
        {
          field: 'name',
          headerName: 'Name',
          width: 250,
          editable: false,
        },
        {
          field: 'contactno',
          headerName: 'Contact No',
          width: 150,
          editable: false,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 150,
            editable: false,
          },
        
      ],[]);

      function handleNew(params) {
        params = ""
        // console.log("This " + params)
         navigate('/configurations/supplier',{state:{params}})
         
       }

       function handleEdit(params) {

        // console.log("This " + params)
         navigate('/configurations/supplier',{state:{params}})
         
       }

       useEffect(() => {
        //setOpen(true);
      }, [rowselected])
    
      const handleClickOpen = (param) => {
     
        setMessage("")
        SetRowSelected(param)
        checkStatus(param)

      };
    
      const handleClose = () => {
        setOpen(false);
      };



      function checkStatus(param) {
        try {
          if(userID == "") 
          {
            getUserInfo()
          }

          let rowId = param
          const url = 'http://localhost:3001/supplier/checksupplierfordelete'
          axios.post(url,{rowId})
          .then(res => {
            const dataResponse = res.data.message;
            if(dataResponse == "Record Found") {
              setMessage("Supplier selected still in use")
              setColorMessage('red')
              setOpen(false);
            } else if (dataResponse == "No Record Found") {
              setOpen(true);
       
            }
          }).catch(err => {
            WriteLog("Error","SupplierView","checkStatus /supplier/checksupplierfordelete","Error in tehn/catch \n " + err.message,userID)
            setMessage("Error in checking status")
            setColorMessage('red')
          })
      
        }
        catch(err) {
          WriteLog("Error","SupplierView","checkStatus /supplier/checksupplierfordelete","Error in try/catch \n" + err.message,userID)
        }
      }


       function handleDelete() {
        try {
          if(userID == "") 
          {
            getUserInfo()
          }

          let rowId = rowselected
        const url = 'http://localhost:3001/supplier/deleteSupplier'
        axios.post(url,{rowId})
        .then(res => {
          const dataResponse = res.data.message;
          if(dataResponse == "Record Deleted") {
            setOpen(false)
            LoadData()
         
          } else if (dataResponse == "No Record Deleted") {
            setMessage("No record deleted")
            setColorMessage("red")
            WriteLog("Error","SupplierView","handleDelete /supplier/deleteSupplier",res.data.message.message,userID)
          }
        }).catch(err => {
          WriteLog("Error","SupplierView","handleDelete /supplier/deleteSupplier","Error in then/catch \n" + err.message,userID)
          setMessage("No record deleted")
          setColorMessage("red")
        })

       }
       catch(err) {
        WriteLog("Error","SupplierView","handleDelete /supplier/deleteSupplier","Error in try/catch \n" + err.message,userID)
       }
      }


    useEffect(() => {
        LoadData()
      },[])
    
    function LoadData(){
      setMessage("")
      if(userID == "") 
      {
        getUserInfo()
      }
      
      const url = 'http://localhost:3001/supplier/viewallsupplier'
      axios.post(url)
      .then(res => {
        const dataResponse = res.data.message;
        if(dataResponse == "Record Found") {
            setSupplier(res.data.result)
        } else if (dataResponse == "No Record Found") {
          WriteLog("Error","SupplierView","LoadData /supplier/viewallsupplier",res.data.message,userID)
          setMessage("No record found")
          setColorMessage("red")
          //navigate('/500');
        }
      }).catch(err => {
        WriteLog("Error","SupplierView","LoadData /supplier/viewallsupplier","Error in then/catch \n" + err.message,userID)
        setMessage("No record found")
        setColorMessage("red")
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
    <>
    
   
    <CCol xs={12}>
    <CCard className="mb-3" size="sm"  >
      <CCardHeader>
        <h6>
        <span className="message" style={{ color: '#5da4f5'}}> <> Supplier </></span> 
        <br></br>
        <strong><span className="message" style={{ color: colorMessage}}><p>{message}</p></span> </strong>
        </h6>
      </CCardHeader>
     
      <CForm >
        <CRow >
            <CCol xs={12}>
              <CCardBody>
              <CButton onClick={handleNew} type='success' >Create New </CButton>
                <CInputGroup size="sm" className="mb-3">
                        <div style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={supplier}
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
                          Category
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
  </>

  )
}

export default SupplierView
