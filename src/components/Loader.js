import React from 'react';

const Loader = () => {
    const loaderStyles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            // backgroundColor: 'rgba(255, 255, 255, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
        },
        spinner: {
            border: '8px solid #f3f3f3',
            borderTop: '8px solid #3498db',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            animation: 'spin 1s linear infinite',
        },
        keyframes: `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `,
    };

    return (
        <>
            {/* Inject keyframes into the page */}
            <style>{loaderStyles.keyframes}</style>
            <div style={loaderStyles.overlay}>
                <div style={loaderStyles.spinner}></div>
            </div>
        </>
    );
};

export default Loader;
