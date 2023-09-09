
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

import AlertMessages from 'src/components/alertmessages/AlertMessages';

function AssetCategory() {

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
 
  //const [userID,setUserID] = useState("")
  var userID = ""
  //const [success,SetSuccess] = useState("");
  //const [errors,setErrors] = useState({})
 // const [message,setMessage] = useState("")
 // const [colorMessage,setColorMessage] = useState('red')

  const [values,setValues] = useState({
    assetid: "",
    name: "",
    description: ""
  })

  function CheckRole() {
    try {

      userRole = decrypt(window.localStorage.getItem('Kgr67W@'), appSettings.secretkeylocal)

    }
    catch(err) {
      WriteLog("Error","AssetCategory","CheckRole Local Storage is tampered", err.message,userID)
      navigate('/dashboard')
    }
  }


  function getUserInfo() {

    try {
      CheckRole()
    
        if (userRole === "Admin" || userRole === "IT")
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
      const url = 'http://localhost:3001/category/getAssetCategorybyID'
      axios.post(url,{rowId})
      .then(res => {
        const dataResponse = res.data.message;
        if(dataResponse == "Record Found") {
         
          setValues(
            {...values,assetid: res.data.result[0].assetCategID,
              name: res.data.result[0].assetCategName,
              description: res.data.result[0].description
            });

        } else if (dataResponse == "No Record Found") {
         AlertMessages("No assete category found","Warning")
          // setMessage(dataResponse)
         // setColorMessage('red')
          WriteLog("Error","AssetCategory","useEffect /category/getAssetCategorybyID",res.data.message,userID)
          //navigate('/500');
        }
      }).catch(err => {
        AlertMessages('Error in loading asset category','Error')
        WriteLog("Error","AssetCategory","useEffect /category/getAssetCategorybyID"," Error in try/catch \n" + err.message,userID)
       
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

              const url = 'http://localhost:3001/category/putCategory'
              axios.post(url,{name,description,userID})
              .then(res => {  
                  const dataResponse = res.data.message 
                  if(dataResponse == "Insert Success"){ 
                  AlertMessages('New Category is addedd','Success')
                  WriteLog("Message","AssetCategory","handleSubmit /category/putCategory", 
                  " New Category "
                  + "\n Name: " + name 
                  + "\n Desc  :  " + description 
                  + "\n User : " + userID ,userID)
                    //navigate('/configurations/categoryview')
                    navigate('/configurations/assetcategory')
                  } else if(dataResponse == "Insert Error") {
                    WriteLog("Error","AssetCategory","handleSubmit /category/putCategory",res.data.message ,userID)
                    AlertMessages('New category is not added','Error')
                   
                  } 
              })
              .catch(err => {
                AlertMessages('Error in inserting category','Error')
                WriteLog("Error","AssetCategory","handleSubmit /category/putCategory",err.message ,userID)
                
              })
              
            }
            else {
              /// update here

              const url = 'http://localhost:3001/category/updateCategory'
              axios.post(url,{name,description,userID,rowId})
              .then(res => {  
                  const dataResponse = res.data.message 
                  if(dataResponse == "Update Success"){ 
                    
                    AlertMessages('Category updated successfully','Success')

                    WriteLog("Message","AssetCategory","handleSubmit /category/updateCategory", 
                    " New Category "
                    + "\n AssetID : " + rowId
                    + "\n Name: " + name 
                    + "\n Desc  :  " + description 
                    + "\n User : " + userID ,userID)
                    
                  } else if(dataResponse == "Update Error") {
                    WriteLog("Error","AssetCategory","handleSubmit /category/updateCategory",res.data.message ,userID)
                    
                    AlertMessages('Category is not updated','Warning')

                  //  setMessage(dataResponse)
                  //  setColorMessage("red")  
                    //navigate('/500');
                  } 
              })
              .catch(err => {
                AlertMessages('Error in submitting status','Error')
                WriteLog("Error","AssetCategory","handleSubmit /category/updateCategory",err.message,userID)
                
              })

            }
          }
          else
          {
            AlertMessages("All fields must not be emtpy",'Error')
          
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
              <span className="message" style={{ color: '#5da4f5'}}> <> Asset Category </></span> 

            </h6>
          </CCardHeader>
          <CForm onSubmit={handleSubmit}>
            <CRow >
                <CCol >
                  <AlertMessages/>
                    <CCardBody>
                      <CInputGroup size="sm" className="mb-3" >
                          <TextField onChange={e => handleInput(e)} name="name" id="outlined-textarea"
                            value={values.name} fullWidth label="Category Name" placeholder="Notes"
                            error = {
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
                <div className="d-grid" style={{
                            
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            }} >
                  <CButton style={{  margin:'5px', width: '120%' }} color="success" type='submit'>Save</CButton>
              </div>

                  
            </CRow>
          </CForm>
         </CCard>
    </CCol>
  )
}

export default AssetCategory
