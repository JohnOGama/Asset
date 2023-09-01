
var express = require("express");

var cors = require('cors');
var mysql = require("mysql2");
var connection = require('./database');
const {randomUUID } = require('crypto')

const multer = require("multer");
const moment = require("moment")

var app = express();

const hostname = 'localhost';
const port = 3001;
const bShowConsole = false; // show the console logs

app.use(cors());
app.use(express.json());

app.get("/",(req,res) => 
{
    res.json("Hello Test")
}
)

app.listen(port,() => {
    connection.connect(function(err)
    {
        if(err)
        {
            console.log("No Database Present");
        } else
        {
            console.log("Database Connected");
            console.log(`Server running at http://${hostname}:${port}/`)
        }
    }
    )
}
);

/// Utilities 
function utils_getDate() {

    let newDate = new Date()
    
    let year = newDate.getFullYear();
    let month = newDate.getMonth() + 1;
    let day = newDate.getDate();
    let hr = newDate.getHours();
    let minute = newDate.getMinutes();
    let secs = newDate.getSeconds();
    let now =  year+"/"+month+"/"+day +" " + hr+":"+minute+":"+secs

   // console.log(newDate)
   // console.log(day)

    return now
}

// img storage confing
var imgconfig = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,"./uploads");
    },
    filename:(req,file,callback)=>{
        callback(null,`image_${Date.now()}_${file.originalname}`)
    }
});

// img filter
const isImage = (req,file,callback)=>{
    if(file.mimetype.startsWith("image")){
        callback(null,true)
    }else{
        callback(null,Error("only image is allowd"))
    }
}


var upload = multer({
    storage:imgconfig,
    fileFilter:isImage
})



/// End of Utils


/////// Write Log //////////////

app.post('/log/putLog', (req,res)   => {
    
    const id = randomUUID()

    const sql = "INSERT INTO tblLogs(logID,logtype,module,"
    + "logfunction,logvalues,createdBy,dateCreated) values (?)";

    const values = [
        id,
        req.body.logtype,
        req.body.module,
        req.body.logfunction,
        req.body.logvalues,
        req.body.userID,
        utils_getDate()
    ];
      
    connection.query(sql,[values],(err,result) => {
        if(err) {
            
            res.json({
                message: "Insert Error",
                message2: err.message});
        }else {

            res.json({
                message: "Insert Success"});
        }

     })
})

