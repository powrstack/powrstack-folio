'use client';

import dynamic from 'next/dynamic';

// Lazy-load ContactForm
const ContactForm = dynamic(() => import('../forms/ContactForm'), {
  ssr: false,
  loading: () => (
    <section className="py-12 sm:py-16 lg:py-20 bg-base-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="h-10 bg-base-300 rounded w-48 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-base-300 rounded w-96 mx-auto animate-pulse"></div>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-base-100 rounded-box animate-pulse"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-12 bg-base-100 rounded-box animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
});

export default function LazyContactForm(props) {
  return <ContactForm {...props} />;
}
