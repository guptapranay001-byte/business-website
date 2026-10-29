/**
 * Centralized Agricultural Catalog & Enterprise Data Layer
 * Vinay Agri Inputs (Tonk, Rajasthan)
 * 
 * NOTE: Demonstration product data is clearly designated for initial UI/UX preview
 * until official inventory and supplier catalogs are integrated.
 */

export const CATEGORIES = [
  {
    id: 'seeds',
    name: 'Seeds',
    slug: 'seeds',
    description: 'Certified hybrid and high-yield seeds for cereals, oilseeds, and vegetables.',
    icon: 'bi-flower2',
    color: '#16a34a',
    subcategories: [
      'Wheat Seeds',
      'Mustard Seeds',
      'Cotton Seeds',
      'Maize Seeds',
      'Bajra Seeds',
      'Paddy Seeds',
      'Vegetable Seeds',
      'Fodder Seeds',
      'Other Crop Seeds'
    ]
  },
  {
    id: 'fertilizers',
    name: 'Fertilizers',
    slug: 'fertilizers',
    description: 'Soil nutrients, water-soluble grades, and primary macro-fertilizers.',
    icon: 'bi-moisture',
    color: '#059669',
    subcategories: [
      'Urea',
      'DAP',
      'NPK Fertilizers',
      'Water-Soluble Fertilizers',
      'Micronutrient Fertilizers',
      'Specialty Fertilizers',
      'Other Fertilizers'
    ]
  },
  {
    id: 'insecticides',
    name: 'Insecticides',
    slug: 'insecticides',
    description: 'Targeted pest control solutions for chewing, sucking, and borer pests.',
    icon: 'bi-bug',
    color: '#d97706',
    subcategories: ['Systemic Insecticides', 'Contact Insecticides', 'Bio-Insecticides']
  },
  {
    id: 'fungicides',
    name: 'Fungicides',
    slug: 'fungicides',
    description: 'Preventive and curative antifungal treatments for root, foliar, and seed diseases.',
    icon: 'bi-shield-shaded',
    color: '#0284c7',
    subcategories: ['Contact Fungicides', 'Systemic Fungicides', 'Seed Treatment']
  },
  {
    id: 'herbicides',
    name: 'Herbicides',
    slug: 'herbicides',
    description: 'Selective and non-selective weed control solutions for pre- and post-emergence.',
    icon: 'bi-scissors',
    color: '#7c3aed',
    subcategories: ['Pre-Emergence Herbicides', 'Post-Emergence Herbicides', 'Broad-Spectrum']
  },
  {
    id: 'plant-growth-regulators',
    name: 'Plant Growth Regulators',
    slug: 'plant-growth-regulators',
    description: 'Growth stimulants, flower drop inhibitors, and root development enhancers.',
    icon: 'bi-graph-up-arrow',
    color: '#10b981',
    subcategories: ['Gibberellic Acid Formulations', 'Flowering Boosters', 'Root Initiators']
  },
  {
    id: 'micronutrients',
    name: 'Micronutrients',
    slug: 'micronutrients',
    description: 'Chelated zinc, boron, ferrous, and multi-micronutrient foliar mixtures.',
    icon: 'bi-droplet-half',
    color: '#ea580c',
    subcategories: ['Chelated Zinc (Zn-EDTA)', 'Boron 20%', 'Sulphur 90%', 'Multi-Micronutrient Mix']
  },
  {
    id: 'plant-nutrition',
    name: 'Plant Nutrition',
    slug: 'plant-nutrition',
    description: 'Bio-stimulants, organic humic amino acids, and sea-weed extracts.',
    icon: 'bi-capsule',
    color: '#0d9488',
    subcategories: ['Bio-Stimulants', 'Humic Acid', 'Amino Acid Foliar', 'Seaweed Extract']
  },
  {
    id: 'other-inputs',
    name: 'Other Agricultural Inputs',
    slug: 'other-agricultural-inputs',
    description: 'Spares, tractor implements, sprayers, farm safety, and storage accessories.',
    icon: 'bi-tools',
    color: '#475569',
    subcategories: ['Knapsack Sprayers', 'Cultivator Shovel Blades', 'Nozzles & Pipes', 'Safety Gear']
  }
];

