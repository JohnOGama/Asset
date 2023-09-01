
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
    CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem

  } from '@coreui/react'


import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import imgDefault from '../../../assets/images/Defaultsupplier.png'

import {useNavigate} from 'react-router-dom';
import {useLocation} from 'react-router-dom';

import appSettings from 'src/AppSettings' // read the app config
import { decrypt } from 'n-krypta';
// encrypt,compare
import WriteLog from 'src/components/logs/LogListener';

function Supplier() {

  const navigate = useNavigate();
  const {state} = useLocation();
  let rowId = ""
  
  const [file,setFile] = useState("")

  try {
     rowId = state.params;
  }
  catch(err){
   navigate('/dashboard')
  }
 
  const [userID,setUserID] = useState("")
  //const [success,SetSuccess] = useState("");
  //const [errors,setErrors] = useState({})
  const [message,setMessage] = useState("")
  const [colorMessage,setColorMessage] = useState('red')
  const [values,setValues] = useState({
    supplierid: "",
    name: "",
    address: "",
    contactno: "",
    email: "",
    imgFile: ""
  })


  const config = {
    headers:{
      "Content-Type":"multipart/form-data"
    }
}


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
      
      LoadSupplierByID()

    },[])

    function LoadSupplierByID() {

      try {
        if(userID == "") 
        {
          getUserInfo()
        }
      if(!rowId == "") {
        const url = 'http://localhost:3001/supplier/getsupplierbyID'
        axios.post(url,{rowId},{
          headers: {
              "Content-Type": "application/json"
          }
      })
        .then(res => {
          const dataResponse = res.data.message;
          if(dataResponse == "Record Found") {
           
            setValues(
              {...values,
                  supplierid: res.data.result[0].supplierid,
                  name: res.data.result[0].name,
                  address: res.data.result[0].address,
                  contactno: res.data.result[0].contactno,
                  email: res.data.result[0].email,
                  imgFile: res.data.result[0].imgFilename
              });
  
          } else if (dataResponse == "No Record Found") {
            setMessage(dataResponse)
            setColorMessage('red')
            WriteLog("Error","Supplier","LoadSupplierByID /supplier/getsupplierbyID",res.data.message,userID)
            //navigate('/500');
          }
        }).catch(err => {
          WriteLog("Error","Supplier","LoadSupplierByID /supplier/getsupplierbyID"," Error in then/catch \n" + err.message,userID)
         
        })
      }
    }
    catch(err) {
      WriteLog("Error","Supplier","LoadSupplierByID /supplier/getsupplierbyID"," Error in try/catch \n" + err.message,userID)
    }

    }

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
          const address = values.address;
          const contactno = values.contactno;
          const email = values.email;
          if((!name == "") && 
            (!address == "") && 
            (!contactno == "") && 
            (!email == "")) 
            {

              if (rowId == "") {

              const url = 'http://localhost:3001/supplier/putSupplier'
              axios.post(url,{name,address,contactno,email,userID})
              .then(res => {  
                  const dataResponse = res.data.message 
                  if(dataResponse == "Insert Success"){ 
                    
                  WriteLog("Message","Supplier","handleSubmit /supplier/putSupplier", 
                  " New Category "
                  + "\n Name: " + name 
                  + "\n Address  :  " + address 
                  + "\n ... " 
                  + "\n User : " + userID ,userID)
                    navigate('/configurations/supplierview')
                  } else if(dataResponse == "Insert Error") {
                    WriteLog("Error","Supplier","handleSubmit /supplier/putSupplier",res.data.message ,userID)
                    setMessage(dataResponse)
                    setColorMessage("red")  
                    //navigate('/500');
                  } 
              })
              .catch(err => {
                WriteLog("Error","Supplier","handleSubmit /supplier/putSupplier","Error in then/catch \n" + err.message ,userID)
                navigate('/500');
              })
              
            }
            else {
              /// update here

              const url = 'http://localhost:3001/supplier/updateSupplier'
              //axios.post(url,{name,description,userID,rowId})
              axios.post(url,{name,address,contactno,email,userID,rowId})
              .then(res => {  
                  const dataResponse = res.data.message 
                  if(dataResponse == "Update Success"){ 
                    WriteLog("Message","Supplier","handleSubmit /supplier/updateSupplier", 
                    " New Category "
                    + "\n SupplierID : " + rowId
                    + "\n Name: " + name 
                    + "\n Address  :  " + address 
                    + "\n ... " 
                    + "\n User : " + userID ,userID)
                    navigate('/configurations/supplierview')
                  } else if(dataResponse == "Update Error") {
                    WriteLog("Error","Supplier","handleSubmit /supplier/updateSupplier",res.data.message ,userID)
                    setMessage(dataResponse)
                    setColorMessage("red")  
                    //navigate('/500');
                  } 
              })
              .catch(err => {
                WriteLog("Error","Supplier","handleSubmit /supplier/updateSupplier","Error in then/catch \n" + err.message,userID)
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
          WriteLog("Error","Supplier","handleSubmit"," Error in try/catch" + err.message,userID)
        }
    }


    function handleUploadImage(e) {
      e.preventDefault()
      try {
      
        if(!file == "") {
          if(userID == "") 
          {
            getUserInfo()
          }
          const rowId = values.supplierid
          const url = 'http://localhost:3001/supplier/updateSupplierImage'
          axios.post(url,{file,rowId},config)
          .then(res => { 
            const dataResponse = res.data.message 
            if(dataResponse == "Upload Success"){ 
             
              WriteLog("Message","AssetEdit","handleUploadImage /supplier/updateSupplierImage",
                "Upload Supplier Image \n"
                + "File : " + file.name
                + "SupplierID : " + rowId
                ,userID)
      
                LoadSupplierByID()
            } else if(dataResponse == "Update Error") {
              WriteLog("Error","AssetEdit","handleUploadImage /supplier/updateSupplierImage",
                "Upload Supplier Image \n"
                + "File : " + file.name
                + "SupplierID : " + rowId
                ,userID)
            } 
          })
          .catch(err => {
            WriteLog("Error","AssetEdit","handleUploadImage /supplier/updateSupplierImage",
                "Error in then/catch \n"
                + err.message
                ,userID)
           
          })
  
        }
        else {
          setMessage("Select image to upload")
          setColorMessage('orange')
        }
  

    }
    catch(err) {
      WriteLog("Error","AssetEdit","handleUploadImage /assets/upDateImage",
      "Error in try/catch \n"
      + err.message
      ,userID)
    }
    
  }

  return (

    <CCol xs={12}>
         <CCard className="mb-3" size="sm"  >
         <CCardHeader>
            <h6>
            <span className="message" style={{ color: '#5da4f5'}}> <> Asset Category </></span> 
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
                            value={values.name} fullWidth label="Supplier Name" placeholder="Supplier Name" />
                      </CInputGroup>
                      <CInputGroup size="sm" className="mb-3" >
                          <TextField onChange={handleInput} name="address" id="outlined-textarea" 
                              value={values.address} fullWidth label="Address" placeholder="Address" 
                              multiline  rows={5}  />
                      </CInputGroup>
                      <CInputGroup size="sm" className="mb-3" >
                          <TextField onChange={e => handleInput(e)} name="contactno" id="outlined-textarea"
                            value={values.contactno} fullWidth label="Contact No" placeholder="Contact No" />
                      </CInputGroup>
                      <CInputGroup size="sm" className="mb-3" >
                          <TextField onChange={e => handleInput(e)} name="email" id="outlined-textarea"
                            value={values.email} fullWidth label="Email" placeholder="email" />
                      </CInputGroup>
                      <CInputGroup xs={5} size="xs" className="mb-3">
                        <CAccordion flush={false} size="xs" className="mb-3" fullWidth>
                          <CAccordionItem itemKey={1} size="xs" className="mb-3">
                          <CAccordionHeader>
                            Upload Image here
                          </CAccordionHeader>
                            <CAccordionBody>
                              <input name="file" id="file" type="file" 
                              onChange={ e => setFile(e.target.files[0])}  />
                              <div className="d-grid" style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  }} >
                                <CButton color="success" style={{ width: '100%' }} onClick={handleUploadImage}>Update Logo</CButton>
                              </div>
                            </CAccordionBody>
                          </CAccordionItem>
                        </CAccordion>
                      </CInputGroup>


                    </CCardBody>

                </CCol>
                <CCol>
                  <CRow>
                    <CCol>
                      <CCardBody xs={6}  >        
                                        
                        <CInputGroup size="sm" className="mb-3" >
                            <div className="formInput" >
                              <img src={
                                values.imgFile
                                ?  require(`../../../../backend/uploads/${values.imgFile}`)
                                : imgDefault 
                              }
                              alt="" style={{ height:'80%', width: '80%', textAlign: "center", margin: "auto"}}    />
                            </div>  
                          </CInputGroup>
                      </CCardBody>

                    </CCol>

                  </CRow>
                  <CRow>

                  </CRow>
                </CCol>
            </CRow>
            <CRow>
              <CCol>
                <div className="d-grid" style={{
                    
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    }} >
                    <CButton  style={{   width: '150%' }}  color="success" type='submit' >Save</CButton>
                </div>
              </CCol>
            </CRow>
            <br></br>


          </CForm>
         </CCard>
         
    </CCol>
  )
}

export default Supplier
