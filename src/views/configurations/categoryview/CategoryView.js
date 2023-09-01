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

function CategoryView() {

    const navigate = useNavigate();
    const [userID,setUserID] = useState("")

    //const [success,SetSuccess] = useState("");
    //const [errors,setErrors] = useState({})
    const [message,setMessage] = useState("")
    const [colorMessage,setColorMessage] = useState('red')

    const [assets,setAssets] = useState([])
    const [open, setOpen] = React.useState(false);
    const [rowselected,SetRowSelected] = useState("")

    useEffect(() => {
      try {
       
        if((!window.localStorage.getItem('id') == null) || (window.localStorage.getItem('id') !== "0")) {
          setUserID(decrypt(window.localStorage.getItem('id'), appSettings.secretkeylocal));
        }
        else
        {
          navigate('/login')
        }
        }catch(err) {
          
          navigate('/login')
        }
  
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
          field: 'assetCategName',
          headerName: 'Category Name',
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
        // console.log("This " + params)
         navigate('/configurations/assetcategory',{state:{params}})
         
       }

       function handleEdit(params) {

        // console.log("This " + params)
         navigate('/configurations/assetcategory',{state:{params}})
         
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
          let rowId = param
          const url = 'http://localhost:3001/category/checkCategoryfordelete'
          axios.post(url,{rowId})
          .then(res => {
            const dataResponse = res.data.message;
            if(dataResponse == "Record Found") {
              setMessage("Category selected still in use")
              setColorMessage('red')
              setOpen(false);
            } else if (dataResponse == "No Record Found") {
              //WriteLog("Error","CategoryView","checkStatus /category/checkCategoryfordelete",res.data.message,userID)
              setOpen(true);
       
            }
          }).catch(err => {
            WriteLog("Error","CategoryView","checkStatus /category/checkCategoryfordelete",err.message,userID)
            setMessage("Error in checking status")
            setColorMessage('red')
          })
      
        }
        catch(err) {
          WriteLog("Error","CategoryView","checkStatus /category/checkCategoryfordelete","Error in try/catch",userID)
        }
      }


       function handleDelete() {
        try {
          let rowId = rowselected
        const url = 'http://localhost:3001/category/deleteCategory'
        axios.post(url,{rowId})
        .then(res => {
          const dataResponse = res.data.message;
          if(dataResponse == "Record Deleted") {
            setOpen(false)
            LoadData()
         
          } else if (dataResponse == "No Record Deleted") {
            setMessage("No record deleted")
            setColorMessage("red")
            WriteLog("Error","CategoryView","handleDelete /category/deleteCategory",res.data.message.message,userID)
          }
        }).catch(err => {
          WriteLog("Error","CategoryView","handleDelete /category/deleteCategory",err.message,userID)
          setMessage("No record deleted")
          setColorMessage("red")
        })

       }
       catch(err) {
        WriteLog("Error","CategoryView","handleDelete /category/deleteCategory","DB Error in try/catch",userID)
       }
      }


    useEffect(() => {
        LoadData()
      },[])
    
    function LoadData(){
      setMessage("")
      const url = 'http://localhost:3001/category/viewallcategory'
      axios.post(url)
      .then(res => {
        const dataResponse = res.data.message;
        if(dataResponse == "Record Found") {
          setAssets(res.data.result)
        } else if (dataResponse == "No Record Found") {
          WriteLog("Error","CategoryView","LoadData /category/viewallcategory",res.data.message,userID)
          setMessage("No record found")
          setColorMessage("red")
          //navigate('/500');
        }
      }).catch(err => {
        WriteLog("Error","CategoryView","LoadData /category/viewallcategory",err.message,userID)
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
    
    <CCol xs={12}>
    <CCard className="mb-3" size="sm"  >
      <CCardHeader>
       
        <h6>
            <span className="message" style={{ color: '#5da4f5'}}> <> Category </></span> 
            <br></br>
            <strong><span className="message" style={{ color: colorMessage}}><p>{message}</p></span> </strong>
        </h6>
      </CCardHeader>
     
      <CForm >
        <CRow >
            <CCol xs={12}>
              <CCardBody>
              <CButton onClick={handleNew} >Create New </CButton>
                <CInputGroup size="sm" className="mb-3">
                        <div style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={assets}
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


  )
}

export default CategoryView
