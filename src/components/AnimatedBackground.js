'use client';

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-base-100 via-base-200 to-base-300"></div>
      
      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 bg-mesh-gradient"></div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
      
      {/* Floating geometric shapes */}
      <div className="absolute inset-0">
        {/* Primary floating orb */}
        <div 
          className="absolute w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"
          style={{ 
            top: '10%', 
            left: '10%',
            animationDelay: '0s',
            animationDuration: '8s'
          }}
        ></div>
        
        {/* Secondary floating orb */}
        <div 
          className="absolute w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float"
          style={{ 
            bottom: '15%', 
            right: '15%',
            animationDelay: '2s',
            animationDuration: '10s'
          }}
        ></div>
        
        {/* Accent floating orb */}
        <div 
          className="absolute w-64 h-64 bg-accent/8 rounded-full blur-3xl animate-float"
          style={{ 
            top: '60%', 
            left: '60%',
            animationDelay: '4s',
            animationDuration: '12s'
          }}
        ></div>
        
        {/* Code elements */}
        <div className="absolute inset-0 font-mono text-base-content/5 text-6xl pointer-events-none">
          <div className="absolute animate-float" style={{ top: '20%', left: '5%', animationDelay: '1s' }}>{'</'}</div>
          <div className="absolute animate-float" style={{ top: '15%', right: '10%', animationDelay: '3s' }}>{'{ }'}</div>
          <div className="absolute animate-float" style={{ bottom: '30%', left: '15%', animationDelay: '5s' }}>{'</>'}</div>
          <div className="absolute animate-float" style={{ bottom: '20%', right: '20%', animationDelay: '2s' }}>{'( )'}</div>
          <div className="absolute animate-float" style={{ top: '70%', right: '5%', animationDelay: '4s' }}>{'[ ]'}</div>
        </div>
        
        {/* Geometric shapes */}
        <div className="absolute inset-0">
          {/* Triangle */}
          <div 
            className="absolute w-20 h-20 animate-rotate-slow opacity-20"
            style={{ top: '25%', right: '25%' }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full fill-primary">
              <polygon points="50,15 90,85 10,85" />
            </svg>
          </div>
          
          {/* Square */}
          <div 
            className="absolute w-16 h-16 bg-secondary/20 animate-scale"
            style={{ 
              bottom: '40%', 
              left: '20%',
              animationDelay: '1s'
            }}
          ></div>
          
          {/* Circle */}
          <div 
            className="absolute w-12 h-12 bg-accent/20 rounded-full animate-scale"
            style={{ 
              top: '80%', 
              left: '70%',
              animationDelay: '3s'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
