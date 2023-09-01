
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

  const [userID,setUserID] = useState("")
  
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
          WriteLog("Message","Position","useEffect /position/getPositionID",dataResponse,userID)
          //navigate('/500');
        }
      }).catch(err => {
        WriteLog("Error","Position","useEffect /position/getPositionID",err.message,userID)
      })
    }
    },[])

    useEffect(() => {
   
      const url = 'http://localhost:3001/department/viewalldepartment'
      axios.post(url)
      .then(res => {
        const dataResponse = res.data.message;
        if(dataResponse == "Record Found") {
   
          setDepartment(res.data.result)
        } else if (dataResponse == "No Record Found") {
          WriteLog("Message","Position","useEffect /position/viewalldepartment",dataResponse,userID)
          setMessage("No Department")
          setColorMessage('red')
          //navigate('/500');
        }
      }).catch(err => {
        WriteLog("Message","Position","useEffect /position/viewalldepartment",err.message,userID)
        setMessage("Error in Fetching All Department")
        setColorMessage('red')
      })
    
    },[])

    useEffect(() => {
      console.log("");
    }, [department])
    



    function handleInput(event){
      setValues({...values,[event.target.name]: event.target.value})

    }


    function handleSubmit(event) {
        try {
    
          event.preventDefault();
          

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
                    navigate('/configurations/positionview')
                  } else if(dataResponse == "Insert Error") {
                    WriteLog("Message","Position","handleSubmit /position/putPosition",res.data.message2,userID)
                    setMessage("Error in Inserting new Position")
                    setColorMessage("red")  
                    //navigate('/500');
                  } 
              })
              .catch(err => {
                WriteLog("Message","Position","handleSubmit /position/putPosition",err.message,userID)
                navigate('/500');
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
                    navigate('/configurations/positionview')
                  } else if(dataResponse == "Update Error") {
                    WriteLog("Message","Position","handleSubmit /position/updatePosition",res.data.message2,userID)
                    setMessage("Error in Updating Position")
                    setColorMessage("red")  
                    //navigate('/500');
                  } 
              })
              .catch(err => {
                WriteLog("Message","Position","handleSubmit /position/updatePosition",err.message,userID)
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
          WriteLog("Message","Position","handleSubmit ","Error in try/catch  " + err.message,userID)
        }
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
          <CForm onSubmit={handleSubmit}>
            <CRow >
                <CCol >
                    <CCardBody>
                   
                      <CInputGroup size="sm" >

                          <FormControl fullWidth >
                            <InputLabel >Department</InputLabel>
                              <Select  size="sm" className="mb-3" aria-label="Small select example"
                                name='departmentid' onChange={handleInput} value={values.departmentid} >
                                  {
                                  department.map((val,result) => 
                                  
                                    <MenuItem key={val.id} value={val.id}  >{val.departmentName}</MenuItem>
                                  )
                                  }
                              </Select>

                          </FormControl>


                      </CInputGroup>


                      <CInputGroup size="sm" className="mb-3" >
                          <TextField onChange={e => handleInput(e)} name="name" id="outlined-textarea"
                            value={values.name} fullWidth label="Position Name" placeholder="Position Name" />
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

export default Position
