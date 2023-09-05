import  { useEffect, useState } from 'react'
import axios from 'axios'
import * as React from 'react'

import { DataGrid } from '@mui/x-data-grid';

import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import {useNavigate} from 'react-router-dom';


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



import WriteLog from 'src/components/logs/LogListener';

import appSettings from 'src/AppSettings' // read the app config
import { decrypt } from 'n-krypta';
// encrypt, compare
const DepreciatedView = () =>   {

    const navigate = useNavigate();
    var userID = ""
    var userRole = ""
    const [assetvalue,setAssetValue] = useState([])

    function CheckRole() {
      try {
  
        userRole = decrypt(window.localStorage.getItem('Kgr67W@'), appSettings.secretkeylocal)
  
      }
      catch(err) {
        WriteLog("Error","DepreciatedView","CheckRole Local Storage is tampered", err.message,userID)
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


    const columns = React.useMemo(() => [
      {
        field: 'id',
        headerName: 'Actions',
        type: 'actions',
        disableClickEventBubbling: true,
        renderCell: (params) => {
          return (
            <div >
              <ReceiptLongRoundedIcon cursor="pointer" onClick={()=> handleClick(params.row.id)}/>
            </div>

          );
        }
      },
      {
        field: 'assetCode',
        headerName: 'Code',
        width: 100,
        editable: false,
      },
      {
        field: 'assetName',
        headerName: 'Asset Name',
        width: 130,
        editable: false,
      },
      {
        field: 'statusName',
        headerName: 'Status',
        width: 130,
        editable: false,
      },
        {
          field: 'assetCategName',
          headerName: 'Category',
          width: 130,
          editable: false,
        },
        {
          field: 'amount',
          headerName: 'Purchase',
          width: 100,
          editable: false,
        },
        {
            field: 'depreciated',
            headerName: 'Amt Depreciated',
            width: 100,
            editable: false,
        },
        {
            field: 'Dfrom',
            headerName: 'Date Purchase',
            width: 100,
            editable: false,
        },
        {
            field: 'Dto',
            headerName: 'Date Purchase',
            width: 100,
            editable: false,
        },
        {
            field: 'RemainingYR',
            headerName: 'Remaining',
            width: 100,
            editable: false,
        },
        {
            field: 'Depreciated',
            headerName: 'Fully Depreciated',
            width: 100,
            editable: false,
        },

      ],[]);


useEffect(() => {
    LoadData()
  },[])
    
function LoadData(){
  if(userID == "") 
  {
    getUserInfo()
  }

  const url = 'http://localhost:3001/depreciated/viewDepreciated'
  axios.post(url)
  .then(res => {
    const dataResponse = res.data.message;
    if(dataResponse == "Record Found") {
        setAssetValue(res.data.result)
    }

  }).catch(err => {
    WriteLog("Error","LogView","Load log/viewallLogs","Error in try/catch " + err.message,userID)
  })
}



  return (

    <CCol xs={12}>
    <CCard className="mb-3" size="sm"  >
     

      <CForm >
        <CRow >
            <CCol xs={12}>
              <CCardBody>
              <div className="d-grid" style={{
                            
                            display: 'flex',
                            alignItems: 'left',
                            justifyContent: 'left',
                            }} >
                  
                </div>
                <CInputGroup size="sm" className="mb-3">
                        <div style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={assetvalue}
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
                                getRowId={(row) => row.id}
                                
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

export default DepreciatedView
