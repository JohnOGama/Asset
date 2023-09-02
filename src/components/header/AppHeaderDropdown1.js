import React from 'react'
import  { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/8.jpg'
import defaultUser from './../../assets/images/avatars/DefaultUser.png'

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
//compare , decrypt
import WriteLog from 'src/components/logs/LogListener';
import { Avatar } from '@mui/material'

const AppHeaderDropdown = () => {

  const navigate = useNavigate();
  let userID = ""
  var userImg = ""

  

  const [success,SetSuccess] = useState("");
  const [errors,setErrors] = useState({})

  const [countnotif,setCountNotif] = useState("0")
  const [countcheckin,setCountcheckin] = useState("0")
  const [countassets,setCountAssets] = useState("0")
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

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
  
    setOpen(true);

  };

  const handleLogout = () => {
    setOpen(true);
  try {
    window.localStorage.removeItem('id')
    window.localStorage.removeItem('display')
    window.localStorage.removeItem('userimg')
    window.localStorage.clear()
      setOpen(false);
      navigate('/login');
  }catch(err) {
    setOpen(false)
    
  }finally {
    setOpen(false)
  }

  };
  /// End of Dialog 

///  Notifications


function getUserInfo() {

  if((!window.localStorage.getItem('id') == null) || (window.localStorage.getItem('id') !== "0")) {
      userID = decrypt(window.localStorage.getItem('id'), appSettings.secretkeylocal)
      userImg = window.localStorage.getItem('userimg'), appSettings.secretkeylocal
      
  }
  else
  { 
      navigate('/login')
  }
  }

  useEffect(() => {
    
    getUserInfo()

  }, [])

useEffect(() => {
 
  try {
    
  if((window.localStorage.getItem('id') !== null) || (window.localStorage.getItem('id') !== "0"))
    {
    if(userID == "") 
    {
    getUserInfo()
    }
    
    const url = 'http://localhost:3001/assets/pulloutNotification'
    axios.post(url,{userID})
    .then(res => {
      const dataResponse = res.data.message;
      if(dataResponse == "Record Found") {
        setCountNotif(res.data.result[0]['Notif'])
      } else if (dataResponse == "No Record Found") {
        setCountNotif("0")
      
      }
    }).catch(err => {
      WriteLog("Error","AppHeaderDropdown","useEffect /assets/pulloutNotification",err.message,userID)
    })
  }
  else {
    navigate("/login")
  }
}
catch (err) {
  WriteLog("Error","AppHeaderDropdown","useEffect /assets/pulloutNotification","Error in try/catch \n" + err.message,userID)
}
},[countnotif])

useEffect(() => {
  try {
  
    if(userID == "") 
    {
      getUserInfo()
    }

      
      const url = 'http://localhost:3001/assets/checkinNotification'
      axios.post(url,{userID})
      .then(res => {
        const dataResponse = res.data.message;
        if(dataResponse == "Record Found") {
          setCountcheckin(res.data.result[0]['checkin'])
          
        } else if (dataResponse == "No Record Found") {
          setCountcheckin("0")
        
        }
      }).catch(err => {
        WriteLog("Error","AppHeaderDropdown","useEffect /assets/checkinNotification",err.message,userID)
      })


  }
  catch (err) {
    WriteLog("Error","AppHeaderDropdown","useEffect /assets/checkinNotification","Error in try/catch \n" + err.message,userID)
  }
},[countcheckin])


useEffect(() => {
  try {
  
    if(userID == "") 
    {
      getUserInfo()
    }
    
      const url = 'http://localhost:3001/assets/countsassignbyuser_deployed'
      axios.post(url,{userID})
      .then(res => {
        const dataResponse = res.data.message;
        if(dataResponse == "Record Found") {
          setCountAssets(res.data.result[0].assetCount)
          
        } else if (dataResponse == "No Record Found") {
          setCountAssets("0")
        
        }
      }).catch(err => {
        WriteLog("Error","AppHeaderDropdown","useEffect /assets/countsassignbyuser_deployed","Error in then/catch \n" + err.message,userID)
      })
  }
  catch (err) {
    WriteLog("Error","AppHeaderDropdown","useEffect /assets/countsassignbyuser_deployed","Error in try/catch \n" + err.message,userID)
  }
},[countassets])

/// EO Notifications


  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>


        <Avatar src={ 
                   userImg
                   ?  require(`../../../../backend/uploads/${userImg}`)
                   : defaultUser 
        }  size="md"
           />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">Account</CDropdownHeader>
        <CDropdownItem href="#/base/assetuserassign">
          <CIcon icon={cilBell} className="me-2" />
          Checkin
          <CBadge color="info" className="ms-2">  
          {
            countcheckin ? (countcheckin) : ""
          }
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#/base/assetpullout">
          <CIcon icon={cilEnvelopeOpen} className="me-2" />
          Pullout
          <CBadge color="danger" className="ms-2">
          
            {countnotif ? (countnotif) : "" }
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#/base/assetbyuser">
          <CIcon icon={cilTask} className="me-2" />
          My Assets
          <CBadge color="success" className="ms-2">
          {countassets ? (countassets) : "" }
          </CBadge>
        </CDropdownItem>
        <CDropdownHeader className="bg-light fw-semibold py-2">Settings</CDropdownHeader>
        <CDropdownItem href="#/pages/updateprofile">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem  onClick={handleClickOpen}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Log Out
        </CDropdownItem>
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
                            Are you sure you want to Log out ?

                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button autoFocus onClick={handleClose}>
                            Cancel
                          </Button>
                          <Button onClick={handleLogout}>Logout</Button>
                        </DialogActions>
                      </Dialog>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
