
import  { useEffect, useState } from 'react'
import axios from 'axios'
import * as React from 'react'

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

  import TextField from '@mui/material/TextField';

import {useNavigate} from 'react-router-dom';
import {useLocation} from 'react-router-dom';

import appSettings from 'src/AppSettings' // read the app config
import { decrypt } from 'n-krypta';
import WriteLog from 'src/components/logs/LogListener';

function AssetStatus() {

  const navigate = useNavigate();
  const {state} = useLocation();
  let rowId = ""
  var userRole = ""
  
  try {
     rowId = state.params;
  }
  catch(err){
   navigate('/dashboard')
  }
  
  var userID = ""
  const [message,setMessage] = useState("")
  const [colorMessage,setColorMessage] = useState('red')

  const [values,setValues] = useState({
    statusid: "",
    name: "",
    description: ""
  })

  function CheckRole() {
    try {

      userRole = decrypt(window.localStorage.getItem('Kgr67W@'), appSettings.secretkeylocal)

    }
    catch(err) {
      WriteLog("Error","AssetStatus","CheckRole Local Storage is tampered", err.message,userID)
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

    useEffect(() => {
      if(userID == "") 
      {
        getUserInfo()
      }
      if(!rowId == "") {
      const url = 'http://localhost:3001/status/getStatusbyID'
      axios.post(url,{rowId})
      .then(res => {
        const dataResponse = res.data.message;
        if(dataResponse == "Record Found") {
         
          setValues(
            {...values,statusid: res.data.result[0].assetStatusID,
              name: res.data.result[0].statusName,
              description: res.data.result[0].statusDescription
            });

        } else if (dataResponse == "No Record Found") {
          setMessage("No Record Found")
          setColorMessage("red")
          WriteLog("Error","AssetStatus","useEffect /status/getStatusbyID",res.data.message2,userID)
          //navigate('/500');
        }
      }).catch(err => {
        WriteLog("Error","AssetStatus","useEffect /status/getStatusbyID","Load error in then/catch \n" + err.message,userID)
      })
    }
    },[])


    function handleInput(event){
      setValues({...values,[event.target.name]: event.target.value})

    }


    function handleSubmit(event) {
        try {
    
          event.preventDefault();
         
          if(userID == "") 
          {
            getUserInfo()
          }

          const name = values.name;
          const description = values.description;

          if((!name == "") && 
            (!description == "")) {

              if (rowId == "") {

              const url = 'http://localhost:3001/status/putStatus'
              axios.post(url,{name,description,userID})
              .then(res => {  
                  const dataResponse = res.data.message 
                  
                  if(dataResponse == "Insert Success"){ 
                    WriteLog("Message","AssetStatus","handleSubmit /status/putStatus", 
                    " New Status "
                    + "\n Name: " + name 
                    + "\n Desc  :  " + description 
                    + "\n User : " + userID ,userID)
                    navigate('/configurations/statusview')
                  } else if(dataResponse == "Insert Error") {
                    
                    WriteLog("Error","AssetStatus","handleSubmit /status/putStatus",res.data.message2,userID)
                    setMessage("dataResponse")
                    setColorMessage("red")  
                    navigate('/500');
                  } 
              })
              .catch(err => {
                WriteLog("Error","AssetStatus","handleSubmit /status/putStatus","Error in then/catch \n" + err.message,userID)
                navigate('/500');
              })
              
            }
            else {
              /// update here

              const url = 'http://localhost:3001/status/updateStatus'
              axios.post(url,{name,description,userID,rowId})
              .then(res => {  
                  const dataResponse = res.data.message
                 
                  if(dataResponse == "Update Success"){ 
                    WriteLog("Message","AssetStatus","handleSubmit /status/updateStatus", 
                    " New Status "
                    + " AssetID : " + rowId
                    + "\n Name: " + name 
                    + "\n Desc  :  " + description 
                    + "\n User : " + userID ,userID)
                    navigate('/configurations/statusview')
                  } else if(dataResponse == "Update Error") {
                    
                    WriteLog("Error","AssetStatus","handleSubmit /status/updateStatus",res.data.message2,userID)
                    setMessage(dataResponse)
                    setColorMessage("red")  
                    navigate('/500');
                  } 
              })
              .catch(err => {
                WriteLog("Error","AssetStatus","handleSubmit /status/updateStatus","Error in then/catch \n" + err.message,userID)
                navigate('/500');
              })

            }
          }
          else
          {
            setMessage("All fields must not be emtpy")
            setColorMessage("red")  
          }
        }
        catch(err) {
          WriteLog("Error","AssetStatus","handleSubmit try/catch","Error in try/catch",userID)
        }

    }

  return (

    <CCol xs={12}>
         <CCard className="mb-3" size="sm"  >
         <CCardHeader>
            <h6>
            <span className="message" style={{ color: '#5da4f5'}}> <> Asset Status </></span> 
            <br></br>
            <strong><span className="message" style={{ color: colorMessage}}><p>{message}</p></span> </strong>
            </h6>
          </CCardHeader>
          <CForm onSubmit={handleSubmit}>
            <CRow >
                <CCol >
                    <CCardBody>
                      <CInputGroup size="sm" className="mb-3" >
                          <TextField onChange={e => handleInput(e)} name="name" id="outlined-textarea"
                            value={values.name} fullWidth label="Status Name" placeholder="Status Name" />
                      </CInputGroup>
                      <CInputGroup size="sm" className="mb-3" >
                          <TextField onChange={handleInput} name="description" id="outlined-textarea" 
                              value={values.description} fullWidth label="Description" placeholder="Description" 
                              multiline  rows={5}  />
                      </CInputGroup>
                    </CCardBody>
                </CCol>
                <CCol>

                </CCol>
                <div className="d-grid"  style={{
                            
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            }} >
                  <CButton style={{   width: '120%' }}  color="success" type='submit'>Save</CButton>
            </div>
            </CRow>

          </CForm>
         </CCard>
    </CCol>
  )
}

export default AssetStatus