export const SEED_CROPS = [
  { slug: 'wheat', name: 'Wheat Seeds', hindiName: 'गेहूं के बीज', cropId: 'wheat', icon: 'bi-flower3' },
  { slug: 'mustard', name: 'Mustard Seeds', hindiName: 'सरसों के बीज', cropId: 'mustard', icon: 'bi-brightness-high' },
  { slug: 'cotton', name: 'Cotton Seeds', hindiName: 'कपास के बीज', cropId: 'cotton', icon: 'bi-cloud-sun' },
  { slug: 'maize', name: 'Maize Seeds', hindiName: 'मक्का के बीज', cropId: 'maize', icon: 'bi-grid-3x3-gap' },
  { slug: 'bajra', name: 'Bajra Seeds', hindiName: 'बाजरा के बीज', cropId: 'bajra', icon: 'bi-sun' },
  { slug: 'paddy', name: 'Paddy Seeds', hindiName: 'धान के बीज', cropId: 'paddy', icon: 'bi-water' },
  { slug: 'vegetables', name: 'Vegetable Seeds', hindiName: 'सब्जी के बीज', cropId: 'vegetables', icon: 'bi-basket' },
  { slug: 'fodder', name: 'Fodder Seeds', hindiName: 'चारा बीज', cropId: 'fodder', icon: 'bi-tree' },
  { slug: 'other', name: 'Other Crop Seeds', hindiName: 'अन्य फसल बीज', cropId: 'other-crops', icon: 'bi-layers' }
];

export function getCategoryBySlug(slug) {
  if (!slug) return null;
  const s = slug.toLowerCase().trim();
  return (
    CATEGORIES.find((c) => {
      if (c.slug === s) return true;
      if (s === 'other-inputs' && c.slug === 'other-agricultural-inputs') return true;
      if (s === 'other-agricultural-inputs' && c.slug === 'other-inputs') return true;
      return false;
    }) || null
  );
}

export const SEED_SUBCATEGORIES = [
  { name: 'Wheat Seeds', slug: 'wheat', subSlug: 'wheat', cropId: 'wheat', sampleCount: 'Demo catalog', icon: 'bi-flower3' },
  { name: 'Mustard Seeds', slug: 'mustard', subSlug: 'mustard', cropId: 'mustard', sampleCount: 'Demo catalog', icon: 'bi-brightness-high' },
  { name: 'Cotton Seeds', slug: 'cotton', subSlug: 'cotton', cropId: 'cotton', sampleCount: 'Available upon inquiry', icon: 'bi-cloud-sun' },
  { name: 'Maize Seeds', slug: 'maize', subSlug: 'maize', cropId: 'maize', sampleCount: 'Available upon inquiry', icon: 'bi-grid-3x3-gap' },
  { name: 'Bajra Seeds', slug: 'bajra', subSlug: 'bajra', cropId: 'bajra', sampleCount: 'Demo catalog', icon: 'bi-sun' },
  { name: 'Paddy Seeds', slug: 'paddy', subSlug: 'paddy', cropId: 'paddy', sampleCount: 'Available upon inquiry', icon: 'bi-water' },
  { name: 'Vegetable Seeds', slug: 'vegetables', subSlug: 'vegetables', cropId: 'vegetables', sampleCount: 'Demo catalog', icon: 'bi-basket' },
  { name: 'Fodder Seeds', slug: 'fodder', subSlug: 'fodder', cropId: 'fodder', sampleCount: 'Available upon inquiry', icon: 'bi-tree' },
  { name: 'Other Crop Seeds', slug: 'other', subSlug: 'other', cropId: 'other-crops', sampleCount: 'Available upon inquiry', icon: 'bi-layers' }
];

export const FERTILIZER_SUBCATEGORIES = [
  { name: 'Urea', slug: 'urea', sampleCount: 'Government-regulated pricing', icon: 'bi-capsule' },
  { name: 'DAP', slug: 'dap', sampleCount: 'Wholesale inquiry', icon: 'bi-box-seam' },
  { name: 'NPK Fertilizers', slug: 'npk-fertilizers', sampleCount: 'Demo catalog', icon: 'bi-diagram-3' },
  { name: 'Water-Soluble Fertilizers', slug: 'water-soluble-fertilizers', sampleCount: 'Demo catalog', icon: 'bi-droplet-half' },
  { name: 'Micronutrient Fertilizers', slug: 'micronutrient-fertilizers', sampleCount: 'Demo catalog', icon: 'bi-shield-check' },
  { name: 'Specialty Fertilizers', slug: 'specialty-fertilizers', sampleCount: 'Available upon inquiry', icon: 'bi-stars' },
  { name: 'Other Fertilizers', slug: 'other-fertilizers', sampleCount: 'Available upon inquiry', icon: 'bi-layers-half' }
];

