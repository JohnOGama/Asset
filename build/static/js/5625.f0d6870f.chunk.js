(self.webpackChunkasset=self.webpackChunkasset||[]).push([[5625],{5625:function(e,t,n){"use strict";n.r(t);var o=n(1413),i=n(29439),r=n(72791),s=n(31243),c=n(15493),a=n(31675),l=n(8845),u=n(57689),d=n(54970),f=n(17746),h=n(44293),p=n(78983),g=n(24518),m=n(5574),Z=n(97123),x=n(39157),w=n(51691),j=n(65661),v=n(35527),b=n(59962),P=n.n(b),k=n(80184);t.default=function(){var e=(0,u.s0)(),t="",n="",b=(0,r.useState)(""),y=(0,i.Z)(b,2),N=y[0],C=y[1],E=(0,r.useState)("red"),S=(0,i.Z)(E,2),M=S[0],V=S[1],z=(0,r.useState)([]),D=(0,i.Z)(z,2),I=D[0],R=D[1],F=r.useState(!1),_=(0,i.Z)(F,2),T=_[0],H=_[1],L=(0,r.useState)(""),O=(0,i.Z)(L,2),A=O[0],U=O[1];function W(){try{!function(){try{n=(0,h.pe)(window.localStorage.getItem("Kgr67W@"),f.Z.secretkeylocal)}catch(o){(0,d.Z)("Error","PositionView","CheckRole Local Storage is tampered",o.message,t),e("/dashboard")}}(),"Admin"==n||"IT"==n?null==!window.localStorage.getItem("id")||"0"!==window.localStorage.getItem("id")?t=(0,h.pe)(window.localStorage.getItem("id"),f.Z.secretkeylocal):e("/login"):e("/dashboard")}catch(o){e("/dashboard")}}(0,r.useEffect)((function(){W()}),[]);var Y=r.useMemo((function(){return[{field:"id",headerName:"Actions",type:"actions",disableClickEventBubbling:!0,renderCell:function(t){return(0,k.jsxs)("div",{children:[(0,k.jsx)(a.Z,{cursor:"pointer",onClick:function(){return function(t){e("/configurations/position",{state:{params:t}})}(t.row.id)}}),(0,k.jsx)(l.Z,{cursor:"pointer",onClick:function(){return q(t.row.id)}})]})}},{field:"departmentName",headerName:"Department",width:200,editable:!1},{field:"positionName",headerName:"Position",width:200,editable:!1},{field:"description",headerName:"Description",width:300,editable:!1}]}),[]);(0,r.useEffect)((function(){}),[A]);var q=function(e){C(""),U(e),function(e){try{""==t&&W();var n=e,o="http://localhost:3001/position/checkPositionfordelete";s.Z.post(o,{rowId:n}).then((function(e){var t=e.data.message;"Record Found"==t?(C("Position selected still in use"),V("red"),H(!1)):"No Record Found"==t&&H(!0)})).catch((function(e){(0,d.Z)("Error","PositionView","checkUserPosition /position/checkPositionfordelete",e.message,t),C("Error in checking position"),V("red")}))}catch(i){(0,d.Z)("Error","PositionView","checkUserPosition /position/checkPositionfordelete",i.message,t)}}(e)},B=function(){H(!1)};function G(){""==t&&W();s.Z.post("http://localhost:3001/position/viewallposition").then((function(e){var t=e.data.message;"Record Found"==t?R(e.data.result):"No Record Found"==t&&(C("No Record Found"),V("red"))})).catch((function(e){(0,d.Z)("Error","PositionView","LoadData /position/viewallposition",e.message,t)}))}return(0,r.useEffect)((function(){G()}),[]),(0,k.jsx)(p.b7,{xs:12,children:(0,k.jsxs)(p.xH,{className:"mb-3",size:"sm",children:[(0,k.jsx)(p.bn,{children:(0,k.jsxs)("h6",{children:[(0,k.jsxs)("span",{className:"message",style:{color:"#5da4f5"},children:[" ",(0,k.jsx)(k.Fragment,{children:" Position "})]}),(0,k.jsx)("br",{}),(0,k.jsxs)("strong",{children:[(0,k.jsx)("span",{className:"message",style:{color:M},children:(0,k.jsx)("p",{children:N})})," "]})]})}),(0,k.jsx)(p.lx,{children:(0,k.jsx)(p.rb,{children:(0,k.jsx)(p.b7,{xs:12,children:(0,k.jsxs)(p.sl,{children:[(0,k.jsx)(p.u5,{onClick:function(t){e("/configurations/position",{state:{params:""}})},children:"Create New "}),(0,k.jsx)(p.YR,{size:"sm",className:"mb-3",children:(0,k.jsx)("div",{style:{height:400,width:"100%"},children:(0,k.jsx)(c._$,{rows:I,columns:Y,initialState:{pagination:{paginationModel:{pageSize:10}}},pageSizeOptions:[10],rowSelection:!0,getRowId:function(e){return e.id}})})}),(0,k.jsx)("div",{className:"d-grid",children:(0,k.jsxs)(m.Z,{open:T,onClose:B,PaperComponent:function(e){return(0,k.jsx)(P(),{handle:"#draggable-dialog-title",cancel:'[class*="MuiDialogContent-root"]',children:(0,k.jsx)(v.Z,(0,o.Z)({},e))})},"aria-labelledby":"draggable-dialog-title",children:[(0,k.jsx)(j.Z,{style:{cursor:"move"},id:"draggable-dialog-title",children:"Position"}),(0,k.jsx)(x.Z,{children:(0,k.jsx)(w.Z,{children:"Are you sure you want to Delete ?"})}),(0,k.jsxs)(Z.Z,{children:[(0,k.jsx)(g.Z,{autoFocus:!0,onClick:B,children:"No"}),(0,k.jsx)(g.Z,{onClick:function(){try{""==t&&W();var e=A;s.Z.post("http://localhost:3001/position/deletePosition",{rowId:e}).then((function(e){var n=e.data.message;"Record Deleted"==n?(H(!1),G()):"No Record Deleted"==n&&(C("No record deleted"),V("red"),(0,d.Z)("Error","PositionView","handleDelete /position/deletePosition",e.data.message2,t))})).catch((function(e){(0,d.Z)("Error","PositionView","handleDelete /position/deletePosition",e.message,t)}))}catch(n){(0,d.Z)("Error","PositionView","handleDelete /position/deletePosition",n.message,t)}},children:"Yes"})]})]})})]})})})})]})})}},8845:function(e,t,n){"use strict";var o=n(64836);t.Z=void 0;var i=o(n(45649)),r=n(80184),s=(0,i.default)((0,r.jsx)("path",{d:"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5-1-1h-5l-1 1H5v2h14V4h-3.5z"}),"DeleteOutlineTwoTone");t.Z=s},31675:function(e,t,n){"use strict";var o=n(64836);t.Z=void 0;var i=o(n(45649)),r=n(80184),s=(0,i.default)([(0,r.jsx)("path",{d:"M5 18.08V19h.92l9.06-9.06-.92-.92z",opacity:".3"},"0"),(0,r.jsx)("path",{d:"M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29s-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83zM3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM5.92 19H5v-.92l9.06-9.06.92.92L5.92 19z"},"1")],"EditTwoTone");t.Z=s},45649:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return o.createSvgIcon}});var o=n(54421)},54421:function(e,t,n){"use strict";n.r(t),n.d(t,{capitalize:function(){return i.Z},createChainedFunction:function(){return r},createSvgIcon:function(){return s.Z},debounce:function(){return c.Z},deprecatedPropType:function(){return a},isMuiElement:function(){return l.Z},ownerDocument:function(){return u.Z},ownerWindow:function(){return d.Z},requirePropFactory:function(){return f},setRef:function(){return h},unstable_ClassNameGenerator:function(){return v},unstable_useEnhancedEffect:function(){return p.Z},unstable_useId:function(){return g.Z},unsupportedProp:function(){return m},useControlled:function(){return Z.Z},useEventCallback:function(){return x.Z},useForkRef:function(){return w.Z},useIsFocusVisible:function(){return j.Z}});var o=n(55902),i=n(14036),r=n(78949).Z,s=n(76189),c=n(83199);var a=function(e,t){return function(){return null}},l=n(19103),u=n(98301),d=n(17602);n(87462);var f=function(e,t){return function(){return null}},h=n(62971).Z,p=n(40162),g=n(67384);var m=function(e,t,n,o,i){return null},Z=n(98278),x=n(89683),w=n(42071),j=n(23031),v={configure:function(e){o.Z.configure(e)}}},64836:function(e){e.exports=function(e){return e&&e.__esModule?e:{default:e}},e.exports.__esModule=!0,e.exports.default=e.exports}}]);
//# sourceMappingURL=5625.f0d6870f.chunk.js.map