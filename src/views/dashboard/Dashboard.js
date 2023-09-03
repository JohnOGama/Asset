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
  CCardGroup,
  CFormLabel,
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
import WidgetsDropdownUser from 'src/views/widgets/WidgetsDropdownUser';
import AssetView from '../base/assetview/AssetView'

//import  {Context} from 'src/components/Store'
//import CryptoJS from "crypto-js";
import {  decrypt } from 'n-krypta';
//encrypt, , compare
import appSettings from 'src/AppSettings' // read the app config
import LogView from '../configurations/logview/LogView'
import LogActivity from '../configurations/logactivity/LogActivity'
import WriteLog from 'src/components/logs/LogListener';

////// For User ////

import AssetByUser from '../base/assetbyuser/AssetByUser';
import AssetPullout from '../base/assetpullout/AssetPullout';
import LogUserInfoView from '../configurations/loguserinfoview/LogUserInfoView';
//// End for User

const Dashboard = () => {

  var userID = ""
  var userRole = ""
  const [userRoles,setUserRole] = useState("")
  const [displayName,setDisplayName] = useState("");


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
       userRole = decrypt(window.localStorage.getItem('Kgr67W@'), appSettings.secretkeylocal)
       setUserRole(userRole)
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

 
  return (


    <div>
      {(() => {
        if (userRoles == "Admin" ) {
          return (
            <>
            <WidgetsDropdown/>

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
                <CCol xs={9} md={6} xl={8}>
                  <AssetView/>
                </CCol>

                <CCol xs={4} md={6} xl={4}>

                <LogUserInfoView/>

                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
            </CRow>
            
            <br></br>
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

            </>
           
          )
        } else if (userRoles == "User" || userRoles == "IT") {
          return (
        <>
           <WidgetsDropdownUser/>

          <CRow>
            <CCol xs={8}>
                <div >
                  <AssetPullout  />
                </div>
            </CCol>
            <CCol>
              
                  <LogUserInfoView/>
             
            </CCol>

                 
             
          </CRow>
        </>
          
          )
        } 
      })()}
    </div>

    /*
    <div>
    <WidgetsDropdown />
<>
      
      

      


     

      
  </div>
  </>
  */
  );

}

export default Dashboard
