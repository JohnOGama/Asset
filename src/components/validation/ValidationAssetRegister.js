
/* eslint-disable */

function ValidationAssetRegister(values) {


    if(values.userid === "") {
        error.userid = "User is required"
    } else {
        error.userid = ""
    }


    return error;
}

export default ValidationAssetRegister;