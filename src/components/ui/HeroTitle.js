import { memo } from 'react';
import TypingAnimation from './TypingAnimation';

const HeroTitle = memo(function HeroTitle({ 
  personalInfo, 
  roles,
  isDesktop = false
}) {
  const titleClass = isDesktop 
    ? "text-7xl font-bold text-base-content leading-tight"
    : "text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-base-content leading-tight";
  
  const subtitleClass = isDesktop
    ? "text-3xl font-semibold text-base-content/80 mt-4 h-12"
    : "text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-base-content/80 mt-4 h-10 sm:h-12 lg:h-12";

  return (
    <div className={isDesktop ? "mb-6" : "mb-4 lg:mb-6"}>
      <h1 className={titleClass}>
        Hi, I'm{' '}
        <span className="text-primary">
          {personalInfo?.name || 'Developer'}
        </span>
      </h1>
      
      <div className={subtitleClass}>
        <TypingAnimation roles={roles} />
      </div>
    </div>
  );
});

export default HeroTitle;
