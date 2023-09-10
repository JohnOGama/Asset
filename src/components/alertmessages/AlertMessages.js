import React from 'react'

  // Alert Notification
  import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';


const AlertMessages = (message,paramMethod) => {

    if(paramMethod === "Warning")
    {

        toast.warn(message, {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
            });

    } else if (paramMethod === "Info") {

        toast.info(message, {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
            });

    } else if(paramMethod === "Success") {

        toast.success(message, {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
            });

    } else if(paramMethod === "Error") {

        toast.error(message, {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
    } else
    {
      toast.error(message, {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }
   
  
  return (
    <div>

        <ToastContainer
                position="top-center"
                autoClose={3000}
                limit={1}
                hideProgressBar
                newestOnTop
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                theme="light"
            />
        
    </div>
  )
}

export default AlertMessages