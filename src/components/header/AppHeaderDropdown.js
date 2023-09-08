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
import userAvatar from '../../assets/images/avatars/8.jpg'
import defaultUser from '../../assets/images/avatars/DefaultUser.png'
//'./../../assets/images/avatars/DefaultUser.png'

//'./../../assets/images/avatars/8.jpg'
const AppHeaderDropdown = () => {

  const navigate = useNavigate();
  var userID = ""


  
  const [userImg,setUserImg] = useState("")
  const [success,SetSuccess] = useState("");
  const [errors,setErrors] = useState({})

  const [countnotif,setCountNotif] = useState("")
  const [countcheckin,setCountcheckin] = useState("")
  const [countassets,setCountAssets] = useState("")

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
    setOpen(false);
  try {
    localStorage.clear();
      navigate('/login');
  }catch(err) {
    setOpen(false)
    
  }

  };
  /// End of Dialog 

///  Notifications


function getUserInfo() {

  if((!window.localStorage.getItem('id') == null) || (window.localStorage.getItem('id') !== "0")) {
      userID = decrypt(window.localStorage.getItem('id'), appSettings.secretkeylocal)
      setUserImg(window.localStorage.getItem('userimg'))
     

  }
  else
  { 
      navigate('/login')
  }
  }

  useEffect(() => {
    
    getUserInfo()
    LoadCount_byDeployed()
    LoadCount_Notif()
    LoadCount_CheckInNotif()
  }, [countassets,countcheckin,countnotif])



function LoadCount_Notif() {

  try {
    
  
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
        setCountNotif("")
      
      }
    }).catch(err => {
      WriteLog("Error","AppHeaderDropdown","LoadCount_Notif /assets/pulloutNotification",err.message,userID)
    })

}
catch (err) {
  WriteLog("Error","AppHeaderDropdown","LoadCount_Notif /assets/pulloutNotification","Error in try/catch \n" + err.message,userID)
}

}

function LoadCount_CheckInNotif() {

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
          setCountcheckin(res.data.result[0].checkin)
          
        } else if (dataResponse == "No Record Found") {
          setCountcheckin("")
        
        }
      }).catch(err => {
        WriteLog("Error","AppHeaderDropdown","useEffect /assets/checkinNotification",err.message,userID)
      })


  }
  catch (err) {
    WriteLog("Error","AppHeaderDropdown","useEffect /assets/checkinNotification","Error in try/catch \n" + err.message,userID)
  }

}

function LoadCount_byDeployed() {
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
          setCountAssets("")
        
        }
      }).catch(err => {
        WriteLog("Error","AppHeaderDropdown","LoadCount_byDeployed /assets/countsassignbyuser_deployed","Error in then/catch \n" + err.message,userID)
      })
  }
  catch (err) {
    WriteLog("Error","AppHeaderDropdown","LoadCount_byDeployed /assets/countsassignbyuser_deployed","Error in try/catch \n" + err.message,userID)
  }
}

/// EO Notifications


  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <Avatar src={ 
                   userImg
                   ? require(`../../../backend/uploads/${userImg}`)
                   
           
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
            countcheckin 
            ? 
              (countcheckin) 
            : ""
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
