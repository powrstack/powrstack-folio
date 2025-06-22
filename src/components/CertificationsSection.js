'use client';

import { useState, useEffect } from 'react';

export default function CertificationsSection({ certifications }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!certifications || certifications.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-base-200">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl font-bold text-base-content mb-4">
            Professional Certifications
          </h2>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
            Industry-recognized certifications that validate my expertise
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className={`transition-all duration-1000 delay-${index * 200} ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="card bg-base-100 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group">
                <div className="card-body items-center text-center">
                  {/* Certificate Icon/Badge */}
                  <div className="avatar placeholder mb-4">
                    <div className="bg-warning text-warning-content rounded-full w-16 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                  </div>

                  {/* Certificate Name */}
                  <h3 className="card-title text-base-content group-hover:text-primary transition-colors">
                    {cert.name}
                  </h3>

                  {/* Issuer */}
                  <div className="flex items-center mb-3">
                    <svg className="w-4 h-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-3a1 1 0 011-1h2a1 1 0 011 1v3m-6 0V9a1 1 0 011-1h2a1 1 0 011 1v12" />
                    </svg>
                    <span className="text-sm font-medium text-base-content/70">
                      {cert.issuer}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center mb-4">
                    <svg className="w-4 h-4 text-success mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4zm-6 4a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6z" />
                    </svg>
                    <span className="text-sm text-base-content/60">
                      Issued {cert.date}
                    </span>
                  </div>

                  {/* Credential ID or View Button */}
                  <div className="card-actions">
                    {cert.url ? (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm group-hover:scale-105 transform"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Certificate
                      </a>
                    ) : cert.credentialId && (
                      <div className="badge badge-outline">
                        ID: {cert.credentialId}
                      </div>
                    )}
                  </div>

                  {/* Verification Badge */}
                  <div className="badge badge-success gap-2 mt-2">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Certification Summary */}
        <div className={`mt-16 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="card bg-gradient-to-r from-success to-primary text-primary-content shadow-xl">
            <div className="card-body text-center">
              <h3 className="card-title text-2xl justify-center mb-4">
                Commitment to Excellence
              </h3>
              <p className="text-primary-content/80 mb-6 max-w-2xl mx-auto">
                These certifications represent my dedication to maintaining the highest standards in software development and DevOps practices.
              </p>
              <div className="stats stats-horizontal shadow">
                <div className="stat">
                  <div className="stat-value text-success">{certifications.length}</div>
                  <div className="stat-title text-primary-content/60">Active Certifications</div>
                </div>
                <div className="stat">
                  <div className="stat-value text-warning">100%</div>
                  <div className="stat-title text-primary-content/60">Verified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
