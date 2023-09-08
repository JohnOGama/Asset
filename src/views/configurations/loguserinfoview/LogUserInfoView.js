import  { useEffect, useState } from 'react'
import axios from 'axios'
import * as React from 'react'

import { DataGrid } from '@mui/x-data-grid';
import defaultUser from 'src/assets/images/avatars/7.jpg'

import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';



import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';


import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CForm,
    CButton,
    CInputGroup,
    CNavLink,
    CFormLabel,

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
import {useNavigate} from 'react-router-dom';

import appSettings from 'src/AppSettings' // read the app config
import { decrypt } from 'n-krypta';
import { Typography } from '@mui/material';
import userAvatar from "../../../assets/images/avatars/8.jpg"
// encrypt, compare
const LogUserInfoView = () => {

    const navigate = useNavigate();
    var userID = ""
    var userRole = ""
    var departmentID = ""
    //const [success,SetSuccess] = useState("");
    //const [errors,setErrors] = useState({})
    const [message,setMessage] = useState("")
    const [colorMessage,setColorMessage] = useState('red')

    const [log,setLog] = useState([])
    const [open, setOpen] = React.useState(false);
    //const [rowselected,SetRowSelected] = useState("")

    function CheckRole() {
      try {
  
        userRole = decrypt(window.localStorage.getItem('Kgr67W@'), appSettings.secretkeylocal)
  
      }
      catch(err) {
        WriteLog("Error","LogUserInfoView","CheckRole Local Storage is tampered", err.message,userID)
        navigate('/dashboard')
      }
    }

 

function getUserInfo() {

  try {
    CheckRole()
      //if (userRole == "Admin" || userRole == "IT")
      //  {
            if((!window.localStorage.getItem('id') == null) || (window.localStorage.getItem('id') !== "0")) {
              userID = decrypt(window.localStorage.getItem('id'), appSettings.secretkeylocal)
              departmentID = decrypt(window.localStorage.getItem('LkgdW23!'), appSettings.secretkeylocal)
  
            }else{ 
              navigate('/login')
          }
    //    }
    //  else {
    //    navigate('/dashboard')
   //   }
        
      }
  catch(err) {
    navigate('/dashboard')
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
        field: 'logvalues',
        headerName: 'Activity',
        width: 300,
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
  const url = 'http://localhost:3001/log/viewaLogUserInfo'
  axios.post(url,{departmentID})
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


    <CCol >
    <CCard >
      <CCardHeader>
        <h6>
        <span className="message" style={{ color: '#5da4f5'}}> <>Department Activity </></span>

        
        </h6>
      </CCardHeader>
      <CCardBody sx={{ overflow: 'auto' }}  >
         
            <List style={{height:'150%'}} >
            
            { log?.map(val => {
              return (
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar alt='ed' 
                          src={
                            val.receiverName
                            ? require(`../../../../backend/uploads/${val.usercreatedImg}`)
                            
                            : defaultUser 
                            } 
                          
                    />
                  </ListItemAvatar>
                   {/*val.receiverName */ }
                  <ListItemText  primary =  'ralph' 
                  
                          secondary={
                          <React.Fragment>
                              <Typography
                              sx={{ display: 'inline' }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                              >
                              See Info Below
                              <br></br>
                              </Typography>
                              {
                                 val.logvalues
                              }
                             {/* 
                             " — You have asset(s) to be pickup on schedule date ( write date here )
                             <CNavLink href='#/base/assetuserassign'>... click here </CNavLink>
                              <Divider variant="inset" component="li" />
                             */}
                          </React.Fragment>
                          }
                  />
                </ListItem>
            ) 
            
            })
            
            }
  
            </List>
   
        
            </CCardBody>

    </CCard>
    </CCol>


                            
  )
}

export default LogUserInfoView
