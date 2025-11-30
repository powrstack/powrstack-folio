'use client';

import { memo } from 'react';

const HeaderActions = memo(function HeaderActions({ email }) {
  return (
    <div className="hidden lg:flex space-x-2">
      <a
        href="/Md_Abu_Raihan_Srabon_Resume.pdf"
        download="Md_Abu_Raihan_Srabon_Resume.pdf"
        className="btn btn-outline"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Download CV
      </a>
      {email && (
        <a
          href={`mailto:${email}`}
          className="btn btn-primary"
        >
          Contact Me
        </a>
      )}
    </div>
  );
});

export default HeaderActions;
