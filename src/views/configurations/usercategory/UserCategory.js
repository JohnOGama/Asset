
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
    //CFormSelect,
    //CFormInput,
   // CInputGroupText,
    CInputGroup,
   // CFormLabel,
  //  CFormFloating,
  //  CLink,
  } from '@coreui/react'

  import TextField from '@mui/material/TextField';

import {useNavigate} from 'react-router-dom';
import {useLocation} from 'react-router-dom';

import appSettings from 'src/AppSettings' // read the app config
import { decrypt } from 'n-krypta';
// encrypt,compare
import WriteLog from 'src/components/logs/LogListener';

function UserCategory() {

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
  //const [success,SetSuccess] = useState("");
  //const [errors,setErrors] = useState({})
  const [message,setMessage] = useState("")
  const [colorMessage,setColorMessage] = useState('red')

  const [values,setValues] = useState({
    assetid: "",
    name: "",
    description: ""
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
      const url = 'http://localhost:3001/usercategory/getuserCategorybyID'
      axios.post(url,{rowId})
      .then(res => {
        const dataResponse = res.data.message;
        if(dataResponse == "Record Found") {
         
          setValues(
            {...values,assetid: res.data.result[0].categoryID,
              name: res.data.result[0].categoryName,
              description: res.data.result[0].categoryDesc
            });

        } else if (dataResponse == "No Record Found") {
          setMessage(dataResponse)
          setColorMessage('red')
          WriteLog("Error","UserCategory","useEffect /usercategory/getuserCategorybyID",res.data.message,userID)
          //navigate('/500');
        }
      }).catch(err => {
        WriteLog("Error","UserCategory","useEffect /usercategory/getuserCategorybyID"," Error in try/catch \n" + err.message,userID)
       
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

              const url = 'http://localhost:3001/usercategory/putuserCategory'
              axios.post(url,{name,description,userID})
              .then(res => {  
                  const dataResponse = res.data.message 
                  if(dataResponse == "Insert Success"){ 
                    
                  WriteLog("Message","UserCategory","handleSubmit /usercategory/putuserCategory", 
                  " New Category "
                  + "\n Name: " + name 
                  + "\n Desc  :  " + description 
                  + "\n User : " + userID ,userID)
                    navigate('/configurations/usercategoryview')
                  } else if(dataResponse == "Insert Error") {
                    WriteLog("Error","UserCategory","handleSubmit /usercategory/putuserCategory",res.data.message ,userID)
                    setMessage(dataResponse)
                    setColorMessage("red")  
                    //navigate('/500');
                  } 
              })
              .catch(err => {
                WriteLog("Error","UserCategory","handleSubmit /usercategory/putuserCategory","Error in then/catch \n" + err.message ,userID)
                navigate('/500');
              })
              
            }
            else {
              /// update here

              const url = 'http://localhost:3001/usercategory/updateuserCategory'
              axios.post(url,{name,description,userID,rowId})
              .then(res => {  
                  const dataResponse = res.data.message 
                  if(dataResponse == "Update Success"){ 
                    WriteLog("Message","UserAssetCategory","handleSubmit /usercategory/updateuserCategory", 
                    " New Category "
                    + "\n AssetID : " + rowId
                    + "\n Name: " + name 
                    + "\n Desc  :  " + description 
                    + "\n User : " + userID ,userID)
                    navigate('/configurations/usercategoryview')
                  } else if(dataResponse == "Update Error") {
                    WriteLog("Error","UserAssetCategory","handleSubmit /usercategory/updateuserCategory",res.data.message ,userID)
                    setMessage(dataResponse)
                    setColorMessage("red")  
                    //navigate('/500');
                  } 
              })
              .catch(err => {
                WriteLog("Error","UserAssetCategory","handleSubmit /usercategory/updateuserCategory", "Error in then/catch \n" + err.message,userID)
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
          WriteLog("Error","AssetCategory","handleSubmit"," Error in try/catch",userID)
        }
    }

  return (

    <CCol xs={12}>
         <CCard className="mb-3" size="sm"  >
         <CCardHeader>
            <h6>
              <span className="message" style={{ color: '#5da4f5'}}> <> User Category </></span> 
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
                            value={values.name} fullWidth label="Category Name" placeholder="Notes" />
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
                <div className="d-grid" style={{
                            
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          
                            }}>
                  <CButton style={{  margin:'5px', width: '120%' }}  color="success" type='submit'>Save</CButton>
                </div>
            </CRow>
          </CForm>
         </CCard>
    </CCol>
  )
}

export default UserCategory
