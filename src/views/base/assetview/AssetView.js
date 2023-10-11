// eslint-disable-next-line
import { useEffect, useState } from "react";
import axios from "axios";
import * as React from "react";

import { DataGrid } from "@mui/x-data-grid";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteOutlineTwoToneIcon from "@mui/icons-material/DeleteOutlineTwoTone";

import defaultAvatarAsset from "../../../assets/images/macbook.png";
//'../../../assets/images/macbook.png'
//

import AlertMessages from "src/components/alertmessages/AlertMessages";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  //CAccordion,
  //CAccordionBody,
  //CAccordionHeader,
  //CAccordionItem,
  CForm,
  CButton,
  //CFormSelect,
  //CFormInput,
  //CInputGroupText,
  CInputGroup,
  CImage,
  CFormLabel,
  //CFormLabel,
  //CFormFloating,
  //CLink
} from "@coreui/react";

import { useNavigate } from "react-router-dom";

import appSettings from "src/AppSettings"; // read the app config
import { decrypt } from "n-krypta";
// encrypt, compare
//import ValidationAssetRegister from 'src/components/validation/ValidationAssetRegister';
//import { Icon } from '@mui/material';
//import { buildTimeValue } from '@testing-library/user-event/dist/types/utils';
import WriteLog from "src/components/logs/LogListener";
import { Avatar } from "@mui/material";
import GenerateAssetPDF from "src/components/generatereport/GenerateAssetPDF";

