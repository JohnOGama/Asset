(self.webpackChunkasset=self.webpackChunkasset||[]).push([[9355],{99355:function(e,t,r){"use strict";r.r(t);var n=r(1413),s=r(29439),a=r(72791),o=r(31243),i=r(15493),c=r(8845),l=r(57689),d=r(54970),u=r(17746),h=r(44293),f=r(78983),m=r(24518),g=r(5574),p=r(97123),Z=r(39157),w=r(51691),x=r(65661),b=r(35527),v=r(59962),j=r.n(v),y=r(80184);t.default=function(){var e=(0,l.s0)(),t="",r="",v=(0,a.useState)(""),E=(0,s.Z)(v,2),N=E[0],U=E[1],k=(0,a.useState)(""),C=(0,s.Z)(k,2),D=C[0],S=C[1],V=(0,a.useState)("red"),I=(0,s.Z)(V,2),R=I[0],M=I[1],F=(0,a.useState)([]),_=(0,s.Z)(F,2),z=_[0],P=_[1],A=a.useState(!1),H=(0,s.Z)(A,2),O=H[0],T=H[1];function L(){try{!function(){try{r=(0,h.pe)(window.localStorage.getItem("Kgr67W@"),u.Z.secretkeylocal)}catch(n){(0,d.Z)("Error","UserView","CheckRole Local Storage is tampered",n.message,t),e("/dashboard")}}(),"Admin"==r||"IT"==r?null==!window.localStorage.getItem("id")||"0"!==window.localStorage.getItem("id")?t=(0,h.pe)(window.localStorage.getItem("id"),u.Z.secretkeylocal):e("/login"):e("/dashboard")}catch(n){e("/dashboard")}}(0,a.useEffect)((function(){L()}),[]);var B=a.useMemo((function(){return[{field:"id",headerName:"Actions",type:"actions",disableClickEventBubbling:!0,renderCell:function(e){return(0,y.jsx)("div",{children:(0,y.jsx)(c.Z,{cursor:"pointer",onClick:function(){return function(e){try{U(e),function(e){try{var r="http://localhost:3001/users/checkUserfordelete";o.Z.post(r,{rowId:e}).then((function(t){"Record Found"==t.data.message?(S("User still with asset(s) tag"),M("re")):(e,T(!0),S(""),M(""))})).catch((function(e){(0,d.Z)("Error","UserView","CheckUserAssets /users/checkUserfordelete","Error in try/catch "+e.message,t)}))}catch(n){(0,d.Z)("Error","UserView","CheckUserAssets /users/checkUserfordelete","Error in try/catch "+n.message,t)}}(e)}catch(r){(0,d.Z)("Error","UserView","handleClick /users/checkUserfordelete",r.message,t)}}(e.row.id)}})})}},{field:"categoryName",headerName:"Category",width:100,editable:!1},{field:"departmentName",headerName:"Department",width:150,editable:!1},{field:"positionName",headerName:"Position",width:250,editable:!1},{field:"fullname",headerName:"Employee",width:250,editable:!1},{field:"displayName",headerName:"Display",width:150,editable:!1},{field:"email",headerName:"Email",width:100,editable:!1},{field:"active",headerName:"Active",width:50,editable:!1,boolean:!0}]}),[]);var W=function(){T(!1),S("")};function Y(){""==t&&L();o.Z.post("http://localhost:3001/users/viewallusers").then((function(e){var r=e.data.message;"Record Found"==r?P(e.data.result):"No Record Found"==r&&(S("No Record Found"),M("red"),(0,d.Z)("Message","UserView","LoadData /users/viewallusers",e.data.message,t))})).catch((function(e){(0,d.Z)("Error","UserView","LoadData /users/viewallusers",e.message,t)}))}return(0,a.useEffect)((function(){Y()}),[]),(0,y.jsx)(f.b7,{xs:12,children:(0,y.jsxs)(f.xH,{className:"mb-3",size:"sm",children:[(0,y.jsx)(f.bn,{children:(0,y.jsxs)("h6",{children:[(0,y.jsxs)("span",{className:"message",style:{color:"#5da4f5"},children:[" ",(0,y.jsx)(y.Fragment,{children:" Employee(s) "})]}),(0,y.jsx)("br",{}),(0,y.jsxs)("strong",{children:[(0,y.jsx)("span",{className:"message",style:{color:R},children:(0,y.jsx)("p",{children:D})})," "]})]})}),(0,y.jsx)(f.lx,{children:(0,y.jsx)(f.rb,{children:(0,y.jsx)(f.b7,{xs:12,children:(0,y.jsxs)(f.sl,{children:[(0,y.jsx)(f.YR,{size:"sm",className:"mb-3",children:(0,y.jsx)("div",{style:{height:400,width:"100%"},children:(0,y.jsx)(i._$,{rows:z,columns:B,initialState:{pagination:{paginationModel:{pageSize:10}}},pageSizeOptions:[10],rowSelection:!0,getRowId:function(e){return e.id}})})}),(0,y.jsx)("div",{className:"d-grid",children:(0,y.jsxs)(g.Z,{open:O,onClose:W,PaperComponent:function(e){return(0,y.jsx)(j(),{handle:"#draggable-dialog-title",cancel:'[class*="MuiDialogContent-root"]',children:(0,y.jsx)(b.Z,(0,n.Z)({},e))})},"aria-labelledby":"draggable-dialog-title",children:[(0,y.jsx)(x.Z,{style:{cursor:"move"},id:"draggable-dialog-title",children:"Employee"}),(0,y.jsx)(Z.Z,{children:(0,y.jsx)(w.Z,{children:"Are you sure you want to Delete ?"})}),(0,y.jsxs)(p.Z,{children:[(0,y.jsx)(m.Z,{autoFocus:!0,onClick:W,children:"No"}),(0,y.jsx)(m.Z,{onClick:function(){try{""==t&&L();o.Z.post("http://localhost:3001/users/deleteUser",{irowSelectedID:N}).then((function(e){var r=e.data.message;"Record Deactivated"==r?(T(!1),(0,d.Z)("Message","UserView","handleDelete /users/deleteUser"," Deactivated Employee \n EmployeeID: "+N+"\n Deleted By  : "+t,t),T(!1),Y()):"No Record Deactivated"==r&&(T(!1),S("No record deactivated"),M("red"),(0,d.Z)("Error","UserView","handleDelete /users/deleteUser","No Record Deactivated \n"+e.data.message,t))})).catch((function(e){(0,d.Z)("Error","UserView","handleDelete /users/deleteUser","Error in then/catch \n"+e.message,t),T(!1)}))}catch(e){(0,d.Z)("Error","UserView","handleDelete /users/deleteUser",e.message,t),T(!1)}},children:"Yes"})]})]})})]})})})})]})})}},8845:function(e,t,r){"use strict";var n=r(64836);t.Z=void 0;var s=n(r(45649)),a=r(80184),o=(0,s.default)((0,a.jsx)("path",{d:"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5-1-1h-5l-1 1H5v2h14V4h-3.5z"}),"DeleteOutlineTwoTone");t.Z=o},45649:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return n.createSvgIcon}});var n=r(54421)},54421:function(e,t,r){"use strict";r.r(t),r.d(t,{capitalize:function(){return s.Z},createChainedFunction:function(){return a},createSvgIcon:function(){return o.Z},debounce:function(){return i.Z},deprecatedPropType:function(){return c},isMuiElement:function(){return l.Z},ownerDocument:function(){return d.Z},ownerWindow:function(){return u.Z},requirePropFactory:function(){return h},setRef:function(){return f},unstable_ClassNameGenerator:function(){return v},unstable_useEnhancedEffect:function(){return m.Z},unstable_useId:function(){return g.Z},unsupportedProp:function(){return p},useControlled:function(){return Z.Z},useEventCallback:function(){return w.Z},useForkRef:function(){return x.Z},useIsFocusVisible:function(){return b.Z}});var n=r(55902),s=r(14036),a=r(78949).Z,o=r(76189),i=r(83199);var c=function(e,t){return function(){return null}},l=r(19103),d=r(98301),u=r(17602);r(87462);var h=function(e,t){return function(){return null}},f=r(62971).Z,m=r(40162),g=r(67384);var p=function(e,t,r,n,s){return null},Z=r(98278),w=r(89683),x=r(42071),b=r(23031),v={configure:function(e){n.Z.configure(e)}}},64836:function(e){e.exports=function(e){return e&&e.__esModule?e:{default:e}},e.exports.__esModule=!0,e.exports.default=e.exports}}]);
//# sourceMappingURL=9355.61c7e246.chunk.js.map