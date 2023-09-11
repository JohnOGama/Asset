
import * as React from 'react'

import jsPDF from "jspdf";
import "jspdf-autotable";
import { autoTable } from 'jspdf-autotable';
// Date Fns is used to format the dates we receive
// from our API call
import { format } from "date-fns";

import DefaultLogoReport from '../../assets/images/DefaultLogoReport.jpeg'

import WriteLog from "../logs/LogListener";

const GenerateDisposeDocPDF = (assets_byDocref,documentNo) => {
  
    try {
  
       
  
        const doc = new jsPDF();
      
        // define the columns we want and their titles
        const tableColumn = ["#","SerialNo", "Code","Name", "Box","Status"];
        // define an empty array of rows
        const tableRows = [];
          var icount = 0
        // for each ticket pass all its data into an array
        assets_byDocref.forEach(asset => {
          icount = icount + 1
          
          const assetData = [
              icount.toString(),
            asset.serialNo,
            asset.assetCode,
            asset.assetName,
            asset.boxName,
            asset.statto
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
        doc.text("Asset Disposal Form",150, 12 ); // margin-left,margin-top
        doc.setFont('Helvetica','Normal')
        doc.setFontSize(10)
        doc.text('Date Generated : ' + dateGenerate,150,16)
        doc.setFont('Helvetica','Bold')
        doc.text('Document No : ' + documentNo,150,21)
        doc.line(10,25,200,25)
      
        doc.setFont('Helvetica','Normal')
        doc.setFontSize(10)
      //  autoTable(doc, {
      //    head: [tableColumn], // don't forget square brackets, columns is an array of string
      //    body: tableRows, // array of arrays of string
//
 //       },{startY: 45,horizontalPageBreak: true,horizontalPageBreakRepeat: 0, })

       doc.autoTable(tableColumn, tableRows,{ startY: 45,horizontalPageBreak: true,horizontalPageBreakRepeat: 0, })
      // doc.autoTable()
        var pageCount = doc.getCurrentPageInfo().pageNumber
        //console.log('Show all font in jsPDF',doc.getFontList())
        for( var i=0; i < pageCount;i++)
        {
          doc.setPage(i)
         
          var curretPage = doc.getCurrentPageInfo().pageNumber

      
          doc.setFont('Helvetica','Normal')
          doc.setFontSize(12)
          doc.text("Dear :  Asset Team Head"   ,10,30)

          doc.setFont('Helvetica','Normal')
          doc.setFontSize(10)
          doc.text("Please find Below asset(s) to be mark as Dispose.",10,36)
          

          doc.setFont('Helvetica','Normal')
          doc.setFontSize(10)
          doc.text("Total Assets : " + Object.keys(assets_byDocref).length.toString() ,10,80)

          doc.setFont('Helvetica','Normal')
          doc.setFontSize(12)
          doc.text("DECLARATION NOTE : ",10,100)

          doc.setFont('Helvetica','Normal')
          doc.setFontSize(10)
          doc.text("By signing below I hereby declared all asset(s) inidicated above are ready for disposal and be removed ",10,105)
          doc.text("from the office on the schedule date4 approved by Asset Team Head",10,110)
          //doc.text("indicated above. ",10,115)


          doc.setFont('Helvetica','Normal')
          doc.setFontSize(10)
          doc.text("Prepared By : ",10,125)
          doc.text("Approved By :",140,125)

          doc.setFont('Helvetica','Normal')
          doc.setFontSize(10)
          doc.text(assets_byDocref[0].PreparedBy ,10,140)
          doc.text("Asset Department Head" ,140,140)
          
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
        doc.save(`AssetDisposal_${dateStr}.pdf`);
      
      }
      catch(err)  {
        console.log(err)
          WriteLog("Error", "Generate PDF " ,"Generate Asset PDF",err.toString(),"")
      }
      
}

export default GenerateDisposeDocPDF
