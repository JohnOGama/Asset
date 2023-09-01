// eslint-disable-next-line
import  { useEffect, useState } from 'react'
import axios from 'axios'
import * as React from 'react'

//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
//import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
//import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
//import { DatePicker } from '@mui/x-date-pickers/DatePicker';


// input Mask

//import PropTypes, { bool } from 'prop-types';
//import { IMaskInput } from 'react-imask';
//import { NumericFormat } from 'react-number-format';
//import Box from '@mui/material/Box';
//import Input from '@mui/material/Input';
//import InputLabel from '@mui/material/InputLabel';
//import TextField from '@mui/material/TextField';
//import FormControl from '@mui/material/FormControl';

import { DataGrid } from '@mui/x-data-grid';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';

import imgDefault from '../../../assets/images/macbook.png'

//

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  //CAccordion,
  //CAccordionBody,
  //CAccordionHeader,
  //CAccordionItem,
  CForm,
  CButton,
  //CFormSelect,
  //CFormInput,
  //CInputGroupText,
  CInputGroup,
  CImage,
  //CFormLabel,
  //CFormFloating,
  //CLink
} from '@coreui/react'



import {useNavigate} from 'react-router-dom';

import appSettings from 'src/AppSettings' // read the app config
import { decrypt  } from 'n-krypta';
// encrypt, compare
//import ValidationAssetRegister from 'src/components/validation/ValidationAssetRegister';
//import { Icon } from '@mui/material';
//import { buildTimeValue } from '@testing-library/user-event/dist/types/utils';
import WriteLog from 'src/components/logs/LogListener';

const AssetView = () => {

  const navigate = useNavigate();
  
  const [userID,setUserID] = useState("")

  const [message,setMessage] = useState("")
  const [colorMessage,setColorMessage] = useState('red')
  
  const [assets,setAssets] = useState([])
  //const [disposeFound,setdisposeFound] = useState(false)
  //const [deployFound,setdeployFound] = useState(false)

  useEffect(() => {
      try {
      const url = 'http://localhost:3001/assets/viewallassetsavailable'
      axios.post(url)
      .then(res => {
        const dataResponse = res.data.message;
        if(dataResponse == "Record Found") {
          setAssets(res.data.result)
        } 
      }).catch(err => {
        
        WriteLog("Error","AssetView","checkStatus /assets/viewallassetsavailable","then/catch \n" + err.message,userID)
      })
    }
    catch(err) {
      WriteLog("Error","AssetView","checkStatus /assets/viewallassetsavailable","try/catch \n" + err.message,userID)
    }
  },[])

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



function CheckDispose(rowidselected,source) {

  try {

    const rowId = rowidselected
  
      const url = 'http://localhost:3001/dispose/checkassetdispose'
      axios.post(url,{rowId})
      .then(res => { 
        const dataResponse = res.data.message 
        
        if(dataResponse == "Record Found"){ 
          setMessage("Asset already mark as Dispose")
          setColorMessage('red')
        } else if(dataResponse == "No Record Found") {
            CheckDeploy(rowidselected,source)
        } 
      })
      .catch(err => {
      WriteLog("Error","AssetView","CheckDispose /dispose/checkassetdispose",err.message,userID)
      navigate('/500');
      //navigate('/page/Page404')
      })
    
  }
  catch(err) {
    WriteLog("Error","AssetDispose","handleSubmit",err,userID)
  }

  
}


function CheckDeploy(rowidselected,source){

 
  try {

    const rowId = rowidselected
    const params = rowidselected
      const url = 'http://localhost:3001/dispose/checkassetdeploy'
      axios.post(url,{rowId})
      .then(res => { 
        const dataResponse = res.data.message 
        if(dataResponse == "Record Found"){ 
          setMessage("Asset still in use")
          setColorMessage('red')
        } else if(dataResponse == "No Record Found") {
            if (source == "Dispose") {
            navigate('/base/assetdispose', {state:{params}})
            } else if(source == "For Edit") {
              navigate('/base/assetedit', {state:{params}})
            }
        } 
      })
      .catch(err => {
      WriteLog("Error","AssetView","CheckDeploy /dispose/checkassetdeploy",err.message,userID)
      //navigate('/500');
      //navigate('/page/Page404')
      })
    
  }
  catch(err) {
    WriteLog("Error","AssetDispose","handleSubmit",err,userID)
  }
}


function handleClick(rowidselected,source) {
  CheckDispose(rowidselected,source)
}



  const columns = React.useMemo(() => [
    {
      field: 'idselect',
      headerName: 'Actions',
      type: 'actions',
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
            <div>
            <EditTwoToneIcon cursor="pointer" onClick={()=> handleClick(params.row.id,"For Edit")}/>
            <DeleteOutlineTwoToneIcon cursor="pointer" onClick={()=> handleClick(params.row.id,"Dispose")}/>
            </div>
        );
      }
    },
    
    {
      field: 'pictureFile',
      headerName: 'Image',
      width: 30,
      renderCell: () => {
        return (
            <div>
            <CImage src={ 
                            colorMessage
                            ?  imgDefault
                            : imgDefault    
                        }
                        alt="" style={{  width: '150%',height: '150%', textAlign: "center", margin: "auto"}}    />
            
            </div>
        );
      }
    },
    {
      field: 'statusName',
      headerName: 'Status',
      width: 100,
      editable: false,
    },
    {
      field: 'AssetCode',
      headerName: 'Asset Code',
      width: 150,
      editable: false,
    },
    {
      field: 'assetName',
      headerName: 'Name',
      width: 200,
      editable: false,
    },
    {
      field: 'assetCategName',
      headerName: 'Category',
      width: 130,
      editable: false,
    },
    
    {
      field: 'suppliername',
      headerName: 'Supplier',
      width: 200,
      editable: false,
    },
    
    {
        field: 'CheckOut',
        headerName: 'CheckOut',
        width: 100,
        editable: false,
    },
    {
        field: 'Checkin',
        headerName: 'CheckIn',
        width: 100,
        editable: false,
      },
    {
      field: 'DeployTo',
      headerName: 'Deploy To',
      width: 200,
      editable: false,
    },
    
  ],[]);

  /////////// End of Datagrid 

  //<CCardHeader>
  //<strong>All Assets <span className="message" style={{ color: colorMessage}}><p>{message}</p></span> </strong>
  //</CCardHeader>  
  return (

      <CCol xs={12}>
        <CCard className="mb-3" size="sm"  >

          <CForm>
         
            <CRow >
                <CCol xs={12}>
                  <CCardBody>
                  <h6>
                    <strong><span className="message" style={{ color: colorMessage}}><p>{message}</p></span> </strong>
                  </h6>
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
                                    getRowId={(row) => row.idselect}
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

export default AssetView