const AssetView = () => {
  const navigate = useNavigate();

  var userID = "";
  var userRole = "";

  //const [message,setMessage] = useState("")
  // const [colorMessage,setColorMessage] = useState('red')

  const [assets, setAssets] = useState([]);
  //const [disposeFound,setdisposeFound] = useState(false)
  //const [deployFound,setdeployFound] = useState(false)

  function CheckRole() {
    try {
      userRole = decrypt(
        window.localStorage.getItem("Kgr67W@"),
        appSettings.secretkeylocal
      );
    } catch (err) {
      WriteLog(
        "Error",
        "AssetView",
        "CheckRole Local Storage is tampered",
        err.message,
        userID
      );
      navigate("/dashboard");
    }
  }

  function getUserInfo() {
    try {
      CheckRole();
      if (userRole == "Admin" || userRole == "IT") {
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
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      navigate("/dashboard");
    }
  }
  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    if (userID == "") {
      getUserInfo();
    }

    try {
      const url = "http://localhost:3001/assets/viewallassetsavailable";
      axios
        .post(url)
        .then((res) => {
          const dataResponse = res.data.message;
          if (dataResponse == "Record Found") {
            setAssets(res.data.result);
          }
        })
        .catch((err) => {
          WriteLog(
            "Error",
            "AssetView",
            "checkStatus /assets/viewallassetsavailable",
            "then/catch \n" + err.message,
            userID
          );
        });
    } catch (err) {
      WriteLog(
        "Error",
        "AssetView",
        "checkStatus /assets/viewallassetsavailable",
        "try/catch \n" + err.message,
        userID
      );
    }
  }, []);

  function CheckDispose(rowidselected, source) {
    try {
      if (userID == "") {
        getUserInfo();
      }
      const rowId = rowidselected;

      const url = "http://localhost:3001/dispose/checkassetdispose";
      axios
        .post(url, { rowId })
        .then((res) => {
          const dataResponse = res.data.message;

          if (dataResponse == "Record Found") {
            AlertMessages("Asset already mark as Dispose", "Warning");
          } else if (dataResponse == "No Record Found") {
            CheckDeploy(rowidselected, source);
          }
        })
        .catch((err) => {
          WriteLog(
            "Error",
            "AssetView",
            "CheckDispose /dispose/checkassetdispose",
            err.message,
            userID
          );
          navigate("/500");
          //navigate('/page/Page404')
        });
    } catch (err) {
      WriteLog("Error", "AssetDispose", "handleSubmit", err, userID);
    }
  }

  function CheckDeploy(rowidselected, source) {
    try {
      if (userID == "") {
        getUserInfo();
      }
      const rowId = rowidselected;
      const params = rowidselected;
      const url = "http://localhost:3001/dispose/checkassetdeploy";
      axios
        .post(url, { rowId })
        .then((res) => {
          const dataResponse = res.data.message;
          if (dataResponse == "Record Found") {
            AlertMessages("Asset still in use", "Warning");
          } else if (dataResponse == "No Record Found") {
            if (source == "Dispose") {
              navigate("/base/assetdispose", { state: { params } });
            } else if (source == "For Edit") {
              navigate("/base/assetedit", { state: { params } });
            }
          }
        })
        .catch((err) => {
          WriteLog(
            "Error",
            "AssetView",
            "CheckDeploy /dispose/checkassetdeploy",
            err.message,
            userID
          );
          //navigate('/500');
          //navigate('/page/Page404')
        });
    } catch (err) {
      WriteLog("Error", "AssetDispose", "handleSubmit", err, userID);
    }
  }

  function handleClick(rowidselected, source) {
    CheckDispose(rowidselected, source);
  }

  const columns = React.useMemo(
    () => [
      {
        field: "idselect",
        headerName: "Actions",
        type: "actions",
        disableClickEventBubbling: true,
        renderCell: (params) => {
          return (
            <div>
              <EditTwoToneIcon
                cursor="pointer"
                onClick={() => handleClick(params.row.id, "For Edit")}
              />
              <DeleteOutlineTwoToneIcon
                cursor="pointer"
                onClick={() => handleClick(params.row.id, "Dispose")}
              />
            </div>
          );
        },
      },

      {
        field: "pictureFile",
        headerName: "Image",
        width: 30,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          return (
            <div>
              {/* <Avatar src= {
                params.row.pictureFile
                ?
                  require(`../../../../backend/uploads/${params.row.pictureFile}`)
                  : defaultAvatarAsset
              }/> */}
              <Avatar src={defaultAvatarAsset} />
            </div>
          );
        },
      },
      {
        field: "statusName",
        headerName: "Status",
        width: 100,
        editable: false,
      },
      {
        field: "AssetCode",
        headerName: "Asset Code",
        width: 150,
        editable: false,
      },
      {
        field: "assetName",
        headerName: "Name",
        width: 200,
        editable: false,
      },
      {
        field: "assetCategName",
        headerName: "Category",
        width: 130,
        editable: false,
      },
      {
        field: "assettype",
        headerName: "Type",
        width: 130,
        editable: false,
      },

      {
        field: "suppliername",
        headerName: "Supplier",
        width: 200,
        editable: false,
      },

      {
        field: "CheckOut",
        headerName: "CheckOut",
        width: 100,
        editable: false,
      },
      {
        field: "Checkin",
        headerName: "CheckIn",
        width: 100,
        editable: false,
      },
      {
        field: "DeployTo",
        headerName: "Deploy To",
        width: 200,
        editable: false,
      },
    ],
    []
  );

  /////////// End of Datagrid

  const handleAssetReport = () => {
    try {
      getUserInfo();

      const totalAssets = assets.length.toString();

      GenerateAssetPDF(assets, totalAssets);
    } catch (err) {
      AlertMessages("Unable to Generate Report", "Error");
      WriteLog("Error", "AssetView", "HandleAssetReport", err.message, userID);
    }
  };

  return (
    <CCol xs={12}>
      <CCard className="mb-3" size="sm">
        <CForm>
          <CRow>
            <CCol xs={12}>
              <CCardHeader width="100px">
                <CCol>
                  <h6>
                    <span className="message" style={{ color: "#5da4f5" }}>
                      {" "}
                      <>Asset(s)</>
                    </span>
                  </h6>
                </CCol>
              </CCardHeader>
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
                      rowSelection={true}
                      getRowId={(row) => row.idselect}
                    />
                  </div>
                </CInputGroup>

                <div
                  className="d-grid"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CButton
                    color="success"
                    onClick={handleAssetReport}
                    style={{ width: "130%" }}
                  >
                    {" "}
                    Generate Asset(s) Report
                  </CButton>
                </div>
              </CCardBody>
            </CCol>
          </CRow>
        </CForm>
      </CCard>
    </CCol>
  );
};

export default AssetView;