export const CROPS = [
  {
    id: 'wheat',
    name: 'Wheat',
    hindiName: 'गेहूं',
    season: 'Rabi',
    icon: 'bi-flower3',
    description: 'Major cereal staple grown extensively across Tonk and Rajasthan basin.'
  },
  {
    id: 'mustard',
    name: 'Mustard',
    hindiName: 'सरसों',
    season: 'Rabi',
    icon: 'bi-brightness-high',
    description: 'Primary commercial oilseed crop in Tonk district with high regional demand.'
  },
  {
    id: 'cotton',
    name: 'Cotton',
    hindiName: 'कपास',
    season: 'Kharif',
    icon: 'bi-cloud-sun',
    description: 'Commercial cash crop requiring structured pest and nutrient management.'
  },
  {
    id: 'maize',
    name: 'Maize',
    hindiName: 'मक्का',
    season: 'Kharif',
    icon: 'bi-grid-3x3-gap',
    description: 'Coarse grain cultivated for food, feed, and starch across regional farms.'
  },
  {
    id: 'bajra',
    name: 'Bajra',
    hindiName: 'बाजरा',
    season: 'Kharif',
    icon: 'bi-sun',
    description: 'Drought-tolerant pearl millet essential to Rajasthan agriculture.'
  },
  {
    id: 'paddy',
    name: 'Paddy',
    hindiName: 'धान',
    season: 'Kharif',
    icon: 'bi-water',
    description: 'Grown in canal-irrigated zones requiring precise weed and stem protection.'
  },
  {
    id: 'vegetables',
    name: 'Vegetables',
    hindiName: 'सब्जियां',
    season: 'All Seasons',
    icon: 'bi-basket',
    description: 'Intensive horticultural crops (chillies, tomato, gourds, onion).'
  },
  {
    id: 'other-crops',
    name: 'Other Crops',
    hindiName: 'अन्य फसलें',
    season: 'Various',
    icon: 'bi-layers',
    description: 'Pulses (Gram, Moong, Urad), spices, and regional oilseeds.'
  }
];

