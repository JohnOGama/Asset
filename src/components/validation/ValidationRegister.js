
/* eslint-disable */

function ValidationRegister(values) {
    const error ={}
    const email_pattern = '/^[^\s@]+@[^\s@]+\.[^\s@]+$/'
    console.log(values)

    if(values.assetcategID === "") {
        error.assetcategID = "Category is required"
    } else {
        error.assetcategID = ""
    }

    if(values.serialno === "") {
        error.serialno = "SerialNo is required"
    } else {
        error.serialno = ""
    }

    if(values.assetcode === "") {
        error.assetcode = "Asset Code is required"
    } else {
        error.assetcode = ""
    }

    if(values.assetname === "") {
        error.assetname = "Asset Name is required"
    } else {
        error.assetname = ""
    }

    if(values.description === "") {
        error.description = "Description is required"
    } else {
        error.description = ""
    }

    if(values.amountnumberformat === "") {
        error.amountnumberformat = "Amount Purchase is required"
    } else {
        error.amountnumberformat = ""
    }

    if(values.amountdepnumberformat === "") {
        error.amountdepnumberformat = "Amount Depreciated is required"
    } else {
        error.amountdepnumberformat = ""
    }

    if(values.datePurchase === "") {
        error.datePurchase = "Date Purchase is required"
    } else {
        error.datePurchase = ""
    }

    if(values.dateDepreciated === "") {
        error.dateDepreciated = "Date Depreciated is required"
    } else {
        error.dateDepreciated = ""
    }



    return error;
}

export default ValidationRegister;