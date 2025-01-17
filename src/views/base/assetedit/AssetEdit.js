// eslint-disable-next-line
import { useEffect, useState } from "react";
import axios from "axios";
import * as React from "react";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

// input Mask

import PropTypes from "prop-types";
import { IMaskInput } from "react-imask";
import { NumericFormat } from "react-number-format";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import imgDefault from "../../../assets/images/DefaultAsset.png";
//"../../../assets/images/macbook.png"

///// I load ang image sa img tag

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
} from "@coreui/react";

// Alert Notification
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import appSettings from "src/AppSettings"; // read the app config
import { decrypt } from "n-krypta";
//encrypt,  compare
import WriteLog from "src/components/logs/LogListener";

// For Input Mask No.
const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="(#00) 000-0000"
      definitions={{
        "#": /[1-9]/,
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
  ref
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

const AssetEdit = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  let rowId = "";

  try {
    rowId = state.params;
  } catch (err) {
    navigate("/dashboard");
  }

  const [assetsCategory, setAssetsCategory] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [type, setAssetType] = useState([]);
  const [errors, setErrors] = useState({});

  // const [message,setMessage] = useState("")
  // const [colorMessage,setColorMessage] = useState('red')

  const [assetStat, setAssetStat] = useState("");

  var userID = "";
  var userRole = "";

  const [datePurchase, setDatePurchase] = useState("");
  const [dateDepreciated, setDateDepreciated] = useState("");

  const [values, setValues] = useState({
    assetID: "",
    assetcategID: "",
    supplierID: "",
    typeID: "",
    serialNo: "",
    assetCode: "",
    assetName: "",
    imgFile: "",
    description: "",
    amount: "",
    datePurchase: "",
    amountDepreciatedYr: "",
    dateDepreciated: "",
  });

  const [file, setFile] = useState("");

  //// For Input Mask

  useEffect(() => {
    //console.log("")
  }, [datePurchase]);

  useEffect(() => {
    //console.log("")
  }, [dateDepreciated]);

  const [formatvalues, setFormatValues] = useState({
    textmask: "(100) 000-0000",
    amountnumberformat: "",
    amountdepnumberformat: "",
  });

  function CheckRole() {
    try {
      userRole = decrypt(
        window.localStorage.getItem("Kgr67W@"),
        appSettings.secretkeylocal
      );
    } catch (err) {
      WriteLog(
        "Error",
        "AssetUser",
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
    LoadData();
    LoadAssetType();
  }, []);

  function LoadData() {
    try {
      if (userID == "") {
        getUserInfo();
      }
      const url = "http://localhost:3001/assets/getassetsbyID";
      axios
        .post(
          url,
          { rowId },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          const dataResponse = res.data.message;

          if (dataResponse == "Record Found") {
            setValues({
              ...values,
              assetID: res.data.result[0].assetID,
              assetcategID: res.data.result[0].assetCategID,
              supplierID: res.data.result[0].supplierid,
              serialNo: res.data.result[0].serialNo,
              typeID: res.data.result[0].typeID,
              assetCode: res.data.result[0].assetCode,
              imgFile: res.data.result[0].pictureFile,
              assetName: res.data.result[0].assetName,
              description: res.data.result[0].description,
              amount: res.data.result[0].amount,
              datePurchase: res.data.result[0].datePurchase,
              amountDepreciatedYr: res.data.result[0].amountDepreciatedYr,
              dateDepreciated: res.data.result[0].dateDepreciated,
            });

            setDatePurchase(res.data.result[0].datePurchase);
            setDateDepreciated(res.data.result[0].dateDepreciated);
            formatvalues.amountnumberformat = res.data.result[0].amount;
            formatvalues.amountdepnumberformat =
              res.data.result[0].amountDepreciatedYr;
          } else if (dataResponse == "No Record Found") {
            WriteLog(
              "Error",
              "AssetEdit",
              "LoadData /assets/getassetsbyID",
              "No Record Found " + res.data.message2,
              userID
            );
          }
        })
        .catch((err) => {
          WriteLog(
            "Error",
            "AssetEdit",
            "LoadData /assets/getassetsbyID",
            "Error in then/catch \n" + err.message,
            userID
          );
        });
    } catch (err) {
      WriteLog(
        "Error",
        "AssetEdit",
        "LoadData /assets/getassetsbyID",
        "Error in try/catch \n" + err.message,
        userID
      );
    }
  }

  useEffect(() => {
    try {
      if (userID == "") {
        getUserInfo();
      }
      const url = "http://localhost:3001/category/getAssetCategory";
      axios
        .post(url)
        .then((res) => {
          const dataResponse = res.data.message;
          if (dataResponse == "Record Found") {
            setAssetsCategory(res.data.result);
          } else if (dataResponse == "No Record Found") {
            WriteLog(
              "Error",
              "AssetEdit",
              "useEffect /category/getAssetCategory",
              res.data.message2,
              userID
            );
          }
        })
        .catch((err) => {
          WriteLog(
            "Error",
            "AssetEdit",
            "useEffect /category/getAssetCategory",
            "Error in then/catch \n" + err.message,
            userID
          );
        });
    } catch (err) {
      WriteLog(
        "Error",
        "AssetEdit",
        "useEffect /category/getAssetCategory",
        "Error in try/catch \n" + err.message,
        userID
      );
    }
  }, []);

  function LoadAssetType() {
    try {
      if (userID == "") {
        getUserInfo();
      }
      const url = "http://localhost:3001/type/getAssetType";
      axios
        .post(url)
        .then((res) => {
          const dataResponse = res.data.message;
          if (dataResponse == "Record Found") {
            setAssetType(res.data.result);
          } else if (dataResponse == "No Record Found") {
            WriteLog(
              "Error",
              "AssetEdit",
              "LoadAssetType /type/getAssetType",
              res.data.message2,
              userID
            );
          }
        })
        .catch((err) => {
          WriteLog(
            "Error",
            "AssetEdit",
            "LoadAssetType /type/getAssetType",
            "Error in then/catch \n" + err.message,
            userID
          );
        });
    } catch (err) {
      WriteLog(
        "Error",
        "AssetEdit",
        "LoadAssetType /type/getAssetType",
        "Error in try/catch \n" + err.message,
        userID
      );
    }
  }

  useEffect(() => {
    try {
      if (userID == "") {
        getUserInfo();
      }

      const url = "http://localhost:3001/supplier/getsupplier";
      axios
        .post(url)
        .then((res) => {
          const dataResponse = res.data.message;
          if (dataResponse == "Record Found") {
            setSupplier(res.data.result);
          } else if (dataResponse == "No Record Found") {
            WriteLog(
              "Error",
              "AssetEdit",
              "useEffect /supplier/getsupplier",
              res.data.message2,
              userID
            );
          }
        })
        .catch((err) => {
          WriteLog(
            "Error",
            "AssetEdit",
            "useEffect /supplier/getsupplier",
            "Error in then/catch \n" + err.message,
            userID
          );
        });
    } catch (err) {
      WriteLog(
        "Error",
        "AssetEdit",
        "useEffect /supplier/getsupplier",
        "Error in try/catch \n" + err.message,
        userID
      );
    }
  }, []);

  useEffect(() => {
    try {
      if (userID == "") {
        getUserInfo();
      }

      const url = "http://localhost:3001/assets/getAssetStatus";
      axios
        .post(url)
        .then((response) => {
          const dataResponse = response.data.message;
          if (dataResponse == "Record Found") {
            setAssetStat(response.data.result[0]["assetStatusID"]);
          } else if (dataResponse == "No Record Found") {
            WriteLog(
              "Error",
              "AssetEdit",
              "useEffect /assets/getAssetStatus",
              response.data.message2,
              userID
            );
          }
        })
        .catch((err) => {
          WriteLog(
            "Error",
            "AssetEdit",
            "useEffect /assets/getAssetStatus",
            "Error in then/catch \n" + err.message,
            userID
          );
        });
    } catch (err) {
      WriteLog(
        "Error",
        "AssetEdit",
        "useEffect /assets/getAssetStatus",
        "Error in try/catch \n" + err.message,
        userID
      );
    }
  }, []);

  function handleInput(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
    // console.log(window.location.origin)
  }

  const handleChange = (event) => {
    setFormatValues({
      ...formatvalues,
      [event.target.name]: event.target.value,
    });
  };

  ////

  function handleSubmit(event) {
    try {
      if (userID == "") {
        getUserInfo();
      }

      event.preventDefault();

      const assetcategID = values.assetcategID;
      const supplierid = values.supplierID;
      const serialno = values.serialNo;
      const assetcode = values.assetCode;
      const assetname = values.assetName;
      const description = values.description;
      const amount = formatvalues.amountnumberformat;
      const amountdepreciated = formatvalues.amountdepnumberformat;
      const typeID = values.typeID;
      //console.log(values)
      //     console.log("What valss : " + amount)

      if (
        !assetStat == "" &&
        !assetcategID == "" &&
        !supplierid == "" &&
        !serialno == "" &&
        !assetcode == "" &&
        !assetname == "" &&
        !description == "" &&
        !amount == "" &&
        !amountdepreciated == "" &&
        !datePurchase == "" &&
        !dateDepreciated == "" &&
        !typeID == ""
      ) {
        const url = "http://localhost:3001/assets/updateassets";
        axios
          .post(url, {
            rowId,
            assetStat,
            assetcategID,
            supplierid,
            serialno,
            assetcode,
            assetname,
            description,
            amount,
            amountdepreciated,
            datePurchase,
            dateDepreciated,
            typeID,
            userID,
          })
          .then((res) => {
            const dataResponse = res.data.message;
            if (dataResponse == "Update Success") {
              WriteLog(
                "Message",
                "AssetEdit",
                "handleSubmit /assets/updateassets",
                "Update Asset Information \n" +
                  "AssetID : " +
                  rowId +
                  "\n Code : " +
                  assetcode +
                  "\n Name : " +
                  assetname +
                  "\n ....." +
                  "\n Updated by : " +
                  userID,
                userID
              );

              showSuccess("Asset updated successfully");
            } else if (dataResponse == "Update Error") {
              showError("Asset not updated successfully");
              WriteLog(
                "Error",
                "AssetEdit",
                "handleSubmit /assets/updateassets",
                res.data.message2,
                userID
              );
              // setMessage('Asset not updated successfully')
              // setColorMessage('red')
            }
          })
          .catch((err) => {
            WriteLog(
              "Error",
              "AssetEdit",
              "handleSubmit /assets/updateassets",
              "Error in then/catch \n" + err.message,
              userID
            );
            //navigate('/500');
            //navigate('/page/Page404')
          });
      } else {
        showError("All Fields must not be Empty !");
        // setMessage(" All Fields must not be Empty")
        // setColorMessage("orange")
      }
    } catch (err) {
      showError("Error in updating asset");
      WriteLog(
        "Error",
        "AssetEdit",
        "handleSubmit",
        "Error in try/catch \n" + err.message,
        userID
      );
    }
  }

  function handleUploadImage(e) {
    e.preventDefault();
    try {
      if (userID == "") {
        getUserInfo();
      }

      if (!file == "") {
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };

        const assetID = values.assetID;
        const url = "http://localhost:3001/assets/upDateImage";
        axios
          .post(url, { file, assetID }, config)
          .then((res) => {
            const dataResponse = res.data.message;
            console.log(dataResponse);
            if (dataResponse == "Upload Success") {
              WriteLog(
                "Message",
                "AssetEdit",
                "handleUploadImage /assets/upDateImage",
                "Upload selected Image \n" +
                  "File : " +
                  file.name +
                  "AssetID : " +
                  assetID,
                userID
              );

              //LoadData()
              //  setMessage('Upload Image successfully')
              //  setColorMessage('green')
              showSuccess("Image uploaded successfuly");
            } else if (dataResponse == "Upload Error") {
              showError("Image not uploaded successfuly");

              WriteLog(
                "Error",
                "AssetEdit",
                "handleUploadImage /assets/upDateImage",
                "Upload selected Image \n" +
                  "File : " +
                  file.name +
                  "AssetID : " +
                  assetID,
                userID
              );
              setMessage("Upload Image not succesful");
              setColorMessage("red");
            }
          })
          .catch((err) => {
            WriteLog(
              "Error",
              "AssetEdit",
              "handleUploadImage /assets/upDateImage",
              "Error in then/catch \n" + err.message,
              userID
            );
          });
      } else {
        showWarning("Select image to upload");
        // setMessage("Select image to upload")
        // setColorMessage('orange')
      }
    } catch (err) {
      WriteLog(
        "Error",
        "AssetEdit",
        "handleUploadImage /assets/upDateImage",
        "Error in try/catch \n" + err.message,
        userID
      );
    }
  }

  //Alert
  const showWarning = (message) => {
    toast.warn(message, {
      position: "bottom-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const showInfo = (message) => {
    toast.info(message, {
      position: "bottom-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const showSuccess = (message) => {
    toast.success(message, {
      position: "bottom-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const showError = (message) => {
    toast.error(message, {
      position: "bottom-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  return (
    <CCol xs={12}>
      <CCard className="mb-3">
        <CCardHeader>
          <h6>
            <span className="message" style={{ color: "#5da4f5" }}>
              {" "}
              <> Update Asset </>
            </span>
          </h6>
        </CCardHeader>
        <CForm onSubmit={handleSubmit}>
          <CRow>
            <CCol>
              <CCardBody>
                <FormControl fullWidth xs={6}>
                  <InputLabel id="demo-simple-select-label">
                    Supplier
                  </InputLabel>
                  <Select
                    className="mb-3"
                    aria-label="Small select example"
                    name="supplierID"
                    onChange={handleInput}
                    value={values.supplierID}
                    label="Supplier"
                    error={values.supplierID ? false : true}
                  >
                    {supplier.map((val) => (
                      <MenuItem key={val.supplierid} value={val.supplierid}>
                        {val.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id="assetcategID">Asset Category</InputLabel>
                  <Select
                    className="mb-3"
                    aria-label="Small select example"
                    name="assetcategID"
                    onChange={handleInput}
                    value={values.assetcategID}
                    label="Asset Category"
                    error={values.assetcategID ? false : true}
                  >
                    {assetsCategory.map((val) => (
                      <MenuItem key={val.assetCategID} value={val.assetCategID}>
                        {val.assetCategName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth xs={6}>
                  <InputLabel id="typeID">Asset Type</InputLabel>
                  <Select
                    className="mb-3"
                    aria-label="Small select example"
                    name="typeID"
                    onChange={handleInput}
                    value={values.typeID}
                    error={values.typeID ? false : true}
                    label="Asseet Type"
                  >
                    {type.map((val) => (
                      <MenuItem key={val.typeID} value={val.typeID}>
                        {val.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <CInputGroup size="sm" className="mb-3">
                  <TextField
                    onChange={handleInput}
                    value={values.serialNo}
                    name="serialNo"
                    error={values.serialNo ? false : true}
                    id="outlined-textarea"
                    fullWidth
                    label="SerialNo"
                    placeholder="Notes"
                    editable
                  />
                </CInputGroup>

                <CInputGroup size="sm" className="mb-3">
                  <TextField
                    onChange={handleInput}
                    name="assetCode"
                    value={values.assetCode}
                    id="outlined-textarea"
                    error={values.assetCode ? false : true}
                    fullWidth
                    label="Asset Code"
                    placeholder="Notes"
                  />
                </CInputGroup>

                <CInputGroup size="sm" className="mb-3">
                  <TextField
                    onChange={handleInput}
                    name="assetName"
                    value={values.assetName}
                    error={values.assetName ? false : true}
                    id="outlined-textarea"
                    fullWidth
                    label="Asset Name"
                    placeholder="Notes"
                  />
                </CInputGroup>

                <CInputGroup size="sm" className="mb-3">
                  <TextField
                    onChange={handleInput}
                    name="description"
                    value={values.description}
                    error={values.description ? false : true}
                    id="outlined-textarea"
                    fullWidth
                    label="Description"
                    placeholder="Notes"
                    multiline
                    rows={3}
                  />
                </CInputGroup>
              </CCardBody>
            </CCol>
            <CCol>
              <CCardBody>
                <CInputGroup size="sm" className="mb-3">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      name="datePurchase"
                      label="Date Purchase"
                      fullWidth
                      true
                      value={dayjs(values.datePurchase)}
                      onChange={(datePurchase) => setDatePurchase(datePurchase)}
                      error={values.datePurchase ? false : true}
                    />
                  </LocalizationProvider>
                </CInputGroup>
                <CInputGroup size="sm" className="mb-3">
                  <Box
                    sx={{
                      "& > :not(style)": {
                        m: 1,
                      },
                    }}
                  >
                    <TextField
                      label="Amount Purchase"
                      error={formatvalues.amountnumberformat ? false : true}
                      value={values.amount}
                      onChange={handleChange}
                      name="amountnumberformat"
                      id="formatted-numberformat-input"
                      InputProps={{
                        inputComponent: NumericFormatCustom,
                      }}
                      variant="standard"
                    />
                  </Box>
                </CInputGroup>
                <CInputGroup size="sm" className="mb-3">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      name="dateDepreciated"
                      label="Date Depreciated"
                      fullWidth
                      true
                      error={values.dateDepreciated ? false : true}
                      value={dayjs(values.dateDepreciated)}
                      onChange={(dateDepreciated) =>
                        setDateDepreciated(dateDepreciated)
                      }
                    />
                  </LocalizationProvider>
                </CInputGroup>
                <CInputGroup size="sm" className="mb-3">
                  <TextField
                    label="Amount Depreciated per YR"
                    value={values.amountDepreciatedYr}
                    onChange={handleChange}
                    name="amountdepnumberformat"
                    id="formatted-numberformat-input"
                    InputProps={{
                      inputComponent: NumericFormatCustom,
                    }}
                    error={formatvalues.amountdepnumberformat ? false : true}
                    variant="standard"
                  />
                </CInputGroup>
                <CInputGroup size="sm" className="mb-3">
                  <CAccordion
                    flush={false}
                    size="xs"
                    className="mb-3"
                    fullWidth
                  >
                    <CAccordionItem itemKey={1} size="xs" className="mb-3">
                      <CAccordionHeader>Upload Image here</CAccordionHeader>
                      <CAccordionBody>
                        <input
                          name="file"
                          id="file"
                          type="file"
                          onChange={(e) => setFile(e.target.files[0])}
                        />
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
                            style={{ width: "100%" }}
                            onClick={handleUploadImage}
                          >
                            Update Logo
                          </CButton>
                        </div>
                      </CAccordionBody>
                    </CAccordionItem>
                  </CAccordion>
                </CInputGroup>
              </CCardBody>
            </CCol>
            <CCol>
              <CRow>
                <CCol>
                  <CCardBody xs={6}>
                    <CInputGroup size="sm" className="mb-3">
                      <div className="formInput" width="100px">
                        {/* <img src={
                        values.imgFile
                        ?  require( `../../../../backend/uploads/${values.imgFile}`)
                        : imgDefault 
                      }
                      alt="" width={'100%'} height={'100%'} 
                         /> */}
                        <img
                          src={imgDefault}
                          alt=""
                          width={"100%"}
                          height={"100%"}
                        />
                      </div>
                    </CInputGroup>
                  </CCardBody>
                </CCol>
              </CRow>
            </CCol>
          </CRow>
          <CRow>
            <CCol>
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
                  style={{ width: "200%" }}
                  type="submit"
                >
                  Save
                </CButton>
              </div>
            </CCol>

            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss={false}
              draggable
              pauseOnHover={false}
              theme="light"
            />
          </CRow>
          <br></br>
        </CForm>
      </CCard>
    </CCol>
  );
};

export default AssetEdit;
