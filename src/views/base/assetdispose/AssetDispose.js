// eslint-disable-next-line
import  { useEffect, useState } from 'react'
import axios from 'axios'
import * as React from 'react'


import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

// input Mask

import PropTypes from 'prop-types';
import { IMaskInput } from 'react-imask';
import { NumericFormat } from 'react-number-format';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';

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
  CFormFloating
} from '@coreui/react'


import {useNavigate} from 'react-router-dom';
import {useLocation} from 'react-router-dom';

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

const AssetDispose = () => {

  const navigate = useNavigate();
  const {state} = useLocation();
  let rowId = ""
  
  try {
     rowId = state.params;
  }
  catch(err){
   navigate('/dashboard')
  }
 
  const [userID,setUserID] = useState("")
  
  const [status , setStatus] = useState([])

  const [box , setBox] = useState([])

  const [dispose,setDispose] = useState({
    statusID: "",
    boxID: "",
    reason: ""
  })
  
  const [message,setMessage] = useState("")
  const [colorMessage,setColorMessage] = useState('red')

  const [datePurchase, setDatePurchase] = useState("");
  const [dateDepreciated, setDateDepreciated] = useState("");
  
  const [values,setValues] = useState ({
    assetID: '',
    assetcategID: '',
    serialNo: '',
    assetCode: '',
    assetName: '',
    description: '',
    amount: '',
    datePurchase: '',
    amountDepreciatedYr: '',
    dateDepreciated: '',
    status
    })


    //// For Input Mask 

  const [formatvalues, setFormatValues] = useState({
    textmask: '(100) 000-0000',
    amountnumberformat: '',
    amountdepnumberformat: '',
  });

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

useEffect(() => {
    const url = 'http://localhost:3001/dispose/viewallstatus'
    axios.post(url)
    .then(res => {
      const dataResponse = res.data.message;
      if(dataResponse == "Record Found") {
        setStatus(res.data.result)
       
      } else if (dataResponse == "No Record Found") {
        WriteLog("Error","AssetDispose","useEffect /status/viewallstatus",res.data.message2,userID)
        
      }
    }).catch(err => {
      WriteLog("Error","AssetDispose","useEffect /status/viewallstatus",err.message,userID)
     
    })
  },[])

  useEffect(() => {
    const url = 'http://localhost:3001/dispose/viewallboxs'
    axios.post(url)
    .then(res => {
      const dataResponse = res.data.message;
      if(dataResponse == "Record Found") {
        setBox(res.data.result)
       
      } else if (dataResponse == "No Record Found") {
        setMessage("No Box(s) Found")
        setColorMessage('red')
        WriteLog("Error","AssetDispose","useEffect /dispose/viewallboxs",res.data.message2,userID)
       
      }
    }).catch(err => {
      WriteLog("Error","AssetDispose","useEffect /dispose/viewallboxs",err.message,userID)
     
    })
  },[])


  useEffect(() => {
  
    const url = 'http://localhost:3001/assets/getassetsbyID'
    axios.post(url,{rowId})
    .then(res => {
      const dataResponse = res.data.message;
      if(dataResponse == "Record Found") {
        setValues(
          {...values,assetID: res.data.result[0].assetID,
            assetcategID: res.data.result[0].assetCategID,
            serialNo: res.data.result[0].serialNo,
            assetCode: res.data.result[0].assetCode,
            assetName:res.data.result[0].assetName,
            description:res.data.result[0].description,
            amount:res.data.result[0].amount,
            datePurchase:res.data.result[0].datePurchase,
            amountDepreciatedYr:res.data.result[0].amountDepreciatedYr,
            dateDepreciated:res.data.result[0].dateDepreciated,
            status:res.data.result[0].statusName
          });

     
          setDatePurchase(res.data.result[0].datePurchase)
          setDateDepreciated(res.data.result[0].dateDepreciated)
          formatvalues.amountnumberformat = res.data.result[0].amount
          formatvalues.amountdepnumberformat = res.data.result[0].amountDepreciatedYr

      } else if (dataResponse == "No Record Found") {
        WriteLog("Error","AssetEdit","useEffect /assets/getassetsbyID",res.data.message2,userID)

      }
    }).catch(err => {
      WriteLog("Error","AssetEdit","useEffect /assets/getassetsbyID",err.message,userID)
      
    })
  }, [])

  function handleInput(e){
    setDispose({...dispose,[e.target.name]: e.target.value.trim()})
  }

////

function DisposeAsset(){
    try {
            
      const statusid = dispose.statusID;
      const reason = dispose.reason
      const boxid = dispose.boxID

        if((!statusid == "") &&
        (!reason == "") && 
        (!boxid == ""))
        {
        const url = 'http://localhost:3001/dispose/insertdispose'
          axios.post(url,{ rowId,statusid,boxid,reason,userID})
          .then(res => { 
            const dataResponse = res.data.message 
            if(dataResponse == "Insert Success"){ 
              WriteLog("Message","AssetDispose","DisposeAsset /dispose/insertdispose",
              "Asset Dispose Information \n"
              + "AssetID : " + rowId
              + "\n Status : " + statusid
              + "\n Box : " + boxid 
              + "\n Reason : " + reason
              + "\n ....."
              + "\n Mark as Dispose by : " + userID,userID)

             navigate('/base/assetview')
            } else if(dataResponse == "Insert Error") {
             WriteLog("Error","AssetDispose","DisposeAsset /dispose/insertdispose",res.data.message2,userID)
              navigate('/500');
            } 
          })
          .catch(err => {
            WriteLog("Error","AssetDispose","DisposeAsset /dispose/insertdispose",err.message,userID)
            navigate('/500');
            //navigate('/page/Page404')
          })
        }
        else
        {
          setMessage(" All Fields must not be Empty")
          setColorMessage("red")  
    
        }

    }
    catch(err) {
        WriteLog("Error","AssetDispose","DisposeAsset","Error try/catch " + err.message,userID)
    }
}

  function handleSubmit(event) {
    try {

      event.preventDefault();
    
    const url = 'http://localhost:3001/dispose/checkassetdispose'
        axios.post(url,{rowId})
        .then(res => { 
        const dataResponse = res.data.message 
        if(dataResponse == "Record Found"){ 
            setMessage("Assset already mark as Dispose")
            setColorMessage('red')
        } else if(dataResponse == "No Record Found") {
            DisposeAsset();
        } 
        })
        .catch(err => {
        WriteLog("Error","AssetDispose","handleSubmit /dispose/checkassetdispose",err.message,userID)
        navigate('/500');
        //navigate('/page/Page404')
        })

    }
    catch(err) {
      WriteLog("Error","AssetDispose","handleSubmit",err,userID)
    }
  }


  return (
    
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Asset For Disposal <span className="message" style={{ color: colorMessage}}><p>{message}</p></span> </strong>
          </CCardHeader>
          <CForm onSubmit={handleSubmit}>
              <CRow>
                <CCol>
                  <CCardBody>
                    <CFormSelect size="sm" className="mb-3" aria-label="Small select example"
                      name='statusID' onChange={handleInput} >
                      {
                          status.map((val,result) => 
                              <option key={val.id} value={val.id} > {val.statusName} </option>
                          )
                      }
                    </CFormSelect>
                    <CFormSelect size="sm" className="mb-3" aria-label="Small select example"
                      name='boxID' onChange={handleInput} >
                      {
                          box.map((val,result) => 
                              <option key={val.boxID} value={val.boxID} > {val.boxName} </option>
                          )
                      }
                    </CFormSelect>
                    <CInputGroup size="sm" className="mb-3" >
                        <TextField onChange={handleInput} name="reason"  id="outlined-textarea" fullWidth label="Reason " placeholder="Reason" multiline rows={10}/>
                    </CInputGroup>
                   
                  </CCardBody>
                </CCol>
                <CCol>

                    <CCardBody>
               
                      <CInputGroup size="sm" className="mb-3" >
                        <TextField name="Information" value={ "Status : " + values.status + "\n\n"
                         + "Serial No : " + values.serialNo + "\n"
                         + "Asset Code : " + values.assetCode + "\n"
                         + "Asset Name : " + values.assetName  + "\n"
                         + "Description : " + values.description } id="outlined-textarea" fullWidth label="Asset Information " 
                         placeholder="Asset Information" multiline rows={14} InputProps={{
                                readOnly: true,
                              }}  />
                    </CInputGroup>


                    </CCardBody>
                </CCol>

                <div className="d-grid">
                  <CButton color="success" type='submit'>Dispose</CButton>
                </div>
              </CRow>

          </CForm>

        </CCard>
      </CCol>

  )
}

export default AssetDispose
