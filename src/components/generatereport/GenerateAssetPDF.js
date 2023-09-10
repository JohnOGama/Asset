
import * as React from 'react'

import jsPDF from "jspdf";
import "jspdf-autotable";
// Date Fns is used to format the dates we receive
// from our API call
import { format } from "date-fns";

import DefaultLogoReport from '../../assets/images/DefaultLogoReport.jpeg'

import WriteLog from "../logs/LogListener";

// define a generatePDF function that accepts a tickets argument
const GenerateAssetPDF = (assets,totalAssets) => {

    try {
  
       
  
  const doc = new jsPDF();

  // define the columns we want and their titles
  const tableColumn = ["#","Code", "Name", "Category", "Status","Received"];
  // define an empty array of rows
  const tableRows = [];
    var icount = 0
  // for each ticket pass all its data into an array
  assets.forEach(asset => {
    icount = icount + 1
    
    const assetData = [
        icount.toString(),
      asset.AssetCode,
      asset.assetName,
      asset.assetCategName,
      asset.statusName,
      asset.Checkin
    ];
    // push each assets info into a row
    tableRows.push(assetData);
  });

    var img = new Image()
    img.src = DefaultLogoReport
  
    let newDate = new Date()
    let year = newDate.getFullYear();
    let month = newDate.getMonth() + 1;
    let day = newDate.getDate();
    


  const date = Date().split(" ");
  const dateStr = date[1] + date[2] + date[3] + date[4];
  const dateGenerate = month + "/" + day + "/" + year

  

  doc.addImage(img, 'jpeg',10 ,5, 40,15)  // margin-left,margin-top,width , height
  doc.text("Current Asset(s) List",150, 12 ); // margin-left,margin-top
  doc.setFontSize(10)
  doc.text('Date Generated : ' + dateGenerate,150,16)
  doc.text('Total Asset(s) : ' + totalAssets,150,21)
  doc.line(10,25,200,25)

  doc.autoTable(tableColumn, tableRows,{ startY: 30,horizontalPageBreak: true,horizontalPageBreakRepeat: 0, })

  var pageCount = doc.getCurrentPageInfo().pageNumber
  
  for( var i=0; i < pageCount;i++)
  {
    doc.setPage(i)
   
    var curretPage = doc.getCurrentPageInfo().pageNumber
    //WriteLog("For Testing"," ")
   // doc.autoTable(tableRows,{startY:30})

    doc.line(10,280,200,280)
    doc.text("Page : " + curretPage + "/" + pageCount, 10,285)
    doc.text("Asset Management Team", 150,285)

  }

   // we define the name of our PDF file to save.
  doc.save(`Assets_${dateStr}.pdf`);

}
catch(err)  {
    WriteLog("Error", "Generate PDF " ,"Generate Asset PDF","","")
}

};

export default GenerateAssetPDF;