export const DEMO_PRODUCTS = [
  {
    id: 1,
    sku: 'PRD-SEED-101',
    name: 'Hybrid Mustard Seeds (Grade 59 Focus)',
    category: 'Seeds',
    subcategory: 'Mustard Seeds',
    brand: '[Authorized Seed Partner Placeholder]',
    packSize: '1 KG Packet',
    price: 980.00,
    priceType: 'configured', // 'configured' or 'quote_only'
    isDemoPrice: true,
    availability: 'In Stock (Tonk Yard)',
    isAvailable: true,
    crops: ['mustard'],
    seasonal: true,
    seasonTag: 'Rabi Sowing Season',
    firmCode: 'VKBB',
    firmName: 'Vinay Khad Beej Bhandaar',
    description: 'Demonstration catalog entry representing high-oil yield hybrid certified seeds packaged for semi-arid sowing.',
    imagePlaceholderBg: '#fef3c7',
    imageCategory: 'seed'
  },
  {
    id: 2,
    sku: 'PRD-NUT-201',
    name: 'Chelated Zinc 12% (EDTA Micro-Nutrient)',
    category: 'Micronutrients',
    subcategory: 'Micronutrient Fertilizers',
    brand: '[Agri Nutrition Partner Placeholder]',
    packSize: '500 Gram Pouch',
    price: 460.00,
    priceType: 'configured',
    isDemoPrice: true,
    availability: 'In Stock (Tonk Mandi)',
    isAvailable: true,
    crops: ['wheat', 'paddy', 'mustard'],
    seasonal: true,
    seasonTag: 'Rabi Sowing Season',
    firmCode: 'VAI',
    firmName: 'Vinay Agri Inputs',
    description: '100% water-soluble chelated zinc for foliar correction of zinc deficiency in field crops.',
    imagePlaceholderBg: '#dcfce7',
    imageCategory: 'nutrient'
  },
  {
    id: 3,
    sku: 'PRD-INS-301',
    name: 'Systemic Insecticide (Chlorpyrifos 20% EC)',
    category: 'Insecticides',
    subcategory: 'Systemic Insecticides',
    brand: '[Crop Protection Partner Placeholder]',
    packSize: '1 Litre Can',
    price: 680.00,
    priceType: 'configured',
    isDemoPrice: true,
    availability: 'In Stock (Central Store)',
    isAvailable: true,
    crops: ['cotton', 'wheat', 'vegetables'],
    seasonal: false,
    firmCode: 'VAI',
    firmName: 'Vinay Agri Inputs',
    description: 'Broad-spectrum emulsifiable concentrate for soil and foliar management of termite and stem borers.',
    imagePlaceholderBg: '#fee2e2',
    imageCategory: 'pesticide'
  },
  {
    id: 4,
    sku: 'PRD-FERT-401',
    name: 'Water Soluble NPK 19-19-19 (Foliar Grade)',
    category: 'Fertilizers',
    subcategory: 'Water-Soluble Fertilizers',
    brand: '[Fertilizer Partner Placeholder]',
    packSize: '1 KG Pack',
    price: 240.00,
    priceType: 'configured',
    isDemoPrice: true,
    availability: 'In Stock',
    isAvailable: true,
    crops: ['wheat', 'vegetables', 'cotton'],
    seasonal: true,
    seasonTag: 'Vegetative Growth Phase',
    firmCode: 'VKBB',
    firmName: 'Vinay Khad Beej Bhandaar',
    description: 'Balanced 1:1:1 nitrogen, phosphorus, and potassium supplement for drip irrigation and foliar sprays.',
    imagePlaceholderBg: '#e0e7ff',
    imageCategory: 'fertilizer'
  },
  {
    id: 5,
    sku: 'PRD-BULK-501',
    name: 'Di-Ammonium Phosphate (DAP 18-46-0)',
    category: 'Fertilizers',
    subcategory: 'DAP',
    brand: '[Institutional Fertilizer Supplier Placeholder]',
    packSize: '50 KG Bag',
    price: null,
    priceType: 'quote_only',
    isDemoPrice: false,
    availability: 'Available on Bulk Quotation',
    isAvailable: true,
    crops: ['wheat', 'mustard', 'paddy', 'maize'],
    seasonal: true,
    seasonTag: 'Basal Soil Application',
    firmCode: 'GTT',
    firmName: 'Gupta Traders, Tonk',
    description: 'Commercial wholesale fertilizer bags for cooperative supply and large acreage application. Subject to Mandi market quotes.',
    imagePlaceholderBg: '#f1f5f9',
    imageCategory: 'bulk'
  },
  {
    id: 6,
    sku: 'PRD-PGR-601',
    name: 'Gibberellic Acid 0.001% L (Bio Growth Stimulant)',
    category: 'Plant Growth Regulators',
    subcategory: 'Gibberellic Acid Formulations',
    brand: '[Bio Agtech Partner Placeholder]',
    packSize: '500 ML Bottle',
    price: 380.00,
    priceType: 'configured',
    isDemoPrice: true,
    availability: 'In Stock',
    isAvailable: true,
    crops: ['cotton', 'vegetables', 'paddy'],
    seasonal: false,
    firmCode: 'VAI',
    firmName: 'Vinay Agri Inputs',
    description: 'Promotes rapid internodal elongation, cell multiplication, and enhances flower retention.',
    imagePlaceholderBg: '#fef9c3',
    imageCategory: 'growth'
  },
  {
    id: 7,
    sku: 'PRD-AUTO-701',
    name: 'Heavy Duty Cultivator Tine Shovels (9-Piece Set)',
    category: 'Other Agricultural Inputs',
    subcategory: 'Cultivator Shovel Blades',
    brand: '[Agricultural Implement Spares Placeholder]',
    packSize: 'Box of 9 Units',
    price: 2450.00,
    priceType: 'configured',
    isDemoPrice: true,
    availability: 'In Stock (Old Bus Stand Road)',
    isAvailable: true,
    crops: ['other-crops'],
    seasonal: false,
    firmCode: 'GTAA',
    firmName: 'Gupta Traders and Auto Agencies',
    description: 'Carbon-tempered steel cultivator reversible shovels engineered for rugged soil tillage.',
    imagePlaceholderBg: '#f1f5f9',
    imageCategory: 'tools'
  },
  {
    id: 8,
    sku: 'PRD-FUNG-801',
    name: 'Mancozeb 75% WP (Contact Antifungal Powder)',
    category: 'Fungicides',
    subcategory: 'Contact Fungicides',
    brand: '[Crop Science Partner Placeholder]',
    packSize: '500 Gram Packet',
    price: 340.00,
    priceType: 'configured',
    isDemoPrice: true,
    availability: 'In Stock',
    isAvailable: true,
    crops: ['mustard', 'wheat', 'vegetables'],
    seasonal: true,
    seasonTag: 'Rabi Disease Protection',
    firmCode: 'VAI',
    firmName: 'Vinay Agri Inputs',
    description: 'Broad-spectrum contact fungicide formulated to prevent early and late blight, leaf spots, and rust.',
    imagePlaceholderBg: '#ecfdf5',
    imageCategory: 'pesticide'
  },
  {
    id: 9,
    sku: 'PRD-SEED-102',
    name: 'Certified Hybrid Wheat Seeds (Sharbati High-Yield)',
    category: 'Seeds',
    subcategory: 'Wheat Seeds',
    brand: '[National Seed Corporation Placeholder]',
    packSize: '40 KG Bag',
    price: 1350.00,
    priceType: 'configured',
    isDemoPrice: true,
    availability: 'In Stock (Tonk Yard)',
    isAvailable: true,
    crops: ['wheat'],
    seasonal: true,
    seasonTag: 'Rabi Sowing Season',
    firmCode: 'VKBB',
    firmName: 'Vinay Khad Beej Bhandaar',
    description: 'Certified high-germination wheat seeds optimized for irrigated acreage in Tonk and Rajasthan basin.',
    imagePlaceholderBg: '#fef3c7',
    imageCategory: 'seed'
  },
  {
    id: 10,
    sku: 'PRD-SEED-103',
    name: 'Hybrid Bajra / Pearl Millet Seeds (Drought-Tolerant)',
    category: 'Seeds',
    subcategory: 'Bajra Seeds',
    brand: '[Regional Seed Corporation Placeholder]',
    packSize: '1.5 KG Pouch',
    price: 520.00,
    priceType: 'configured',
    isDemoPrice: true,
    availability: 'In Stock',
    isAvailable: true,
    crops: ['bajra'],
    seasonal: false,
    firmCode: 'VKBB',
    firmName: 'Vinay Khad Beej Bhandaar',
    description: 'High-tillering pearl millet hybrid seeds engineered for arid and semi-arid tracts of Rajasthan.',
    imagePlaceholderBg: '#fef3c7',
    imageCategory: 'seed'
  },
  {
    id: 11,
    sku: 'PRD-SEED-104',
    name: 'Hybrid Vegetable Seeds Kit (Tomato & Chilli Focus)',
    category: 'Seeds',
    subcategory: 'Vegetable Seeds',
    brand: '[Horticultural Seed Partner Placeholder]',
    packSize: 'Multi-Pack (100g each)',
    price: 360.00,
    priceType: 'configured',
    isDemoPrice: true,
    availability: 'In Stock (Central Store)',
    isAvailable: true,
    crops: ['vegetables'],
    seasonal: false,
    firmCode: 'VKBB',
    firmName: 'Vinay Khad Beej Bhandaar',
    description: 'Treated disease-resistant vegetable seeds with exceptional germination vitality for kitchen gardens and commercial farming.',
    imagePlaceholderBg: '#fef3c7',
    imageCategory: 'seed'
  },
  {
    id: 12,
    sku: 'PRD-HERB-701',
    name: 'Selective Wheat Herbicide (Clodinafop-Propargyl 15% WP)',
    category: 'Herbicides',
    subcategory: 'Post-Emergence Herbicides',
    brand: '[Weed Control Science Placeholder]',
    packSize: '160 Gram Pack',
    price: 490.00,
    priceType: 'configured',
    isDemoPrice: true,
    availability: 'In Stock (Central Store)',
    isAvailable: true,
    crops: ['wheat'],
    seasonal: true,
    seasonTag: 'Rabi Weed Management',
    firmCode: 'VAI',
    firmName: 'Vinay Agri Inputs',
    description: 'Selective post-emergence herbicide for eradication of Phalaris minor (Gulli Danda) and wild oats in wheat.',
    imagePlaceholderBg: '#f3e8ff',
    imageCategory: 'pesticide'
  },
  {
    id: 13,
    sku: 'PRD-HERB-702',
    name: 'Pre-Emergence Herbicide (Pendimethalin 30% EC)',
    category: 'Herbicides',
    subcategory: 'Pre-Emergence Herbicides',
    brand: '[Crop Science Partner Placeholder]',
    packSize: '1 Litre Bottle',
    price: 740.00,
    priceType: 'configured',
    isDemoPrice: true,
    availability: 'In Stock',
    isAvailable: true,
    crops: ['mustard', 'cotton', 'vegetables'],
    seasonal: true,
    firmCode: 'VAI',
    firmName: 'Vinay Agri Inputs',
    description: 'Residual pre-emergence soil spray preventing annual grasses and broadleaf weeds in oilseeds and pulses.',
    imagePlaceholderBg: '#f3e8ff',
    imageCategory: 'pesticide'
  },
  {
    id: 14,
    sku: 'PRD-NUT-801',
    name: 'Bio-Stimulant Humic & Fulvic Acid Concentrate (12% Liquid)',
    category: 'Plant Nutrition',
    subcategory: 'Humic Acid',
    brand: '[Bio Agtech Partner Placeholder]',
    packSize: '1 Litre Bottle',
    price: 420.00,
    priceType: 'configured',
    isDemoPrice: true,
    availability: 'In Stock (Tonk Mandi)',
    isAvailable: true,
    crops: ['wheat', 'mustard', 'vegetables'],
    seasonal: false,
    firmCode: 'VAI',
    firmName: 'Vinay Agri Inputs',
    description: 'Enriches soil cation exchange capacity, enhances root proliferation, and accelerates nutrient absorption.',
    imagePlaceholderBg: '#ccfbf1',
    imageCategory: 'nutrient'
  },
  {
    id: 15,
    sku: 'PRD-NUT-802',
    name: 'Cold-Pressed Seaweed Extract (Bio-Active Plant Tonic)',
    category: 'Plant Nutrition',
    subcategory: 'Seaweed Extract',
    brand: '[Agri Nutrition Partner Placeholder]',
    packSize: '500 ML Bottle',
    price: 580.00,
    priceType: 'configured',
    isDemoPrice: true,
    availability: 'In Stock',
    isAvailable: true,
    crops: ['wheat', 'cotton', 'vegetables'],
    seasonal: false,
    firmCode: 'VAI',
    firmName: 'Vinay Agri Inputs',
    description: 'Natural phytohormone rich organic sea-kelp extract offering stress resistance and heavy flowering.',
    imagePlaceholderBg: '#ccfbf1',
    imageCategory: 'nutrient'
  },
  {
    id: 16,
    sku: 'PRD-FERT-402',
    name: 'Neem Coated Agricultural Urea (46% Nitrogen)',
    category: 'Fertilizers',
    subcategory: 'Urea',
    brand: '[Institutional Fertilizer Supplier Placeholder]',
    packSize: '45 KG Bag',
    price: null,
    priceType: 'quote_only',
    isDemoPrice: false,
    availability: 'Available on Bulk Quotation',
    isAvailable: true,
    crops: ['wheat', 'mustard', 'paddy', 'maize'],
    seasonal: true,
    seasonTag: 'Basal & Top Dressing',
    firmCode: 'VKBB',
    firmName: 'Vinay Khad Beej Bhandaar',
    description: 'Regulated statutory fertilizer formulation for top-dressing nitrogen nourishment across Tonk crop basins.',
    imagePlaceholderBg: '#e0e7ff',
    imageCategory: 'bulk'
  },
  {
    id: 17,
    sku: 'PRD-AUTO-702',
    name: 'Manual Knapsack Backpack Sprayer (16 Litre Tank)',
    category: 'Other Agricultural Inputs',
    subcategory: 'Knapsack Sprayers',
    brand: '[Farm Equipment Partner Placeholder]',
    packSize: '1 Complete Unit',
    price: 1850.00,
    priceType: 'configured',
    isDemoPrice: true,
    availability: 'In Stock (Old Bus Stand Road)',
    isAvailable: true,
    crops: ['wheat', 'mustard', 'cotton', 'vegetables'],
    seasonal: false,
    firmCode: 'GTAA',
    firmName: 'Gupta Traders and Auto Agencies',
    description: 'Ergonomic high-density polyethylene sprayer with brass lance and multiple nozzle attachments for field pesticide application.',
    imagePlaceholderBg: '#f1f5f9',
    imageCategory: 'tools'
  },
  {
    id: 18,
    sku: 'PRD-NUT-202',
    name: 'Disodium Octaborate Tetrahydrate (Boron 20%)',
    category: 'Micronutrients',
    subcategory: 'Boron 20%',
    brand: '[Agri Nutrition Partner Placeholder]',
    packSize: '250 Gram Pouch',
    price: 310.00,
    priceType: 'configured',
    isDemoPrice: true,
    availability: 'In Stock',
    isAvailable: true,
    crops: ['mustard', 'vegetables'],
    seasonal: true,
    firmCode: 'VAI',
    firmName: 'Vinay Agri Inputs',
    description: '100% water-soluble foliar grade boron essential for pollen tube development and seed setting in mustard.',
    imagePlaceholderBg: '#dcfce7',
    imageCategory: 'nutrient'
  }
];

