// API URL'leri
const DEV_API_URL = 'http://192.168.1.197:3000';
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
  
  // News - Yeni harici API endpoint'leri
  NEWS: '/news',
  AGRICULTURE_NEWS: '/news/agriculture',
  LATEST_AGRICULTURE_NEWS: '/news/agriculture/latest',
  AGRICULTURE_NEWS_RSS: '/news/agriculture/rss',
  
  // Growth Stages
  GROWTH_STAGES: '/growth-stages',
  
  // Crop Types
  CROP_TYPES: '/crop-types',
  
  // Fertilizers
  FERTILIZER_RECOMMENDATIONS: '/fertilizer-recommendations',
  ORGANIC_FERTILIZERS: '/organic-fertilizers',
  
  // Fields (Tarlalar)
  FIELDS: '/fields',
  FIELD_ANALYTICS: '/fields/:id/analytics',
  
  // Soil Analysis
  SOIL_ANALYSIS: '/soil-analysis',
  FIELD_SOIL_ANALYSIS: '/soil-analysis/field/:fieldId',
  SOIL_FERTILIZATION_PLAN: '/soil-analysis/field/:fieldId/fertilization-plan',
  
  // Analytics
  ANALYTICS: '/analytics',
  FIELD_ANALYTICS_DETAIL: '/analytics/field/:fieldId',
  
  // Organic Pest Control (Organik Zararlı Mücadelesi)
  ORGANIC_PEST_CONTROL: '/organic-pest-control',
  PEST_CONTROL_EFFECTIVENESS: '/organic-pest-control/field/:fieldId/effectiveness',
  COMPANION_PLANTING: '/organic-pest-control/companion-planting/:cropName',
  BIOLOGICAL_CONTROL: '/organic-pest-control/biological-control/:pestType',
  
  // Crop Rotation (Ekin Rotasyonu)
  CROP_ROTATION: '/crop-rotation',
  ROTATION_RECOMMENDATIONS: '/crop-rotation/recommendations/:fieldId/:soilType',
  ROTATION_COMPANION_PLANTING: '/crop-rotation/companion-planting/:cropName',
  ROTATION_BENEFITS: '/crop-rotation/:id/benefits',
};

const config = {
  baseURL: API_URL,
  endpoints: API_ENDPOINTS
};

export default config; 