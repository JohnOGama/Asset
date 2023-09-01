// eslint-disable-next-line
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormInput,
  CButton,
  CForm,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem
} from '@coreui/react'


import imgDefault from '../../../assets/images/defaultProfile.png'

import { decrypt } from 'n-krypta';
import appSettings from 'src/AppSettings' // read the app config
import WriteLog from 'src/components/logs/LogListener';
import {useNavigate} from 'react-router-dom';

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
    const url = 'http://localhost:3001/getCategory'
    
    axios.post(url)
    .then(res => {
      const dataResponse = res.data.message;
      if(dataResponse == "Record Found") {
        SetCategory(res.data.result)
      } else if (dataResponse == "No Record Found") {
        WriteLog("Message","UpdateProfile","useEffect /getCategory",dataResponse,userID)
      }
    }).catch(err => {
      WriteLog("Error","UpdateProfile","useEffect /getCategory",err.message,userID)
    })
},[])

useEffect(() => {
  const url = 'http://localhost:3001/position/viewallposition'
  axios.post(url)
  .then( res => {
    const dataResponse = res.data.message;
    if(dataResponse === "Record Found") {
      setPosition(res.data.result)
    } else if (dataResponse === "No Record Found") {
      WriteLog("Message","UpdateProfile","useEffect /position/viewallposition",dataResponse,userID)
    }
  }).catch(err => {
    WriteLog("Error","UpdateProfile","useEffect /position/viewallposition",err.message,userID)
  }) 
},[])


/// load profile based on userID
useEffect(() => {

  LoadProfile()
},[])

function LoadProfile() {
  try {

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
        WriteLog("Message","UpdateProfile","LoadProfile /users/getuserprofile",res.data.message2,userID)
      }
  
    }).catch(err => {
      WriteLog("Error","UpdateProfile","LoadProfile /users/getuserprofile","Error in then/catch \n" +  err.message,userID)
    })

  }
  catch(err) {
    WriteLog("Error","UpdateProfile","LoadProfile /users/getuserprofile","Error in try/catch \n" + err.message,userID)
  }
}

const handleInput = (e) => {
  setValues(values => ({...values,[e.target.name]: [e.target.value]}))
  
  
  //console.log(values)
}

useEffect(() => {
  //console.log(values);
},[values])


  function handleSubmit(event) {
    try {
      getUserInfo()
      
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

          if(dataResponse == "Update Success"){
            WriteLog("Message","UpdateProfile","handleSubmit /auth/updateProfile", 
            " Update Profile "
            + "\n Name: " + lastname + ", " + firstname 
            + "\n....  " 
            + "\n User : " + userID ,userID)
            setMessage("Update successfull")
            setColorMessage("green")
            //navigate('/login');
          } else if(dataResponse == "Update Error") {
            setMessage("Update Error")
            setColorMessage("red")
            WriteLog("Error","UpdateProfile","handleSubmit /auth/updateProfile",res.data.message2,userID)
          } else {
            //setMessage(dataResponse)

          }
        })
      } else (
        setMessage("Incomplete Information")
      )
    } catch(err) {
      WriteLog("Error","UpdateProfile","handleSubmit",err.message,userID)
    }
  }


  function handleUploadImage(e) {
    getUserInfo()
    e.preventDefault()
    try {
    
      if(!file == "") {

        const config = {
          headers:{
              "Content-Type":"multipart/form-data"
          }
      }
    
        
       console.log(userID)
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
    
              LoadProfile()
              setMessage('Upload image success')
              setColorMessage('green')
          } else if(dataResponse == "Update Error") {
            WriteLog("Error","UpdateProfile","handleUploadImage /assets/upDateImage",
              "Upload selected Image \n"
              + "File : " + file.name
              + "userID : " + userID
              ,userID)
          } 
        })
        .catch(err => {
          WriteLog("Error","UpdateProfile","handleUploadImage /assets/upDateImage",
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
    WriteLog("Error","UpdateProfile","handleUploadImage /assets/upDateImage",
    "Error in try/catch \n"
    + err.message
    ,userID)
  }
  
}


  return (

    <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
                <h6>
                <span className="message" style={{ color: '#5da4f5'}}> <> Update Profile</></span> 
                <br></br>
                <strong><span className="message" style={{ color: colorMessage}}><p>{message}</p></span> </strong>
                </h6>
            </CCardHeader>
            <CForm onSubmit={handleSubmit}>
              <CRow>
                <CCol>
                <CCardBody>
                  <CFormSelect size="sm" className="mb-3"  aria-label="Small select example"
                  name='categoryID' onChange={handleInput} value={values.categoryID} >
                  {
                      category.map((val,result) => 
                        
                          <option name={result.toString()} key={val.categoryID} value={val.categoryID}  > {val.categoryName} </option>
                      )
                  }
                  </CFormSelect>
                  <CFormSelect size="sm" className="mb-3"  aria-label="Small select example"
                    name='positionID' onChange={handleInput} value= {values.positionID} >
                    {
                        position.map((val,result) => 
                            <option name={result.toString()} key={val.id}  value={val.id}  > {val.positionName} </option>
                          
                        )
                    }
                  </CFormSelect>
                  <CInputGroup size="sm" className="mb-3">
                    <CInputGroupText id="inputGroup-sizing-sm">Firstname</CInputGroupText>
                    <CFormInput aria-label="Sizing example input"  aria-describedby="inputGroup-sizing-sm"
                    name='firstname' onChange={handleInput} value={values.firstname} />
                  </CInputGroup>
                  <CInputGroup size="sm" className="mb-3">
                    <CInputGroupText id="inputGroup-sizing-sm">Lastname</CInputGroupText>
                    <CFormInput aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"
                    name='lastname' onChange={handleInput} value={values.lastname}/>
                  </CInputGroup>
                  <CInputGroup size="sm" className="mb-3">
                    <CInputGroupText id="inputGroup-sizing-sm">Display Name</CInputGroupText>
                    <CFormInput aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" 
                    name='displayname' onChange={handleInput} value={values.displayname} />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                      <CInputGroupText>@</CInputGroupText>
                      <CFormInput placeholder="Email" name="email" onChange={handleInput} value={values.email}
                        autoComplete="email" />
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
                    <img src={
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
