
import * as React from 'react'
import axios from 'axios'
import  { useEffect, useState } from 'react'



import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
  //CButton,
  CCardBody,
} from '@coreui/react'

import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons'


import appSettings from 'src/AppSettings' // read the app config
import {  decrypt } from 'n-krypta';
// encrypt, compare
import WriteLog from 'src/components/logs/LogListener';

import {useNavigate} from 'react-router-dom';

const WidgetsDropdownUser = () => {

  const navigate = useNavigate();

  const [message,setMessage] = useState("")
  const [colorMessage,setColorMessage] = useState('red')
  var  userID = ""
  var departmentID = ""

  const [assets,setTotalAssets] = useState({
    totalassets: ""
  })

  const [totalDepartment,setTotalDepartment] = useState({
    totaldepartment: ""
  })

  const [statavailable,setStatAvailable] = useState({
    available: ""
  })

  const [assetsperCategory,setAssetsperCategoory] = useState([])
  const [department,setDepartment] = useState([])
  const [status,setStatus] = useState([])
  
  
  useEffect(() => {
    try {
     
      if((!window.localStorage.getItem('id') == null) || (window.localStorage.getItem('id') !== "0")) {
        userID = decrypt(window.localStorage.getItem('id'), appSettings.secretkeylocal)
        departmentID = decrypt(window.localStorage.getItem('LkgdW23!'), appSettings.secretkeylocal)
      }
      
      }catch(err) {
        
        navigate('/login')
      }

    }, [])

  useEffect(() => {
  
  LoadAssetsbyUser()
  LoadAssetsperCategory()
  LoadCountDepartment_ByUser()
  LoadTotalCountDepartment_ByUser()
  LoadCountStatusDepartment_ByUser()
  LoadTotalCountStatusDepartment_ByUser()
 /*
  LoadStatus()
  LoadStatAvailable()
  LoadPullout()
  LoadCountPullout()
  */
  }, [])


 
  function LoadAssetsbyUser(){


    const url = 'http://localhost:3001/assets/getCountassets_byUser'
     axios.post(url,{userID})

    .then(res => {
      const dataResponse = res.data.message;
      if(dataResponse == "Record Found") {
        setTotalAssets({...assets,
          totalassets: res.data.result[0].totalAssets})
      } else if (dataResponse == "No Record Found") {
        WriteLog("Error","WidgetsDropDownUser","LoadAssetsbyUser /assets/getCountassets",res.data.message,userID)
        setTotalAssets({...assets,
          totalassets: "0"})
        //navigate('/500');
      }
    }).catch(err => {
      WriteLog("Error","WidgetsDropDownUser","LoadAssetsbyUser /assets/getCountassets","Error in then/catch \n" + err.message,userID)
    })
  }

  function LoadAssetsperCategory(){
    setMessage("")
    const url = 'http://localhost:3001/assets/getCountassetsper_category_ByUser'
     axios.post(url,{userID})
 
    .then(res => {
      const dataResponse = res.data.message;
      if(dataResponse == "Record Found") {
        setAssetsperCategoory(res.data.result)
        
      } else if (dataResponse == "No Record Found") {
        WriteLog("Error","WidgetsDropDown","LoadAssetsperCategory /assets/getCountassetsper_category",res.data.message,userID)
      }
    }).catch(err => {
      WriteLog("Error","WidgetsDropDown","LoadAssetsperCategory /assets/getCountassetsper_category","Error in then/catch \n" + err.message,userID)
    })
  }

  function LoadCountDepartment_ByUser(){
    setMessage("")
    const url = 'http://localhost:3001/assets/viewallassetsCountPerDepartment_By_User'
     axios.post(url)
 
    .then(res => {
      const dataResponse = res.data.message;
      if(dataResponse == "Record Found") {
        setDepartment(res.data.result)
        
      } else if (dataResponse == "No Record Found") {
        WriteLog("Error","WidgetsDropDownUser","LoadCountperDepartment /assets/viewallassetsCountPerDepartment",res.data.message,userID)
        //setTotalAssets()
        //navigate('/500');
      }
    }).catch(err => {
      WriteLog("Error","WidgetsDropDownUser","LoadCountperDepartment /assets/viewallassetsCountPerDepartment","Error in then/catch \n" + err.message,userID)
    })
  }


  function LoadTotalCountDepartment_ByUser() {
    setMessage("")
    const url = 'http://localhost:3001/assets/viewallassetsToatalPerDepartment_By_User'
     axios.post(url,{departmentID})

    .then(res => {
      const dataResponse = res.data.message;
      if(dataResponse == "Record Found") {
        setTotalDepartment({...totalDepartment,
          totaldepartment: res.data.result[0].totalDepartment})
      } else if (dataResponse == "No Record Found") {
        WriteLog("Error","WidgetsDropDownUser","LoadTotalCountDepartment_ByUser /assets/viewallassetsToatalPerDepartment_By_User",res.data.message,userID)
        setTotalAssets({...totalDepartment,
          totaldepartment: "0"})
        //navigate('/500');
      }
    }).catch(err => {
      WriteLog("Error","WidgetsDropDownUser","LoadTotalCountDepartment_ByUser /assets/viewallassetsToatalPerDepartment_By_User","Error in then/catch \n" + err.message,userID)
    })
  }

  function LoadCountStatusDepartment_ByUser(){
    setMessage("")
    const url = 'http://localhost:3001/status/getStatusbyAssetDepartment_ByUser'
     axios.post(url,{departmentID})
 
    .then(res => {
      const dataResponse = res.data.message;
      if(dataResponse == "Record Found") {
        setStatus(res.data.result)
        
      } else if (dataResponse == "No Record Found") {
        WriteLog("Error","WidgetsDropDownUser","LoadStatusDepartment_ByUser /status/getStatusbyAssetDepartment_ByUser",res.data.message,userID)
        //setTotalAssets()
        //navigate('/500');
      }
    }).catch(err => {
      WriteLog("Error","WidgetsDropDownUser","LoadStatusDepartment_ByUser /status/getStatusbyAssetDepartment_ByUser","Error in then/catch \n" + err.message,userID)
    })
  }

  function LoadTotalCountStatusDepartment_ByUser(){
    setMessage("")
    const url = 'http://localhost:3001/status/getStatusAvailable'
     axios.post(url)
 
    .then(res => {
      const dataResponse = res.data.message;
      if(dataResponse == "Record Found") {
        setStatAvailable({...statavailable,
          available: res.data.result[0].statavailalble})
        
      } else if (dataResponse == "No Record Found") {
        WriteLog("Error","WidgetsDropDown","LoadAvailable /status/getStatusAvailable",res.data.message,userID)
        //setTotalAssets()
        //navigate('/500');
      }
    }).catch(err => {
      WriteLog("Error","WidgetsDropDown","LoadAvailable /status/getStatusAvailable","Error in then/catch \n" + err.message,userID)
    })
  }
  

  return (
    <CRow>
      <CCol sm={6} lg={3}>

        <CCardBody>

        </CCardBody>

        <CWidgetStatsA id='a'
          className="mb-4"
          color="primary"
          value={
            <>
            {(assets.totalassets)}
              </>
          }
          title="Assigned Asset(s)"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="p-0">
                <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem  href="#/base/assetbyuser"> Asset</CDropdownItem> 
                <CDropdownItem href="#/base/assetuserassign"> CheckIn</CDropdownItem>
                <CDropdownItem href="#/base/assetpullout">Pullout</CDropdownItem>
                
                
              </CDropdownMenu>
            </CDropdown>
          }
        
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{

               labels: assetsperCategory?.map((categ) => categ.assetCategName),
                datasets: [
                  {
                    label: 'Total',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,221,.55)',
                    pointBackgroundColor: getStyle('--cui-primary'),
                    data: assetsperCategory?.map((categ) => categ.countAsset),
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: 0,
                    max: 200,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                    tension: 0.4,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }

          
        />

      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA id='department'
          className="mb-4"
          color="info"
          value={
            <>
            {(totalDepartment.totaldepartment)}
              </>
          }
          title="Department Asset(s)"
          /* action={
           <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="p-0">
                <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Action</CDropdownItem>
                <CDropdownItem>Another action</CDropdownItem>
                <CDropdownItem>Something else here...</CDropdownItem>
                <CDropdownItem disabled>Disabled action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown> 
          }*/
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: department?.map((dept) => dept.departmentName),
                datasets: [
                  {
                    label: 'Total',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-info'),
                    data: department?.map((dept) => dept.countDept),
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: -9,
                    max: 39,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={5} lg={3}>
        <CWidgetStatsA id='status'
          className="mb-4"
          color="warning"
          value= 

            {(statavailable.available)
         
          }
          title="Department Status"
         /*  action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="p-0">
                <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Action</CDropdownItem>
                <CDropdownItem>Another action</CDropdownItem>
                <CDropdownItem>Something else here...</CDropdownItem>
                <CDropdownItem disabled>Disabled action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          } */
          chart={
            <CChartLine
              className="mt-3"
              style={{ height: '70px' }}
              data={{
                labels:  status?.map((stat) => stat.statusName),
                datasets: [
                  {
                    label: 'Total',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data:  status?.map((stat) => stat.countStatus), 
                    fill: true,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    display: false,
                  },
                  y: {
                    display: false,
                  },
                },
                elements: {
                  line: {
                    borderWidth: 2,
                    tension: 0.4,
                  },
                  point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
         
        />
        
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA id='a'
          className="mb-4"
          color="danger"
          value= 

          {(statavailable.available)
       
        }
          title="Department Pullout History"
          /*
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="p-0">
                <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
              </CDropdownToggle>
              <CDropdownMenu>
              <CDropdownItem  href="#/configurations/viewpullout"> Receive Pullout</CDropdownItem> 
              </CDropdownMenu>
            </CDropdown> 
          } */
          chart={
            <CChartBar
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels:  status?.map((stat) => stat.statusName),
                datasets: [
                  {
                    label: 'Total',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: status?.map((stat) => stat.countStatus), 
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
                      display: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    grid: {
                      display: false,
                      drawBorder: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
              }}
            />
          }
        />
      </CCol>
    </CRow>
  )
}

export default WidgetsDropdownUser
