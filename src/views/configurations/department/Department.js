
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
    CInputGroup
  } from '@coreui/react'

  import TextField from '@mui/material/TextField';

import {useNavigate} from 'react-router-dom';
import {useLocation} from 'react-router-dom';

import appSettings from 'src/AppSettings' // read the app config
import {  decrypt } from 'n-krypta';
// encrypt, compare
import WriteLog from 'src/components/logs/LogListener';

function Department() {

  const navigate = useNavigate();
  const {state} = useLocation();
  let rowId = ""
  
  try {
     rowId = state.params;
  }
  catch(err){
   navigate('/dashboard')
  }
  
  const [userID,setUserID] = useState("")

  const [message,setMessage] = useState("")
  const [colorMessage,setColorMessage] = useState('red')

  const [values,setValues] = useState({
    departmentid: "",
    name: "",
    description: ""
  })

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

    useEffect(() => {
      try {
      if(!rowId == "") {
      const url = 'http://localhost:3001/department/getDepartmentID'
      axios.post(url,{rowId})
      .then(res => {
        const dataResponse = res.data.message;
        if(dataResponse == "Record Found") {
         
          setValues(
            {...values,departmentid: res.data.result[0].departmentDisplayID,
              name: res.data.result[0].departmentName,
              description: res.data.result[0].description
            });

        } else if (dataResponse == "No Record Found") {
          WriteLog("Error","Department","useEffect /department/getDepartmentID",res.data.message2,userID)
          //navigate('/500');
        }
      }).catch(err => {
        WriteLog("Error","Department","useEffect /department/getDepartmentID","then/catch \n" + err.message,userID)
      })
    }
  }
  catch(err) {
    WriteLog("Error","Department","useEffect /department/getDepartmentID","try/catch \n" + err.message,userID)
  }
    },[])


    function handleInput(event){
      setValues({...values,[event.target.name]: event.target.value})

    }


    function handleSubmit(event) {
        try {
    
          event.preventDefault();
          const userID = decrypt(localStorage.getItem('id'), appSettings.secretkeylocal); 

          const name = values.name;
          const description = values.description;

          if((!name == "") && 
            (!description == "")) {

              if (rowId == "") {

              const url = 'http://localhost:3001/department/putDepartment'
              axios.post(url,{name,description,userID})
              .then(res => {  
                  const dataResponse = res.data.message 
                  if(dataResponse == "Insert Success"){ 
                    WriteLog("Message","AssetStatus","handleSubmit /department/putDepartment", 
                    " New Department "
                    + "\n Name: " + name 
                    + "\n Desc  :  " + description 
                    + "\n User : " + userID ,userID)
                    navigate('/configurations/departmentview')
                  } else if(dataResponse == "Insert Error") {
                    WriteLog("Error","Department","handleSubmit /department/putDepartment",res.data.message2,userID)
                    setMessage("Error in Inserting new Department")
                    setColorMessage("red")  
                    //navigate('/500');
                  } 
              })
              .catch(err => {
                WriteLog("Error","Department","handleSubmit /department/putDepartment",err.message,userID)
              })
              
            }
            else {
              /// update here

              const url = 'http://localhost:3001/department/updateDepartment'
              axios.post(url,{name,description,userID,rowId})
              .then(res => {  
                  const dataResponse = res.data.message 
                  if(dataResponse == "Update Success"){ 
                    WriteLog("Message","AssetStatus","handleSubmit /department/updateDepartment", 
                    " Update Department "
                    + " AssetID : " + rowId
                    + "\n Name: " + name 
                    + "\n Desc  :  " + description 
                    + "\n User : " + userID ,userID)
                    navigate('/configurations/departmentview')
                  } else if(dataResponse == "Update Error") {
                    WriteLog("Error","Department","handleSubmit /department/updateDepartment",res.data.message2,userID)
                    setMessage("Error in Updating Department")
                    setColorMessage("red")  
                    //navigate('/500');
                  } 
              })
              .catch(err => {
                WriteLog("Error","Department","handleSubmit /department/updateDepartment","Error in try/catch " + err.message,userID)
                //navigate('/500');
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
          WriteLog("Error","Department","handleSubmit","Error in try/catch " +  err.message,userID)
        }
    }

  return (

    <CCol xs={12}>
         <CCard className="mb-3" size="sm"  >
         <CCardHeader>
            <h6>
            <span className="message" style={{ color: '#5da4f5'}}> <> Department </></span> 
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
                            value={values.name} fullWidth label="Department Name" placeholder="Department Name" />
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

            </CRow>
            <div className="d-grid" style={{
                            
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            }} >
                  <CButton style={{   width: '150%' }} color="success" type='submit'>Save</CButton>
            </div>
          </CForm>
         </CCard>
    </CCol>
  )
}

export default Department
