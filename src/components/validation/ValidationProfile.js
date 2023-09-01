
/* eslint-disable */

function ValidationProfile(values) {
    const error ={}
    const email_pattern = '/^[^\s@]+@[^\s@]+\.[^\s@]+$/'

    if(values.categoryID === "") {
        error.categoryID = "Category is required"
    } else {
        error.categoryID = ""
    }

    if(values.positionID === "") {
        error.positionID = "Position is required"
    } else {
        error.positionID = ""
    }

    if(values.lastname === "") {
        error.lastname = "lastname is required"
    } else {
        error.lastname = ""
    }

    if(values.firstname === "") {
        error.firstname = "firstname is required"
    } else {
        error.firstname = ""
    }

    if(values.displayname === "") {
        error.displayname = "Display name is required"
    } else {
        error.displayname = ""
    }

    if(values.email === "") {
        error.email = "Email is required"
    } else {
        error.email = ""
    }

    return error;
}

export default ValidationProfile;