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

import { useNavigate } from "react-router-dom";

import appSettings from "src/AppSettings"; // read the app config
import { decrypt } from "n-krypta";
//encrypt, compare

import WriteLog from "src/components/logs/LogListener";
import utils_getDate from "src/components/DateFunc";
import WriteUserInfo from "src/components/logs/LogListenerUser";

const AssetUserAssign = () => {
  const navigate = useNavigate();

  let userID = "";

  //const [success,SetSuccess] = useState("");
  //const [errors,setErrors] = useState({})
  const [message, setMessage] = useState("");
  const [colorMessage, setColorMessage] = useState("red");

  const [assets, setAssets] = useState([]);
  const [assetstat, setAssetStat] = useState(""); // deployed
  const [assetstatfordeploy, setAssetForDeploy] = useState(""); // for deploy
  const [rowselected, setRowSelected] = useState({});
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
  }, []);

  useEffect(() => {
    try {
      if (userID == "") {
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
  }, []);

  useEffect(() => {
    //console.log
  }, [assets]);

  const handleClickOpen = (event) => {
    try {
      event.preventdefault;

      var num = 0;
      rowselected.forEach((irow, index) => {
        //num = num + 1;
        num = index + 1;
      });
      SetTotalSelected(num);

      setOpen(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // console.log()
  }, [iselected]);

  /// For Dialog
  const handleClose = () => {
    setOpen(false);
  };

  const handleCheckin = (event) => {
    event.preventdefault;
    if(userID == "") 
    {
      getUserInfo()
    }
    CheckIN();
  };

  function CheckIN() {
    try {



          rowselected.forEach((irow) => {
            
          const detailID = irow
          WriteLog("Error","AssetUserAssign","Hit ",detailID,userID)
          const url = 'http://localhost:3001/assets/checkinassetsdetail'
          axios.post(url,{userID,assetstat,detailID})
          .then(response => {
            const dataResponse = response.data.message;
            if(dataResponse == "Update Success")
            {
              WriteLog("For Testing","CHECKIN SUCCESS" ,"",success_insert,)
             
              UpdateAssetDeployed(detailID)
              const writeOnce = window.localStorage.getItem('Kvsf45_')
              if (writeOnce == "0" ) {
                window.localStorage.setItem('Kvsf45_','1')
              }
              
              WriteLog("Message","AssetUserAssign","handleCheckin /assets/checkinassetsdetail", 
                      "User asset received or checkin "
                      + "\n Asset Detail ID: " + detailID 
                      + "\n Status From :  " + assetstatfordeploy 
                      + "\n Status To :  " + assetstat
                      + "\n Receive by : " + userID ,userID)
              
            }
            else if (dataResponse == "Update Error") {
              WriteLog("Error","AssetUserAssign","handleCheckin /assets/checkinassetsdetail",response.data.message2,userID)
              window.localStorage.setItem('Kvsf45_','0')
            }
          }).catch(err => {
            WriteLog("Error","AssetUserAssign","handleCheckin /assets/checkinassetsdetail","Error in then/catch " + err.message,userID)
        })

          })
        sendEmail()
        setOpen(false);
        LoadData() 

  }catch(err) {
    setOpen(false)
    WriteLog("Error","AssetUserAssign","handleCheckin /assets/checkinassetsdetail'","Error in try/catch " + err.message,userID)
    navigate('/dashboard')
  }

  }

  function sendEmail() {
    try {
      let strDate = utils_getDate();
      const allow_send_email_checkin_asset_by_user =
        appSettings.ALLOW_SENDEMAIL_CHECKIN_BY_USER;

      const checkin_success = window.localStorage.getItem("Kvsf45_");

      //senderInfo.receiveremail,
      // senderInfo.receiveremail,
      var templateParams = {
        email_to: appSettings.email_sender,
        email_sender: "",
        reply_to: "",
        name: appSettings.ASSET_RECEIVERNAME,
        notes: "Asset is now CheckIn on my end",
        date: strDate,
      };

      if (checkin_success == "1") {
        if (allow_send_email_checkin_asset_by_user == "send") {
          emailjs
            .send(
              appSettings.YOUR_SERVICE_ID,
              appSettings.YOUR_TEMPLATE_ID,
              templateParams,
              appSettings.public_key
            )
            .then(
              function (response) {
                WriteLog(
                  "Error",
                  "e",
                  "templateParams ",
                  "checkin_success ",
                  userID
                );

                WriteUserInfo(
                  "Info",
                  "AssetUserAssign",
                  userID,
                  "CheckIn Asset : " + `\nNotes : ` + templateParams.notes,
                  userID
                );
              },
              function (error) {
                WriteUserInfo(
                  "Error",
                  "DisposeView",
                  userID,
                  "Info : " +
                    "Failed sending email Approve Dispose : " +
                    userID +
                    "\n" +
                    "Notes : " +
                    templateParams.notes +
                    "\n " +
                    "Response : " +
                    error,
                  userID
                );
              }
            );
        } else {
          WriteUserInfo(
            "Info",
            "AssetUserAssign",
            userID,
            "CheckIn Asset : " + `\nNotes : ` + templateParams.notes,
            userID
          );
        }
      } else {
        WriteUserInfo(
          "Info",
          "AssetUserAssign",
          userID,
          "CheckIn Asset : " + `\nNotes : ` + templateParams.notes,
          userID
        );
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

  function UpdateAssetDeployed(paramdetailID) {
    const [varassetID, setVarAsset] = useState("");

    try {
      if (userID == "") {
        getUserInfo();
      }

      //// GetAssetByDetail

      const url = "http://localhost:3001/assets/getAssetID_By_detailID";
      axios
        .post(url, { paramdetailID })
        .then((res) => {
          const dataResponse = res.data.message;
          if (dataResponse == "Record Found") {
            setVarAsset(res.data.result[0].assetID);
            WriteLog("Error", "val ", "val", varassetID, userID);
          } else if (dataResponse == "No Record Found") {
            WriteLog(
              "Message",
              "AssetUserAssign",
              "UpdateAssetDeployed /assets/getAssetID_By_detailID",
              dataResponse,
              userID
            );
            WriteLog("Error", "A ", "A", varassetID, userID);
          } else {
            WriteLog("Error", "B ", "B", varassetID, userID);
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
          varassetID = "";
          WriteLog("Error", "C ", "C", varassetID, userID);
        });

      WriteLog("Error", "val1 ", "va1l", varassetID, userID);
      /// Update Asset Deploy

      WriteLog(
        "Message",
        "AssetUserAssign",
        "Test value if AssetID : " +
          varassetID +
          " AND DETAILID : " +
          paramdetailID,
        userID
      );
      //const assetdeploy = assetstat

      const url1 = "http://localhost:3001/assets/updateassetdeploy";
      axios
        .post(url1, { assetstat, userID, varassetID })
        .then((res) => {
          const dataResponse = res.data.message;
          if (dataResponse == "Record Found") {
            setAssets(res.data.result);
          } else if (dataResponse == "No Record Found") {
            WriteLog(
              "Message",
              "AssetUserAssign",
              "UpdateAssetDeployed /assets/updateassetdeploy",
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
            "UpdateAssetDeployed /assets/updateassetdeploy",
            "Error in then/catch " + err.message,
            userID
          );
        });
    } catch (err) {
      WriteLog(
        "Error",
        "AssetUserAssign",
        "UpdateAssetDeployed",
        "Error in main try/catch " + err.message,
        userID
      );
    }
  }

  /// End of Dialog

  function LoadData() {
    try {
      if (userID == "") {
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

  useEffect(() => {
    if (userID == "") {
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
  }, []);

  useEffect(() => {
    if (userID == "") {
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
          //navigate('/500');
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
  }, []);

  /// For Data Grid

  const columns = [
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
                      checkboxSelection
                      disableRowSelectionOnClick
                      onRowSelectionModelChange={(id) => setRowSelected(id)}
                    />
                  </div>
                </CInputGroup>
              </CCardBody>
            </CCol>
            <div
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
                  Selected : ({iselected})
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
