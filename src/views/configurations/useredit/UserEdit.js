import React from 'react'

// eslint-disable-next-line
import  { useEffect, useState } from 'react'
import axios from 'axios'



import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CForm,
    CButton,
    CFormSelect,
    CInputGroup,
    CFormLabel,
    CImage,
    CAccordion,
    CAccordionBody,
    CAccordionHeader,
    CAccordionItem,
  
  } from '@coreui/react'


// input Mask

import PropTypes from 'prop-types';
import { IMaskInput } from 'react-imask';
import { NumericFormat } from 'react-number-format';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import imgDefault from '../../../assets/images/DefaultAsset.png'

import {useNavigate} from 'react-router-dom';

import appSettings from 'src/AppSettings' // read the app config
import { decrypt } from 'n-krypta';
import WriteLog from 'src/components/logs/LogListener'


const UserEdit = () => {

    var userID = ""
    const [message,setMessage] = useState("")
    const [colorMessage,setColorMessage] = useState('red')
    
    const [values,setValues] = useState ({
        assetID: '',
        assetcategID: '',
        supplierID:'',
        typeID: '',
        serialNo: '',
        assetCode: '',
        assetName: '',
        imgFile: '',
        description: '',
        amount: '',
        datePurchase: '',
        amountDepreciatedYr: '',
        dateDepreciated: ''
    })

    const [file,setFile] = useState("")


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
        LoadData()
    
        }, [])

    function LoadData() {
        try {

            const url = 'http://localhost:3001/user/LoadUser'
            axios.post(url,{userID})
            .then(res => { 
                const dataResponse = res.data.message

                if(dataResponse == "Record Found") {

                } else {
                    // Write log here
                    WriteLog("Error","UserEdit","LoadData /assets/getassetsbyID","No Record Found " + res.data.message2,userID)
                }
            })
            .catch(err => {
                WriteLog("Error","UserEdit","LoadData /assets/getassetsbyID","Error in then/catch " + err.message,userID)
            })

        }
        catch(err) {
            WriteLog("Error","UserEdit","LoadData /assets/getassetsbyID","Error in try/catch" + err.message,userID)
        }
        
    }
  return (
    <div>UserEdit</div>
  )
}

export default UserEdit