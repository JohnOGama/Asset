"use strict";(self.webpackChunkasset=self.webpackChunkasset||[]).push([[3024],{17746:function(e,s,a){var t,r=a(4942),l=(t={projectTitle:"Asset",secretkey:"Adefg",secretkeylocal:"Adefg321",ALLOW_WRITELOG:"0",ALLOW_SENDEMAIL_CHECKOUT_BY_IT:"no",ALLOW_SENDEMAIL_CHECKIN_BY_USER:"no",ALLOW_SENDEMAIL_APPROVE_DISPOSE:"no",ALLOW_SENDEMAIL_PULLOUT_BY_USER:"no",email_key:"re_BReLyfj9_7cLbVV2Rxf5aji3CcnmUvinH",email_sender:"asset@test.dev",reply_to:"noreply@test.dev",YOUR_SERVICE_ID:"service_e0mdv86",YOUR_TEMPLATE_ID:"template_9p4hpvy",public_key:"vEuwkpou6K7nfqdH1",ASSET_EMAIL:"dg0at1818@gmail.com",USER_SERVICE_ID:"service_ivu0u7x",ASSET_RECEIVERNAME:"Asset Team",USER_TEMPLATE_ID:"template_n3o5jrb"},(0,r.Z)(t,"USER_SERVICE_ID","service_ivu0u7x"),(0,r.Z)(t,"USER_TEMPLATE_ID","template_n3o5jrb"),t);s.Z=l},23024:function(e,s,a){a.r(s);var t=a(4942),r=a(1413),l=a(29439),n=a(72791),o=a(31243),c=a(11087),i=a(78983),d=a(24846),m=a(99161),u=a(93647),g=a(57689),h=a(44293),x=a(17746),p=a(80184);s.default=function(){var e=(0,n.useState)(""),s=(0,l.Z)(e,2),a=s[0],w=s[1],j=(0,n.useState)("red"),S=(0,l.Z)(j,2),_=S[0],E=S[1],I=(0,g.s0)(),y=(0,n.useState)({username:"",password:""}),v=(0,l.Z)(y,2),f=v[0],L=v[1];(0,n.useEffect)((function(){null==!window.localStorage.getItem("id")?"0"!==window.localStorage.getItem("id")&&I("/dashboard"):window.localStorage.setItem("id","0")}),[]);var N=function(e){L((function(s){return(0,r.Z)((0,r.Z)({},s),{},(0,t.Z)({},e.target.name,[e.target.value.trim()]))}))};return(0,n.useState)((function(){return{}}),[f]),(0,p.jsx)("div",{className:"bg-light min-vh-100 d-flex flex-row align-items-center",children:(0,p.jsx)(i.KB,{children:(0,p.jsx)(i.rb,{className:"justify-content-center",children:(0,p.jsx)(i.b7,{md:8,children:(0,p.jsxs)(i.dL,{children:[(0,p.jsx)(i.xH,{className:"p-4",children:(0,p.jsx)(i.sl,{children:(0,p.jsxs)(i.lx,{onSubmit:function(e){try{if(e.preventDefault(),localStorage.clear(),""==!f.username&&""==!f.password){var s=(0,h.HI)(f.password,x.Z.secretkey),a=f.username;o.Z.post("http://localhost:3001/checkLogin",{username:a,password:s}).then((function(e){if("Record Found"==e.data.message){var s=e.data.result[0].userDisplayID,a=e.data.result[0].displayName,t=e.data.result[0].imgFilename,r=(e.data.result[0].Name,(0,h.HI)(s,x.Z.secretkeylocal)),l=(0,h.HI)(e.data.result[0].userRole,x.Z.secretkeylocal),n=(0,h.HI)(e.data.result[0].departmentDisplayID,x.Z.secretkeylocal);window.localStorage.removeItem("id"),window.localStorage.removeItem("display"),window.localStorage.removeItem("userimg"),window.localStorage.removeItem("Kgr67W@"),window.localStorage.removeItem("LkgdW23!"),window.localStorage.removeItem("Kvsf45_"),window.localStorage.clear(),window.localStorage.setItem("id",r),window.localStorage.setItem("display",a),window.localStorage.setItem("userimg",t),window.localStorage.setItem("Kgr67W@",l),window.localStorage.setItem("LkgdW23!",n),window.localStorage.setItem("Kvsf45_","0"),I("/dashboard")}else w("Login Error"),E("red")})).catch((function(e){w(e.message),E("red")}))}}catch(t){console.log(t)}},children:[(0,p.jsx)("h3",{children:(0,p.jsxs)("span",{className:"message",style:{color:"#5da4f5"},children:[" ",(0,p.jsx)(p.Fragment,{children:"Login "})]})}),(0,p.jsx)("br",{}),(0,p.jsxs)("h6",{children:[(0,p.jsx)("span",{className:"message",style:{color:_},children:(0,p.jsx)("p",{children:a})}),(0,p.jsx)("p",{className:"text-medium-emphasis",children:"Sign In to your account"})]}),(0,p.jsxs)(i.YR,{className:"mb-3",children:[(0,p.jsx)(i.wV,{children:(0,p.jsx)(d.Z,{icon:m.E})}),(0,p.jsx)(i.jO,{name:"username",placeholder:"Username",autoComplete:"username",onChange:N})]}),(0,p.jsxs)(i.YR,{className:"mb-4",children:[(0,p.jsx)(i.wV,{children:(0,p.jsx)(d.Z,{icon:u.U})}),(0,p.jsx)(i.jO,{name:"password",type:"password",placeholder:"Password",autoComplete:"current-password",onChange:N})]}),(0,p.jsxs)(i.rb,{children:[(0,p.jsx)(i.b7,{xs:6,children:(0,p.jsx)(i.u5,{color:"primary",className:"px-4",type:"submit",children:"Login"})}),(0,p.jsx)(i.b7,{xs:6,className:"text-right",children:(0,p.jsx)(i.u5,{color:"link",className:"px-0",children:"Forgot password?"})})]})]})})}),(0,p.jsx)(i.xH,{className:"text-white bg-primary py-5",style:{width:"44%"},children:(0,p.jsx)(i.sl,{className:"text-center",children:(0,p.jsxs)("div",{children:[(0,p.jsx)("h2",{children:(0,p.jsxs)("span",{className:"message",children:[" ",(0,p.jsx)(p.Fragment,{children:"Sign up "})]})}),(0,p.jsxs)("p",{children:["By clicking the ",'"',"Sign Up ",'"',", you are creating an account to Asset Management System, and you are agree to Asset Management Terms of Use and Privacy Policy"]}),(0,p.jsx)(c.rU,{to:"/register",children:(0,p.jsx)(i.u5,{color:"primary",className:"mt-3",active:!0,tabIndex:-1,children:"Register Now!"})})]})})})]})})})})})}}}]);
//# sourceMappingURL=3024.e038468d.chunk.js.map