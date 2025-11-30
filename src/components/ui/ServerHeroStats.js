import { memo } from 'react';

const ServerHeroStats = memo(function ServerHeroStats({ 
  resumeData, 
  technicalSkills, 
  certificationsByVendor
}) {
  // Limit certifications to show only top 3 vendors to prevent overflow
  const topCertVendors = [...certificationsByVendor.entries()].slice(0, certificationsByVendor.size-1);
  
  return (
    <div className="w-full flex justify-center">
      <div className="stats stats-vertical sm:stats-horizontal shadow bg-base-200 animate-fade-in-up">
        <div className="stat">
          <div className="stat-title">Experience</div>
          <div className="stat-value text-primary">
            {resumeData?.stats?.totalExperienceYears || 5}+
          </div>
          <div className="stat-desc">Years</div>
        </div>

        <div className="stat">
          <div className="stat-title">Projects</div>
          <div className="stat-value text-secondary">
            25+
          </div>
          <div className="stat-desc">Worked</div>
        </div>

        <div className="stat">
          <div className="stat-title">Technologies</div>
          <div className="stat-value text-accent">
            {technicalSkills.length || 15}+
          </div>
          <div className="stat-desc">Skills</div>
        </div>

        {/* Show top certification vendors */}
        {topCertVendors.map(([vendor, certs], index) => (
          <div className="stat" key={vendor}>
            <div className="stat-title">Certifications</div>
            <div className="stat-value text-info">
              {certs.length}x
            </div>
            <div className="stat-desc">{vendor}</div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default ServerHeroStats;