export const FAMILY_FIRMS = [
  {
    code: 'VAI',
    name: 'Vinay Agri Inputs',
    operatingRole: 'Flagship Agri-Inputs & Plant Protection Hub',
    location: 'Station Road, Near Krishi Upaj Mandi, Tonk, Rajasthan 304001',
    primarySpecialty: 'Crop protection, bio-fertilizers, technical foliar nutrition, and field spray solutions.',
    contactPlaceholder: 'Official agency contact and billing desk [Tonk Branch]',
    badgeStyle: 'firm-badge-vai'
  },
  {
    code: 'GTAA',
    name: 'Gupta Traders and Auto Agencies',
    operatingRole: 'Tractor Implements & Automotive Dealership Agency',
    location: 'Old Bus Stand Road, Tonk, Rajasthan 304001',
    primarySpecialty: 'Tractor attachments, tillage implement spares, diesel pump accessories, and mechanical farm tools.',
    contactPlaceholder: 'Commercial spares counter [Tonk Branch]',
    badgeStyle: 'firm-badge-gtaa'
  },
  {
    code: 'VKBB',
    name: 'Vinay Khad Beej Bhandaar',
    operatingRole: 'Certified Seeds & Retail Fertilizer Depot',
    location: 'Subhash Chowk, Grain Market, Tonk, Rajasthan 304001',
    primarySpecialty: 'Certified high-yield seed varieties, regulated chemical fertilizers, and foundational soil nutrition.',
    contactPlaceholder: 'Seed and fertilizer booking desk [Tonk Branch]',
    badgeStyle: 'firm-badge-vkbb'
  },
  {
    code: 'GTT',
    name: 'Gupta Traders, Tonk',
    operatingRole: 'Agricultural Trading & Institutional Bulk Distribution',
    location: 'Mandi Samiti Complex, Tonk, Rajasthan 304001',
    primarySpecialty: 'Commercial bulk commodities distribution, cooperative supply orders, and Mandi trading.',
    contactPlaceholder: 'Institutional trading and bulk desk [Tonk Branch]',
    badgeStyle: 'firm-badge-gtt'
  }
];

export const BRAND_PLACEHOLDERS = [
  { id: 'b1', name: 'National Fertilizer Agency [Placeholder]', category: 'Fertilizers & Urea', status: 'Verification Pending' },
  { id: 'b2', name: 'Certified Seed Hybrid Corporation [Placeholder]', category: 'Cereals & Oilseeds', status: 'Verification Pending' },
  { id: 'b3', name: 'Crop Protection Science Partner [Placeholder]', category: 'Insecticides & Fungicides', status: 'Verification Pending' },
  { id: 'b4', name: 'Bio-Nutrient Research Lab [Placeholder]', category: 'Plant Growth Regulators', status: 'Verification Pending' },
  { id: 'b5', name: 'Tractor & Implement Spares Agency [Placeholder]', category: 'Farm Implements', status: 'Verification Pending' }
];
