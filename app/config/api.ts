// API URL'leri
const DEV_API_URL = 'http://localhost:3000';
const PROD_API_URL = 'https://backend-ciftciyoldas.onrender.com'; // Render.com'da oluşturacağın URL

// Geliştirme ortamında mı yoksa prodüksiyon ortamında mı olduğumuzu kontrol et
export const API_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;

// API endpoint'leri
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/auth/profile',
  
  // Users
  USERS: '/users',
  
  // Messages
  MESSAGES: '/messages',
  FORUM_MESSAGES: '/forum-messages',
  
  // Sensors
  SENSORS: '/sensors',
  
  // News
  NEWS: '/news',
  
  // Growth Stages
  GROWTH_STAGES: '/growth-stages',
  
  // Crop Types
  CROP_TYPES: '/crop-types',
  
  // Fertilizers
  FERTILIZER_RECOMMENDATIONS: '/fertilizer-recommendations',
  ORGANIC_FERTILIZERS: '/organic-fertilizers',
}; 