// eslint-disable-next-line
import  { useEffect, useState } from 'react'
import axios from 'axios'
import * as React from 'react'


import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
  CForm,
  CButton,
  CFormSelect,
  CFormInput,
  CInputGroupText,
  CInputGroup,
  CFormLabel,
  CFormFloating
} from '@coreui/react'

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';


import {useNavigate} from 'react-router-dom';

const Logout = () => {

  const navigate = useNavigate();


  function handleSubmit(event) {
    try {

      event.preventDefault();

     localStorage.removeItem('id')
     localStorage.removeItem('display')
     localStorage.clear()
     navigate('/login');
      //setErrors(ValidationRegister(values))
      
    }
    catch(err) {
      console.log(err)
    }
  }

  return (
    
      <CCol xs={12}>
       
          <CForm onSubmit={handleSubmit}>
              <CRow>
                <CCol>
                </CCol>
                <CCol>
   
                <div className="d-grid">
                  <CButton color="success" type='submit'>Do you want to LogOut</CButton>
                </div>
    
                </CCol>
                <CCol>

                </CCol>

              </CRow>

          </CForm>

    
      </CCol>

  )
}

export default Logout
