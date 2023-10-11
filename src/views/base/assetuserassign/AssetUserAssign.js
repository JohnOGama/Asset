// eslint-disable-next-line
import { useEffect, useState } from "react";
import axios from "axios";

import * as React from "react";

import { DataGrid } from "@mui/x-data-grid";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CButton,
  CFormSelect,
  //CFormInput,
  //CInputGroupText,
  CInputGroup,
  CFormLabel,
  //CFormLabel,
  //CFormFloating
} from "@coreui/react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";

import { json, useNavigate } from "react-router-dom";


import appSettings from "src/AppSettings"; // read the app config
import { decrypt, encrypt } from "n-krypta";
//encrypt, compare

import WriteLog from "src/components/logs/LogListener";
import utils_getDate from "src/components/DateFunc";
import WriteUserInfo from "src/components/logs/LogListenerUser";


import ChecklistIcon from '@mui/icons-material/Checklist';
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import GenerateCheckINDocPDF from "src/components/generatereport/GenerateCheckINDocPDF";
import AlertMessages from "src/components/alertmessages/AlertMessages";


const AssetUserAssign = () => {
  const navigate = useNavigate();

  let userID = "";
  var userRole = ""
  var receiver_detailID = ""
  var receiver_assetID = ""
  var receiver_name = ""
  var receiver_deptID = ""
  var receiver_userID = ""
  var checkin_success = ""
  var receiver_assetName = ""

  //const [message, setMessage] = useState("");
  //const [colorMessage, setColorMessage] = useState("red");

  const [assets, setAssets] = useState([]);
  const [assetstat, setAssetStat] = useState(""); // deployed
  const [assetstatfordeploy, setAssetForDeploy] = useState(""); // for deploy
  const [rowselected, setRowSelected] = useState({
    id: '',
    assetid: ''
  });
  const [iselected, SetTotalSelected] = useState(0); // count how many are selected

  const [open, setOpen] = React.useState(false);

  const [docRef,setDocRef] = useState([])
  const [docRef_selected,setdocRef_selected] = useState("")


  /// For Dialog Box

  function PaperComponent(props) {
    return (
      <Draggable
        handle="#draggable-dialog-title"
        cancel={'[class*="MuiDialogContent-root"]'}
      >
        <Paper {...props} />
      </Draggable>
    );
  }

  function CheckRole() {
    try {
      userRole = decrypt(
        window.localStorage.getItem("Kgr67W@"),
        appSettings.secretkeylocal
      );
    } catch (err) {
      WriteLog(
        "Error",
        "AssetUserAssign",
        "CheckRole Local Storage is tampered",
        err.message,
        userID
      );
      navigate("/dashboard");
    }
  }

  function getUserInfo() {
    try {
      CheckRole()

      if(userRole === "User") {
        if (
          !window.localStorage.getItem("id") == null ||
          window.localStorage.getItem("id") !== "0"
        ) 
        {
          userID = decrypt(
            window.localStorage.getItem("id"),
            appSettings.secretkeylocal
          );
        } else {
          navigate("/login");
        }
      }
      else {
        navigate("/dashboard");
      }
    } catch (err) {
      navigate("/dashboard");
    }
  }

  useEffect(() => {
    getUserInfo();
    LoadData();
    LoadDocCheckIn();
   //GetAsset_Status_For_Deploy();
   // GetAsset_Status_Deploy()
  }, []);

  //// Get_Status_Deploy
  useEffect(() => {
  
    try {

      if (userID === "") {
        getUserInfo();
      }
      const url = "http://localhost:3001/assets/getassetstatdeploy";
      axios
        .post(url)
        .then((res) => {
          const deployResponse = res.data.message;
          if (deployResponse == "Record Found") {
            setAssetStat(res.data.result[0]["assetStatusID"]);
          } else if (deployResponse == "No Record Found") {
            setAssetStat([])
            WriteLog(
              "Message",
              "AssetUserAssign",
              "useEffect /assets/getassetstatdeploy",
              deployResponse,
              userID
            );
          }
        })
        .catch((err) => {
          WriteLog(
            "Message",
            "AssetUserAssign",
            "useEffect /assets/getassetstatdeploy",
            err.message,
            userID
          );
        });
  
    }
    catch(err) {
      WriteLog(
        "Error",
        "AssetUserAssign",
        "GetAsset_Status_Deploy /assets/getAssetID_By_detailID",
        " Error in try/catch " + err.message,
        userID
      );
    }
  }, [])

/// GetAsset_Status_For_Deploy
useEffect(() => {

  try {

    if (userID === "") {
      getUserInfo();
    }
    const url = "http://localhost:3001/assets/getassetfordeploystatus";
    axios
      .post(url)
      .then((response) => {
        const dataResponse = response.data.message;
        if (dataResponse == "Record Found") {
          setAssetForDeploy(response.data.result[0]["assetStatusID"]);
        } else if (dataResponse == "No Record Found") {
          WriteLog(
            "Message",
            "AssetUserAssign",
            "useEffect /assets/getassetfordeploystatus",
            dataResponse,
            userID
          );
          //navigate('/500');
        }
      })
      .catch((err) => {
        WriteLog(
          "Error",
          "AssetUserAssign",
          "useEffect /assets/getassetfordeploystatus",
          err.message,
          userID
        );
      });
  }
  catch(err) {
    WriteLog(
      "Error",
      "AssetUserAssign",
      "GetAsset_Status_For_Deploy /assets/getAssetID_By_detailID",
      " Error in try/catch " + err.message,
      userID
    );
  }

}, [])


function LoadDocCheckIn() {

  try {
    if (userID === "") {
      getUserInfo();
    }
    const url = "http://localhost:3001/assets/viewallassetsassignby_docref";
    axios
      .post(url, { userID })
      .then((res) => {
        const dataResponse = res.data.message;
     
        if (dataResponse == "Record Found") {
          setDocRef(res.data.result);
        }
        else {
          setDocRef([])
        }
      })
      .catch((err) => {
        WriteLog(
          "Error",
          "AssetUserAssign",
          "LoadDocCheckIn /assets/viewallassetsassignfordeploy_DocRef",
          err.message,
          userID
        );
      });
  } catch (err) {
    WriteLog(
      "Error",
      "AssetUserAssign",
      "LoadDocCheckIn /assets/viewallassetsassignfordeploy_DocRef",
      err.message,
      userID
    );
  }

}

  function LoadData() {
    try {
      if (userID === "") {
        getUserInfo();
      }
      const url = "http://localhost:3001/assets/viewallassetsassignfordeploy";
      axios
        .post(url, { userID })
        .then((res) => {
          const dataResponse = res.data.message;

          if (dataResponse == "Record Found") {
            setAssets(res.data.result);
          } else {
            setAssets([]);
          }
        })
        .catch((err) => {
          WriteLog(
            "Error",
            "AssetUserAssign",
            "LoadData /assets/viewallassetsassignfordeploy",
            err.message,
            userID
          );
        });
    } catch (err) {
      WriteLog(
        "Error",
        "AssetUserAssign",
        "LoadData /assets/viewallassetsassignfordeploy",
        err.message,
        userID
      );
    }
  }

  
function GetAsset_Status_For_Deploy() {
  try {

    if (userID === "") {
      getUserInfo();
    }
    const url = "http://localhost:3001/assets/getassetfordeploystatus";
    axios
      .post(url)
      .then((response) => {
        const dataResponse = response.data.message;
        if (dataResponse == "Record Found") {
          setAssetForDeploy(response.data.result[0]["assetStatusID"]);
        } else if (dataResponse == "No Record Found") {
          WriteLog(
            "Message",
            "AssetUserAssign",
            "GetAsset_Status_For_Deploy /assets/getassetfordeploystatus",
            dataResponse,
            userID
          );
          //navigate('/500');
        }
      })
      .catch((err) => {
        WriteLog(
          "Error",
          "AssetUserAssign",
          "GetAsset_Status_For_Deploy /assets/getassetfordeploystatus",
          err.message,
          userID
        );
      });
  }
  catch(err) {
    WriteLog(
      "Error",
      "AssetUserAssign",
      "GetAsset_Status_For_Deploy /assets/getAssetID_By_detailID",
      " Error in try/catch " + err.message,
      userID
    );
  }
}

function GetAsset_Status_Deploy () {
  try {

    if (userID === "") {
      getUserInfo();
    }
    const url = "http://localhost:3001/assets/getassetstatdeploy";
    axios
      .post(url)
      .then((res) => {
        const deployResponse = res.data.message;
        if (deployResponse == "Record Found") {
          setAssetStat(res.data.result[0]["assetStatusID"]);
        } else if (deployResponse == "No Record Found") {
          WriteLog(
            "Message",
            "AssetUserAssign",
            "GetAsset_Status_Deploy /assets/getassetstatdeploy",
            deployResponse,
            userID
          );
        }
      })
      .catch((err) => {
        WriteLog(
          "Message",
          "AssetUserAssign",
          "GetAsset_Status_Deploy /assets/getassetstatdeploy",
          err.message,
          userID
        );
      });

  }
  catch(err) {
    WriteLog(
      "Error",
      "AssetUserAssign",
      "GetAsset_Status_Deploy /assets/getAssetID_By_detailID",
      " Error in try/catch " + err.message,
      userID
    );
  }
}

  const handleClickOpen = (event) => {
  
      event.preventdefault;

      if (Object.keys(rowselected).length > 0) {
      
       
        setOpen(true);
      
      }
      else {

        setOpen(false)
        AlertMessages('No Asset selected','Warning')
        //setMessage('No Asset Selected')
        //setColorMessage('orange')
      }

  };

 
  function handle_Asset_Detail(detailID,assetname) {

    try {
    window.localStorage.removeItem('0ghds-134U')
    window.localStorage.removeItem('bbg54WQ')
    window.localStorage.removeItem('125df')
    window.localStorage.removeItem('8786bgd')
    window.localStorage.removeItem("Kvsf45_")
    setOpen(true)
    }
    catch(err) {
      // means no laman
      WriteLog("Error","AssetUserAssign","handle_Asset_Detail","No localsotrage for processing asstassign checkin")
    }
 
    GetAssetByDetail(detailID,assetname)
   


  }

  /// For Dialog
  const handleClose = () => {
    setOpen(false);
  };

  function GeneratePDF() {

   // const [docref_asset,setAssetsby_docRef] = useState([])

    try {
      if (userID === "") {
        getUserInfo();
      }
      const docref = docRef_selected
      const url = "http://localhost:3001/assets/viewassetsassignfordeploy_by_docRef";
      axios.post(url, { userID,docref })
        .then((res) => {
          const dataResponse = res.data.message;

          if (dataResponse == "Record Found") {
           
         //   console.log(res.data.result)
            GenerateCheckINDocPDF( res.data.result,docref)
            LoadDocCheckIn()
          }
        })
        .catch((err) => {
          WriteLog(
            "Error",
            "AssetUserAssign",
            "LoadData /assets/viewassetsassignfordeploy_by_docRef",
            err.message,
            userID
          );
        });
    } catch (err) {
      WriteLog(
        "Error",
        "AssetUserAssign",
        "LoadData /assets/viewassetsassignfordeploy_by_docRef",
        err.message,
        userID
      );
    }

  }

  const handleCheckin = (event) => {

    event.preventdefault;


    if(userID === "") 
    {
      getUserInfo()
    }
  
    try {
      setOpen(false)
     
      if(userID === "") 
      {
        getUserInfo()
      }

      window.localStorage.setItem('Kvsf45_','0')
      receiver_detailID = decrypt(window.localStorage.getItem('0ghds-134U'),appSettings.secretkeylocal)
      receiver_name = decrypt(window.localStorage.getItem('bbg54WQ'),appSettings.secretkeylocal)
      receiver_deptID = decrypt(window.localStorage.getItem('125df'),appSettings.secretkeylocal)
      receiver_userID = decrypt(window.localStorage.getItem('8786bgd'),appSettings.secretkeylocal)
      receiver_assetID = decrypt(window.localStorage.getItem('uuer474'),appSettings.secretkeylocal) 
      receiver_assetName = decrypt(window.localStorage.getItem('ooe34d'),appSettings.secretkeylocal) 

          const detailID = receiver_detailID
          const url = 'http://localhost:3001/assets/checkinassetsdetail'
          axios.post(url,{userID,assetstat,detailID})
          .then(response => {
            const dataResponse = response.data.message;
            if(dataResponse == "Update Success") {

  
              var writeOnce = window.localStorage.getItem('Kvsf45_')
             
            
              if ((writeOnce === "0") || (writeOnce === "") ) {

                window.localStorage.setItem('Kvsf45_','1')
             
                checkin_success = window.localStorage.getItem('Kvsf45_');
              
              }
              
            UpdateAssetDeployed(receiver_assetID) 
          
       
              WriteLog("Message","AssetUserAssign","handleCheckIn /assets/checkinassetsdetail", 
                        "User asset received or checkin "
                        + "\n Asset Detail ID: " + receiver_detailID 
                        + "\n Status From :  " + assetstatfordeploy 
                        + "\n Status To :  " + assetstat
                        + "\n Receive by : " + receiver_userID ,userID)

        
              // kapag nilagyan ng setmessagte di nagrerefresh yng grid 
              sendEmail(checkin_success)
              LoadData()

              window.localStorage.removeItem('0ghds-134U')
              window.localStorage.removeItem('bbg54WQ')
              window.localStorage.removeItem('125df')
              window.localStorage.removeItem('8786bgd')
              window.localStorage.removeItem('ooe34d')
              window.localStorage.setItem('Kvsf45_','0')

            } else if (dataResponse == "Update Error") {
              WriteLog("Error","AssetUserAssign","handleCheckIn /assets/checkinassetsdetail",response.data.message2,userID)
             
              window.localStorage.removeItem('0ghds-134U')
              window.localStorage.removeItem('bbg54WQ')
              window.localStorage.removeItem('125df')
              window.localStorage.removeItem('8786bgd')
              window.localStorage.removeItem('ooe34d')
              window.localStorage.setItem('Kvsf45_','0')

            }
    

          }).catch(err => {
            WriteLog("Error","AssetUserAssign","handleCheckIn /assets/checkinassetsdetail","Error in then/catch " + err.message,userID)
          })
     // })

      
    
      


    }
      catch(err) {
        WriteLog("Error","AssetUserAssign","handleCheckIn /assets/checkinassetsdetail","Error in try/catch possible local Storage tampered " + err.message,
        userID)

        window.localStorage.removeItem('0ghds-134U')
        window.localStorage.removeItem('bbg54WQ')
        window.localStorage.removeItem('125df')
        window.localStorage.removeItem('8786bgd')
        window.localStorage.removeItem('uuer474')
        window.localStorage.removeItem('ooe34d')
        
        window.localStorage.setItem('Kvsf45_','0')

      }


  };


  function GetAssetByDetail(paramdetailID,assetName) {
    try {
      if (userID === "") {
        getUserInfo();
      }

      window.localStorage.setItem('0ghds-134U',encrypt(paramdetailID,appSettings.secretkeylocal))
      window.localStorage.setItem('ooe34d',encrypt(assetName,appSettings.secretkeylocal))
      
      const url = "http://localhost:3001/assets/getAssetID_By_detailID";
      axios.post(url, {paramdetailID})
        .then((res) => {
          const dataResponse = res.data.message;
          if (dataResponse == "Record Found") {
          
          window.localStorage.setItem('bbg54WQ',encrypt(res.data.result[0].firstname,appSettings.secretkeylocal))
          window.localStorage.setItem('125df',encrypt(res.data.result[0].departmentID,appSettings.secretkeylocal))
          window.localStorage.setItem('8786bgd',encrypt(res.data.result[0].userid,appSettings.secretkeylocal))
          window.localStorage.setItem('uuer474',encrypt(res.data.result[0].assetID,appSettings.secretkeylocal))
          
          
          } else if (dataResponse == "No Record Found") {

            window.localStorage.removeItem('0ghds-134U')
            window.localStorage.removeItem('bbg54WQ')
            window.localStorage.removeItem('125df')
            window.localStorage.removeItem('8786bgd')
            window.localStorage.removeItem('uuer474')
            window.localStorage.removeItem('ooe34d')
            window.localStorage.setItem('Kvsf45_','0')

            WriteLog(
              "Message",
              "AssetUserAssign",
              "GetAssetbyDetail /assets/getAssetID_By_detailID",
              dataResponse,
              userID
            );

          } 
          else {
            WriteLog(
              "Error",
              "AssetUserAssign",
              "GetAssetbyDetail /assets/getAssetID_By_detailID",
              " Suppose to be a success or error only, need tocheck this!!",
              userID
            );
          }
        })
        .catch((err) => {
          WriteLog(
            "Error",
            "AssetUserAssign",
            "GetAssetbyDetail /assets/getAssetID_By_detailID",
            " Error in then/catch " + err.message,
            userID
          );
         
          window.localStorage.removeItem('0ghds-134U')
          window.localStorage.removeItem('bbg54WQ')
          window.localStorage.removeItem('125df')
          window.localStorage.removeItem('8786bgd')
          window.localStorage.removeItem('uuer474')
          window.localStorage.removeItem('ooe34d')
          window.localStorage.setItem('Kvsf45_','0')
        });
      
    }
    catch(err) {
      WriteLog(
        "Error",
        "AssetUserAssign",
        "GetAssetbyDetail /assets/getAssetID_By_detailID",
        " Error in try/catch " + err.message,
        userID
      );

      window.localStorage.removeItem('0ghds-134U')
      window.localStorage.removeItem('bbg54WQ')
      window.localStorage.removeItem('125df')
      window.localStorage.removeItem('8786bgd')
      window.localStorage.removeItem('uuer474')
      window.localStorage.removeItem('ooe34d')
      window.localStorage.removeItem("Kvsf45_")

    }
  }

function UpdateAssetDeployed(paramassetid) {
   
    try {
      if (userID === "") {
        getUserInfo();
      }
      
      var varassetID = ""
      try {

            receiver_detailID = decrypt(window.localStorage.getItem('0ghds-134U'),appSettings.secretkeylocal)
            varassetID = decrypt(window.localStorage.getItem('uuer474'),appSettings.secretkeylocal) 

      }
      catch(err) {
        varassetID = paramassetid
       // WriteLog("For Testing","What happen localsotrage still reading","Hit ",err.message,userID)
      }

      const url = "http://localhost:3001/assets/updateassetdeploy";
      axios.post(url, {assetstat,userID,varassetID })
        .then((res) => {
          const dataResponse = res.data.message;
          if (dataResponse == "Update Error") {
            WriteLog(
              "Error",
              "AssetUserAssign",
              "UpdateAssetDeployed /assets/updateassetdeploy",
              "Asset DetaildID : " + paramassetid + "\n" + dataResponse,
              userID)

          }
        })
        .catch((err) => {
          WriteLog(
            "Error",
            "AssetUserAssign",
            "UpdateAssetDeployed /assets/updateassetdeploy",
            "Error in then/catch " + err.message,
            userID
          )
        });
      
    } catch (err) {
      WriteLog(
        "Error",
        "AssetUserAssign",
        "UpdateAssetDeployed /assets/updateassetdeploy ",
        "Error in try/catch " + err.message,
        userID
      );
    }

  }


  function sendEmail(paramcheckin_success) {
    try {

      if(userID === "") {
        getUserInfo()
      }

     
      let strDate = utils_getDate();
      const allow_send_email_checkin_asset_by_user = appSettings.ALLOW_SENDEMAIL_CHECKIN_BY_USER;
      
    

      var templateParams = {
        email_to: appSettings.email_sender,
        email_sender: "",
        reply_to: "",
        name: appSettings.ASSET_RECEIVERNAME,
        notes: " Asset Name ( " + receiver_assetName + " ) \n is now CheckIn on my end",
        date: strDate,
      };

      if (paramcheckin_success === "1") {
        if (allow_send_email_checkin_asset_by_user === "send") {
          emailjs.send(
              appSettings.YOUR_SERVICE_ID,
              appSettings.YOUR_TEMPLATE_ID,
              templateParams,
              appSettings.public_key
            )
            .then(
              function (response) {
                WriteUserInfo("Info", "AssetUserAssign", receiver_userID,
                receiver_name,receiver_deptID,
                templateParams.notes,userID)

              },
              function (error) {

                WriteLog(
                  "Error",
                  "AssetUserAssign",
                  "Failed sending checkin email",
                  error.message,
                  userID
                );
               
              }
            );
        } 
        else {
          WriteUserInfo("Info", "AssetUserAssign", receiver_userID,
          receiver_name,receiver_deptID, 
          "CheckIn Asset : \nNotes : \n"  + templateParams.notes,userID)

        }
      } 
    } catch (err) {
      WriteLog(
        "Error",
        "AssetUserAssign",
        "LocalStorage checkin tampered",
        err.message,
        userID
      );
    }
  }

  /// For Data Grid

  const columns = [
    {
      field: 'id',
      headerName: 'Actions',
      type: 'actions',
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
            <div>
              
            <ChecklistIcon cursor="pointer" onClick={()=> handle_Asset_Detail(params.row.id,
                                      params.row.assetName)}/>

            </div>
        );
      }
    },
    {
      field: "assetCode",
      headerName: "Asset Code",
      width: 150,
      editable: false,
    },
    {
      field: "assetName",
      headerName: "Name",
      width: 150,
      editable: false,
    },
    {
      field: "statusName",
      headerName: "Status",
      width: 100,
      editable: false,
    },
    {
      field: "assetCategName",
      headerName: "Category",
      width: 150,
      editable: false,
    },
    {
      field: "displayName",
      headerName: "Checkout By",
      width: 130,
      editable: false,
    },
    {
      field: "datecheckout",
      headerName: "Date Checkout",
      width: 130,
      editable: false,
    },
  ];

  /////// end of DGrid

  function handleInput(e) {
   // setdocRef_selected(e.targ)
    setdocRef_selected(e.target.value.trim())
  }

  return (
    <CCol xs={12}>
      <CCard className="mb-3">
        <AlertMessages/>
        <CCardHeader>
       

          <h6>
            
            <span className="message" style={{ color: "#5da4f5" }}>

            Asset Checkin 
          
            </span>
          </h6>
        
       { /*
            <strong>
              <span className="message" style={{ color: colorMessage }}>
                <p>{message}</p>
              </span>{" "}
            </strong>
  */}
          
        </CCardHeader>
       
        <CForm>
         <CCardBody>
          <CRow>
            <CCol xs={3}>

                <FormControl fullWidth  size="sm"  >
                        <InputLabel id="docref">CheckIn Document Reference No.</InputLabel>
                          <Select  className="mb-3" aria-label="Small select example"
                            name='docref' onChange={handleInput} value={docRef_selected}
                            error = {
                            docRef_selected
                              ? false
                              : true
                            }
                            label="Checkin Reference No."
                            >
                              { 
                              docRef.map((val) => 
                                
                                <MenuItem key={val.docRef} value={val.docRef} >{val.docRef}</MenuItem>

                              )
                              }
                          </Select>
                </FormControl>
                <CButton
                style={{ width: "100%" }}
                onClick={GeneratePDF}
                color="info"
              >
                Print Receiving Document
              </CButton>
            </CCol>
            <CCol >

            </CCol>
          </CRow>
          <br></br>
          <CRow>
          
            <CCol xs={12}>
           

                <CInputGroup size="sm" className="mb-3">

           
                  <div style={{ height: 400, width: "100%" }}>
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

                   
                    />
                  </div>
                </CInputGroup>
             
            </CCol>
             {/*  <div
              className="d-grid"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
           
              <CButton
                style={{ width: "150%" }}
                onClick={handleClickOpen}
                color="success"
              >
                Checkin
              </CButton>
            </div>
            */}
            <Dialog
              open={open}
              onClose={handleClose}
              PaperComponent={PaperComponent}
              aria-labelledby="draggable-dialog-title"
            >
              <DialogTitle
                style={{ cursor: "move" }}
                id="draggable-dialog-title"
              >
                CheckIn
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to Checkin / Receive asset(s) ?<br></br>
                 
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={handleCheckin}>CheckIn</Button>
              </DialogActions>
            </Dialog>
          </CRow>
          </CCardBody>
        </CForm>
      </CCard>
    </CCol>
  );
};

export default AssetUserAssign;
