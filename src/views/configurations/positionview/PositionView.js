import  { useEffect, useState } from 'react'
import axios from 'axios'
import * as React from 'react'

import { DataGrid } from '@mui/x-data-grid';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';

import {useNavigate} from 'react-router-dom';
import WriteLog from 'src/components/logs/LogListener';
import appSettings from 'src/AppSettings' // read the app config
import { decrypt } from 'n-krypta';

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

  const PositionView = () => {

    const navigate = useNavigate();
    
    const [userID,setUserID] = useState("")
    const [message,setMessage] = useState("")
    const [colorMessage,setColorMessage] = useState('red')

    const [positions,setPosition] = useState([])
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
              <EditTwoToneIcon cursor="pointer" onClick={()=> handleClick(params.row.id)}/>
              <DeleteOutlineTwoToneIcon cursor="pointer" onClick={()=> handleClickOpen(params.row.id)}/>
              
            </div>

          );
        }
      },
      {
        field: 'departmentName',
        headerName: 'Department',
        width: 200,
        editable: false,
      },
        {
          field: 'positionName',
          headerName: 'Position',
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
         navigate('/configurations/position',{state:{params}})
         
       }

       function handleClick(params) {

        // console.log("This " + params)
         navigate('/configurations/position',{state:{params}})
         
       }


  useEffect(() => {
    //setOpen(true);
  }, [rowselected])

  const handleClickOpen = (param) => {


      setMessage("")
      SetRowSelected(param)
      checkUserPosition(param)
     
  };

  const handleClose = () => {
    setOpen(false);
  };


  function checkUserPosition(param) {
  try {
    let rowId = param
    const url = 'http://localhost:3001/position/checkPositionfordelete'
    axios.post(url,{rowId})
    .then(res => {
      const dataResponse = res.data.message;
      if(dataResponse == "Record Found") {
        setMessage("Position selected still in use")
        setColorMessage('red')
        setOpen(false);
      } else if (dataResponse == "No Record Found") {
        setOpen(true);
        
 
      }
    }).catch(err => {
      WriteLog("Error","PositionView","checkUserPosition /position/checkPositionfordelete",err.message,userID)
      setMessage("Error in checking position")
      setColorMessage('red')
    })

  }
  catch(err) {
    WriteLog("Error","PositionView","checkUserPosition /position/checkPositionfordelete",err.message,userID)
  }
}

    function handleDelete() {
    try {
      let rowId = rowselected
    const url = 'http://localhost:3001/position/deletePosition'
    axios.post(url,{rowId})
    .then(res => {
      const dataResponse = res.data.message;
      if(dataResponse == "Record Deleted") {
        setOpen(false)
        LoadData()
        //window.location.reload();
      } else if (dataResponse == "No Record Deleted") {
        setMessage("No record deleted")
        setColorMessage("red")
        WriteLog("Error","PositionView","handleDelete /position/deletePosition",res.data.message2,userID)
      }
    }).catch(err => {
      WriteLog("Error","PositionView","handleDelete /position/deletePosition",err.message,userID)
      
    })

    }
    catch(err) {
      WriteLog("Error","PositionView","handleDelete /position/deletePosition",err.message,userID)
    }
  }


useEffect(() => {
    LoadData()
  },[])
    
function LoadData(){
  const url = 'http://localhost:3001/position/viewallposition'
  axios.post(url)
  .then(res => {
    const dataResponse = res.data.message;
    if(dataResponse == "Record Found") {
        setPosition(res.data.result)
    } else if (dataResponse == "No Record Found") {
        setMessage("No Record Found")
        setColorMessage("red")
    }
  }).catch(err => {
    WriteLog("Error","PositionView","LoadData /position/viewallposition",err.message,userID)
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
        <span className="message" style={{ color: '#5da4f5'}}> <> Position </></span> 
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
                                rows={positions}
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

export default PositionView
