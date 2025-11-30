import { memo } from 'react';

const HeroDescription = memo(function HeroDescription({ personalInfo }) {
  return (
    <div className="hidden lg:block text-lg text-base-content/70 mb-8 leading-relaxed animate-fade-in-up">
      {personalInfo?.summary ?
        personalInfo.summary.split('\n').map((line, index) => (
          <p key={index} className={index > 0 ? 'mt-4' : ''}>
            {line}
          </p>
        )) :
        <p>Passionate about creating innovative solutions and building scalable applications that make a difference.</p>
      }
    </div>
  );
});

export default HeroDescription;
