'use client';

import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      return;
    }

    setStatus('loading');
    
    // Simulate newsletter subscription (replace with actual API call)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus('success');
      setEmail('');
      
      // Reset success message after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="form-control w-full max-w-xs mx-auto">
      <label className="label">
        <span className="label-text font-semibold">Stay updated with my latest work</span>
      </label>
      
      <form onSubmit={handleSubmit} className="join">
        <input 
          type="email" 
          placeholder="Enter your email" 
          className={`input input-bordered join-item flex-1 ${
            status === 'error' ? 'input-error' : ''
          }`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading'}
        />
        <button 
          type="submit"
          className={`btn join-item ${
            status === 'loading' ? 'btn-disabled loading' : 'btn-primary'
          }`}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            'Subscribe'
          )}
        </button>
      </form>
      
      <label className="label">
        {status === 'success' && (
          <span className="label-text-alt text-success text-xs">
            ✓ Successfully subscribed! Thank you.
          </span>
        )}
        {status === 'error' && (
          <span className="label-text-alt text-error text-xs">
            ✗ Please enter a valid email address.
          </span>
        )}
        {status === 'idle' && (
          <span className="label-text-alt text-xs opacity-70">
            Get notified about new projects and blog posts
          </span>
        )}
      </label>
    </div>
  );
}
