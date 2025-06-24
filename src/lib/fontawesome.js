// FontAwesome configuration
import { config, library } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

// Import solid icons
import {
  faBlog,
  faCalendar,
  faClock,
  faHeart,
  faComment,
  faEye,
  faExternalLinkAlt,
  faShare,
  faSearch,
  faTimes,
  faChevronLeft,
  faChevronRight,
  faRefresh,
  faRss,
  faStar,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

// Import brand icons
import {
  faGithub,
  faLinkedin,
  faDev,
  faMedium
} from '@fortawesome/free-brands-svg-icons';

// Add icons to library
library.add(
  // Solid icons
  faBlog,
  faCalendar,
  faClock,
  faHeart,
  faComment,
  faEye,
  faExternalLinkAlt,
  faShare,
  faSearch,
  faTimes,
  faChevronLeft,
  faChevronRight,
  faRefresh,
  faRss,
  faStar,
  faExclamationTriangle,
  
  // Brand icons
  faGithub,
  faLinkedin,
  faDev,
  faMedium
);

// Prevent FontAwesome from adding its CSS since we're using Tailwind
config.autoAddCss = false;

export default config;
