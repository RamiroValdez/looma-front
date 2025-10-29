import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

export const ToastProvider = () => {
    return (
        <ToastContainer 
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true} 
            pauseOnHover={false}
            closeOnClick
            draggable
            limit={3}
            style={{ top: 150 }}
        />
    );
};