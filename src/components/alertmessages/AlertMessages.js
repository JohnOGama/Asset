import React from 'react'

  // Alert Notification
  import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';


const AlertMessages = (message,paramMethod) => {

    if(paramMethod === "Warning")
    {

        toast.warn(message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
            });

    } else if (paramMethod === "Info") {

        toast.info(message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
            });

    } else if(paramMethod === "Success") {

        toast.success(message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
            });

    } else if(paramMethod === "Error") {

        toast.error(message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
            });
    } else
    {
      toast.error(message, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
        });
    }
   
  
  return (
    <div>

        <ToastContainer
             position="top-center"
             autoClose={3000}
             hideProgressBar
             newestOnTop={false}
             closeOnClick
             rtl={false}
             pauseOnFocusLoss={false}
             draggable={false}
             pauseOnHover
             theme="light"
            />
        
    </div>
  )
}

export default AlertMessages