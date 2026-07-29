import { AboutScreen } from '@/presentation/screens/AboutScreen';

/**
 * Route: /about
 * App version, build number and contact info.
 *
 * Sits outside the (main) group on purpose: it is reached from /profiles, which
 * is also outside it, and mounting (main)/_layout would start the background
 * music just to read a version number.
 */
export default AboutScreen;
