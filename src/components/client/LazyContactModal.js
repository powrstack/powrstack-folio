'use client';

import dynamic from 'next/dynamic';

// Aggressively lazy-load ContactModal - only shown on demand
const ContactModal = dynamic(() => import('../ui/ContactModal'), {
  ssr: false,
  loading: () => (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="animate-pulse">
          <div className="h-8 bg-base-300 rounded mb-4"></div>
          <div className="h-32 bg-base-300 rounded"></div>
        </div>
      </div>
    </div>
  )
});

export default function LazyContactModal(props) {
  // Only render when actually opened
  if (!props.isOpen) return null;
  
  return <ContactModal {...props} />;
}
