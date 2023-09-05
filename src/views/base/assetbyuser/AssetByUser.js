
import React from 'react'
import  { useEffect, useState } from 'react'
import axios from 'axios'

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

import {useNavigate} from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

import appSettings from 'src/AppSettings' // read the app config
import { encrypt, decrypt, compare } from 'n-krypta';
import WriteLog from 'src/components/logs/LogListener';

function AssetByUser() {

  const navigate = useNavigate();
  
  var userID = ""
  var userRole = ""
    const [success,SetSuccess] = useState("");
    const [errors,setErrors] = useState({})
    const [message,setMessage] = useState("")
    const [colorMessage,setColorMessage] = useState('red')

useEffect(() => {
  getUserInfo()
}, [])

function CheckRole() {
  try {

    userRole = decrypt(window.localStorage.getItem('Kgr67W@'), appSettings.secretkeylocal)

  }
  catch(err) {
    WriteLog("Error","AssetByUser","CheckRole Local Storage is tampered", err.message,userID)
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



    function handleSubmit(event) {
        try {
    
          event.preventDefault();
    

          
        }
        catch(err) {
          console.log(err)
        }
    }

////// Data Grid

const [assets,setAssets] = useState([])

useEffect(() => {
  if(userID == "") 
  {
    getUserInfo()
  }
  const url = 'http://localhost:3001/assets/viewallassetsassignbyuserfordeploy_deployed  '
  axios.post(url,{userID})
  .then(res => {
    const dataResponse = res.data.message;
    if(dataResponse == "Record Found") {
      setAssets(res.data.result)
    }
  }).catch(err => {
    WriteLog("Error","AssetByUser","handleCheckin /assets/viewallassetsassignbyuserfordeploy_deployed'",err.message,userID)
  })

},[])


    const columns = [
      {
        field: 'assetCode',
        headerName: 'Asset Code',
        width: 150,
        editable: false,
      },
      {
        field: 'assetName',
        headerName: 'Name',
        width: 150,
        editable: false,
      },
      {
        field: 'statusName',
        headerName: 'Status',
        width: 100,
        editable: false,
      },
      {
        field: 'assetCategName',
        headerName: 'Category',
        width: 150,
        editable: false,
      },
      {
        field: 'displayName',
        headerName: 'Deploy By',
        width: 130,
        editable: false,
      },
      {
        field: 'datecheckin',
        headerName: 'Date Receive',
        width: 130,
        editable: false,
      },
    ];
  

    /////////// End of Datagrid 

  return (

    <CCol xs={12}>
         <CCard className="mb-3" size="sm"  >
         <CCardHeader>
            <h6>
            <span className="message" style={{ color: '#5da4f5'}}> <>My Current Asset(s)  </></span> 
            <br></br>
            <strong><span className="message" style={{ color: colorMessage}}><p>{message}</p></span> </strong>
            </h6>
          </CCardHeader>
          <CForm onSubmit={handleSubmit}>
            <CRow >
                <CCol xs={12}>
                    <CCardBody>
                    <CInputGroup size="sm" className="mb-3">
                            <div style={{ height: 400, width: '100%' }}>
                                <DataGrid
                                    rows={assets}
                                    columns={columns}
                                    initialState={{
                                    pagination: {
                                        paginationModel: {
                                        pageSize: 5,
                                        },
                                    },
                                    }}
                                    pageSizeOptions={[5]}
                                    rowSelection={true}
                                
                                />
                            </div>
                    </CInputGroup>
                    </CCardBody>
                </CCol>
            </CRow>
          </CForm>
         </CCard>
    </CCol>
  )
}

export default AssetByUser
