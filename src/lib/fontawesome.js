// FontAwesome configuration
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

// Prevent FontAwesome from adding its CSS since we're using Tailwind
config.autoAddCss = false;

export default config;
