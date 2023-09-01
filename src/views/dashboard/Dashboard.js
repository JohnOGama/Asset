/* eslint-disable react/prop-types  */
import React, { useState ,useEffect} from 'react'
import randomColor from "randomcolor";
//useContext, , 
//import { Link } from 'react-router-dom'
import {useNavigate} from 'react-router-dom'

import axios from 'axios'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
 // CTable,
 // CTableBody,
//  CTableDataCell,
 // CTableHead,
//  CTableHeaderCell,
//  CTableRow,
} from '@coreui/react'

import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import { CChartBar, CChartLine,  CChartPie,CChartDoughnut } from '@coreui/react-chartjs'
import TextField from '@mui/material/TextField';

import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  //cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

import WidgetsBrand from '../widgets/WidgetsBrand'
//'../../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import AssetView from '../base/assetview/AssetView'

//import  {Context} from 'src/components/Store'
//import CryptoJS from "crypto-js";
import {  decrypt } from 'n-krypta';
//encrypt, , compare
import appSettings from 'src/AppSettings' // read the app config
import LogView from '../configurations/logview/LogView'
import LogActivity from '../configurations/logactivity/LogActivity'
import WriteLog from 'src/components/logs/LogListener';

import getITAssets from '../base/snipe/Snipe';

const Dashboard = () => {

  //const[state,setState] = useContext(Context);
  //const [userID,setUserID] = useState("");
  var userID = ""
  const [displayName,setDisplayName] = useState("");
  //const [id,setID] = useState("")

  const [supplierasset,setSupplierAsset] = useState([])
  const [disposeasset,setDisposeAsset] = useState([])
  const [deptasset,setDeptAsset] = useState([])
  const [assetdispose,setAssetDispose] = useState([])
  const [checkinpullout,setCheckInPullOut] = useState([])
  

  const navigate = useNavigate();

  function getUserInfo() {
    let id = "";
    let display = "";

    if((!window.localStorage.getItem('id') == null) || (window.localStorage.getItem('id') !== "0")) {
      //setID(window.localStorage.getItem('id'));
      display = window.localStorage.getItem('display');
      userID = decrypt(window.localStorage.getItem('id'), appSettings.secretkeylocal)
      setDisplayName(display);
    }
    else
    { 
      navigate('/login')
    }
  }

  useEffect(() => {

    getUserInfo()

  },[]);

  useEffect(() => {

    LoadDisposeAssetValue()
    LoadSupplierAssetValue()
    LoadDeptCountAsset()
    LoadAssetDisposeAmount()
    LoadCount_CheckInPullout()
  }, [])

  //useEffect(() => {
    //console.lo
 // }, [assetdispose])

  function LoadSupplierAssetValue(){

    getUserInfo() 

   try {
    const url = 'http://localhost:3001/supplier/getSupplierAssetsValue'
     axios.post(url)

    .then(res => {
      const dataResponse = res.data.message;
      if(dataResponse == "Record Found") {
        setSupplierAsset(res.data.result)
      } else if (dataResponse == "No Record Found") {
        WriteLog("Error","DashBoard","LoadSupplierAssetValue /supplier/getSupplierAssetsValue",res.data.message,userID)

        //navigate('/500');
      }
    }).catch(err => {
      WriteLog("Error","DashBoard","LoadSupplierAssetValue /supplier/getSupplierAssetsValue","Error in then/catch \n" + err.message,userID)
      
    })
  }
  catch(err) {
    WriteLog("Error","DashBoard","LoadSupplierAssetValue /supplier/getSupplierAssetsValue","Error in try/catch \n" + err.message,userID)
    
  }
  }

  function LoadDisposeAssetValue(){

    
    getUserInfo() 
    
      try {
      const url = 'http://localhost:3001/dispose/getAssetDisposeAmount'
        axios.post(url)
      .then(response => {
        const dataResponse = response.data.message;
        if(dataResponse == "Record Found") {
          setDisposeAsset(response.data.result)
          //setSupplierAsset(res.data.result)
        } else if (dataResponse == "No Record Found") {
          WriteLog("Error","DashBoard","LoadDisposeAssetValue /dispose/getAssetDisposeAmount",response.data.message2,userID)
  
          //navigate('/500');
        }
      }).catch(err => {
        WriteLog("Error","DashBoard","LoadDisposeAssetValue /dispose/getAssetDisposeAmount","Error in then/catch \n" + err.message,userID)
        console.log("Error catch" + err.message)
        })
    }
    catch(err) {
      WriteLog("Error","DashBoard","LoadDisposeAssetValue /supplier/getAssetDisposeAmount","Error in try/catch \n" + err.message,userID)
      console.log("Error try " + err.message)
      }
   }

   function LoadDeptCountAsset(){

    
    getUserInfo() 
    
    try {
    const url = 'http://localhost:3001/department/getCountAsset_by_Department'
      axios.post(url)
    .then(response => {
      const dataResponse = response.data.message;
      if(dataResponse == "Record Found") {
        setDeptAsset(response.data.result)
        //setSupplierAsset(res.data.result)
      } else if (dataResponse == "No Record Found") {
        WriteLog("Error","DashBoard","LoadDeptCountAsset /department/getCountAsset_by_Department",response.data.message2,userID)

        //navigate('/500');
      }
    }).catch(err => {
      WriteLog("Error","DashBoard","LoadDeptCountAsset /department/getCountAsset_by_Department","Error in then/catch \n" + err.message,userID)
      
      })
  }
  catch(err) {
    WriteLog("Error","DashBoard","LoadDeptCountAsset /department/getCountAsset_by_Department","Error in try/catch \n" + err.message,userID)
   
    }
 }

 function LoadAssetDisposeAmount(){

  
  getUserInfo() 
    
  try {
  const url = 'http://localhost:3001/dispose/getAssetDisposeAmount'
    axios.post(url)
  .then(response => {
    const dataResponse = response.data.message;
    if(dataResponse == "Record Found") {
      setAssetDispose(response.data.result[0])
    } else if (dataResponse == "No Record Found") {
      WriteLog("Error","DashBoard","LoadAssetDispose /dispose/getAssetDisposeAmount",response.data.message2,userID)

      //navigate('/500');
    }
  }).catch(err => {
    WriteLog("Error","DashBoard","LoadAssetDispose /dispose/getAssetDisposeAmount","Error in then/catch \n" + err.message,userID)
  
    })
}
catch(err) {
  WriteLog("Error","DashBoard","LoadAssetDispose /dispose/getAssetDisposeAmount","Error in try/catch \n" + err.message,userID)
  
  }
}

function LoadCount_CheckInPullout(){

  getUserInfo()

  try {
    const url = 'http://localhost:3001/CheckInPullOut/Count_CheckInPullOut'
    axios.post(url)
  .then(response => {
    const dataResponse = response.data.message;
    if(dataResponse == "Record Found") {
      setCheckInPullOut(response.data.result[0])
    } else if (dataResponse == "No Record Found") {
      WriteLog("Error","DashBoard","LoadAssetDispose /CheckInPullOut/Count_CheckInPullOut",response.data.message2,userID)

      //navigate('/500');
    }
  }).catch(err => {
    WriteLog("Error","DashBoard","LoadAssetDispose /CheckInPullOut/Count_CheckInPullOut","Error in then/catch \n" + err.message,userID)
   
    })
}
catch(err) {
  WriteLog("Error","DashBoard","LoadAssetDispose /dispose/getAssetDisposeAmount","Error in try/catch \n" + err.message,userID)
 
  }
}

  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

  const progressExample = [
    { title: 'Visits', value: '29.703 Users', percent: 40, color: 'success' },
    { title: 'Unique', value: '24.093 Users', percent: 20, color: 'info' },
    { title: 'Pageviews', value: '78.706 Views', percent: 60, color: 'warning' },
    { title: 'New Users', value: '22.123 Users', percent: 80, color: 'danger' },
    { title: 'Bounce Rate', value: 'Average Rate', percent: 40.15, color: 'primary' },
  ]

  const progressGroupExample1 = [
    { title: 'Monday', value1: 34, value2: 78 },
    { title: 'Tuesday', value1: 56, value2: 94 },
    { title: 'Wednesday', value1: 12, value2: 67 },
    { title: 'Thursday', value1: 43, value2: 91 },
    { title: 'Friday', value1: 22, value2: 73 },
    { title: 'Saturday', value1: 53, value2: 82 },
    { title: 'Sunday', value1: 9, value2: 69 },
  ]

  const progressGroupExample2 = [
    { title: 'Male', icon: cilUser, value: 53 },
    { title: 'Female', icon: cilUserFemale, value: 43 },
  ]

  const progressGroupExample3 = [
    { title: 'Organic Search', icon: cibGoogle, percent: 56, value: '191,235' },
    { title: 'Facebook', icon: cibFacebook, percent: 15, value: '51,223' },
    { title: 'Twitter', icon: cibTwitter, percent: 11, value: '37,564' },
    { title: 'LinkedIn', icon: cibLinkedin, percent: 8, value: '27,319' },
  ]

  const tableExample = [
    {
      avatar: { src: avatar1, status: 'success' },
      user: {
        name: 'Yiorgos Avraamu',
        new: true,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'USA', flag: cifUs },
      usage: {
        value: 50,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'success',
      },
      payment: { name: 'Mastercard', icon: cibCcMastercard },
      activity: '10 sec ago',
    },
    {
      avatar: { src: avatar2, status: 'danger' },
      user: {
        name: 'Avram Tarasios',
        new: false,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'Brazil', flag: cifBr },
      usage: {
        value: 22,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'info',
      },
      payment: { name: 'Visa', icon: cibCcVisa },
      activity: '5 minutes ago',
    },
    {
      avatar: { src: avatar3, status: 'warning' },
      user: { name: 'Quintin Ed', new: true, registered: 'Jan 1, 2021' },
      country: { name: 'India', flag: cifIn },
      usage: {
        value: 74,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'warning',
      },
      payment: { name: 'Stripe', icon: cibCcStripe },
      activity: '1 hour ago',
    },
    {
      avatar: { src: avatar4, status: 'secondary' },
      user: { name: 'Enéas Kwadwo', new: true, registered: 'Jan 1, 2021' },
      country: { name: 'France', flag: cifFr },
      usage: {
        value: 98,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'danger',
      },
      payment: { name: 'PayPal', icon: cibCcPaypal },
      activity: 'Last month',
    },
    {
      avatar: { src: avatar5, status: 'success' },
      user: {
        name: 'Agapetus Tadeáš',
        new: true,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'Spain', flag: cifEs },
      usage: {
        value: 22,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'primary',
      },
      payment: { name: 'Google Wallet', icon: cibCcApplePay },
      activity: 'Last week',
    },
    {
      avatar: { src: avatar6, status: 'danger' },
      user: {
        name: 'Friderik Dávid',
        new: true,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'Poland', flag: cifPl },
      usage: {
        value: 43,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'success',
      },
      payment: { name: 'Amex', icon: cibCcAmex },
      activity: 'Last week',
    },
  ]



  return (
    <>
      <WidgetsDropdown />
   
    <CRow>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <h6>
            <span className="message" style={{ color: '#5da4f5'}}> <>Supplier</> </span> 
            </h6>
          </CCardHeader>
          <CCardBody>
            <CChartBar
              data={{
                labels: supplierasset?.map((supplier) => supplier.name),
                datasets: [
                  {
                    label: 'Asset Value',
                    backgroundColor: supplierasset?.map((supplier) => randomColor()),
                    //'#f87979',
                    data: supplierasset?.map((supplier) => supplier.assetvalue),
                  },
                ],
              }}
              labels="months"
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <h6>
              <span className="message" style={{ color: '#5da4f5'}}> <> Assets Deployed by Department</></span> 
            </h6>
          </CCardHeader>
           
          <CCardBody>
            <CChartBar
                data={{
                  labels: deptasset?.map((dept) => dept.name),

                  datasets: [
                    {
                      label: 'Asset Value',
                      backgroundColor: deptasset?.map((dept) => randomColor()),
                      //'#f87979',
                      data: deptasset?.map((dept) => dept.assetcount_department),
                    },
                  ],
                }}
                labels="months"
              />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    

    <CRow>
    <CAccordion flush={false}>
              <CAccordionItem itemKey={1}>
                <CAccordionHeader>
                <span className="message" style={{ color: 'green'}}> <> Check In</></span> 
                -
                <span className="message" style={{ color: '#ed8b13'}}>  <> Checkout </> </span>
                -
                <span className="message" style={{ color: 'red'}}>  <> Pullout </> </span>
                </CAccordionHeader>
                <CAccordionBody>
                    <CRow>
                    
                        <div className="small text-medium-emphasis">January - December</div>
                        <div className="small text-medium-emphasis">Every Year</div>

                    </CRow>
                    <CCol>
                        <CChartLine
                          style={{ height: '300px', marginTop: '40px' }}
                          data={{
                            labels: checkinpullout?.map((checkinpullout) => checkinpullout.MonthName),
                            datasets: [
                              {
                                label: 'Received by User',
                                backgroundColor: hexToRgba(getStyle('--cui-success'), 10),
                                borderColor: getStyle('--cui-success'),
                                pointHoverBackgroundColor: getStyle('--cui-success'),
                                borderWidth: 2,
                                data: checkinpullout?.map((checkinpullout) => checkinpullout.CheckInCount),
                                fill: true,
                              },
                              {
                                label: 'PullOut by User',
                                backgroundColor: 'transparent',
                                borderColor: getStyle('--cui-warning'),
                                pointHoverBackgroundColor: getStyle('--cui-warning'),
                                borderWidth: 2,
                                data: checkinpullout?.map((checkinpullout) => checkinpullout.PullOutCount),
                              },
                              {
                                label: 'Dispose By IT',
                                backgroundColor: 'transparent',
                                borderColor: getStyle('--cui-danger'),
                                pointHoverBackgroundColor: getStyle('--cui-danger'),
                                borderWidth: 2,
                                data: checkinpullout?.map((checkinpullout) => checkinpullout.Dispose),
                              },
                            ],
                          }}
                          options={{
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                display: false,
                              },
                            },
                            scales: {
                              x: {
                                grid: {
                                  drawOnChartArea: false,
                                },
                              },
                              y: {
                                ticks: {
                                  beginAtZero: true,
                                  maxTicksLimit: 5,
                                  stepSize: Math.ceil(250 / 5),
                                  max: 250,
                                },
                              },
                            },
                            elements: {
                              line: {
                                tension: 0.4,
                              },
                              point: {
                                radius: 0,
                                hitRadius: 10,
                                hoverRadius: 4,
                                hoverBorderWidth: 3,
                              },
                            },
                          }}
                        />
                      </CCol>
                      <CCol xs={3}>
                        <CCard className="mb-4">
                          <CCardHeader>Dispose</CCardHeader>
                          <CCardBody>
                            <CChartPie
                              data={{
                                labels: assetdispose?.map((assdispose) => assdispose.ADName),
                                datasets: [
                                  {
                                    data: assetdispose?.map((assdispose) => assdispose.totamount),
                                    backgroundColor: assetdispose?.map((assdispose) => randomColor()),
                                    //hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                                  },
                                ],
                              }}
                            />
                          </CCardBody>
                        </CCard>
                      </CCol>

                </CAccordionBody>
              </CAccordionItem>

    </CAccordion>
    </CRow>
    <CRow>
    <CAccordion flush={false}>
              <CAccordionItem itemKey={1}>
                <CAccordionHeader>
                <h6>
                <span className="message" style={{ color: '#5da4f5'}}> <> See Other Reports</></span> 
                </h6>
                </CAccordionHeader>
                <CAccordionBody>
                    <CRow>
                    <CCol xs={3}>
                        <CCard className="mb-4">
                          <CCardHeader>Dispose</CCardHeader>
                          <CCardBody>
                            <CChartPie
                              data={{
                                labels: assetdispose?.map((assdispose) => assdispose.ADName),
                                datasets: [
                                  {
                                    data: assetdispose?.map((assdispose) => assdispose.totamount),
                                    backgroundColor: assetdispose?.map((assdispose) => randomColor()),
                                    //hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                                  },
                                ],
                              }}
                            />
                          </CCardBody>
                        </CCard>
                      </CCol>
                    </CRow>
                    


                </CAccordionBody>
              </CAccordionItem>

    </CAccordion>
    </CRow>

    <br></br>

      <CRow>
        <CCol>
          <CCard className="card-title mb-0">
            <CCardHeader>
              <h6>
              <span className="message" style={{ color: '#5da4f5'}}> <> Assets </></span> 
                {' & '}  
              <span className="message" style={{ color: '#5da4f5'}}> <> Activity </></span> 
              </h6>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs={5} md={6} xl={8}>
                  <AssetView/>
                </CCol>

                <CCol xs={12} md={6} xl={4}>

                  <LogActivity/>

                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
