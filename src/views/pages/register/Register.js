/* eslint-disable */

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ValidationRegister from '../../../components/validation/ValidationRegister'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormSelect,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

import {useNavigate} from 'react-router-dom';


import { encrypt, decrypt, compare } from 'n-krypta';
import appSettings from 'src/AppSettings' // read the app config
import WriteLog from 'src/components/logs/LogListener';


function Register() {

  
  const navigate = useNavigate();
 
  const [message,setMessage] = useState("")
  const [colorMessage,setColorMessage] = useState("")
  const [success,SetSuccess] = useState("");
  const [mali,setErrors] = useState("")

  const [values,setValues] = useState({
    username: '',
    password: '',
    email: ''
  })




  useEffect(() => {
    
    try {
      
    const url = 'http://localhost:3001/getPositions'
    axios.post(url)
    .then( res => {
      const dataResponse = res.data.message;
      if(dataResponse === "Record Found") {
        setPosition(res.data.result)
      
      } else if (dataResponse === "No Record Found") {
        WriteLog("Message","Register","useEffect /getPositions",dataResponse,"")
       
      }
    }).catch(err => {
      WriteLog("Error","Register","useEffect /getPositions",err.message,"")
      
    }) 
  }
  catch (err) {
    console.log(err)
  }
  },[])


  const handleInput = (e) => {

      setValues(prev => ({...prev,[e.target.name]: [e.target.value]}))
      //setErrors("test")
}

useEffect(() => { 
//console.log("")
},[values])




  function handleSubmit(event) {
    try {
      
      event.preventDefault();
   
      //navigate('/login')
     // setErrors(ValidationRegister(values))
      //console.log(values)
     
      if((!values.username == "") && 
        (!values.email == "") && 
        (!values.password == ""))
        {
          //window.localStorage.clear();
         
          const password = encrypt(values.password,  appSettings.secretkey); // #Iblankartan!not!svreblankartwhfreblankartzpublankartase!gettiogblankartypvrblankartiofprmatipn,blankartcvtblankartgpoeblankarttopid.blankartI!oeedtblankartuoblankartspeodblankartspneblankarttjmfblankartlearoing!nore!osblankartundesstaoeing!mpre.blankartTiankt!for!eycelleotblankartiogoblankartI!wbsblankartlooling!gorblankartuhjsblankartinfpblankartfos!myblankartnitsion.#
         
          const username = values.username;
          const email = values.email;

          const url = 'http://localhost:3001/auth/register'
          
          axios.post(url,{username,email,password})
          
          .then(res => {
            
            const dataResponse = res.data.message
            console.log(dataResponse)
            if(dataResponse == "Insert Success"){
              WriteLog("Message","Register","handleSubmit /auth/register", 
              " New user in registration "
              + "\n Name: " + username 
              + "\n Email  :  " + email 
              + "\n Pass : " + password
              ,"")
              navigate('/login');
            } else if(dataResponse == "Insert Error") {
              WriteLog("Error","Register","handleSubmit /auth/register",res.data.message2,"")
              //setMessage("Error in Inserting new User")
              //setColorMessage("red")
             
            } 
          })
          .catch(err => {
            setErrors(err.message)
            WriteLog("Error","Register","handleSubmit /auth/register",err.message,"")
          })
        }
        else{
          setErrors("All Field must not be empty")
          //console.log("All Field must not be empty")
        }
    }
    catch(err) {
      setMessage(err.message)
      setColorMessage('red')
      WriteLog("Error","Register","handleSubmit ",err.message,"")
    }
  }
  
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                <h4>
                <span className="message" style={{ color: '#5da4f5'}}> <> Register</></span> 
                <br></br>
                  <h6>
                    <span className="message" style={{ color: colorMessage}}><p>{message}</p></span> 
                  </h6>
                </h4>
                <h6>
                <span className="text-medium-emphasis" style={{ color: '#ced6de'}}> <> Create your account</></span> 
                </h6>
                
                  
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput name="username"  placeholder="Username" 
                      autoComplete="username" onChange={handleInput} />
                  </CInputGroup>
                
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput placeholder="Email" name="email"
                      autoComplete="email" onChange={handleInput} />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      name="password"
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      onChange={handleInput}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      name="repeatpassword"
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton color="success" type='submit'>Create Account</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
