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
  //CFormSelect,
  //CFormInput,
  //CInputGroupText,
  CInputGroup,
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
import e from "cors";

const AssetUserAssign = () => {
  const navigate = useNavigate();

  let userID = "";

  var receiver_detailID = ""
  var receiver_assetID = ""
  var receiver_name = ""
  var receiver_deptID = ""
  var receiver_userID = ""


  //const [success,SetSuccess] = useState("");
  //const [errors,setErrors] = useState({})
  const [message, setMessage] = useState("");
  const [colorMessage, setColorMessage] = useState("red");

  const [assets, setAssets] = useState([]);
  const [assetstat, setAssetStat] = useState(""); // deployed
  const [assetstatfordeploy, setAssetForDeploy] = useState(""); // for deploy
  const [rowselected, setRowSelected] = useState({
    id: '',
    assetid: ''
  });
  const [iselected, SetTotalSelected] = useState(0); // count how many are selected

  const [open, setOpen] = React.useState(false);

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
      if (
        !window.localStorage.getItem("id") == null ||
        window.localStorage.getItem("id") !== "0"
      ) {
        userID = decrypt(
          window.localStorage.getItem("id"),
          appSettings.secretkeylocal
        );
      } else {
        navigate("/login");
      }
    } catch (err) {
      navigate("/dashboard");
    }
  }

  useEffect(() => {
    getUserInfo();
    LoadData();
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
        setMessage('')
       
        setOpen(true);
        SetTotalSelected(Object.keys(rowselected).length)
      }
      else {

        setOpen(false)
        setMessage('No Asset Selected')
        setColorMessage('orange')
      }

  };

 
  function handle_Asset_Detail(detailID,assetid,event) {

    try {
    window.localStorage.removeItem('0ghds-134U')
    window.localStorage.removeItem('bbg54WQ')
    window.localStorage.removeItem('125df')
    window.localStorage.removeItem('8786bgd')
    window.localStorage.removeItem("Kvsf45_")
    }
    catch(err) {
      // means no laman
      WriteLog("Error","AssetUserAssign","handle_Asset_Detail","No localsotrage for processing asstassign checkin")
    }
    setMessage('')
    setColorMessage('')
    GetAssetByDetail(detailID)
   
    setOpen(true)

  }

  /// For Dialog
  const handleClose = () => {
    setOpen(false);
  };

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

      receiver_detailID = decrypt(window.localStorage.getItem('0ghds-134U'),appSettings.secretkeylocal)
      receiver_name = decrypt(window.localStorage.getItem('bbg54WQ'),appSettings.secretkeylocal)
      receiver_deptID = decrypt(window.localStorage.getItem('125df'),appSettings.secretkeylocal)
      receiver_userID = decrypt(window.localStorage.getItem('8786bgd'),appSettings.secretkeylocal)
      receiver_assetID = decrypt(window.localStorage.getItem('uuer474'),appSettings.secretkeylocal) 


          const detailID = receiver_detailID
          const url = 'http://localhost:3001/assets/checkinassetsdetail'
          axios.post(url,{userID,assetstat,detailID})
          .then(response => {
            const dataResponse = response.data.message;
            if(dataResponse == "Update Success") {

              WriteLog("For Testing","Start reading chekin once","","",userID)
              const writeOnce = window.localStorage.getItem('Kvsf45_')
              var checkin_success = ""
              if (writeOnce === "0" ) {
                window.localStorage.setItem('Kvsf45_','1')
                WriteLog("For Testing","I write chekin once","","",userID)
                checkin_success = window.localStorage.getItem('Kvsf45_');
                WriteLog("For Testing","ano laman mo ngyn","",checkin_success,userID)
              }
              
              UpdateAssetDeployed(receiver_assetID)
            
       
              WriteLog("Message","AssetUserAssign","handleCheckIn /assets/checkinassetsdetail", 
                        "User asset received or checkin "
                        + "\n Asset Detail ID: " + receiver_detailID 
                        + "\n Status From :  " + assetstatfordeploy 
                        + "\n Status To :  " + assetstat
                        + "\n Receive by : " + userID ,userID)

            } else if (dataResponse == "Update Error") {
              WriteLog("Error","AssetUserAssign","handleCheckIn /assets/checkinassetsdetail",response.data.message2,userID)
              window.localStorage.setItem('Kvsf45_','0')
            }
    

          }).catch(err => {
            WriteLog("Error","AssetUserAssign","handleCheckIn /assets/checkinassetsdetail","Error in then/catch " + err.message,userID)
          })
     // })

      // kapag nilagyan ng setmessagte di nagrerefresh yng grid 
      sendEmail()
      LoadData() 
      
      window.localStorage.removeItem('0ghds-134U')
      window.localStorage.removeItem('bbg54WQ')
      window.localStorage.removeItem('125df')
      window.localStorage.removeItem('8786bgd')
      window.localStorage.setItem('Kvsf45_','0')

    }
      catch(err) {
        WriteLog("Error","AssetUserAssign","handleCheckIn /assets/checkinassetsdetail","Error in try/catch " + err.message,
        userID)

        window.localStorage.removeItem('0ghds-134U')
        window.localStorage.removeItem('bbg54WQ')
        window.localStorage.removeItem('125df')
        window.localStorage.removeItem('8786bgd')
        window.localStorage.removeItem('uuer474')
        window.localStorage.setItem('Kvsf45_','0')

      }


  };


  function GetAssetByDetail(paramdetailID) {
    try {
      if (userID === "") {
        getUserInfo();
      }

      window.localStorage.setItem('0ghds-134U',encrypt(paramdetailID,appSettings.secretkeylocal))

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
            "UpdateAssetDeployed /assets/getAssetID_By_detailID",
            " Error in then/catch " + err.message,
            userID
          );
         
          window.localStorage.removeItem('0ghds-134U')
          window.localStorage.removeItem('bbg54WQ')
          window.localStorage.removeItem('125df')
          window.localStorage.removeItem('8786bgd')
          window.localStorage.removeItem('uuer474')
          window.localStorage.setItem('Kvsf45_','0')
        });
      
    }
    catch(err) {
      WriteLog(
        "Error",
        "AssetUserAssign",
        "UpdateAssetDeployed /assets/getAssetID_By_detailID",
        " Error in try/catch " + err.message,
        userID
      );

      window.localStorage.removeItem('0ghds-134U')
      window.localStorage.removeItem('bbg54WQ')
      window.localStorage.removeItem('125df')
      window.localStorage.removeItem('8786bgd')
      window.localStorage.removeItem('uuer474')
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
      axios.post(url, { assetstat, userID, varassetID })
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


  function sendEmail() {
    try {

      if(userID === "") {
        getUserInfo()
      }

      var checkin_success = ""
      let strDate = utils_getDate();
      const allow_send_email_checkin_asset_by_user = appSettings.ALLOW_SENDEMAIL_CHECKIN_BY_USER;
      try {

        checkin_success = window.localStorage.getItem("Kvsf45_");
        WriteLog("For Testing","nabasa ko may laman","",checkin_success,userID)
      }
      catch(err)
      {
        WriteLog("For Testing","May error sa reading ng write once","",err.message,userID)
      }

      var templateParams = {
        email_to: appSettings.email_sender,
        email_sender: "",
        reply_to: "",
        name: appSettings.ASSET_RECEIVERNAME,
        notes: "Asset is now CheckIn on my end",
        date: strDate,
      };

      if (checkin_success === "1") {
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
      } else
      {
          WriteLog("For Test","No checkin success","",checkin_success,userID)
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
                                      params.row.assetID,e)}/>

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

  return (
    <CCol xs={12}>
      <CCard className="mb-3" size="sm">
        <CCardHeader>
          <h6>
            <span className="message" style={{ color: "#5da4f5" }}>
              {" "}
              <> Asset Checkin</>
            </span>
            <br></br>
            <strong>
              <span className="message" style={{ color: colorMessage }}>
                <p>{message}</p>
              </span>{" "}
            </strong>
          </h6>
        </CCardHeader>
        <CForm>
          <CRow>
            <CCol xs={12}>
              <CCardBody>
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

                      onRowSelectionModelChange={(id,assetID) => setRowSelected({...rowselected,
                      id: id,
                      asseid: assetID})}
                    />
                  </div>
                </CInputGroup>
              </CCardBody>
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
        </CForm>
      </CCard>
    </CCol>
  );
};

export default AssetUserAssign;
