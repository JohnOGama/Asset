"use strict";(self.webpackChunkasset=self.webpackChunkasset||[]).push([[584],{20584:function(e,l,t){t.r(l);var o=t(1413),s=t(29439),a=t(72791),n=t(31243),i=t(78983),r=t(27391),d=t(57689),c=t(17746),u=t(44293),g=t(54970),h=t(80184);l.default=function(){var e=(0,d.s0)(),l="",t=(0,d.TH)().state,m="";try{m=t.params}catch(j){e("/dashboard")}var f=(0,a.useState)({logid:"",type:"",module:"",function:"",details:""}),p=(0,s.Z)(f,2),x=p[0],b=p[1];function y(){try{!function(){try{(0,u.pe)(window.localStorage.getItem("Kgr67W@"),c.Z.secretkeylocal)}catch(j){WriteLog("Error","Log","CheckRole Local Storage is tampered",j.message,l),e("/dashboard")}}(),null==!window.localStorage.getItem("id")||"0"!==window.localStorage.getItem("id")?l=(0,u.pe)(window.localStorage.getItem("id"),c.Z.secretkeylocal):e("/login")}catch(j){e("/dashboard")}}return(0,a.useEffect)((function(){y()}),[]),(0,a.useEffect)((function(){if(""==l&&y(),""==!m){n.Z.post("http://localhost:3001/log/getlogID",{rowId:m}).then((function(e){var t=e.data.message;"Record Found"==t?b((0,o.Z)((0,o.Z)({},x),{},{logid:e.data.result[0].logID,type:e.data.result[0].logtype,module:e.data.result[0].module,function:e.data.result[0].logfunction,details:e.data.result[0].logvalues})):"No Record Found"==t&&g.Z.WriteLog("Error","Log","Load /log/getlogID","DB No Record Found",l)})).catch((function(e){g.Z.WriteLog("Error","Log","Load /log/getlogID","Load Error on then/catch response \n"+e.message,l)}))}}),[]),(0,h.jsx)(i.b7,{xs:12,children:(0,h.jsxs)(i.xH,{className:"mb-3",size:"sm",children:[(0,h.jsx)(i.bn,{children:(0,h.jsx)("strong",{children:"Log Detail Information "})}),(0,h.jsx)(i.lx,{children:(0,h.jsxs)(i.rb,{children:[(0,h.jsx)(i.b7,{children:(0,h.jsxs)(i.sl,{children:[(0,h.jsx)(i.YR,{size:"sm",className:"mb-3",children:(0,h.jsx)(r.Z,{name:"type",id:"outlined-basic",value:x.type,fullWidth:!0,label:"Log Type",placeholder:"Log Type",InputProps:{readOnly:!0}})}),(0,h.jsx)(i.YR,{size:"sm",className:"mb-3",children:(0,h.jsx)(r.Z,{name:"module",id:"outlined-basic",value:x.module,fullWidth:!0,label:"Module",placeholder:"Module",InputProps:{readOnly:!0}})}),(0,h.jsx)(i.YR,{size:"sm",className:"mb-3",children:(0,h.jsx)(r.Z,{name:"function",id:"outlined-basic",value:x.function,fullWidth:!0,label:"Function",placeholder:"Function",InputProps:{readOnly:!0}})}),(0,h.jsx)(i.YR,{size:"sm",className:"mb-3",children:(0,h.jsx)(r.Z,{name:"details",id:"outlined-textarea",value:x.details,fullWidth:!0,label:"Details",placeholder:"Details",multiline:!0,rows:5,InputProps:{readOnly:!0}})})]})}),(0,h.jsx)("div",{className:"d-grid",style:{display:"flex",alignItems:"center",justifyContent:"center"},children:(0,h.jsx)(i.u5,{style:{width:"150%"},onClick:function(){e("/configurations/logview")},color:"success",children:"View All Logs"})})]})})]})})}}}]);
//# sourceMappingURL=584.a6cfa0b6.chunk.js.map