app.post('/log/viewallLogs',(req,res) => {

   const sql = "SELECT log.logID as id,log.logtype,log.module,log.logfunction,log.logvalues,"
    + "users.displayName,COALESCE(DATE_FORMAT(log.dateCreated, '%m/%d/%Y'),'') as dateatecreated  FROM tblLogs log"
    + " INNER JOIN tblUsers users on users.userDisplayID = log.createdBy"
    + " ORDER BY log.dateCreated desc"
    

    connection.query(sql,(err,result) => {
        if(err) {
            console.log(err)
            res.json({message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                
                if (bShowConsole == true ) {
                    console.log(result)
                } else 
                {
                    /// Error Logs here
                }
         
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
});

app.post('/log/getlogID',(req,res) => {

   const sql = "SELECT * FROM tblLogs"
        + " where logID = ?"

    connection.query(sql,[req.body.rowId],(err,result) => {
        if(err) {
            
            res.json({err:err,
                message2: err.message});
        } else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
});
////// End of Log

//////////////// MODULE : USERS  /////////

app.get('/listofusers',function(req,res)
{
    let sql = "SELECT * FROM tblUsers ORDER BY lastname";
    connection.query(sql,function(err,results)
    {
        if(err) {
            
            res.json({results,message: "No Record Found",
            message2: err.message});
        }
        else{
            res.json({results,message: "Record Found"});
        }
    });
});

app.post('/getuserbyactive',(req,res) => {

    const sql = "SELECT userDisplayID, concat(lastname,', ' , firstname) as fullname FROM tblUsers where active = 1";
    const userid = req.body.userid;


    connection.query(sql,[userid],(err,result) => {

        if(err) {
            res.json({message: "No Record Found",
                message2: err.message});
            
        } else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
                
                
            } else {
                res.json({result,message: "No Record Found"});
            }
        }
    })
});

app.post('/checkLogin',(req,res) => {

    const sql = "SELECT userDisplayID, displayName FROM tblUsers where `username` = ? and `password` = ? and active=1";
    const username = req.body.username;
    const pass = req.body.password;

    connection.query(sql,[username,pass],(err,result) => {

        if(err) {
            res.json({message: "No Record Found",
                message2: err.message});
            throw err;
        } else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
               
            } else {
                res.json({result,message: "No Record Found"});
            }
        }
    })
});

app.post('/auth/register', (req,res)   => {
    
    const id = randomUUID()

    const sql = "INSERT INTO tblUsers(userDisplayID,username,email,password,displayName,dateCreated) values (?)";
    const display = "Set your Display Name"
    const values = [
        id,
        req.body.username,
        req.body.email,
        req.body.password,
        display,
        utils_getDate()
    ];
      
    connection.query(sql,[values],(err,result) => {
        if(err) {
            //console.log("Error here " + err)
            res.json({
                message: "Insert Error",
                message2: err.message});
        }else {
            
            res.json({
                message: "Insert Success"});
                console.log(result)
        }

     })
})

app.post('/auth/updateProfile', (req,res)   => {
    
    const sql = "UPDATE tblUsers SET `firstname` = ?,`lastname`= ?,`email`= ?,positionID = ?,"  
    + "`groupTypeID` = ?,`displayName`= ?,`updatedBy`=?,`dateUpdated`=? WHERE `userDisplayID` = ?";

    connection.query(sql,[req.body.firstname,req.body.lastname,
        req.body.email,req.body.positionID,req.body.categoryID,req.body.displayname,
        req.body.userDisplayID,utils_getDate(),req.body.userDisplayID],(err,result) => {
        if(err) {
           
            res.json({
                message: "Upload Error",
                message2: err.message});
        }else {
            //console.log("Success")
            res.json({
                message: "Upload Success"});
        }

     })
})


app.post('/auth/updateImage',upload.single("file"), (req,res)   => {
    
    const imagefile = req.file.filename
   
    const sql = "UPDATE tblUsers SET  imgFilename = ?"
     +  " WHERE userDisplayID = ?";

    connection.query(sql,[imagefile,req.body.userID],(err,result) => {
        if(err) {
            res.json({
                message: "Upload Error",
                message2: err.message});
        }else {
            res.json({
                message: "Upload Success"});
        }

     })
})

app.post('/users/getuserprofile',(req,res) => {

    const sql = "SELECT a.groupTypeID,b.categoryName,a.positionID,a.firstname,a.lastname,a.displayName,"
    + "a.email,a.imgFilename FROM tblUsers a INNER JOIN tblUserCategory b ON a.groupTypeID = b.categoryID " 
    + "WHERE a.userDisplayID = ?";

    //let userid = 

    connection.query(sql,[req.body.userid],(err,result) => {
        if(err) {
            
            res.json({message: "No Profile Found",
            message2: err.message});
            throw err;
        } else {
            if(result.length > 0) {
                res.json({result,message: "Profile Found"});
               
            } else {
                res.json({result,message: "No Profile Found"});
            }
        }
    })
});

app.post('/users/viewallusers',(req,res) => {

    const sql = "SELECT users.userDisplayID as id,usercategory.categoryName,positions.positionName,"
        + "concat(users.lastname,', ' , users.firstname) as fullname,department.departmentName,"
        + "users.displayName,users.email,users.active"
        + " FROM tblUsers users"
        + " INNER JOIN tblUserCategory usercategory on usercategory.categoryID COLLATE utf8mb4_unicode_ci = users.groupTypeID"
        + " INNER JOIN tblPositions positions on positions.positionDisplayID COLLATE utf8mb4_unicode_ci = users.positionID"
        + " INNER JOIN tblDepartments department on department.departmentDisplayID COLLATE utf8mb4_unicode_ci = positions.departmentDisplayID"
        + " where users.active = 1"
        + " ORDER BY fullname"

    connection.query(sql,(err,result) => {
        if(err) {
            
            res.json({message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
});

app.post('/users/checkUserfordelete', (req,res)   => {
    
    const sql = "SELECT * FROM tblUserAssetDetails details"
        + " inner join tblAssetStatus stat on stat.assetStatusID COLLATE utf8mb4_unicode_ci = details.assetStatusID"
        + " where stat.statusName = 'Deployed'"
        + " and details.userSelectedID = ?"
        + " limit 1" 
    
    connection.query(sql,[req.body.rowId],(err,result) => {
        if(err) {
            
            res.json({
                message: "No Record Found",
                message2: err.message});
        }else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }

     })
})

app.post('/users/deleteUser', (req,res)   => {
    

    const sqlUpdate = "UPDATE tblUsers SET active = 0 where userDisplayID = ?"

    connection.query(sqlUpdate,[req.body.rowId],(err,result) => {
        if(err) {
           
            res.json({
                message: "No Record Deleted",
                message2: err.message});
        }else {

            res.json({
                message: "Record Deleted"});
        }

     })
})
////////////// END OF USERS /////////


//////// Category //////////////

app.post('/getCategory',(req,res) => {
    const sql = "SELECT categoryID,categoryName FROM tblUserCategory WHERE groupID = '0' ORDER BY orderBy";
    connection.query(sql,(err,result) => {
        if(err) {
            res.json({
                message: err.message,
                message2: err.message});
        } else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
});

app.post('/category/putCategory', (req,res)   => {
    
    const id = randomUUID()

    const sql = "INSERT INTO tblAssetCategory(assetCategID,assetCategName,"
    + "description,createdBy,dateCreated) values (?)";

    const values = [
        id,
        req.body.name,
        req.body.description,
        req.body.userID,
        utils_getDate()
    ];
      
    connection.query(sql,[values],(err,result) => {
        if(err) {
            res.json({
                message: "Insert Error",
                message2: err.message});
        }else {
            res.json({
                message: "Insert Success"});
        }

     })
})

app.post('/category/updateCategory', (req,res)   => {
    

    const sqlUpdate = "UPDATE tblAssetCategory SET assetCategName = ?,description = ?,"
    + "updateBy = ?,dateUpdate = ?"
    + " where assetCategID = ? "

    connection.query(sqlUpdate,[req.body.name,req.body.description,
        req.body.userID,utils_getDate(),req.body.rowId],(err,result) => {
        if(err) {
            res.json({
                message: "Update Error",
                message2: err.message});
        }else {
            //console.log("Success")
            //console.log(values)
            res.json({
                message: "Update Success"});
        }

     })
})

app.post('/category/deleteCategory', (req,res)   => {
    

    const sqlUpdate = "DELETE FROM tblAssetCategory WHERE assetCategID=?"

    connection.query(sqlUpdate,[req.body.rowId],(err,result) => {
        if(err) {
            res.json({
                message: "Record Error Deleted",
                message2: err.message});
        }else {
            //console.log("Success")
            //console.log(values)
            res.json({
                message: "Record Deleted"});
        }

     })
})


app.post('/category/getAssetCategorybyID',(req,res) => {
    const sql = "SELECT assetCategID,assetCategName,description FROM tblAssetCategory WHERE assetCategID = ?";
    connection.query(sql,[req.body.rowId],(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
});

app.post('/category/getAssetCategory',(req,res) => {
    const sql = "SELECT assetCategID,assetCategName FROM tblAssetCategory ORDER BY assetCategName";
    connection.query(sql,(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
});

app.post('/category/checkCategoryfordelete', (req,res)   => {
    
    const sqlUpdate = "SELECT assetCategID FROM  tblAssets where assetCategID = ?"

    connection.query(sqlUpdate,[req.body.rowId],(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        }else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }

     })
})

app.post('/category/deleteCategory', (req,res)   => {
    

    const sqlUpdate = "DELETE FROM tblAssetCategory WHERE assetCategID=?"

    connection.query(sqlUpdate,[req.body.rowId],(err,result) => {
        if(err) {
            res.json({
                message: "No Record Deleted",
                message2: err.message});
        }else {
            //console.log("Success")
            //console.log(values)
            res.json({
                message: "Record Deleted"});
        }

     })
})

app.post('/category/viewallcategory',(req,res) => {
    const sql = "SELECT assetCategName,description,assetCategID as id FROM tblAssetCategory ORDER BY assetCategName";
    connection.query(sql,(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
            } else {
                res.json({
                    message: "No Record Found",
                    message2: "No Record Found" });
            }
        }
    })
});

///////// END OF Category

//////// Status /////////////////

app.post('/status/getasset_status_users',(req,res) => {

    const sql = "SELECT assetStatusID,statusName FROM tblAssetStatus"
    + " where vwusers = '1'"
    + " order by statusName"

    connection.query(sql,(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
});

app.post('/status/viewallstatus',(req,res) => {
    const sql = "SELECT statusName,statusDescription, assetStatusID as id FROM tblAssetStatus ORDER BY statusName";
    connection.query(sql,(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message });
        } else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
});

app.post('/status/getStatusbyID',(req,res) => {
    const sql = "SELECT assetStatusID, statusName,statusDescription FROM tblAssetStatus WHERE assetStatusID = ?";
    connection.query(sql,[req.body.rowId],(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
});

app.post('/status/putStatus', (req,res)   => {
    
    const id = randomUUID()

    const sql = "INSERT INTO tblAssetStatus(assetStatusID,statusName,"
    + "statusDescription,createdBy,dateCreated) values (?)";

    const values = [
        id,
        req.body.name,
        req.body.description,
        req.body.userID,
        utils_getDate()
    ];
      
    connection.query(sql,[values],(err,result) => {
        if(err) {
            //console.log(err)
            res.json({
                message: "Insert Error",
                message2: err.message });
                
        }else {
            //console.log("Success")
            //console.log(values)
            res.json({
                message: "Insert Success"});
        }

     })
})

app.post('/status/updateStatus', (req,res)   => {
    

    const sqlUpdate = "UPDATE tblAssetStatus SET statusName = ?,statusDescription = ?,"
    + "updateBy = ?,dateUpdate = ?"
    + " where assetStatusID = ? "

    connection.query(sqlUpdate,[req.body.name,req.body.description,
        req.body.userID,utils_getDate(),req.body.rowId],(err,result) => {
        if(err) {
            //console.log(err.message )
            res.json({
                message: "Update Error",
                message2: err.message });
        }else {
            //console.log("Success")
            //console.log(values)
            res.json({
                message: "Update Success"});
        }

     })
})

app.post('/status/checkStatusfordelete', (req,res)   => {
    
    const sqlUpdate = "SELECT assetStatusID FROM  tblAssets where assetStatusID = ?"

    connection.query(sqlUpdate,[req.body.rowId],(err,result) => {
        if(err) {
            // write error log here
            res.json({
                message: "No Record Found",
                message2: err.message});
        }else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }

     })
})

app.post('/status/deleteStatus', (req,res)   => {
    

    const sqlUpdate = "DELETE FROM tblAssetStatus WHERE assetStatusID=?"

    connection.query(sqlUpdate,[req.body.rowId],(err,result) => {
        if(err) {
            res.json({
                message: "No Record Deleted",
                message2: err.message });
        }else {
            //console.log("Success")
            //console.log(values)
            res.json({
                message: "Record Deleted"});
        }

     })
})

app.post('/status/getStatusbyAsset',(req,res) => {
    // Dashboard
        const sql = "SELECT stat.assetStatusID, stat.statusName,"
        + "("
        + "SELECT count(asset.assetID) FROM  tblAssets asset"
        + " where (asset.active=1) and (asset.assetStatusID COLLATE utf8mb4_unicode_ci = stat.assetStatusID)"
        + " and (asset.assetID COLLATE utf8mb4_unicode_ci not in (select det.assetid from tblUserAssetDetails det where det.pulloutnotify = 1))"
        + ") as totalasset"
        + " FROM  tblAssetStatus stat"
        + " where stat.statusName <> '-'"
        + " order by stat.statusName"
    
        connection.query(sql,(err,result) => {
            if(err) {
                res.json({
                    message: "No Record Found",
                    message2: err.message});
            } else {
                if(result.length > 0) {
                    //console.log(result[0]);
                    res.json({result,message: "Record Found"});
                } else {
                    res.json({message: "No Record Found"});
                }
            }
        })
    });

app.post('/status/getStatusAvailable',(req,res) => {
    // Dashboard
    const sql = "SELECT count(assets.assetID) as statavailalble FROM tblAssets assets"
    + " INNER JOIN tblAssetStatus assetstatus on  assets.assetStatusID = assetstatus.assetStatusID"
    + " where (assetstatus.statusName = 'Available' OR assetstatus.statusName = 'Replace' OR assetstatus.statusName = 'Return' )"
    + " and (assets.assetID COLLATE utf8mb4_unicode_ci not in (select det.assetid from tblUserAssetDetails det where det.pulloutnotify = 1))"
    + " and (assets.active=1)"
    
        connection.query(sql,(err,result) => {
            if(err) {
                res.json({
                    message: "No Record Found",
                    message2: err.message});
            } else {
                if(result.length > 0) {
                    //console.log(result[0]);
                    res.json({result,message: "Record Found"});
                } else {
                    res.json({message: "No Record Found"});
                }
            }
        })
    });


//////// End of Status //////////

/////// Department /////////////

app.post('/department/viewalldepartment',(req,res) => {
    const sql = "SELECT departmentName,description, departmentDisplayID as id FROM tblDepartments ORDER BY departmentName";
    connection.query(sql,(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
});

app.post('/department/getDepartmentID',(req,res) => {
    const sql = "SELECT departmentDisplayID, departmentName,description FROM tblDepartments WHERE departmentDisplayID = ?";
    connection.query(sql,[req.body.rowId],(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
});

app.post('/department/putDepartment', (req,res)   => {
    
    const id = randomUUID()

    const sql = "INSERT INTO tblDepartments(departmentDisplayID,departmentName,"
    + "description,createdBy,dateCreated) values (?)";

    const values = [
        id,
        req.body.name,
        req.body.description,
        req.body.userID,
        utils_getDate()
    ];
      
    connection.query(sql,[values],(err,result) => {
        if(err) {
            res.json({
                message: "Insert Error",
                message2: err.message});
        }else {
            //console.log("Success")
            //console.log(values)
            res.json({
                message: "Insert Success"});
        }

     })
})

app.post('/department/updateDepartment', (req,res)   => {
    

    const sqlUpdate = "UPDATE tblDepartments SET departmentName = ?,description = ?,"
    + "updatedBy = ?,dateUpdated = ?"
    + " where departmentDisplayID = ? "

    connection.query(sqlUpdate,[req.body.name,req.body.description,
        req.body.userID,utils_getDate(),req.body.rowId],(err,result) => {
        if(err) {
            res.json({
                message: "Update Error",
                message2: err.message});
        }else {
            res.json({
                message: "Update Success"});
        }

     })
})

app.post('/department/checkDepartmentfordelete', (req,res)   => {
    
    const sqlUpdate = "SELECT departmentDisplayID FROM  tblPositions where departmentDisplayID = ?"

    connection.query(sqlUpdate,[req.body.rowId],(err,result) => {
        if(err) {
            // write error log here
            res.json({
                message: "No Record Found",
                message2: err.message});
        }else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }

     })
})

app.post('/department/deleteDepartment', (req,res)   => {
    

    const sqlUpdate = "DELETE FROM tblDepartments WHERE departmentDisplayID=?"

    connection.query(sqlUpdate,[req.body.rowId],(err,result) => {
        if(err) {
            res.json({
                message: "No Record Deleted",
                message2: err.message});
        }else {
            //console.log("Success")
            //console.log(values)
            res.json({
                message: "Record Deleted"});
        }

     })
})

app.post('/department/getCountAsset_by_Department',(req,res) => {
    // Dashboard
       
    const sql = "select left(dept.departmentName,8) as name,"
        + "(SELECT count(details.assetID) as countasset"
        + " FROM assets.tblUserAssetDetails details"
        + " inner join tblAssets assets on assets.assetID COLLATE utf8mb4_unicode_ci = details.assetID"
        + " inner join tblAssetStatus statdetails on statdetails.assetStatusID COLLATE utf8mb4_unicode_ci = details.assetStatusID"
        + " inner join tblAssetStatus statasset on statasset.assetStatusID COLLATE utf8mb4_unicode_ci = assets.assetStatusID"
        + " inner join tblUsers users on users.userDisplayID COLLATE utf8mb4_unicode_ci = details.userSelectedID"
        + " inner join tblPositions position on position.positionDisplayID COLLATE utf8mb4_unicode_ci = users.positionID"
        + " inner join tblDepartments department on department.departmentDisplayID = position.departmentDisplayID"
        + " where (statdetails.statusName = 'Deployed')"
        + " and (details.datepullout is null)"
        + " and (department.departmentDisplayID = dept.departmentDisplayID)"
        + ") as assetcount_department"
        + " from tblDepartments dept"
        + " order by dept.departmentName"
    
        connection.query(sql,(err,result) => {
            if(err) {
                res.json({
                    message: "No Record Found",
                    message2: err.message});
            } else {
                if(result.length > 0) {
                    //console.log(result);
                    res.json({result,message: "Record Found"});
                } else {
                    res.json({message: "No Record Found"});
                }
            }
        })
    });


/////// End of Department /////

/////// Position //////////////

app.post('/getPositions',(req,res) => {

    const sql = "SELECT positionDisplayID, positionName FROM tblPositions order by positionName";
    connection.query(sql,(err,result) => {

        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
                //console.log(result)
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
});

app.post('/position/viewallposition',(req,res) => {

    const sql = "SELECT positions.positionName,departments.departmentName,positions.description,positions.positionDisplayID as id"
        + " FROM tblPositions positions"
        + " INNER JOIN tblDepartments departments on departments.departmentDisplayID = positions.departmentDisplayID"
        + " ORDER BY positions.positionName"

    connection.query(sql,(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
});

app.post('/position/getPositionID',(req,res) => {

    const sql = "SELECT positions.positionDisplayID,positions.positionName,positions.description,"
        + "departments.departmentDisplayID,"
        + "departments.departmentName FROM tblPositions positions"
        + " INNER JOIN tblDepartments departments on departments.departmentDisplayID = positions.departmentDisplayID"
        + " WHERE positions.positionDisplayID = ?"

    connection.query(sql,[req.body.rowId],(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
               
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
});


app.post('/position/putPosition', (req,res)   => {
    
    const id = randomUUID()

    const sql = "INSERT INTO tblPositions(positionDisplayID,positionName,"
    + "description,departmentDisplayID,createdBy,dateCreated) values (?)";

    const values = [
        id,
        req.body.name,
        req.body.description,
        req.body.deptid,
        req.body.userID,
        utils_getDate()
    ];
      
    connection.query(sql,[values],(err,result) => {
        if(err) {
            res.json({
                message: "Insert Error",
                message2: err.message});
        }else {
            //console.log("Success")
            //console.log(values)
            res.json({
                message: "Insert Success"});
        }

     })
})


app.post('/position/updatePosition', (req,res)   => {
    

    const sqlUpdate = "UPDATE tblPositions SET positionName = ?,description = ?,"
    + "departmentDisplayID = ?,updateBy = ?,dateUpdated = ?"
    + " where positionDisplayID = ? "

    connection.query(sqlUpdate,[req.body.name,req.body.description,
        req.body.deptid,req.body.userID,utils_getDate(),req.body.rowId],(err,result) => {
        if(err) {
            res.json({
                message: "Update Error",
                message2: err.message});
        }else {

            res.json({
                message: "Update Success"});
        }

     })
})

app.post('/position/checkPositionfordelete', (req,res)   => {
    
    const sql = "SELECT positionID FROM  tblUsers where positionID = ?"

    connection.query(sql,[req.body.rowId],(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        }else {
            
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }

     })
})


app.post('/position/deletePosition', (req,res)   => {
    

    const sqlUpdate = "DELETE FROM tblPositions WHERE positionDisplayID=?"

    connection.query(sqlUpdate,[req.body.rowId],(err,result) => {
        if(err) {
            res.json({
                message: "No Record Deleted",
                message2: err.message});
        }else {
            //console.log("Success")
            //console.log(values)
            res.json({
                message: "Record Deleted"});
        }

     })
})

////// End of Position ///////


//////////// Assets /////////////
// For Dashboard
app.post('/assets/getCountassets',(req,res) => {

    const sql = "SELECT count(assets.assetID) as totalAsset,CONCAT('', FORMAT(sum(assets.amount), 2))  as totalAmount FROM  tblAssets assets"
        + " where assets.active=1 "

    connection.query(sql,(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                //console.log(result[0]);
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
});

app.post('/assets/getCountassetsper_category',(req,res) => {

    const sql = "SELECT category.assetCategID,category.assetCategName,"
            + "( SELECT count(assets.assetID) as totalAsset FROM  tblAssets assets"
            + " where assets.assetCategID COLLATE utf8mb4_unicode_ci = category.assetCategID"
            + " and assets.active=1) as countAsset"
            + " FROM tblAssetCategory category"
            + " where category.assetCategName <> '-'"
            + " order by category.assetCategName"

    connection.query(sql,(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                //console.log(result[0]);
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
});

app.post('/assets/getAssetStatus',(req,res) => {
    const sql = "SELECT assetStatusID,statusName FROM tblAssetStatus WHERE statusName = 'Available'";
    connection.query(sql,(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                //console.log(result[0]);
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
});

app.post('/assets/upDateImage', upload.single("file"), (req,res)   => {
    try {

    const imagefile =req.file.filename
    
    const sqlUpdate = "UPDATE tblAssets SET pictureFile = ?"
    + " where assetID = ? "

    connection.query(sqlUpdate,[imagefile,req.body.assetID],(err,result) => {
        if(err) {
            res.json({
                message: "Upload Error",
                message2: err.message});
        }else {
            
            //console.log(result)
            if(result.changedRows == 1) {
                res.json({result,message: "Upload Success"});
            } else {
                res.json({message: "Upload Error"});
            }
        }

     })
    }
    catch(err) {
        console.log(err.message)
    }
})

app.post('/assets/putAssets', upload.single("file"), (req,res)   => {
    try {
    const id = randomUUID()
    const imagefile = req.file.filename
       
    const sql = "INSERT INTO tblAssets(assetID,assetCategID,supplierID,"
    + "assetStatusID,serialNo,assetCode,assetName,description," 
    + "amount,datePurchase,amountDepreciatedYr,"
    + "dateDepreciated,dateCreated,createdBy,pictureFile) values (?)";

    const dpurchase = new Date(req.body.datePurchase)
    const ddepreciated = new Date(req.body.dateDepreciated)
    
   
    const values = [
        id,
        req.body.assetcategID,
        req.body.supplierid,
        req.body.assetStat,
        req.body.serialno,
        req.body.assetcode,
        req.body.assetname,
        req.body.description,
        req.body.amount,
        dpurchase,
        req.body.amountdepreciated,
        ddepreciated,
        utils_getDate(),
        req.body.userID,
        imagefile
    ];
      
    connection.query(sql,[values],(err,result) => {
        if(err) {
            res.json({
                message: "Insert Error",
                message2: err.message});
        }else {
            //console.log("Success")
            //console.log(values)
            res.json({
                message: "Insert Success"});
        }

     })
} 
catch(err) {
    console.log("Put Assets Error Here : " + err)
}
}
)



app.post('/assets/getassetstatdeploy',(req,res) => {
    const sql = "SELECT assetStatusID,statusName FROM tblAssetStatus WHERE statusName = 'Deployed'";
    connection.query(sql,(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                //console.log(result[0]);
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
});

app.post('/assets/getassetfordeploystatus',(req,res) => {
    const sql = "SELECT assetStatusID,statusName FROM tblAssetStatus WHERE statusName = 'For Deploy'";
    connection.query(sql,(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                //console.log(result[0]);
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
});


app.post('/assets/updateassets',(req,res)   => {

    try {
    
    const sqlUpdate = "UPDATE tblAssets SET assetCategID = ?,assetStatusID = ?,supplierID = ?,serialNo = ?,"
            + "assetCode = ?,assetName = ?,description = ?,amount = ?,datePurchase = ?,"
            + "amountDepreciatedYr = ?,dateDepreciated = ?,updatedBy = ?,dateUpdated = ?"
            + " where assetID = ? "

            const dpurchase = new Date(req.body.datePurchase)
            const ddepreciated = new Date(req.body.dateDepreciated)
          /*  var imagefile = ""
            try {
                imagefile = req.file.filename
            }
            catch{
                imagefile = "NA"
            } */
             
      
    connection.query(sqlUpdate,[req.body.assetcategID, req.body.assetStat,req.body.supplierid,req.body.serialno,
        req.body.assetcode,req.body.assetname, req.body.description,req.body.amount,dpurchase,
        req.body.amountdepreciated,ddepreciated, req.body.userID,utils_getDate(),req.body.rowId],(err,result) => {
        if(err) {
            res.json({
                message: "Update Error",
                message2: err.message});
        }else {
      
            //console.log(values)
            res.json({
                message: "Update Success"});
        }

     })
    }
    catch(err) {
        console.log(err.message)
    }
})

app.post('/assets/getallassetsavailable',(req,res) => {
    const sql = "SELECT assets.assetID as id,assets.serialNo,assets.assetCode,category.assetCategName,"
                + "assets.assetName,assetstatus.statusName FROM tblAssets assets"
                + " INNER JOIN tblAssetCategory category on assets.assetCategID = category.assetCategID"
                + " INNER JOIN tblAssetStatus assetstatus on  assets.assetStatusID = assetstatus.assetStatusID"
                + " where (assetstatus.statusName = 'Available' OR assetstatus.statusName = 'Replace' OR assetstatus.statusName = 'Return' )"
                + " and (assets.assetID COLLATE utf8mb4_unicode_ci not in (select det.assetid from tblUserAssetDetails det where det.pulloutnotify = 1))"
                + " and (assets.active=1)"
    connection.query(sql,(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                
                if (bShowConsole == true ) {
                    console.log(result)
                } else 
                {
                    /// Error Logs here
                }
         
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
});

app.post('/assets/viewallassetsavailable',(req,res) => {

    const sql = "select assets.assetID as id,assets.serialNo, assets.AssetCode,assets.assetName,"
        + "assets.description,FORMAT(assets.amount,2) as 'Amount',assetstatus.statusName,"
        + "supplier.name as suppliername,assets.pictureFile,"
        + "category.assetCategName,"
        + "(select COALESCE(DATE_FORMAT(assetdetails.plancheckout, '%m/%d/%Y'),'') as result from   tblUserAssetDetails assetdetails"
        + " inner join tblAssetStatus stats on assetdetails.assetStatusID COLLATE utf8mb4_unicode_ci  = stats.assetStatusID"
        + " where (stats.statusName = 'For Deploy' OR stats.statusName = 'Deployed')"
        + " and ( assetdetails.assetID COLLATE utf8mb4_unicode_ci  =  assets.assetID) Limit 1) as CheckOut,"
        + "(select COALESCE(DATE_FORMAT(assetdetails.datecheckin, '%m/%d/%Y'),'') as result from   tblUserAssetDetails assetdetails"
        + " inner join tblAssetStatus stats on assetdetails.assetStatusID COLLATE utf8mb4_unicode_ci  = stats.assetStatusID"
        + " where stats.statusName = 'Deployed'"
        + " and ( assetdetails.assetID COLLATE utf8mb4_unicode_ci  =  assets.assetID) Limit 1) as Checkin,"
        + "(select concat(users.lastname,', ' ,users.firstname) from tblUsers users"
        + " inner join tblUserAssetDetails assetdetails on users.userDisplayID COLLATE utf8mb4_unicode_ci = assetdetails.userSelectedID"
        + " inner join tblAssetStatus stats on assetdetails.assetStatusID COLLATE utf8mb4_unicode_ci = stats.assetStatusID"
        + " where stats.statusName = 'Deployed'"
        + " and (assetdetails.assetID COLLATE utf8mb4_unicode_ci = assets.assetID) Limit 1) as DeployTo,"
        + " assets.assetID as idselect"
        + " from tblAssets assets"
        + " INNER JOIN tblAssetStatus assetstatus on assets.assetStatusID = assetstatus.assetStatusID" 
        + " INNER JOIN tblAssetCategory category on assets.assetCategID = category.assetCategID"
        + " LEFT JOIN tblSuppliers supplier on supplier.supplierid COLLATE utf8mb4_unicode_ci = assets.supplierID"
        + " where assets.active=1"
        + " order by assets.assetName"
    

    connection.query(sql,(err,result) => {
        if(err) {ç
            res.json({
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                
                if (bShowConsole == true ) {
                    console.log(result)
                } else 
                {
                    /// Error Logs here
                }
         
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
});

app.post('/assets/getassetsbyID',(req,res) => {

    const sql = "SELECT assets.assetID,assets.assetCategID,assets.supplierid,assets.serialNo,assets.assetCode,"
        + "assets.assetName,assets.description,assets.pictureFile,assets.amount,COALESCE(DATE_FORMAT(assets.datePurchase, '%m/%d/%Y'),'') as datePurchase,"
        + "assets.amountDepreciatedYr,"
        + "COALESCE(DATE_FORMAT(assets.dateDepreciated, '%m/%d/%Y'),'') as dateDepreciated,"
        + "stat.statusName FROM tblAssets assets"
        + " inner join tblAssetStatus stat on stat.assetStatusID COLLATE utf8mb4_unicode_ci = assets.assetStatusID"
        + " where assetID = ?"
 
     connection.query(sql,[req.body.rowId],(err,result) => {
         if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
         } else {
             if(result.length > 0) {
                
                 if (bShowConsole == true ) {
                     console.log(result)
                 } else 
                 {
                     /// Error Logs here
                 }
          
                 res.json({result,message: "Record Found"});
             } else {
                 res.json({message: "No Record Found"});
             }
         }
     })
 });


 app.post('/assets/countsassignbyuser_deployed',(req,res) => {

    const sql = "select count(assets.assetID) as assetCount from tblUsers users"
        + " inner join tblUserAssetDetails details on details.userSelectedID COLLATE utf8mb4_unicode_ci = users.userDisplayID"
        + " inner join tblAssetStatus stats on stats.assetStatusID COLLATE utf8mb4_unicode_ci = details.assetStatusID"
        + " inner join tblAssets assets on assets.assetID COLLATE utf8mb4_unicode_ci = details.assetID"
        + " inner join tblAssetCategory category on category.assetCategID COLLATE utf8mb4_unicode_ci = assets.assetCategID"
        + " inner join tblUsers userdeploy on userdeploy.userDisplayID COLLATE utf8mb4_unicode_ci = details.useridcheckout"
        + " where users.userDisplayID = ?"
        + " and stats.statusName = 'Deployed'"
        + " and assets.active=1"
        + " order by assets.assetName"
 
     connection.query(sql,[req.body.userID],(err,result) => {
         if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
         } else {
             if(result.length > 0) {
                
                 if (bShowConsole == true ) {
                     console.log(result)
                 } else 
                 {
                     /// Error Logs here
                 }
          
                 res.json({result,message: "Record Found"});
             } else {
                 res.json({message: "No Record Found"});
             }
         }
     })
 });

app.post('/assets/viewallassetsassignbyuserfordeploy_deployed',(req,res) => {

    const sql = "select assets.assetID as id,assets.assetCode,assets.assetName,"
        + "stats.statusName,category.assetCategName,userdeploy.displayName,"
        + "COALESCE(DATE_FORMAT(details.datecheckin, '%m/%d/%Y'),'') as datecheckin  from tblUsers users"
        + " inner join tblUserAssetDetails details on details.userSelectedID COLLATE utf8mb4_unicode_ci = users.userDisplayID"
        + " inner join tblAssetStatus stats on stats.assetStatusID COLLATE utf8mb4_unicode_ci = details.assetStatusID"
        + " inner join tblAssets assets on assets.assetID COLLATE utf8mb4_unicode_ci = details.assetID"
        + " inner join tblAssetCategory category on category.assetCategID COLLATE utf8mb4_unicode_ci = assets.assetCategID"
        + " inner join tblUsers userdeploy on userdeploy.userDisplayID COLLATE utf8mb4_unicode_ci = details.useridcheckout"
        + " where users.userDisplayID = ?"
        + " and stats.statusName = 'Deployed'"
        + " order by assets.assetName"
 
     connection.query(sql,[req.body.userID],(err,result) => {
         if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
         } else {
             if(result.length > 0) {
                
                 if (bShowConsole == true ) {
                     console.log(result)
                 } else 
                 {
                     /// Error Logs here
                 }
          
                 res.json({result,message: "Record Found"});
             } else {
                 res.json({message: "No Record Found"});
             }
         }
     })
 });

 app.post('/assets/viewallassetsassignfordeploy',(req,res) => {

     
    const sql = "select assets.assetID as id,assets.assetCode,assets.assetName,"
        + "stats.statusName,category.assetCategName,userdeploy.displayName,"
        + "COALESCE(DATE_FORMAT(details.plancheckout, '%m/%d/%Y'),'') as datecheckout  from tblUsers users"
        + " inner join tblUserAssetDetails details on details.userSelectedID COLLATE utf8mb4_unicode_ci = users.userDisplayID"
        + " inner join tblAssetStatus stats on stats.assetStatusID COLLATE utf8mb4_unicode_ci = details.assetStatusID"
        + " inner join tblAssets assets on assets.assetID COLLATE utf8mb4_unicode_ci = details.assetID"
        + " inner join tblAssetCategory category on category.assetCategID COLLATE utf8mb4_unicode_ci = assets.assetCategID"
        + " inner join tblUsers userdeploy on userdeploy.userDisplayID COLLATE utf8mb4_unicode_ci = details.useridcheckout"
        + " where users.userDisplayID = ?"
        + " and stats.statusName = 'For Deploy'"
        + " order by assets.assetName"
        
  
      connection.query(sql,[req.body.userID],(err,result) => {
          if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
          } else {
              if(result.length > 0) {
                  
                  if (bShowConsole == true ) {
                      console.log(result)
                  } else 
                  {
                      /// Error Logs here
                  }
           
                  res.json({result,message: "Record Found"});
              } else {
                  res.json({message: "No Record Found"});
              }
          }
      })
  });

  app.post('/assets/viewallassetsassigndeployed_user',(req,res) => {

    const sql = "select details.detailID as id,assets.assetCode,assets.assetName,"
    + "stats.statusName,category.assetCategName,userdeploy.displayName,"
    + "COALESCE(DATE_FORMAT(details.datecheckin, '%m/%d/%Y'),'') as datecheckin  from tblUsers users"
    + " inner join tblUserAssetDetails details on details.userSelectedID COLLATE utf8mb4_unicode_ci = users.userDisplayID"
    + " inner join tblAssetStatus stats on stats.assetStatusID COLLATE utf8mb4_unicode_ci = details.assetStatusID"
    + " inner join tblAssets assets on assets.assetID COLLATE utf8mb4_unicode_ci = details.assetID"
    + " inner join tblAssetCategory category on category.assetCategID COLLATE utf8mb4_unicode_ci = assets.assetCategID"
    + " inner join tblUsers userdeploy on userdeploy.userDisplayID COLLATE utf8mb4_unicode_ci = details.useridcheckout"
    + " where users.userDisplayID = ?"
    + " and stats.statusName = 'Deployed'"
    + " order by assets.assetName"

  
      connection.query(sql,[req.body.userID],(err,result) => {
          if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
          } else {
              if(result.length > 0) {
                  
                  if (bShowConsole == true ) {
                      console.log(result)
                  } else 
                  {
                      /// Error Logs here
                  }
           
                  res.json({result,message: "Record Found"});
              } else {
                  res.json({message: "No Record Found"});
              }
          }
      })
  });


  // need to remove later no longer use
app.post('/assets/searchuser',(req,res) => {

    const sql = "SELECT userSelectedID FROM tblUserAssets WHERE userSelectedID = ?";
    const val = req.body.userselectedid;
    //console.log(val)

    connection.query(sql,[val],(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                //console.log(result[0]);
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })

});


  // need to remove later no longer use
app.post('/assets/putuser',(req,res) => {

    const id = randomUUID()

    const sql = "INSERT INTO tblUserAssets(`userAssetID`,`userSelectedID`,`notes`,"
    + "`dateInsert`,`insertedBy`) values (?)";

    const ddateinsert = new Date(req.body.datePurchase)
 
    const values = [
        id,
        req.body.varuserid,
        req.body.varnotes,
        utils_getDate(),
        req.body.userID
    ];
      
    connection.query(sql,[values],(err,result) => {
        if(err) {
            console.log(err)
            res.json({
                message: "Insert Error",
                message2: err.message});
        }else {
            //console.log("Success")
            //console.log(values)
            res.json({
                message: "Insert Success"});
        }

     })

})

app.post('/assets/putassetsdetail',(req,res) => {

    const id = randomUUID()

    const sql = "INSERT INTO tblUserAssetDetails(detailID,userSelectedID,assetID,"
    + "plancheckout,useridcheckout,assetStatusID,notescheckout) values (?)";

    const dcheckout = new Date(req.body.checkout)
   
    const values = [
        id,
        req.body.varuserid,
        req.body.assetid,
        dcheckout,
        req.body.userID,
        req.body.assetdeploy,
        req.body.varnotes
    ];
      
    connection.query(sql,[values],(err,result) => {
        if(err) {
            //console.log(err)
            res.json({
                message: "Insert Error",
                message2: err.message});
        }else {
            //console.log("Success")
            //console.log(values)
            res.json({
                message: "Insert Success"});
        }

     })

})

app.post('/assets/updateassetdeploy',(req,res) => {

    const sqlUpdate = "UPDATE tblAssets SET `assetStatusID` = ?,`updatedBy` = ?,`dateUpdated` = ?"
            + " where assetID = ?"
      
    connection.query(sqlUpdate,[ req.body.assetdeploy, req.body.userID, utils_getDate(),req.body.varassetid],(err,result) => {
        if(err) {
            res.json({
                message: "Update Error",
                message2: err.message});
        }else {
            res.json({
                message: "Update Success"});
        }
     })

})

// need to remove no longer use
app.post('/assets/updateuserasset',(req,res) => {


    const sqlUpdate = "UPDATE tblUserAssets SET `updatedBy` = ?,`dateupdate` = ?,`notes` = ?"
            + " where userSelectedID = ? "

   
      
    connection.query(sqlUpdate,[ req.body.userID,utils_getDate(), req.body.varnotes,req.body.varuserid],(err,result) => {
        if(err) {
            res.json({
                message: "Update Error",
                message2: err.message});
        }else {
            //console.log("Success")
            //console.log(values)
            res.json({
                message: "Update Success"});
        }

     })

})

app.post('/assets/checkinassetsdetail',(req,res) => {


    const sqlUpdate = "UPDATE tblUserAssetDetails SET `checkinby` = ?,`datecheckin` = ?,`assetStatusID` = ?"
            + " where userSelectedID = ? and assetStatusID = ? and assetID = ?"

    connection.query(sqlUpdate,[ req.body.userID,utils_getDate(), req.body.assetstat,
        req.body.userID,req.body.assetstatfordeploy,req.body.assetid],(err,result) => {
        if(err) {
            res.json({
                message: "Update Error",
                message2: err.message});
        }else {
            //console.log("Success")
            //console.log(values)
            res.json({
                message: "Update Success"});
        }

     })

})

app.post('/assets/pulloutasset_selectedbyuser',(req,res) => {

    try {
    const sqlUpdate = "UPDATE tblUserAssetDetails SET pulloutBy = ?,datepullout = ?,assetStatusID = ?,"
            + "notesPullout = ?,pulloutnotify=1 where detailID = ?"

    connection.query(sqlUpdate,[req.body.userID,utils_getDate(), 
        req.body.assetID,req.body.notes,req.body.detailid],(err,result) => {
        if(err) {
            res.json({
                message: "Update Error",
                message2: err.message});
        }else {
            //console.log("Success")
            //console.log(values)
            res.json({
                message: "Update Success"});
        }

     })
    }
    catch(err) {
        console.log("Error")
    }

})


app.post('/assets/pulloutNotification',(req,res) => {

    try {
   
       const sql = "select count(pulloutnotify) as Notif from tblUserAssetDetails"
        + " where pulloutnotify = 1"
        + " and checkinby = ?"

    connection.query(sql,[req.body.userID],(err,result) => {

        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                //console.log(result[0]);
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }

     })
    }
    catch(err) {
        console.log("Error")
    }

})

app.post('/assets/checkinNotification',(req,res) => {

    try {
   
    const sql = "select count(assetsdetails.plancheckout) as checkin from tblUserAssetDetails assetsdetails"
        + " inner join tblAssetStatus stats on assetsdetails.assetStatusID COLLATE utf8mb4_unicode_ci = stats.assetStatusID"
        + " where stats.statusName = 'For Deploy' and assetsdetails.userSelectedID = ?"
    

    connection.query(sql,[req.body.userID],(err,result) => {

        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                //console.log(result[0]);
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }

     })
    }
    catch(err) {
        console.log("Error")
    }

})


app.post('/assets/asset_bydetail',(req,res) => {
//assetStatusID
    const sql = "SELECT assetID FROM tblUserAssetDetails"
        + " where detailID = ?"
    
    connection.query(sql,[req.body.detailID],(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                
                if (bShowConsole == true ) {
                    console.log(result)
                } else 
                {
                    /// Error Logs here
                }
         
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
});


/// End of Assets ///////////


///////// Dispose ///////////
// Date : 08232022
// Author : JK

app.post('/dispose/insertdispose', (req,res)   => {
    
    const id = randomUUID()

    const sql = "INSERT INTO tblDispose(disposeID,assetID,"
    + "statusID,boxid,reason,createdBy,datecreated) values (?)";

    const values = [
        id,
        req.body.rowId,
        req.body.statusid,
        req.body.boxid,
        req.body.reason,
        req.body.userID,
        utils_getDate()
    ];
      
    connection.query(sql,[values],(err,result) => {
        if(err) {
            console.log(err)
            res.json({
                message: "Insert Error",
                message2: err.message });
                
        }else {
            res.json({
                message: "Insert Success"});

            //// FOR update Assets 

            //this is working already
            //const sqlupdate = "UPDATE tblAssets SET active = 0"
            //    + " where assetID = ?"
            
            //connection.query(sqlupdate,[req.body.rowId],(err1,result) => {
            //   if(err1) {
            //        console.log(err1)
            //        res.json({
            //            message: "Insert Error",
            //            message2: err1.message });
                        
            //    }else {
            //        res.json({
            //           message: "Insert Success"});
            //    }
        
            // })

            //// end of update

        }

     })
})


app.post('/dispose/viewallstatus',(req,res) => {
    const sql = "SELECT statusName,statusDescription, assetStatusID as id FROM tblAssetStatus"
        + " where vwdispose='1' ORDER BY statusName";
    connection.query(sql,(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message });
        } else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
});

app.post('/dispose/viewallboxs',(req,res) => {

const sql = "SELECT boxID,boxName FROM tblBox where active=1 order by boxName "

connection.query(sql,(err,result) => {
    if(err) {
        res.json({
            message: "No Record Found",
            message2: err.message});
    } else {
        if(result.length > 0) {
            res.json({result,message: "Record Found"});
        } else {
            res.json({message: "No Record Found"});
        }
    }
})
});

app.post('/dispose/checkassetdispose',(req,res) => {

    const sql = "SELECT assetID FROM tblDispose where assetID=?"
    
    connection.query(sql,[req.body.rowId],(err,result) => {
        if(err) {
            res.json({result,
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
            } else {
                res.json({result,message: "No Record Found"});
            }
        }
    })
});

app.post('/dispose/checkassetdispose_approve_exist',(req,res) => {

    const sql = "SELECT dispose.assetID FROM tblDispose dispose"
            + " where dispose.disposeID=? and dispose.isApprove=0"
   
    connection.query(sql,[req.body.rowId],(err,result) => {
        if(err) {
            res.json({result,
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
            } else {
                res.json({result,message: "No Record Found"});
            }
        }
    })
});


app.post('/dispose/checkassetdeploy',(req,res) => {

    const sql = "SELECT details.assetID,stat.statusName FROM tblUserAssetDetails details"
        + " inner join tblAssetStatus stat on stat.assetStatusID COLLATE utf8mb4_unicode_ci = details.assetStatusID"
        + " where (stat.statusName  = 'For Deploy' OR stat.statusName = 'Deployed' OR details.pulloutnotify = 1)"
        + " and details.assetID = ?"

    connection.query(sql,[req.body.rowId],(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
});

app.post('/dispose/viewallassetdispose',(req,res) => {

    const sql = "SELECT dispose.disposeID as id,assets.serialNo,assets.assetCode,assets.assetName,"
        + "supplier.name as suppliername,category.assetCategName,"
        + "box.boxName,assetstat.statusName as statfrom, stat.statusName as statto,users.displayName,"
        + "COALESCE(DATE_FORMAT(dispose.datecreated, '%m/%d/%Y'),'') as disposedate,"
        + "dispose.isApprove"
        + " FROM tblAssets assets"
        + " INNER JOIN tblDispose dispose on dispose.assetID COLLATE utf8mb4_unicode_ci = assets.assetID"
        + " INNER JOIN tblBox box on box.boxID COLLATE utf8mb4_unicode_ci = dispose.boxid"
        + " INNER JOIN tblAssetStatus stat on stat.assetStatusID COLLATE utf8mb4_unicode_ci = dispose.statusID"
        + " INNER JOIN tblAssetStatus assetstat on assetstat.assetStatusID COLLATE utf8mb4_unicode_ci = assets.assetStatusID"
        + " INNER JOIN tblUsers users on users.userDisplayID COLLATE utf8mb4_unicode_ci = dispose.createdBy"
        + " INNER JOIN tblSuppliers supplier ON supplier.supplierid COLLATE utf8mb4_unicode_ci = assets.supplierID"
        + " INNER JOIN tblAssetCategory category on category.assetCategID COLLATE utf8mb4_unicode_ci = assets.assetCategID"
        + " WHERE dispose.isApprove = 0"
        + " ORDER BY disposedate "


    connection.query(sql,(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
});

app.post('/dispose/getDisposeAssetsValue',(req,res) => {
    // Dashboard
        const sql = "select LEFT(box.boxName ,5) as name,"
                + "(SELECT IFNULL(CONCAT('',sum(assets.amount)),'0')  as totalAmount FROM tblAssets assets"
                +  " where assets.assetID COLLATE utf8mb4_unicode_ci = dispose.assetID)"
                + " as assetval"
                + " from tblBox box"
                + " inner join tblDispose dispose on dispose.boxid = box.boxID"
    
        connection.query(sql,(err,result) => {
            if(err) {
                res.json({
                    message: "No Record Found",
                    message2: err.message});
            } else {
                if(result.length > 0) {
                    //console.log(result);
                    res.json({result,message: "Record Found"});
                } else {
                    res.json({message: "No Record Found"});
                }
            }
        })
    });

app.post('/dispose/getAssetDisposeAmount',(req,res) => {
    
    const sql = "call getAssetDisposeAmount()"
    
        connection.query(sql,(err,result) => {
            if(err) {
                //console.log(err);
                res.json({
                    message: "No Record Found",
                    message2: err.message});
            } else {
                if(result.length > 0) {
                    //console.log(result);
                    
                    res.json({result,message: "Record Found"});
                    
                } else {
                   // console.log(result);
                    res.json({message: "No Record Found"});
                }
            }
        })
    });

app.post('/dispose/AssetDispose_Approve', (req,res)   => {

    const sqlUpdate = "UPDATE tblDispose SET isApprove =1,approvedBy = ?,dateApproved = ?"
    + " where disposeID = ? and assetID = ? and isApprove = 0"

    //console.log("asset id is : " + req.body.assetid)
   // console.log("dispose id is : " + req.body.disposeid)
    connection.query(sqlUpdate,[req.body.userID,utils_getDate(), 
    req.body.disposeid,req.body.assetid],(err,result) => {
        if(err) {
           // console.log("Error here :" + err)
            res.json({result,
                message: "Update Error",
                message2: err.message});
        }else {
           // console.log("Success here : " + res)
            res.json({result,
                message: "Update Success"});
        }

        })
})

////////// End of Dispose 

///// Pullout //////
// Date : 08222023
//          08/31
//              Add CheckinPullout Count from Jan-Dec

app.post('/CheckInPullOut/Count_CheckInPullOut',(req,res) => {

    const sql = "call getCheckinPullout(YEAR(CURDATE()))"

    connection.query(sql,(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
});


app.post('/pullout/viewallpullout',(req,res) => {

    const sql = "select assetdetails.detailID as id,"
    + "assets.assetCode,assets.assetName,stat.statusName,category.assetCategName,"
    + "users.displayName as pulloutby,COALESCE(DATE_FORMAT(assetdetails.datepullout, '%m/%d/%Y'),'') as pulloutdate,"
    + "COALESCE(usersreceive.displayName,'') as pulloutreceive,"
    + "COALESCE(DATE_FORMAT(assetdetails.datereceived, '%m/%d/%Y'),'') as pulloutdatereceive"
    + " from tblAssets assets"
    + " inner join tblUserAssetDetails assetdetails on assetdetails.assetID COLLATE utf8mb4_unicode_ci = assets.assetID"
    + " inner join tblAssetStatus stat on stat.assetStatusID COLLATE utf8mb4_unicode_ci = assetdetails.assetStatusID"
    + " inner join tblUsers users on users.userDisplayID COLLATE utf8mb4_unicode_ci = assetdetails.pulloutBy"
    + " left join tblUsers usersreceive on usersreceive.userDisplayID COLLATE utf8mb4_unicode_ci = assetdetails.receivedby"
    + " inner join tblAssetCategory category on category.assetCategID COLLATE utf8mb4_unicode_ci = assets.assetCategID"
    + " where assets.active=1 and assetdetails.pulloutnotify = 1"
    //assetdetails.pulloutnotify = 1"
    + " order by pulloutdate desc"

    connection.query(sql,(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
});

app.post('/pullout/updatepulloutnotification', (req,res)   => {
    

    const sqlUpdate = "UPDATE tblUserAssetDetails SET pulloutnotify = 0,"
            + "receivedby =?,datereceived =?"
            + " where detailID = ?"

    connection.query(sqlUpdate,[req.body.userID,utils_getDate(),req.body.rowId],(err,result) => {
        if(err) {
            res.json({
                message: "Update Error",
                message2: err.message});
        }else {
      
            //console.log(values)
            res.json({
                message: "Update Success"});
        }

     })
})

app.post('/pullout/checkpulloutnotification',(req,res) => {

    const sql = "SELECT details.assetID,stat.statusName FROM tblUserAssetDetails details"
        + " inner join tblAssetStatus stat on stat.assetStatusID COLLATE utf8mb4_unicode_ci = details.assetStatusID"
        + " where receivedby is null" 
        + " and details.detailID = ?"

    connection.query(sql,[req.body.rowId],(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
});

app.post('/pullout/countallPullout',(req,res) => {
//Dashboard
    const sql = "SELECT count(detail.detailID) as totalpullout FROM  tblUserAssetDetails detail"
            + " where detail.pulloutnotify=1 and detail.pulloutBy is not null"
    
    connection.query(sql,(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
    });

app.post('/pullout/getallpulloutbydepartment',(req,res) => {
    //Dashboard
    const sql = "SELECT dep.departmentDisplayID,dep.departmentName,"
       + "(SELECT count(detail.detailID) as tot FROM  tblUserAssetDetails detail"
       + " inner join tblUsers users on users.userDisplayID COLLATE utf8mb4_unicode_ci = detail.userSelectedID"
       + " inner join tblPositions position on position.positionDisplayID COLLATE utf8mb4_unicode_ci = users.positionID"
       + " inner join tblDepartments department on department.departmentDisplayID COLLATE utf8mb4_unicode_ci = position.departmentDisplayID"
       + " where (detail.pulloutBy is not null)"
       + " and (department.departmentDisplayID = dep.departmentDisplayID ))  as total"
        + " FROM  tblDepartments dep"
        + " order by dep.departmentName Limit 15"
        
        connection.query(sql,(err,result) => {
            if(err) {
                res.json({
                    message: "No Record Found",
                    message2: err.message});
            } else {
                if(result.length > 0) {
                   
                    res.json({result,message: "Record Found"});
                } else {
                    res.json({message: "No Record Found"});
                }
            }
        })
        });

//// End of Pullout


//// Get Email info from user /////

app.post('/email/getemailinfo',(req,res) => {

    const sql = "SELECT users.lastname as userName,users.email FROM tblUsers users"
    + " where users.userDisplayID = ?"
    
    connection.query(sql,[req.body.rowId],(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
});

///// End of email from user

//// USER CATEGORY ////


app.post('/usercategory/viewallusercategory',(req,res) => {

    const sql = "SELECT category.categoryID as id,category.categoryName,"
        + "category.categoryDesc FROM tblUserCategory category"
        + " ORDER BY category.categoryName"
    
    connection.query(sql,(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
});

app.post('/usercategory/checkuserCategoryfordelete', (req,res)   => {
    
    const sqlUpdate = "SELECT groupTypeID FROM  tblUsers where groupTypeID = ?"

    connection.query(sqlUpdate,[req.body.rowId],(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        }else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }

     })
})

app.post('/usercategory/deleteuserCategory', (req,res)   => {
    
    const sqlUpdate = "DELETE FROM tblUserCategory WHERE categoryID=?"

    connection.query(sqlUpdate,[req.body.rowId],(err,result) => {
        if(err) {
            res.json({
                message: "Record Error Deleted",
                message2: err.message});
        }else {
            //console.log("Success")
            //console.log(values)
            res.json({
                message: "Record Deleted"});
        }

     })
})


app.post('/usercategory/getuserCategorybyID',(req,res) => {
    const sql = "SELECT categoryID,categoryName,categoryDesc FROM tblUserCategory WHERE categoryID = ?";
    connection.query(sql,[req.body.rowId],(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
});

app.post('/usercategory/putuserCategory', (req,res)   => {
    
    const id = randomUUID()

    const sql = "INSERT INTO tblUserCategory(categoryID,categoryName,"
    + "categoryDesc,createdBy,dateCreated) values (?)";

    const values = [
        id,
        req.body.name,
        req.body.description,
        req.body.userID,
        utils_getDate()
    ];
      
    connection.query(sql,[values],(err,result) => {
        if(err) {
            res.json({
                message: "Insert Error",
                message2: err.message});
        }else {
            res.json({
                message: "Insert Success"});
        }

     })
})


app.post('/usercategory/updateuserCategory', (req,res)   => {
    

    const sqlUpdate = "UPDATE tblUserCategory SET categoryName = ?,categoryDesc = ?,"
    + "updateBy = ?,dateUpdate = ?"
    + " where categoryID = ? "

    connection.query(sqlUpdate,[req.body.name,req.body.description,
        req.body.userID,utils_getDate(),req.body.rowId],(err,result) => {
        if(err) {
            res.json({
                message: "Update Error",
                message2: err.message});
        }else {
            //console.log("Success")
            //console.log(values)
            res.json({
                message: "Update Success"});
        }

     })
})


//// EOF USER CATEGORY


////// Supplier
// Date : 0828

app.post('/supplier/getsupplier',(req,res) => {

    const sql = "SELECT supplier.supplierid,supplier.name FROM tblSuppliers supplier"
            + " order by supplier.name"
    
    connection.query(sql,(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
});

app.post('/supplier/checksupplierfordelete', (req,res)   => {
    
    const sqlUpdate = "SELECT supplierid FROM  tblSuppliers where supplierid = ?"

    connection.query(sqlUpdate,[req.body.rowId],(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        }else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }

     })
})

app.post('/supplier/deleteSupplier', (req,res)   => {
    

    const sqlUpdate = "DELETE FROM tblSuppliers WHERE supplierid=?"

    connection.query(sqlUpdate,[req.body.rowId],(err,result) => {
        if(err) {
            res.json({
                message: "Record Error Deleted",
                message2: err.message});
        }else {
            //console.log("Success")
            //console.log(values)
            res.json({
                message: "Record Deleted"});
        }

     })
})

app.post('/supplier/viewallsupplier',(req,res) => {

    const sql = "SELECT supplier.supplierid as id,supplier.name,supplier.contactno,supplier.email FROM tblSuppliers supplier"
            + " order by supplier.name"

    connection.query(sql,(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
            } else {
                res.json({
                    message: "No Record Found",
                    message2: "No Record Found" });
            }
        }
    })
});

app.post('/supplier/getsupplierbyID',(req,res) => {

    const sql = "SELECT supplier.supplierid,supplier.name,supplier.address,"
            + "supplier.contactno,supplier.email,supplier.imgFilename FROM tblSuppliers supplier"
            + " where supplier.supplierid = ?"
            + " order by supplier.name"

    connection.query(sql,[req.body.rowId],(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
});


app.post('/supplier/putSupplier', (req,res)   => {
    
    const id = randomUUID()

    const sql = "INSERT INTO tblSuppliers(supplierid,name,"
    + "address,contactno,email,createdBy,dateCreated) values (?)";

    const values = [
        id,
        req.body.name,
        req.body.address,
        req.body.contactno,
        req.body.email,
        req.body.userID,
        utils_getDate()
    ];
      
    connection.query(sql,[values],(err,result) => {
        if(err) {
            res.json({
                message: "Insert Error",
                message2: err.message});
        }else {
            res.json({
                message: "Insert Success"});
        }

     })
})


app.post('/supplier/updateSupplier', (req,res)   => {
    

    const sqlUpdate = "UPDATE tblSuppliers SET name = ?,address = ?,"
    + "contactno=?,email=?,"
    + "updateBy = ?,dateUpdate = ?"
    + " where supplierid = ? "

    connection.query(sqlUpdate,[req.body.name,req.body.address,
        req.body.contactno,req.body.email,req.body.userID,utils_getDate(),req.body.rowId],(err,result) => {
        if(err) {
            res.json({
                message: "Update Error",
                message2: err.message});
        }else {
            //console.log("Success")
            //console.log(values)
            res.json({
                message: "Update Success"});
        }

     })
})

app.post('/supplier/updateSupplierImage',upload.single("file"), (req,res)   => {
    
    const imagefile = req.file.filename
    const sqlUpdate = "UPDATE tblSuppliers SET imgFilename = ?"
    + " where supplierid = ? "

    connection.query(sqlUpdate,[imagefile,req.body.rowId],(err,result) => {
        if(err) {
            res.json({
                message: "Update Error",
                message2: err.message});
        }else {
            //console.log("Success")
            //console.log(values)
            res.json({
                message: "Update Success"});
        }

     })
})

app.post('/supplier/getSupplierAssets',(req,res) => {
// Dashboard
    const sql = "SELECT supplier.name,"
            + "(SELECT count(asset.assetID) FROM tblAssets asset"
            + " where asset.supplierID COLLATE utf8mb4_unicode_ci = supplier.supplierid"
            + " and asset.active=1) as countsupplier"
            + " FROM tblSuppliers supplier"
            + " order by supplier.name"
            + " limit 10"

    connection.query(sql,(err,result) => {
        if(err) {
            res.json({
                message: "No Record Found",
                message2: err.message});
        } else {
            if(result.length > 0) {
                //console.log(result[0]);
                res.json({result,message: "Record Found"});
            } else {
                res.json({message: "No Record Found"});
            }
        }
    })
});

app.post('/supplier/getCountSupplier',(req,res) => {
    // Dashboard
        const sql = "SELECT count(supplier.supplierid) as countsupplier FROM tblSuppliers supplier"
                + " where supplier.active=1"
    
        connection.query(sql,(err,result) => {
            if(err) {
                res.json({
                    message: "No Record Found",
                    message2: err.message});
            } else {
                if(result.length > 0) {
                    //console.log(result[0]);
                    res.json({result,message: "Record Found"});
                } else {
                    res.json({message: "No Record Found"});
                }
            }
        })
    });

app.post('/supplier/getSupplierAssetsValue',(req,res) => {
    // Dashboard
        const sql = "SELECT LEFT(supplier.name , 8) as name,"
                + "(SELECT IFNULL(CONCAT('',sum(asset.amount), 0),'0')  as totalAmount FROM tblAssets asset"
                + " where asset.supplierID COLLATE utf8mb4_unicode_ci = supplier.supplierid"
                + " and asset.active=1) as assetvalue"
                + " FROM  tblSuppliers supplier"
                + " order by assetvalue desc"
    
        connection.query(sql,(err,result) => {
            if(err) {
                res.json({
                    message: "No Record Found",
                    message2: err.message});
            } else {
                if(result.length > 0) {
                    //console.log(result[0]);
                    res.json({result,message: "Record Found"});
                } else {
                    res.json({message: "No Record Found"});
                }
            }
        })
    });
        
////// End of Supplier

