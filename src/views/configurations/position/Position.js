
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
  import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import {useNavigate} from 'react-router-dom';
import {useLocation} from 'react-router-dom';

import appSettings from 'src/AppSettings' // read the app config
import {  decrypt } from 'n-krypta';
import WriteLog from 'src/components/logs/LogListener';
import AlertMessages from 'src/components/alertmessages/AlertMessages';



function Position() {

  const navigate = useNavigate();
  const {state} = useLocation();
  let rowId = ""
  

  try {
     rowId = state.params;
  }
  catch(err){
   navigate('/dashboard')
  }

     var userID = ""
  var userRole = ""
    const [message,setMessage] = useState("")
    const [colorMessage,setColorMessage] = useState('red')

    const [department,setDepartment] = useState([])
    const [values,setValues] = useState({
      positionid: "",
      name: "",
      description: "",
      departmentid: "",
      departmentname: ""
    })

    function CheckRole() {
      try {
  
        userRole = decrypt(window.localStorage.getItem('Kgr67W@'), appSettings.secretkeylocal)
  
      }
      catch(err) {
        WriteLog("Error","Position","CheckRole Local Storage is tampered", err.message,userID)
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
      const url = 'http://localhost:3001/position/getPositionID'
      axios.post(url,{rowId})
      .then(res => {
        const dataResponse = res.data.message;
        if(dataResponse == "Record Found") {
         
          setValues(
            {...values,positionid: res.data.result[0].positionDisplayID,
              name: res.data.result[0].positionName,
              description: res.data.result[0].description ,
              departmentid: res.data.result[0].departmentDisplayID,
              departmentname: res.data.result[0].departmentName

            });

        } else if (dataResponse == "No Record Found") {
          AlertMessages('No positions loaded','Error')
          WriteLog("Message","Position","useEffect /position/getPositionID",dataResponse,userID)
          //navigate('/500');
        }
      }).catch(err => {
        WriteLog("Error","Position","useEffect /position/getPositionID",err.message,userID)
      })
    }
    },[])

    useEffect(() => {
     if(userID == "") 
  {
    getUserInfo()
  }
      const url = 'http://localhost:3001/department/viewalldepartment'
      axios.post(url)
      .then(res => {
        const dataResponse = res.data.message;
        if(dataResponse == "Record Found") {
   
          setDepartment(res.data.result)
        } else if (dataResponse == "No Record Found") {
          WriteLog("Message","Position","useEffect /position/viewalldepartment",dataResponse,userID)
  
        AlertMessages('No department loaded','Warning')
        }
      }).catch(err => {
        WriteLog("Message","Position","useEffect /position/viewalldepartment",err.message,userID)
        AlertMessages("Error in Fetching All Department",'Error')
       
      })
    
    },[])

    useEffect(() => {
    //fgh
    }, [department])
    



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
          const deptid = values.departmentid;

          if((!name == "") && 
            (!description == "")) {

              if (rowId == "") {

              const url = 'http://localhost:3001/position/putPosition'
              axios.post(url,{name,description,deptid,userID})
              .then(res => {  
                  const dataResponse = res.data.message 
                  if(dataResponse == "Insert Success"){ 
                    WriteLog("Message","Position","handleSubmit /position/putPosition", 
                    " New Position "
                    + "\n Name: " + name 
                    + "\n Desc  :  " + description 
                    + "\n DeptID : " + deptid
                    + "\n User : " + userID ,userID)
                    setValues({...values,
                      positionid: "",
                      name: "",
                      description: "",
                      departmentid: "",
                      departmentname: ""})
                    AlertMessages('Position successfully created','Success')
                    //navigate('/configurations/position')
                  } else if(dataResponse == "Insert Error") {
                    WriteLog("Message","Position","handleSubmit /position/putPosition",res.data.message2,userID)
                    AlertMessages("Error in Inserting new Position",'Error')
                  
                    //navigate('/500');
                  } 
              })
              .catch(err => {
                WriteLog("Message","Position","handleSubmit /position/putPosition",err.message,userID)
                
              })
              
            }
            else {
              /// update here

              const url = 'http://localhost:3001/position/updatePosition'
              axios.post(url,{name,description,deptid,userID,rowId})
              .then(res => {  
                  const dataResponse = res.data.message 
                  if(dataResponse == "Update Success"){ 
                    WriteLog("Message","Position","handleSubmit /position/updatePosition", 
                    " Update Position " +
                    " Position ID : " + rowId
                    + "\n Name: " + name 
                    + "\n Desc  :  " + description 
                    + "\n DeptID : " + deptid
                    + "\n User : " + userID ,userID)
                   AlertMessages('Position successfully created','Success')
                  } else if(dataResponse == "Update Error") {
                    WriteLog("Message","Position","handleSubmit /position/updatePosition",res.data.message2,userID)
                    AlertMessages("Error in Updating Position",'Error')
                   
                  } 
              })
              .catch(err => {
                AlertMessages('Error in Position','Error')
                WriteLog("Message","Position","handleSubmit /position/updatePosition",err.message,userID)
                //navigate('/500');
              })

            }
          }
          else
          {
            AlertMessages("All fields must not be emtpy",'Error')
          
          }
        }
        catch(err) {
          AlertMessages('Error in submitting position','Error')
          WriteLog("Message","Position","handleSubmit ","Error in try/catch  " + err.message,userID)
        }
    }

  return (

    <CCol xs={12}>
         <CCard className="mb-3" size="sm"  >
         <CCardHeader>
            <h6>
            <span className="message" style={{ color: '#5da4f5'}}> <> Position </></span> 
            <AlertMessages/>
            </h6>
          </CCardHeader>
          <CForm onSubmit={handleSubmit}>
            <CRow >
                <CCol >
                    <CCardBody>
                   
                      <CInputGroup size="sm" >

                          <FormControl fullWidth >
                            <InputLabel >Department</InputLabel>
                              <Select  size="sm" className="mb-3" aria-label="Small select example"
                                name='departmentid' onChange={handleInput} value={values.departmentid} 
                                
                                error = {
                                  values.departmentid
                                  ? false
                                  :true
                                }
                                >
                                  {
                                  department.map((val) => 
                                  
                                    <MenuItem key={val.id} value={val.id}  >{val.departmentName}</MenuItem>
                                  )
                                  }

                                  
                              </Select>

                          </FormControl>


                      </CInputGroup>


                      <CInputGroup size="sm" className="mb-3" >
                          <TextField onChange={e => handleInput(e)} name="name" id="outlined-textarea"
                            value={values.name} fullWidth label="Position Name" placeholder="Position Name"
                            error= {
                              values.name
                              ? false
                              : true
                            }

                            />
                      </CInputGroup>
                      <CInputGroup size="sm" className="mb-3" >
                          <TextField onChange={handleInput} name="description" id="outlined-textarea" 
                              value={values.description} fullWidth label="Description" placeholder="Description" 
                              multiline  rows={5} 
                              error = {
                                values.description
                                ? false
                                : true
                              }
                              />
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

export default Position
