'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';

export default function ToastifyContainer() {
    const [toasterTheme, setToasterTheme] = useState('colored');
   

    return (
        <ToastContainer
            position="top-center"
            autoClose={10000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss  
            draggable
            pauseOnHover
            theme={toasterTheme}
        />
    );
}