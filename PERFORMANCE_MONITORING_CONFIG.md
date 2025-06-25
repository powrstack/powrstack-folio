# Performance Monitoring Configuration

## Overview
The portfolio includes optional performance monitoring components that can be enabled or disabled via the `masterConfig.js` file.

## Configuration Options

### Disable Performance Monitoring
To disable performance monitoring components, edit `src/masterConfig.js`:

```javascript
// Performance monitoring configuration
performance: {
  // Set to false to completely disable performance monitoring
  enableMonitor: false, // Disables PerformanceMonitor component
  enableBudget: false,  // Disables PerformanceBudget component
  
  // Performance thresholds (still used if components are enabled)
  thresholds: {
    lcp: 1400,  // Largest Contentful Paint target (ms)
    fid: 100,   // First Input Delay target (ms)
    cls: 0.1    // Cumulative Layout Shift target (score)
  }
}
```

### Partial Disabling
You can selectively disable individual components:

```javascript
performance: {
  enableMonitor: true,  // Keep real-time monitoring
  enableBudget: false,  // Remove visual budget indicators
  // ...
}
```

## Performance Components

### PerformanceMonitor
- **Purpose**: Real-time Web Vitals tracking
- **Features**: LCP, FID, CLS monitoring with visual indicators
- **Location**: Floating overlay in development/debug mode
- **Disable with**: `enableMonitor: false`

### PerformanceBudget  
- **Purpose**: Performance budget tracking with visual warnings
- **Features**: Budget thresholds, performance score calculations
- **Location**: Small widget showing current vs target metrics
- **Disable with**: `enableBudget: false`

## Customizing Thresholds

You can adjust performance targets:

```javascript
thresholds: {
  lcp: 1200,  // Stricter LCP target (1.2s instead of 1.4s)
  fid: 50,    // Stricter FID target (50ms instead of 100ms)
  cls: 0.05   // Stricter CLS target (0.05 instead of 0.1)
}
```

## Production Impact

- **Development**: Components are fully active for debugging
- **Production**: Components respect the configuration settings
- **Performance**: Disabled components have zero bundle impact
- **Bundle Size**: No performance monitoring code included when disabled

## Quick Disable

For immediate disabling of all performance monitoring:

```javascript
// In src/masterConfig.js
performance: {
  enableMonitor: false,
  enableBudget: false,
  // thresholds still available if re-enabled later
  thresholds: { lcp: 1400, fid: 100, cls: 0.1 }
}
```

## Use Cases

### Development Team
- **Enable**: For performance debugging and optimization
- **Setting**: `enableMonitor: true, enableBudget: true`

### Client Demos
- **Disable**: For clean presentation without technical overlays
- **Setting**: `enableMonitor: false, enableBudget: false`

### Production Monitoring
- **Selective**: Keep monitoring but hide budget UI
- **Setting**: `enableMonitor: true, enableBudget: false`

### Performance Audits
- **Full Enable**: All monitoring for comprehensive analysis
- **Setting**: `enableMonitor: true, enableBudget: true`

This configuration provides flexible control over performance monitoring without requiring code changes.
