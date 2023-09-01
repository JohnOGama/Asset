
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

const WidgetsDropdown = () => {

  const navigate = useNavigate();

  const [assets,setTotalAssets] = useState({
    totalassets: "",
    totalamount:""
  })
  const [countsupplier,setTotalSupplier] = useState({
    totalsupplier: ""
  })
  const [statavailable,setStatAvailable] = useState({
    available: ""
  })
  const [countPullout,setCountPullout] = useState({
    totalpullout: ""
  })

  const [assetsperCategory,setAssetsperCategoory] = useState([])
  const [supplier,setSupplier] = useState([])
  const [status,setStatus] = useState([])
  const [pullout,setPullout] = useState([])

  const [message,setMessage] = useState("")
  const [colorMessage,setColorMessage] = useState('red')
  const [userID,setUserID] = useState("")

  useEffect(() => {
    try {
     
      if((!window.localStorage.getItem('id') == null) || (window.localStorage.getItem('id') !== "0")) {
        setUserID(decrypt(window.localStorage.getItem('id'), appSettings.secretkeylocal));
      }
      
      }catch(err) {
        
        navigate('/login')
      }

    }, [])

  useEffect(() => {
  // console.log()
  LoadAssets()
  LoadAssetsperCategory()
  LoadSuppler()
  LoadCountSupplier()
  LoadStatus()
  LoadStatAvailable()
  LoadPullout()
  LoadCountPullout()
  //console.log()
  }, [])

  useEffect(() => {
    //console.log(assetsperCategory)
  }, [assetsperCategory])

   function LoadAssets(){
    setMessage("")
    const url = 'http://localhost:3001/assets/getCountassets'
     axios.post(url)

    .then(res => {
      const dataResponse = res.data.message;
      if(dataResponse == "Record Found") {
        setTotalAssets({...assets,
          totalassets: res.data.result[0].totalAsset,
          totalamount: res.data.result[0].totalAmount})
      } else if (dataResponse == "No Record Found") {
        WriteLog("Error","WidgetsDropDown","LoadData /assets/getCountassets",res.data.message,userID)
        setTotalAssets({...assets,
          totalassets: "0"})
        //navigate('/500');
      }
    }).catch(err => {
      WriteLog("Error","WidgetsDropDown","LoadData /assets/getCountassets","Error in then/catch \n" + err.message,userID)
    })
  }

  function LoadAssetsperCategory(){
    setMessage("")
    const url = 'http://localhost:3001/assets/getCountassetsper_category'
     axios.post(url)
 
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

  function LoadSuppler(){
    setMessage("")
    const url = 'http://localhost:3001/supplier/getSupplierAssets'
     axios.post(url)
 
    .then(res => {
      const dataResponse = res.data.message;
      if(dataResponse == "Record Found") {
        setSupplier(res.data.result)
        
      } else if (dataResponse == "No Record Found") {
        WriteLog("Error","WidgetsDropDown","LoadSuppler /assets/getCountSupplier",res.data.message,userID)
        //setTotalAssets()
        //navigate('/500');
      }
    }).catch(err => {
      WriteLog("Error","WidgetsDropDown","LoadSuppler /assets/getCountSupplier","Error in then/catch \n" + err.message,userID)
    })
  }

  function LoadCountSupplier(){
    setMessage("")
    const url = 'http://localhost:3001/supplier/getCountSupplier'
     axios.post(url)

    .then(res => {
      const dataResponse = res.data.message;
      if(dataResponse == "Record Found") {
        setTotalSupplier({...countsupplier,
          totalsupplier: res.data.result[0].countsupplier})
      } else if (dataResponse == "No Record Found") {
        WriteLog("Error","WidgetsDropDown","LoadCountSupplier /supplier/getCountSupplier",res.data.message,userID)
        setTotalAssets({...countsupplier,
          totalsupplier: "0"})
        //navigate('/500');
      }
    }).catch(err => {
      WriteLog("Error","WidgetsDropDown","LoadCountSupplier /supplier/getCountSupplier","Error in then/catch \n" + err.message,userID)
    })
  }

  function LoadStatus(){
    setMessage("")
    const url = 'http://localhost:3001/status/getStatusbyAsset'
     axios.post(url)
 
    .then(res => {
      const dataResponse = res.data.message;
      if(dataResponse == "Record Found") {
        setStatus(res.data.result)
        
      } else if (dataResponse == "No Record Found") {
        WriteLog("Error","WidgetsDropDown","LoadStatus /status/getStatusbyAsset",res.data.message,userID)
        //setTotalAssets()
        //navigate('/500');
      }
    }).catch(err => {
      WriteLog("Error","WidgetsDropDown","LoadStatus /status/getStatusbyAsset","Error in then/catch \n" + err.message,userID)
    })
  }

  function LoadStatAvailable(){
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

  function LoadPullout(){
    setMessage("")
    const url = 'http://localhost:3001/pullout/countallPullout'
     axios.post(url)
    
    .then(res => {
      const dataResponse = res.data.message;
      if(dataResponse == "Record Found") {
        setCountPullout({...countPullout,
          totalpullout: res.data.result[0].totalpullout})
        
      } else if (dataResponse == "No Record Found") {
        WriteLog("Error","WidgetsDropDown","LoadPullout /pullout/countallPullout",res.data.message,userID)
        //setTotalAssets()
        //navigate('/500');
      }
    }).catch(err => {
      WriteLog("Error","WidgetsDropDown","LoadPullout /pullout/countallPullout","Error in then/catch \n" + err.message,userID)
    })
  }

  function LoadCountPullout(){
   
    const url = 'http://localhost:3001/pullout/getallpulloutbydepartment'
     axios.post(url)
    .then(res => {
      const dataResponse = res.data.message;
      if(dataResponse == "Record Found") {
        setPullout(res.data.result)
        
      } else if (dataResponse == "No Record Found") {
        WriteLog("Error","WidgetsDropDown","LoadCountPullout /pullout/getallpulloutbydepartment",res.data.message,userID)
        //setTotalAssets()
        //navigate('/500');
      }
    }).catch(err => {
      WriteLog("Error","WidgetsDropDown","LoadCountPullout /pullout/getallpulloutbydepartment","Error in then/catch \n" + err.message,userID)
    })
  }

  return (
    <CRow>
      <CCol sm={6} lg={3}>

        <CCardBody>

        </CCardBody>

        <CWidgetStatsA
          className="mb-4"
          color="primary"
          value={
            <>
            
            {( assets.totalassets ) }
           
              <span className="fs-6 fw-normal">
            
              ( { assets?.totalamount || "0.00"} )
              </span>
              </>
          }
          title="Asset  "
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="p-0">
                <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
              </CDropdownToggle>
              <CDropdownMenu>
              <CDropdownItem  href="#/base/assetregister"> New Asset</CDropdownItem> 
                <CDropdownItem  href="#/base/assetview"> Asset</CDropdownItem> 
                <CDropdownItem href="#/base/assetuser">Checkout</CDropdownItem>
                <CDropdownItem href="#/base/disposeview"> Dispose</CDropdownItem>
                
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
        <CWidgetStatsA
          className="mb-4"
          color="info"
          value={
            <>
              {countsupplier.totalsupplier}
              <span className="fs-6 fw-normal">
               
              </span>
            </>
          }
          title="Supplier(s)"
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
                labels: supplier?.map((categ) => categ.name),
                datasets: [
                  {
                    label: 'Total',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-info'),
                    data: supplier?.map((categ) => categ.countsupplier),
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
        <CWidgetStatsA
          className="mb-4"
          color="warning"
          value={
            <>
              { statavailable.available} 
             
              <span className="fs-6 fw-normal">
                ( Available )  
              </span>
            </>
          }
          title="Status"
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
                labels: status?.map((stat) => stat.statusName),
                datasets: [
                  {
                    label: 'Total',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: status?.map((stat) => stat.totalasset),
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
        <CWidgetStatsA
          className="mb-4"
          color="danger"
          value={
            <>
              {countPullout?.totalpullout || ""}
              <span className="fs-6 fw-normal">
                ( For Pullout )
              </span>
            </>
          }
          title="Pullout History"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="p-0">
                <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
              </CDropdownToggle>
              <CDropdownMenu>
              <CDropdownItem  href="#/configurations/viewpullout"> Receive Pullout</CDropdownItem> 
              </CDropdownMenu>
            </CDropdown>
          } 
          chart={
            <CChartBar
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: pullout?.map((pullout) => pullout.departmentName),
                datasets: [
                  {
                    label: 'Total',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: pullout?.map((pullout) => pullout.total),
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

export default WidgetsDropdown
