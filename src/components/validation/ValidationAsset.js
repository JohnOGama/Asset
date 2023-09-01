import React from "react";

function ValidationAsset(values) {
    const error ={}
    const email_pattern = '/^[^\s@]+@[^\s@]+\.[^\s@]+$/'

            if(values.categoryID === "") {
                error.categoryID = "Category is required"
            }
            else{
                error.categoryID = ""
            }
        
            if(values.positionID === "") {
                error.positionID = "Position is required"
            } else {
                error.positionID = ""
            }
        
            if(values.username === "") {
                error.username = "Username is required"
            } else {
                error.username = ""
            }
        
            if(values.password === "") {
                error.password = "Password is required"
            } else {
                error.password = ""
            }
        
            if(values.firstname === "") {
                error.firstname = "Firstname is required"
            } else {
                error.firstname = ""
            }
        
            if(values.lastname === "") {
                error.lastname = "Lastname is required"
            } else {
                error.lastname = ""
            }
        
            if(values.email === "") {
                error.email = "Email is required"
            } else {
                error.email = ""
            }

    
    return error;
}

export default ValidationAsset;