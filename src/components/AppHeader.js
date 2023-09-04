
import React, {useEffect, useState } from 'react'
// useContext, 
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  //CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilEnvelopeOpen, cilList, cilMenu,cilAddressBook, cilBellExclamation, cilAlarm} from '@coreui/icons'

import {  decrypt } from 'n-krypta';
import appSettings from 'src/AppSettings' // read the app config
import WriteLog from 'src/components/logs/LogListener';
//import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { logo } from 'src/assets/brand/logo'
import belUser from 'src/assets/images/DefaultUserBellInfo.jpg'
import {useNavigate} from 'react-router-dom'

import { Icon } from '@mui/material'

const AppHeader = () => {


  const navigate = useNavigate();

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  var userID = ""
  let displayName = ""
  const [display,setDisplay] = useState("")
  const [countlogNotif,setCountlogNotif] = useState("")
  //const [userid,setUserID] = useState("");

  useEffect(() => {
    getUserInfo()
    Load_LogUserInfo()
},[]);

  function getUserInfo() {
    try {

      if(window.localStorage.getItem('id') == "0")
      {
        navigate('/login')
      }

    if((!window.localStorage.getItem('id') == null) || (window.localStorage.getItem('id') !== "0")) {
        userID = decrypt(window.localStorage.getItem('id'), appSettings.secretkeylocal)
        displayName = window.localStorage.getItem('display')
        setDisplay(window.localStorage.getItem('display'))
    }
    else
    { 
        navigate('/login')
    }
  }
  catch{
    navigate('/login')
  } 
}


function Load_LogUserInfo() {
  try {
    
    if(userID == "") 
    {
    getUserInfo()
    }
    
    const url = 'http://localhost:3001/log/getInfoNotif'
    axios.post(url,{userID})
    .then(res => {
      const dataResponse = res.data.message;
      if(dataResponse == "Record Found") {
       setCountlogNotif(res.data.result[0].countInfo)
      } else if (dataResponse == "No Record Found") {
        setCountlogNotif("")
        
      }
    }).catch(err => {
      WriteLog("Error","AppHeader","Load_LogUserInfo /log/getInfoNotif","Error in then/catch : " + err.message,userID)
    })
  }

catch (err) {
  WriteLog("Error","AppHeader","Load_LogUserInfo /log/getInfoNotif","Error in try/catch \n" + err.message,userID)
}

}

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          <CIcon icon={logo} height={0} alt="Logo" />
        </CHeaderBrand>
        <CHeaderNav className="d-none d-md-flex me-auto">
        <CNavItem>
            <CNavLink to="/dashboard" component={NavLink} >
              Welcome : {
              displayName
              ? displayName
            : display
            }
            </CNavLink>
        </CNavItem> 
        </CHeaderNav >
        <CHeaderNav  >
          <CNavItem>
          
            {/*
            <CBadge color="info" className="ms-2">  
            
            {
            countlogNotif 
            ? (countlogNotif) 
            : ""
            }
          </CBadge> */}

      
          </CNavItem>
          
        </CHeaderNav>
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown/>
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
