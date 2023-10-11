// eslint-disable-next-line

import React, { useEffect, useRef, useState } from 'react'


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





import {useNavigate} from 'react-router-dom';
import bcrypt from 'bcryptjs'


import AlertMessages from 'src/components/alertmessages/AlertMessages';

const PassBcrypt = () => {

  const navigate = useNavigate();
  

  const [message,setMessage] = useState("");
  const [colorMessage,setColorMessage] = useState("");

  const passwordInputRef = useRef()
  



  async function  handleSubmit(event) {
 // eslint-disable-next-line 

      event.preventDefault();

      const passw = passwordInputRef.current.value;


   //  const salt = bcrypt.genSaltSync(10)
    // const passw = this.password.value
   

    console.log("Original : " + passw)

     let hashedpass = bcrypt.hashSync(passw,10)

    console.log("Encrypted : " + hashedpass)
    // this.hashpass.value = hashedpass
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

                  <CInputGroup size="sm" className="mb-3">
                    
                    <input type='password' placeholder='password' ref={passwordInputRef}>
                    </input>

                    

                  </CInputGroup>



                  </CCardBody> 
                </CCol>
              </CRow>
              <CButton
                style={{ width: "100%" }}
               onClick={handleSubmit}
                color="success"
              >
                Checkin
              </CButton>
            </CForm>
          </CCard>
        </CCol>

    </CRow>
  )
}

export default PassBcrypt
