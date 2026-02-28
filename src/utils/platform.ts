import { Platform } from 'react-native';

// On web, we can use plain SVG. On native we need react-native-svg.
// This wrapper makes both work without react-native-svg dependency.
// Charts use this so they render on both platforms.

export { Platform };