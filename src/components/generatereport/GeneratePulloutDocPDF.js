
import * as React from 'react'

import jsPDF from "jspdf";
import "jspdf-autotable";
// Date Fns is used to format the dates we receive
// from our API call
import { format } from "date-fns";

import DefaultLogoReport from '../../assets/images/DefaultLogoReport.jpeg'

import WriteLog from "../logs/LogListener";

const GeneratePulloutDocPDF = (assets_byDocref,documentNo) => {
  
    try {
  
       
  
        const doc = new jsPDF();
      
        // define the columns we want and their titles
        const tableColumn = ["#","Code", "Serial","Name", "Category","Status","Note"];
        // define an empty array of rows
        const tableRows = [];
          var icount = 0
        // for each ticket pass all its data into an array
        assets_byDocref.forEach(asset => {
          icount = icount + 1
          
          const assetData = [
              icount.toString(),
            asset.assetCode,
            asset.serialNo,
            asset.assetName,
            asset.assetCategName,
            asset.statusName,
            asset.notesPullout,
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
        doc.setFont('Helvetica','Bold')
        doc.text("Asset Pullout Form",150, 12 ); // margin-left,margin-top
        doc.setFont('Helvetica','Normal')
        doc.setFontSize(10)
        doc.text('Date Generated : ' + dateGenerate,150,16)

        doc.setFont('Helvetica','Normal')
        doc.text('Document No : ',150,21)
        doc.setFont('Helvetica','Bold')
        doc.setFontSize(12)
        doc.text(documentNo,175,21)

        doc.setFont('Helvetica','Normal')
        doc.line(10,25,200,25)
      
        doc.autoTable(tableColumn, tableRows,{ startY: 45,horizontalPageBreak: true,horizontalPageBreakRepeat: 0, })
      
        var pageCount = doc.getCurrentPageInfo().pageNumber
        //console.log('Show all font in jsPDF',doc.getFontList())
        for( var i=0; i < pageCount;i++)
        {
          doc.setPage(i)
         
          var curretPage = doc.getCurrentPageInfo().pageNumber

      
          doc.setFont('Helvetica','Normal')
          doc.setFontSize(12)
          doc.text("Dear : " + assets_byDocref[0].ReleaseBy + ',',10,30)

          doc.setFont('Helvetica','Normal')
          doc.setFontSize(10)
          doc.text("Please find Below asset(s) to be pullout from my end.",10,36)
          


          doc.setFont('Helvetica','Normal')
          doc.setFontSize(10)
          doc.text("Total Assets : " + Object.keys(assets_byDocref).length.toString() ,10,80)

          doc.setFont('Helvetica','Normal')
          doc.setFontSize(12)
          doc.text("DECLARATION NOTE : ",10,100)

          doc.setFont('Helvetica','Normal')
          doc.setFontSize(10)
          doc.text("The employee whoose name and signature below acknowledge that he/she has returned the asset mentioned above",10,105)
          doc.text("The person receiving the asset whose name signature below confirmed receiving the asset(s) mentioned above.",10,110)
          doc.text(" ",10,115)


          doc.setFont('Helvetica','Normal')
          doc.setFontSize(10)
          doc.text("Receiving Asset Team ",10,125)
          doc.text(" Employee",140,125)

          doc.setFont('Helvetica','Normal')
          doc.setFontSize(10)
          doc.text(assets_byDocref[0].ReleaseBy  ,10,140)
          doc.text(assets_byDocref[0].PulloutName ,140,140)
          
          doc.setFont('Helvetica','Normal')
          doc.setFontSize(8)
          doc.text("NAME AND SIGNATURE",10,145)     
          doc.text("NAME AND SIGNATURE" ,140,145)
        

         
          
          doc.setFontSize(10)
          doc.line(10,280,200,280)
          doc.text("Page : " + curretPage + "/" + pageCount, 10,285)
          doc.text("Asset Management Team", 150,285)
      
        }
      
         // we define the name of our PDF file to save.
        doc.save(`AssetPullout_${dateStr}.pdf`);
      
      }
      catch(err)  {
        console.log(err)
          WriteLog("Error", "Generate PDF " ,"Generate Asset PDF","","")
      }
      

}

export default GeneratePulloutDocPDF
