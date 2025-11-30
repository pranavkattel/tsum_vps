import React from 'react';

type Props = {
  phone?: string; // E.164 format without plus, e.g. "15551234567"
  message?: string;
};

const FloatingWhatsApp: React.FC<Props> = ({ phone = '15551234567', message = 'Hi! I have a question about a product.' }) => {
  const whatsappNative = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;
  const waMe = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  const openWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    // Try native protocol first (mobile / WhatsApp Desktop). Fallback to wa.me.
    window.location.href = whatsappNative;
    setTimeout(() => {
      window.open(waMe, '_blank', 'noopener');
    }, 700);
  };

  return (
    <a
      href={waMe}
      onClick={openWhatsApp}
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
      style={{
        position: 'fixed',
        left: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: '50%',
        backgroundColor: '#25D366',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
        zIndex: 9999,
        textDecoration: 'none',
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden>
        <path d="M20.52 3.48A11.86 11.86 0 0 0 12 .5C6.21.5 1.54 4.86.51 10.08c-.5 2.1.01 4.18 1.44 5.9L.5 23l6.3-1.65a11.87 11.87 0 0 0 5.2 1.1h.01c5.79 0 10.46-4.36 11.49-9.58.49-2.1-.02-4.18-1.42-5.89zM12 20.5c-1.72 0-3.4-.43-4.88-1.24l-.35-.2-3.74.98.99-3.64-.23-.37A8.87 8.87 0 0 1 3 10.5 8.99 8.99 0 0 1 12 2.5c4.87 0 8.88 3.82 9 8.61.09 4.59-3.66 8.39-8 8.39z" />
        <path d="M17.6 14.2c-.3-.15-1.8-.9-2.08-.99-.28-.09-.48-.14-.68.14-.2.28-.79.99-.97 1.19-.18.2-.36.23-.66.08-.3-.15-1.27-.47-2.42-1.48-.9-.8-1.5-1.79-1.67-2.09-.17-.3-.02-.46.13-.6.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2 0-.38-.01-.53-.01-.15-.68-1.64-.93-2.25-.24-.58-.49-.5-.68-.51-.18-.01-.38-.01-.58-.01-.2 0-.53.07-.81.36-.28.29-1.08 1.06-1.08 2.58 0 1.52 1.1 2.99 1.25 3.2.15.2 2.15 3.45 5.2 4.83 3.05 1.39 3.05.93 3.6.87.58-.07 1.8-.73 2.05-1.44.25-.71.25-1.32.18-1.44-.07-.12-.28-.2-.58-.35z" />
      </svg>
    </a>
  );
};

export default FloatingWhatsApp;
