import { toast } from 'react-toastify';

export const notifySuccess = (text: string) => {
    toast.success(text, {
        position: "top-right",
        theme: "light",

            style: {
            backgroundColor: `#e6e6e6ff`,
            borderLeft: `8px solid #11bb4fff`,
            borderRadius: '8px',
            fontWeight: '600',
        },
    });
};


export const notifyError = (text: string) => {
    toast.error(text, {
        position: "top-right",
        theme: "light", 
        
        style: {
            borderLeft: `8px solid #d35d5dff`,
            borderRadius: '8px',
            fontWeight: '600',
        },
    });
};