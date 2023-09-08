// eslint-disable-next-line
import  { useEffect, useState } from 'react'
import axios from 'axios'
import * as React from 'react'

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import myimage from "../../../assets/images/DefaultAsset.png"


// input Mask

import PropTypes, { object } from 'prop-types';
import { IMaskInput } from 'react-imask';
import { NumericFormat } from 'react-number-format';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

//

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
  CFormFloating,
  CImage
} from '@coreui/react'


import {useNavigate} from 'react-router-dom';

import appSettings from 'src/AppSettings' // read the app config
import { encrypt, decrypt, compare } from 'n-krypta';

import WriteLog from 'src/components/logs/LogListener'


// For Input Mask No.
const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="(#00) 000-0000"
      definitions={{
        '#': /[1-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

TextMaskCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const NumericFormatCustom = React.forwardRef(function NumericFormatCustom(
  props,
  ref,
) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(formatvalues) => {
        onChange({
          target: {
            name: props.name,
            value: formatvalues.value,
          },
        });
      }}
      thousandSeparator
      valueIsNumericString
      prefix="Php "
    />
  );
});


NumericFormatCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};


///// 

const AssetRegister = () => {

  const navigate = useNavigate();

  const [assetsCategory , setAssetsCategory] = useState([])
  const [supplier , setSupplier] = useState([])
  const [success,SetSuccess] = useState("");
  const [errors,setErrors] = useState({})
  const [message,setMessage] = useState("")
  const [colorMessage,setColorMessage] = useState('red')
  
  const [assetStat,setAssetStat] = useState("");
  const [datePurchase, setDatePurchase] = useState("");
  const [dateDepreciated, setDateDepreciated] = useState("");
  
  var userID = ""
  var userRoles = ""

  const [values,setValues] = useState ({
    assetcategID: '',
    supplierID: "",
    serialno: '',
    assetcode: '',
    assetname: '',
    description: ''
    })

    const [file,setFile] = useState("")

    //// For Input Mask 

  const [formatvalues, setFormatValues] = React.useState({
    textmask: '(100) 000-0000',
    amountnumberformat: '',
    amountdepnumberformat: '',
  });

  useEffect(() => {
    //console.log(" ")
  },[values]);

  useEffect(() => {
    //console.log("")
  },[datePurchase]);

  useEffect(() => {
   // console.log("")
  },[dateDepreciated]);

  function CheckRole() {
    try {

      userRoles = userID = decrypt(window.localStorage.getItem('Kgr67W@'), appSettings.secretkeylocal)

    }
    catch(err) {
      WriteLog("Error","AssetRegister","CheckRole Local Storage is tampered", err.message,userID)
      navigate('/dashboard')
    }
    
  }

  function getUserInfo() {
    try {
    CheckRole()
      if (userRoles == "Admin" || userRoles == "IT")
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

    try {
    const url = 'http://localhost:3001/category/getAssetCategory'
    axios.post(url)
    .then(res => {
      const dataResponse = res.data.message;
      if(dataResponse == "Record Found") {
        setAssetsCategory(res.data.result)
      } else if (dataResponse == "No Record Found") {
        WriteLog("Error","AssetRegister","useEffect /category/getAssetCategory",res.data.message2,userID)
      }
    }).catch(err => {
      WriteLog("Error","AssetRegister","useEffect /category/getAssetCategory"," then/catch \n " + err.message,userID)
    })
  }
  catch(err) {
    WriteLog("Error","AssetRegister","useEffect /category/getAssetCategory"," try/catch \n " + err.message,userID)
  }

  },[])

  
  useEffect(() => {
    LoadSupplier()
  },[])

  function LoadSupplier() {
    try {
      if(userID == "") 
      {
        getUserInfo()
      }

      const url = 'http://localhost:3001/supplier/getsupplier'
      axios.post(url)
      .then(res => {
        const dataResponse = res.data.message;
        if(dataResponse == "Record Found") {
          setSupplier(res.data.result)
         
        } else if (dataResponse == "No Record Found") {
          WriteLog("Error","AssetEdit","LoadSupplier /supplier/getsupplier",res.data.message2,userID)
      
        }
      }).catch(err => {
        WriteLog("Error","AssetEdit","LoadSupplier /supplier/getsupplier","Error in then/catch \n" + err.message,userID)
       
      })
    }
    catch(err) {
      WriteLog("Error","AssetEdit","LoadSupplier /supplier/getsupplier","Error in try/catch \n" + err.message,userID)
    }
  }

  useEffect(() => {

    if(userID == "") 
    {
      getUserInfo()
    }

    try {
    const url = 'http://localhost:3001/assets/getAssetStatus'
    axios.post(url)
    .then(response => {
      const dataResponse = response.data.message;
      if(dataResponse == "Record Found") {
        setAssetStat(response.data.result[0]['assetStatusID'])
       
      } else if (dataResponse == "No Record Found") {
        WriteLog("Error","AssetRegister","useEffect /assets/getAssetStatus",response.data.message2,userID)
      }
    }).catch(err => {
      WriteLog("Error","AssetRegister","useEffect /assets/getAssetStatus"," then/catch \n " + err.message,userID)
    })
  }
  catch(err) {
    WriteLog("Error","AssetRegister","useEffect /assets/getAssetStatus"," try/catch \n " + err.message,userID)
  }
  },[])


  function handleInput(e){

    setValues({...values,[e.target.name]: e.target.value.trim()})

  }

const handleChange = (event) => {
  setFormatValues({...formatvalues,[event.target.name]: event.target.value,});
};




////

  function handleSubmit(event) {
    try {
  if(userID == "") 
  {
    getUserInfo()
  }
      event.preventDefault();

      const config = {
        headers:{
            "Content-Type":"multipart/form-data"
        }
    }
      
      const assetcategID = values.assetcategID;
      const serialno = values.serialno;
      const assetcode = values.assetcode;
      const assetname = values.assetname;
      const description = values.description;
      const amount = formatvalues.amountnumberformat;
      const amountdepreciated = formatvalues.amountdepnumberformat;
      const supplierid = values.supplierID;

      console.log(supplierid)
     // console.log(values)

          if((!assetStat == "") && 
            (!assetcategID == "") &&
            (!serialno == "") && 
            (!assetcode == "") && 
            (!assetname == "") && 
            (!description == "") && 
            (!amount == "") && 
            (!amountdepreciated == "") && 
            (!datePurchase == "") && 
            (!dateDepreciated == "") && 
            (!file == "") && 
            (!supplierid == ""))
          {
          
          const url = 'http://localhost:3001/assets/putAssets'
          axios.post(url,{assetStat,supplierid,assetcategID,serialno,assetcode,assetname,description,
                amount,amountdepreciated,datePurchase,dateDepreciated,file,userID},config)
          .then(res => { 
            const dataResponse = res.data.message 
            if(dataResponse == "Insert Success"){ 
              
              navigate('/Dashboard')
            } else if(dataResponse == "Insert Error") {
              WriteLog("Error","AssetRegister","handleSubmit /assets/putAssets",res.data.message2,userID)
              setMessage("Error in inserting new asset")
              setColorMessage('red')
            } 
          })
          .catch(err => {
            WriteLog("Error","AssetRegister","handleSubmit /assets/putAssets"," then/catch " + err.message,userID)

          })
        }
        else
        {
          setMessage(" All Fields must not be Empty")
          setColorMessage("orange")  
          //console.log("Missing -- " + values)
        }

    }
    catch(err) {
      WriteLog("Error","AssetRegister","handleSubmit /assets/putAssets"," try/catch " + err.message,userID)
    }
  }

useEffect(() => {
  console.log(file)
}, [file])


  return (
    
      <CCol xs={12}>
        <CCard className="mb-3">
          <CCardHeader>
            
            <h6>
            <span className="message" style={{ color: '#5da4f5'}}> <> Asset Registration  </></span> 
            <br></br>
            <strong><span className="message" style={{ color: colorMessage}}><p>{message}</p></span> </strong>
            </h6>
          </CCardHeader>
          <CForm onSubmit={handleSubmit}>
              <CRow>
                <CCol>
                  <CCardBody>

                  <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Supplier</InputLabel>
                        <Select className="mb-3" aria-label="Small select example"
                          name='supplierID' onChange={handleInput} value={values.supplierID}
                          label="Supplier"
                          
                          >
                            { 
                            supplier.map((val,result) => 
                              
                              <MenuItem key={val.supplierid} value={val.supplierid} >{val.name}</MenuItem>

                             
                            )
                            }
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel >Asset Category</InputLabel>
                        <Select  size="sm" className="mb-3" aria-label="Small select example"
                            name='assetcategID' onChange={handleInput} >
                            {
                            assetsCategory.map((val) => 
                             
                              <MenuItem key={val.assetCategID} value={val.assetCategID} >{val.assetCategName}</MenuItem>
                            )
                            }
                        </Select>

                    </FormControl>

                    <CInputGroup size="sm" className="mb-3" >
                        <TextField onChange={handleInput} name="serialno" id="outlined-textarea" fullWidth label="SerialNo" placeholder="SerialNo" />
                      </CInputGroup>

                    <CInputGroup size="sm" className="mb-3" >
                        <TextField onChange={handleInput} name="assetcode" id="outlined-textarea" fullWidth label="Asset Code" placeholder="Asset Code" />
                      </CInputGroup>

                      <CInputGroup size="sm" className="mb-3" >
                        <TextField onChange={handleInput} name="assetname" id="outlined-textarea" fullWidth label="Asset Name" placeholder="Asset Name" />
                      </CInputGroup>

                      <CInputGroup size="sm" className="mb-3" >
                        <TextField onChange={handleInput} name="description" id="outlined-textarea" fullWidth label="Description" placeholder="Description" multiline rows={5} />
                      </CInputGroup>

                  </CCardBody>
                </CCol>
                <CCol>
                <CCardBody xs={6}>
                  <CInputGroup size="sm" className="mb-3">
                          <Box
                            sx={{
                            '& > :not(style)': {
                            m: 1,
                            },
                            }}
                          >
                          <TextField
                                  label="Amount Purchase"
                                  value={formatvalues.amountnumberformat}
                                  onChange={handleChange}
                                  name="amountnumberformat"
                                  id="formatted-numberformat-input"
                                  InputProps={{
                                    inputComponent: NumericFormatCustom,
                                  }}
                                  variant="standard"
                          />
                          </Box>
                  </CInputGroup>
                  <CInputGroup size="sm" className="mb-3">
                        <TextField
                                
                                label="Amount Depreciated per YR"
                                value={formatvalues.amountdepnumberformat}
                                onChange={handleChange}
                                name="amountdepnumberformat"
                                id="formatted-numberformat-input"
                                InputProps={{
                                  inputComponent: NumericFormatCustom,
                                }}
                                variant="standard"
                        />
                  </CInputGroup>
                  <CInputGroup size="sm" className="mb-3">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            name='datePurchase'
                            label="Date Purchase"
                            fullWidth true
                            onChange={(datePurchase) => setDatePurchase(datePurchase)}
                          />
                      </LocalizationProvider>
                  </CInputGroup>
                  <br></br>
                  <CInputGroup size="sm" className="mb-3">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            name='dateDepreciated'
                            label="Date Depreciated"
                            fullWidth true
                            onChange={(dateDepreciated) => setDateDepreciated(dateDepreciated)}
                          />
                      </LocalizationProvider>
                  </CInputGroup>
                </CCardBody>
                </CCol>
                <CCol>
                  <CRow>
                    
                  </CRow>
                  <CRow>
                  <CCardBody xs={6}>  
                  <CInputGroup size="sm" className="mb-3" >
                    <div className='CCardBody img1' width={'100%'} height={'100%'}  >
                       
                          <img src=
                          {
                          file
                            ? URL.createObjectURL(file)
                            : myimage
                          } 
                          alt=""    style={{ width: '80%', textAlign: "center", margin: "auto" }} className="mt-2" />
                          <div className="formInput">
                          <input name="file" type="file"  onChange={e => setFile(e.target.files[0])}  />
                          </div>
                       
                    </div>  
                  </CInputGroup>
                  </CCardBody>
                  </CRow>
                  <CRow>
                    
                  </CRow>
                  
                </CCol>
                
                
                <div className="d-grid"  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    }} >
                  <CButton color="success"  style={{   width: '200%' }}  type='submit'>Save</CButton>
                </div>
              </CRow>

          </CForm>

        </CCard>
      </CCol>

  )
}

export default AssetRegister
