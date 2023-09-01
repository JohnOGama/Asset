
import  { useEffect, useState } from 'react'
import axios from 'axios'
import * as React from 'react'

import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CButton,
    CRow,
    CForm,
    CInputGroup,
  } from '@coreui/react'

  import TextField from '@mui/material/TextField';

import {useNavigate} from 'react-router-dom';
import {useLocation} from 'react-router-dom';

import appSettings from 'src/AppSettings' // read the app config
import { decrypt } from 'n-krypta';
//encrypt, compare
import LogListener from 'src/components/logs/LogListener'

function Log() {

  const navigate = useNavigate();
  var userID = ""
  
  const {state} = useLocation();
  let rowId = ""
  
  try {
     rowId = state.params;
  }
  catch(err){
   navigate('/dashboard')
  }

    const [values,setValues] = useState({
      logid: "",
      type: "",
      module: "",
      function: "",
      details: "",
    })

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


    useEffect(() => {

      if(userID == "") 
      {
        getUserInfo()
      }

      if(!rowId == "") {
      const url = 'http://localhost:3001/log/getlogID'
      axios.post(url,{rowId})
      .then(res => {
        const dataResponse = res.data.message;
        if(dataResponse == "Record Found") {
         
          setValues(
            {...values,logid: res.data.result[0].logID,
                type: res.data.result[0].logtype,
                module: res.data.result[0].module,
                function: res.data.result[0].logfunction,
                details: res.data.result[0].logvalues
            });

        } else if (dataResponse == "No Record Found") {
            LogListener.WriteLog("Error","Log","Load /log/getlogID","DB No Record Found",userID)
   
        }
      }).catch(err => {
        LogListener.WriteLog("Error","Log","Load /log/getlogID","Load Error on then/catch response \n" + err.message,userID)

      })
    }
    },[])

    function handlebacktomain() {
      navigate('/configurations/logview')
    }

  return (

    <CCol xs={12}>
         <CCard className="mb-3" size="sm"  >
         <CCardHeader>
            <strong>Log Detail Information </strong>
          </CCardHeader>
          <CForm>
            <CRow >
                <CCol >
                    <CCardBody>
                      <CInputGroup size="sm" className="mb-3" >
                          <TextField name="type" id="outlined-basic"
                            value={values.type} fullWidth label="Log Type" placeholder="Log Type" InputProps={{
                                readOnly: true,
                              }} />
                      </CInputGroup>
                      <CInputGroup size="sm" className="mb-3" >
                          <TextField name="module" id="outlined-basic"
                            value={values.module} fullWidth label="Module" placeholder="Module"  InputProps={{
                                readOnly: true,
                              }} />
                      </CInputGroup>
                      <CInputGroup size="sm" className="mb-3" >
                          <TextField name="function" id="outlined-basic"
                            value={values.function} fullWidth label="Function" placeholder="Function"  InputProps={{
                                readOnly: true,
                              }} />
                      </CInputGroup>
                      <CInputGroup size="sm" className="mb-3" >
                          <TextField  name="details" id="outlined-textarea" 
                              value={values.details} fullWidth label="Details" placeholder="Details" 
                              multiline  rows={5}  InputProps={{
                                readOnly: true,
                              }} />
                      </CInputGroup>
                    </CCardBody>
                </CCol>
                <div className="d-grid" style={{
                            
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            }} >
                      <CButton style={{   width: '150%' }} onClick={handlebacktomain} color="success">View All Logs</CButton>
                </div>
            </CRow>
          </CForm>
         </CCard>
    </CCol>
  )
}

export default Log
