// eslint-disable-next-line
import React, { useEffect, useState } from 'react'
import axios from 'axios'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CButton,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CAccordion,
  CAccordionItem,CAccordionHeader,
  CAccordionBody,
  CImage
} from '@coreui/react'

import Select, { SelectChangeEvent } from '@mui/material/Select';

import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import imgDefault from '../../../assets/images/defaultProfile.png'

import { decrypt } from 'n-krypta';
import appSettings from 'src/AppSettings' // read the app config
import WriteLog from 'src/components/logs/LogListener';
import {useNavigate} from 'react-router-dom';

import AlertMessages from 'src/components/alertmessages/AlertMessages';

const UpdateProfile = () => {

  const navigate = useNavigate();
  
  var userID = ""
  const [category,SetCategory] = useState([]);
  const [position,setPosition] = useState([]);

  const [message,setMessage] = useState("");
  const [colorMessage,setColorMessage] = useState("");

  const [file,setFile] = useState("")

  const [values,setValues] = useState({
    categoryID: '',
    categoryname: '',
    positionID: '',
    firstname: '',
    lastname: '',
    displayname: '',
    email: '',
    imgFile: ''
  })

  function getUserInfo() {

    if((!window.localStorage.getItem('id') == null) || (window.localStorage.getItem('id') !== "0")) {
        userID = decrypt(window.localStorage.getItem('id'), appSettings.secretkeylocal)
        
    }
    else
    { 
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
    const url = 'http://localhost:3001/getCategory'
    
    axios.post(url)
    .then(res => {
      const dataResponse = res.data.message;
      if(dataResponse == "Record Found") {
        SetCategory(res.data.result)
      } else if (dataResponse == "No Record Found") {
        setValues({
          categoryID: '',
          categoryname: '',
          positionID: '',
          firstname: '',
          lastname: '',
          displayname: '',
          email: '',
          imgFile: ''

        })
        AlertMessages('Profile not found ','Warning')
        WriteLog("Message","UpdateProfile","useEffect /getCategory",dataResponse,userID)
      }
    }).catch(err => {
      AlertMessages('Error in loading profile','Error')
      WriteLog("Error","UpdateProfile","useEffect /getCategory",err.message,userID)
    })
},[])

useEffect(() => {
  if(userID == "") 
  {
    getUserInfo()
  }
  const url = 'http://localhost:3001/position/viewallposition'
  axios.post(url)
  .then( res => {
    const dataResponse = res.data.message;
    if(dataResponse === "Record Found") {
      setPosition(res.data.result)
    } else if (dataResponse === "No Record Found") {
      AlertMessages(' Position not found','Error')
      WriteLog("Message","UpdateProfile","useEffect /position/viewallposition",dataResponse,userID)
    }
  }).catch(err => {
    AlertMessages('Error in loading Profile','Error')
    WriteLog("Error","UpdateProfile","useEffect /position/viewallposition",err.message,userID)
  }) 
},[])


/// load profile based on userID
useEffect(() => {

  LoadProfile()
},[])

function LoadProfile() {
  try {

    if(userID == "") 
    {
      getUserInfo()
    }

    const userid =  userID

    const url = 'http://localhost:3001/users/getuserprofile'
    axios.post(url,{userid})
    .then(res => {
      const dataResponse = res.data.message;
      if(dataResponse == "Profile Found") {
       // console.log("CATEG ==> " + res.data.result[0].categoryName)
       // console.log("FNAME ==> " + res.data.result[0].firstname) 
        setValues(
          {...values,categoryID: res.data.result[0].groupTypeID,
            categoryname: res.data.result[0].categoryName,
            positionID: res.data.result[0].positionID,
            firstname: res.data.result[0].firstname,
            lastname: res.data.result[0].lastname,
            displayname:res.data.result[0].displayName,
            email:res.data.result[0].email,
            imgFile: res.data.result[0].imgFilename
          });
         
  
      } else if (dataResponse == "No Profile Found") {
        AlertMessages('Profile not found','Error')
        WriteLog("Message","UpdateProfile","LoadProfile /users/getuserprofile",res.data.message2,userID)
      }
  
    }).catch(err => {
      AlertMessages('Loading Profile error','Error')
      WriteLog("Error","UpdateProfile","LoadProfile /users/getuserprofile","Error in then/catch \n" +  err.message,userID)
    })

  }
  catch(err) {
    AlertMessages('Error in profile','Error')
    WriteLog("Error","UpdateProfile","LoadProfile /users/getuserprofile","Error in try/catch \n" + err.message,userID)
  }
}

const handleInput = (e) => {

  setValues(values => ({...values,[e.target.name]: [e.target.value]}))
  console.log(values)
}

useEffect(() => {
  //console.log(values);
},[values])


  function handleSubmit(event) {
    try {
     
      if(userID == "") 
      {
        getUserInfo()
      }
      
      event.preventDefault();
     // setErrors(ValidationProfile(values))
      if((!values.categoryID == "") && 
        (!values.positionID == "") && 
        (!values.lastname == "") && 
        (!values.firstname == "") && 
        (!values.email== "") && 
        (!values.displayname == "")) {
        
        const url = 'http://localhost:3001/auth/updateProfile'
        const categoryID = values.categoryID
        const positionID = values.positionID
        const firstname = values.firstname
        const lastname = values.lastname
        const displayname = values.displayname
        const email = values.email
        const userDisplayID = userID
        
        axios.post(url,{firstname,lastname,email,positionID,categoryID,displayname,userDisplayID})
        .then(res => {
          const dataResponse = res.data.message

          if(dataResponse == "Upload Success"){
            AlertMessages('Profile successfully updated.', 'Success')
            WriteLog("Message","UpdateProfile","handleSubmit /auth/updateProfile", 
            " Update Profile "
            + "\n Name: " + lastname + ", " + firstname 
            + "\n....  " 
            + "\n User : " + userID ,userID)
            
            //navigate('/login');
          } else if(dataResponse == "Upload Error") {
            AlertMessages('Profile not updated successfully !','Error')
            
            WriteLog("Error","UpdateProfile","handleSubmit /auth/updateProfile",res.data.message2,userID)
          } 
        })
      } else (
        AlertMessages('All fields must not be empty !','Error')
        
      )
    } catch(err) {
      AlertMessages('Error in profile','Error')
      WriteLog("Error","UpdateProfile","handleSubmit",err.message,userID)
    }
  }


  function handleUploadImage(e) {
   
    e.preventDefault()
    try {
      if(userID == "") 
      {
        getUserInfo()
      }
      if(!file == "") {

        const config = {
          headers:{
              "Content-Type":"multipart/form-data"
          }
      }
    
        
      // console.log(userID)
        const url = 'http://localhost:3001/auth/updateImage'
        axios.post(url,{file,userID},config)
        .then(res => { 
          const dataResponse = res.data.message 
          if(dataResponse == "Upload Success"){ 
           
            WriteLog("Message","UpdateProfile","handleUploadImage /assets/upDateImage",
              "Upload selected Image \n"
              + "File : " + file.name
              + "userID : " + userID
              ,userID)
    
              //LoadProfile()
             AlertMessages('Profile image successfully uploaded','Success')
          } else if(dataResponse == "Update Error") {
            AlertMessages('Error in updating Profile !','Error')
            WriteLog("Error","UpdateProfile","handleUploadImage /assets/upDateImage",
              "Upload selected Image \n"
              + "File : " + file.name
              + "userID : " + userID
              ,userID)
          } 
        })
        .catch(err => {
          AlertMessages('Error in submtting Profile Image','Error')
          WriteLog("Error","UpdateProfile","handleUploadImage /assets/upDateImage",
              "Error in then/catch \n"
              + err.message
              ,userID)
         
        })

      }
      else {
        AlertMessages('Select Image to upload','Warning')
      }


    
  }
  catch(err) {
    AlertMessages('Error in Profile Image','Error')
    WriteLog("Error","UpdateProfile","handleUploadImage /assets/upDateImage",
    "Error in try/catch \n"
    + err.message
    ,userID)
  }
  
}


  return (

    <CRow>
        <CCol xs={12}>
          <CCard className="mb-3" size="sm">
            <CCardHeader>
              <AlertMessages/>
                <h6>
                <span className="message" style={{ color: '#5da4f5'}}> <> Update Profile</></span> 
                
                </h6>
            </CCardHeader>
            <CForm onSubmit={handleSubmit}>
              <CRow>
                <CCol>
                <CCardBody>
                <CInputGroup size="sm" className="mb-3" >
                  <Select size="sm" fullWidth className="mb-3" aria-label="Small select example"
                  name='categoryID' onChange={handleInput} value={values.categoryID}
                  error= {values.categoryID ? false : true}
                  >
                  {
                      category.map((val,result) => 
                        
                          <option name={result.toString()} key={val.categoryID} value={val.categoryID}  > {val.categoryName} </option>
                      )
                  }
                  </Select>
                </CInputGroup>
                <CInputGroup size="sm" className="mb-3">
                  <Select size="sm" className="mb-3"  aria-label="Small select example"
                    name='positionID' fullWidth onChange={handleInput}
                    error = {values.positionID ? false : true} value= {values.positionID} >
                    {
                        position.map((val,result) => 
                            <option name={result.toString()} key={val.id}  value={val.id}  > {val.positionName} </option>
                          
                        )
                    }
                  </Select>
                  </CInputGroup>
                  <CInputGroup size="sm" className="mb-3">
                    
                    <TextField onChange={e => handleInput(e)} name="firstname" id="outlined-textarea"
                            value={values.firstname} fullWidth label="Firstname" placeholder="Firstname"
                            error= {
                              values.firstname
                              ? false
                              : true
                            }

                    />

                  </CInputGroup>
                  <CInputGroup size="sm" className="mb-3">

                    <TextField onChange={e => handleInput(e)} name="lastname" id="outlined-textarea"
                            value={values.lastname} fullWidth label="Lastname" placeholder="Lastname"
                            error= {
                              values.lastname
                              ? false
                              : true
                            }

                    />
                  </CInputGroup>


                  </CCardBody> 
                </CCol>
                <CCol>
                  <CCardBody>
                <CInputGroup size="sm" className="mb-3">


                    <TextField onChange={e => handleInput(e)} name="displayname" id="outlined-textarea"
                            value={values.displayname} fullWidth label="Displayname" placeholder="Displayname"
                            error= {
                              values.displayname
                              ? false
                              : true
                            }

                    />

                    </CInputGroup>
                    <CInputGroup className="mb-3">

                    <TextField onChange={e => handleInput(e)} name="email" id="outlined-textarea"
                            value={values.displayname} fullWidth label="Email" placeholder="Email"
                            error= {
                              values.email
                              ? false
                              : true
                            }

                    />

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
                 
                  <CCardBody xs={6}  >        

                    <CInputGroup size="sm" className="mb-3" >
                    <div className="formInput" >
                    <CImage src={
                    values.imgFile
                    ?  require(`../../../../backend/uploads/${values.imgFile}`)
                    : imgDefault 
                    }
                    alt="" style={{  width: '80%', textAlign: "center", margin: "auto"}}    />
                    </div>  
                    </CInputGroup>
                  </CCardBody>
              
                </CCol>
              </CRow>
              <CRow>
                <CCol>

                  <div className="d-grid" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    }} >
                      <CButton color="success" style={{   width: '200%' }}  type='submit'>Save</CButton>
                  </div>
                </CCol>
              
              </CRow>
              <br></br>

            </CForm>
          </CCard>
        </CCol>

    </CRow>
  )
}

export default UpdateProfile
