const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sharp = require('sharp');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Enhanced product database with comprehensive features
const products = [
    // ==================== ELECTRONICS ====================
    {
        id: "1",
        name: "Wireless Bluetooth Headphones",
        category: "electronics",
        price: 79.99,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
        description: "Noise-cancelling wireless headphones with premium sound quality",
        labels: ["headphones", "electronics", "audio", "music", "wireless", "bluetooth", "sound", "headset", "earphones", "audio equipment"],
        features: ["black", "over-ear", "cushioned", "adjustable", "foldable", "noise-cancelling"],
        colorProfile: "dark",
        material: ["plastic", "metal"],
        shape: "over-ear",
        keywords: ["audio", "music", "wireless", "headphones", "bluetooth", "sound"]
    },
    {
        id: "2",
        name: "Modern Smartphone",
        category: "electronics",
        price: 699.99,
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
        description: "Latest smartphone with advanced camera and performance",
        labels: ["smartphone", "phone", "electronics", "mobile", "technology", "device", "communication", "mobile phone"],
        features: ["black", "touchscreen", "camera", "sleek", "modern", "high-resolution"],
        colorProfile: "dark",
        material: ["glass", "metal"],
        shape: "rectangle",
        keywords: ["smartphone", "mobile", "technology", "camera", "communication"]
    },
    {
        id: "3",
        name: "Silver Laptop Computer",
        category: "electronics",
        price: 999.99,
        imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
        description: "High-performance laptop for work and gaming",
        labels: ["laptop", "computer", "electronics", "technology", "notebook", "portable", "device"],
        features: ["silver", "slim", "lightweight", "powerful", "portable"],
        colorProfile: "silver",
        material: ["metal", "plastic"],
        shape: "laptop",
        keywords: ["laptop", "computer", "technology", "portable", "work"]
    },
    {
        id: "4",
        name: "Smart Watch - Black",
        category: "electronics",
        price: 199.99,
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
        description: "Fitness tracking smartwatch with heart rate monitor",
        labels: ["smartwatch", "watch", "electronics", "fitness", "wearable", "technology"],
        features: ["black", "digital", "fitness", "tracking", "water-resistant"],
        colorProfile: "dark",
        material: ["metal", "glass"],
        shape: "round",
        keywords: ["smartwatch", "fitness", "wearable", "technology", "tracking"]
    },
    {
        id: "5",
        name: "Wireless Earbuds - White",
        category: "electronics",
        price: 149.99,
        imageUrl: "https://images.unsplash.com/photo-1590658165737-15a047b8b5e3?w=400&h=400&fit=crop",
        description: "True wireless earbuds with charging case and noise cancellation",
        labels: ["earbuds", "wireless", "audio", "electronics", "music", "bluetooth"],
        features: ["white", "wireless", "compact", "noise-cancelling", "portable"],
        colorProfile: "white",
        material: ["plastic", "silicon"],
        shape: "earbuds",
        keywords: ["earbuds", "wireless", "audio", "music", "bluetooth"]
    },
    {
        id: "6",
        name: "Gaming Console",
        category: "electronics",
        price: 499.99,
        imageUrl: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop",
        description: "Next-generation gaming console with 4K gaming",
        labels: ["gaming", "console", "electronics", "entertainment", "4k", "gaming console"],
        features: ["black", "wireless", "4k", "gaming", "entertainment", "powerful"],
        colorProfile: "dark",
        material: ["plastic", "metal"],
        shape: "console",
        keywords: ["gaming", "console", "entertainment", "4k", "games"]
    },

    // ==================== FOOTWEAR ====================
    {
        id: "7",
        name: "Running Shoes - Blue & White",
        category: "footwear",
        price: 129.99,
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
        description: "Lightweight running shoes with advanced cushioning",
        labels: ["shoes", "sneakers", "footwear", "running", "sports", "athletic", "training"],
        features: ["blue", "white", "cushioned", "lightweight", "breathable", "comfortable"],
        colorProfile: "blue-white",
        material: ["mesh", "rubber", "foam"],
        shape: "sneaker",
        keywords: ["running", "sports", "shoes", "athletic", "training"]
    },
    {
        id: "8",
        name: "Leather Dress Shoes - Brown",
        category: "footwear",
        price: 149.99,
        imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop",
        description: "Classic leather dress shoes for formal occasions",
        labels: ["shoes", "dress shoes", "footwear", "leather", "formal", "business"],
        features: ["brown", "leather", "formal", "comfortable", "classic"],
        colorProfile: "brown",
        material: ["leather", "rubber"],
        shape: "dress-shoe",
        keywords: ["dress", "formal", "leather", "shoes", "business"]
    },
    {
        id: "9",
        name: "Basketball Shoes - Red & Black",
        category: "footwear",
        price: 139.99,
        imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
        description: "High-performance basketball shoes with ankle support",
        labels: ["basketball", "shoes", "sneakers", "sports", "athletic", "footwear"],
        features: ["red", "black", "high-top", "cushioned", "supportive"],
        colorProfile: "red-black",
        material: ["leather", "rubber", "mesh"],
        shape: "high-top",
        keywords: ["basketball", "sports", "shoes", "athletic", "basketball shoes"]
    },
    {
        id: "10",
        name: "Hiking Boots - Brown",
        category: "footwear",
        price: 179.99,
        imageUrl: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5b?w=400&h=400&fit=crop",
        description: "Durable hiking boots for outdoor adventures",
        labels: ["boots", "hiking", "footwear", "outdoor", "adventure", "waterproof"],
        features: ["brown", "waterproof", "durable", "outdoor", "comfortable"],
        colorProfile: "brown",
        material: ["leather", "rubber", "fabric"],
        shape: "boots",
        keywords: ["hiking", "boots", "outdoor", "adventure", "waterproof"]
    },

    // ==================== CLOTHING ====================
    {
        id: "11",
        name: "Brown Leather Jacket",
        category: "clothing",
        price: 199.99,
        imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
        description: "Genuine leather jacket with classic design",
        labels: ["jacket", "leather jacket", "clothing", "fashion", "outerwear", "leather"],
        features: ["brown", "leather", "classic", "warm", "stylish"],
        colorProfile: "brown",
        material: ["leather"],
        shape: "jacket",
        keywords: ["leather", "jacket", "fashion", "outerwear", "classic"]
    },
    {
        id: "12",
        name: "Denim Jeans - Blue",
        category: "clothing",
        price: 59.99,
        imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
        description: "Comfortable blue denim jeans for everyday wear",
        labels: ["jeans", "denim", "clothing", "pants", "casual", "fashion"],
        features: ["blue", "denim", "comfortable", "casual", "durable"],
        colorProfile: "blue",
        material: ["denim", "cotton"],
        shape: "pants",
        keywords: ["jeans", "denim", "casual", "clothing", "pants"]
    },
    {
        id: "13",
        name: "Cotton T-Shirt - White",
        category: "clothing",
        price: 24.99,
        imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
        description: "100% cotton comfortable t-shirt for daily wear",
        labels: ["tshirt", "clothing", "cotton", "casual", "fashion", "basic"],
        features: ["white", "cotton", "casual", "comfortable", "basic"],
        colorProfile: "white",
        material: ["cotton"],
        shape: "tshirt",
        keywords: ["tshirt", "cotton", "casual", "clothing", "basic"]
    },
    {
        id: "14",
        name: "Winter Jacket - Black",
        category: "clothing",
        price: 129.99,
        imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
        description: "Warm winter jacket for cold weather",
        labels: ["jacket", "winter", "clothing", "outerwear", "warm", "fashion"],
        features: ["black", "warm", "water-resistant", "hooded", "comfortable"],
        colorProfile: "dark",
        material: ["polyester", "cotton"],
        shape: "jacket",
        keywords: ["winter", "jacket", "warm", "outerwear", "cold weather"]
    },
    {
        id: "15",
        name: "Formal Shirt - White",
        category: "clothing",
        price: 49.99,
        imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop",
        description: "Classic formal shirt for business and formal occasions",
        labels: ["shirt", "formal", "clothing", "business", "dress shirt", "fashion"],
        features: ["white", "formal", "cotton", "classic", "business"],
        colorProfile: "white",
        material: ["cotton"],
        shape: "shirt",
        keywords: ["formal", "shirt", "business", "dress", "clothing"]
    },

    // ==================== HOME & KITCHEN ====================
    {
        id: "16",
        name: "Coffee Maker Machine",
        category: "home",
        price: 89.99,
        imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop",
        description: "Automatic drip coffee maker with programmable timer",
        labels: ["coffee maker", "appliance", "kitchen", "beverage", "home", "coffee"],
        features: ["silver", "automatic", "programmable", "drip", "kitchen"],
        colorProfile: "silver",
        material: ["plastic", "metal"],
        shape: "appliance",
        keywords: ["coffee", "maker", "kitchen", "appliance", "beverage"]
    },
    {
        id: "17",
        name: "Blender - Stainless Steel",
        category: "home",
        price: 69.99,
        imageUrl: "https://images.unsplash.com/photo-1571354199763-4c62c2bb4b9a?w=400&h=400&fit=crop",
        description: "High-speed blender for smoothies and food processing",
        labels: ["blender", "appliance", "kitchen", "food", "smoothie", "home"],
        features: ["stainless steel", "powerful", "multifunctional", "kitchen"],
        colorProfile: "silver",
        material: ["stainless steel", "plastic"],
        shape: "blender",
        keywords: ["blender", "kitchen", "appliance", "smoothie", "food"]
    },
    {
        id: "18",
        name: "Toaster - 4 Slice",
        category: "home",
        price: 39.99,
        imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop",
        description: "4-slice toaster with multiple browning settings",
        labels: ["toaster", "appliance", "kitchen", "breakfast", "home", "toast"],
        features: ["silver", "4-slice", "adjustable", "kitchen", "breakfast"],
        colorProfile: "silver",
        material: ["metal", "plastic"],
        shape: "toaster",
        keywords: ["toaster", "kitchen", "appliance", "breakfast", "toast"]
    },
    {
        id: "19",
        name: "Desk Lamp - Modern",
        category: "home",
        price: 34.99,
        imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
        description: "Modern LED desk lamp with adjustable brightness",
        labels: ["lamp", "desk", "lighting", "home", "office", "LED"],
        features: ["black", "adjustable", "LED", "modern", "desk"],
        colorProfile: "dark",
        material: ["metal", "plastic"],
        shape: "lamp",
        keywords: ["lamp", "desk", "lighting", "LED", "office"]
    },
    {
        id: "20",
        name: "Office Chair - Ergonomic",
        category: "home",
        price: 199.99,
        imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop",
        description: "Ergonomic office chair with lumbar support",
        labels: ["chair", "office", "furniture", "ergonomic", "home", "work"],
        features: ["black", "ergonomic", "adjustable", "comfortable", "office"],
        colorProfile: "dark",
        material: ["fabric", "metal", "plastic"],
        shape: "chair",
        keywords: ["chair", "office", "ergonomic", "furniture", "work"]
    },

    // ==================== SPORTS & FITNESS ====================
    {
        id: "21",
        name: "Yoga Mat - Purple",
        category: "sports",
        price: 29.99,
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
        description: "Non-slip yoga mat for exercise and meditation",
        labels: ["yoga mat", "sports", "fitness", "exercise", "yoga", "workout"],
        features: ["purple", "non-slip", "cushioned", "exercise", "fitness"],
        colorProfile: "purple",
        material: ["rubber", "PVC"],
        shape: "mat",
        keywords: ["yoga", "mat", "fitness", "exercise", "workout"]
    },
    {
        id: "22",
        name: "Dumbbell Set - 20kg",
        category: "sports",
        price: 79.99,
        imageUrl: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&h=400&fit=crop",
        description: "Adjustable dumbbell set for home workouts",
        labels: ["dumbbell", "weights", "fitness", "exercise", "sports", "workout"],
        features: ["black", "adjustable", "weights", "exercise", "fitness"],
        colorProfile: "dark",
        material: ["metal", "rubber"],
        shape: "dumbbell",
        keywords: ["dumbbell", "weights", "fitness", "exercise", "workout"]
    },
    {
        id: "23",
        name: "Basketball",
        category: "sports",
        price: 24.99,
        imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=400&fit=crop",
        description: "Official size basketball for indoor and outdoor play",
        labels: ["basketball", "sports", "ball", "game", "outdoor", "indoor"],
        features: ["orange", "rubber", "bounce", "sports", "game"],
        colorProfile: "orange",
        material: ["rubber"],
        shape: "ball",
        keywords: ["basketball", "sports", "ball", "game", "outdoor"]
    },

    // ==================== ACCESSORIES ====================
    {
        id: "24",
        name: "Leather Wallet - Brown",
        category: "accessories",
        price: 45.99,
        imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop",
        description: "Genuine leather wallet with multiple card slots",
        labels: ["wallet", "leather", "accessories", "fashion", "money", "cards"],
        features: ["brown", "leather", "compact", "multiple slots", "fashion"],
        colorProfile: "brown",
        material: ["leather"],
        shape: "wallet",
        keywords: ["wallet", "leather", "accessories", "money", "cards"]
    },
    {
        id: "25",
        name: "Sunglasses - Aviator",
        category: "accessories",
        price: 89.99,
        imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
        description: "Classic aviator sunglasses with UV protection",
        labels: ["sunglasses", "aviator", "accessories", "fashion", "eyewear", "sun"],
        features: ["gold", "black", "UV protection", "classic", "fashion"],
        colorProfile: "gold-black",
        material: ["metal", "glass"],
        shape: "sunglasses",
        keywords: ["sunglasses", "aviator", "accessories", "eyewear", "fashion"]
    }
];

// Enhanced mock image analysis with better detection
async function analyzeImage(imageBuffer) {
    try {
        // Get basic image information
        const metadata = await sharp(imageBuffer).metadata();
        
        // Generate mock analysis based on image characteristics
        const analysis = {
            labels: generateMockLabels(metadata),
            objects: generateMockObjects(metadata),
            colors: generateMockColors(metadata),
            imageInfo: {
                width: metadata.width,
                height: metadata.height,
                format: metadata.format,
                size: metadata.size
            }
        };

        console.log('📊 Enhanced mock analysis completed');
        return analysis;
    } catch (error) {
        console.error('Image analysis error:', error);
        return getFallbackAnalysis();
    }
}

// Generate realistic mock labels based on image characteristics
function generateMockLabels(metadata) {
    const allLabels = [
        // Electronics
        { description: "Electronics", score: 0.9, confidence: 90 },
        { description: "Gadget", score: 0.8, confidence: 80 },
        { description: "Device", score: 0.8, confidence: 80 },
        { description: "Technology", score: 0.7, confidence: 70 },
        
        // Clothing & Fashion
        { description: "Fashion", score: 0.8, confidence: 80 },
        { description: "Clothing", score: 0.8, confidence: 80 },
        { description: "Apparel", score: 0.7, confidence: 70 },
        { description: "Style", score: 0.6, confidence: 60 },
        
        // Footwear
        { description: "Footwear", score: 0.8, confidence: 80 },
        { description: "Shoes", score: 0.8, confidence: 80 },
        { description: "Sneakers", score: 0.7, confidence: 70 },
        
        // Home & Kitchen
        { description: "Home", score: 0.8, confidence: 80 },
        { description: "Kitchen", score: 0.8, confidence: 80 },
        { description: "Appliance", score: 0.7, confidence: 70 },
        
        // Sports
        { description: "Sports", score: 0.8, confidence: 80 },
        { description: "Fitness", score: 0.8, confidence: 80 },
        { description: "Exercise", score: 0.7, confidence: 70 },
        
        // Accessories
        { description: "Accessories", score: 0.8, confidence: 80 },
        { description: "Fashion", score: 0.7, confidence: 70 },
        
        // General
        { description: "Product", score: 0.9, confidence: 90 },
        { description: "Item", score: 0.8, confidence: 80 },
        { description: "Object", score: 0.7, confidence: 70 },
        { description: "Merchandise", score: 0.6, confidence: 60 }
    ];

    // Return a random selection of labels
    return allLabels
        .sort(() => Math.random() - 0.5)
        .slice(0, 8 + Math.floor(Math.random() * 4));
}

// Generate mock objects
function generateMockObjects(metadata) {
    const objects = [
        { name: "Product", score: 0.9, confidence: 90 },
        { name: "Item", score: 0.8, confidence: 80 },
        { name: "Merchandise", score: 0.7, confidence: 70 }
    ];

    return objects.slice(0, 2 + Math.floor(Math.random() * 2));
}

// Generate mock colors
function generateMockColors(metadata) {
    const colors = [
        { red: 50, green: 50, blue: 50, score: 0.8, hex: "#323232" },
        { red: 100, green: 100, blue: 100, score: 0.7, hex: "#646464" },
        { red: 200, green: 200, blue: 200, score: 0.6, hex: "#c8c8c8" },
        { red: 255, green: 255, blue: 255, score: 0.5, hex: "#ffffff" },
        { red: 0, green: 0, blue: 255, score: 0.4, hex: "#0000ff" },
        { red: 255, green: 0, blue: 0, score: 0.4, hex: "#ff0000" },
        { red: 0, green: 255, blue: 0, score: 0.4, hex: "#00ff00" }
    ];

    return colors.slice(0, 3 + Math.floor(Math.random() * 2));
}

// Fallback analysis
function getFallbackAnalysis() {
    return {
        labels: [
            { description: "Product", score: 0.8, confidence: 80 },
            { description: "Item", score: 0.7, confidence: 70 }
        ],
        objects: [
            { name: "Product", score: 0.7, confidence: 70 }
        ],
        colors: [
            { red: 128, green: 128, blue: 128, score: 0.8, hex: "#808080" }
        ]
    };
}

// Enhanced similarity calculation
function calculateSimilarityScore(queryFeatures, product) {
    let totalScore = 0;
    let weightSum = 0;

    // 1. Label matching (60% weight) - Most important
    if (queryFeatures.labels && queryFeatures.labels.length > 0) {
        const labelWeight = 0.6;
        weightSum += labelWeight;
        
        let labelScore = 0;
        let matches = 0;
        
        queryFeatures.labels.forEach(queryLabel => {
            // Check against product labels
            product.labels.forEach(productLabel => {
                const similarity = stringSimilarity(queryLabel.description.toLowerCase(), productLabel.toLowerCase());
                if (similarity > 0.5) { // Lower threshold for more matches
                    labelScore += queryLabel.score * similarity;
                    matches++;
                }
            });
            
            // Also check against product keywords
            product.keywords.forEach(keyword => {
                const similarity = stringSimilarity(queryLabel.description.toLowerCase(), keyword.toLowerCase());
                if (similarity > 0.5) {
                    labelScore += queryLabel.score * similarity;
                    matches++;
                }
            });
        });
        
        if (matches > 0) {
            totalScore += (labelScore / matches) * labelWeight;
        }
    }

    // 2. Feature matching (25% weight)
    const featureWeight = 0.25;
    weightSum += featureWeight;
    
    let featureScore = 0;
    if (queryFeatures.labels) {
        queryFeatures.labels.forEach(label => {
            product.features.forEach(feature => {
                if (stringSimilarity(label.description.toLowerCase(), feature.toLowerCase()) > 0.6) {
                    featureScore += label.score;
                }
            });
        });
    }
    
    totalScore += Math.min(featureScore, 1) * featureWeight;

    // 3. Category bonus (15% weight)
    const categoryWeight = 0.15;
    weightSum += categoryWeight;
    
    // Give bonus for matching categories
    let categoryScore = 0;
    if (queryFeatures.labels) {
        queryFeatures.labels.forEach(label => {
            if (stringSimilarity(label.description.toLowerCase(), product.category.toLowerCase()) > 0.7) {
                categoryScore += label.score;
            }
        });
    }
    
    totalScore += Math.min(categoryScore, 1) * categoryWeight;

    // Ensure minimum score for all products
    const baseScore = 0.1;
    return weightSum > 0 ? Math.max(baseScore, Math.min(totalScore / weightSum, 1)) : baseScore;
}

// Improved string similarity function
function stringSimilarity(str1, str2) {
    if (!str1 || !str2) return 0;
    
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    // Exact match
    if (longer === shorter) return 1.0;
    
    // Contains match (high similarity)
    if (longer.includes(shorter) || shorter.includes(longer)) return 0.9;
    
    // Common prefix/suffix
    if (longer.startsWith(shorter) || shorter.startsWith(longer)) return 0.8;
    
    // Word-based matching
    const words1 = str1.toLowerCase().split(/\s+/);
    const words2 = str2.toLowerCase().split(/\s+/);
    
    let maxWordSimilarity = 0;
    words1.forEach(word1 => {
        words2.forEach(word2 => {
            if (word1.length > 2 && word2.length > 2) {
                // Word contains another word
                if (word1.includes(word2) || word2.includes(word1)) {
                    maxWordSimilarity = Math.max(maxWordSimilarity, 0.8);
                }
                // Common prefixes
                else if (word1.substring(0, 3) === word2.substring(0, 3)) {
                    maxWordSimilarity = Math.max(maxWordSimilarity, 0.6);
                }
            }
        });
    });
    
    return maxWordSimilarity > 0 ? maxWordSimilarity : 0.3;
}

// ==================== ROUTES ====================

// Root API route
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Visual Product Matcher API',
        version: '1.0.0',
        endpoints: {
            health: 'GET /api/health',
            products: 'GET /api/products',
            search: 'POST /api/search',
            searchUrl: 'POST /api/search/url',
            productById: 'GET /api/products/:id',
            productsByCategory: 'GET /api/products/category/:category'
        },
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Enhanced Product Matcher API is running',
        products: products.length,
        categories: [...new Set(products.map(p => p.category))],
        timestamp: new Date().toISOString()
    });
});

// Get all products
app.get('/api/products', (req, res) => {
    const { category, limit } = req.query;
    
    let filteredProducts = products;
    
    // Filter by category if provided
    if (category && category !== 'all') {
        filteredProducts = products.filter(product => 
            product.category.toLowerCase() === category.toLowerCase()
        );
    }
    
    // Apply limit if provided
    if (limit) {
        filteredProducts = filteredProducts.slice(0, parseInt(limit));
    }

    res.json({
        success: true,
        data: filteredProducts,
        total: filteredProducts.length,
        categories: [...new Set(products.map(p => p.category))]
    });
});

// Search similar products with file upload
app.post('/api/search', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
        }

        console.log('🔍 Processing image search...');

        // Process image
        const processedImage = await sharp(req.file.buffer)
            .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 90 })
            .toBuffer();

        // Analyze image
        const queryFeatures = await analyzeImage(processedImage);

        console.log('📊 Enhanced analysis detected:', {
            labels: queryFeatures.labels.slice(0, 5).map(l => `${l.description} (${l.confidence}%)`),
            imageInfo: queryFeatures.imageInfo
        });

        // Calculate similarity for each product
        const productsWithSimilarity = products.map(product => {
            const similarity = calculateSimilarityScore(queryFeatures, product);
            const matchReasons = getMatchReasons(queryFeatures, product);
            
            return {
                ...product,
                similarity: Math.round(similarity * 100) / 100,
                matchReasons: matchReasons.slice(0, 3),
                matchScore: Math.round(similarity * 100)
            };
        });

        // Filter and sort results - show more products with lower threshold
        const filteredResults = productsWithSimilarity
            .filter(product => product.similarity > 0.15) // Lower threshold to show more results
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 15); // Show more results

        console.log(`✅ Found ${filteredResults.length} similar products`);

        res.json({
            success: true,
            data: filteredResults,
            analysis: {
                detectedLabels: queryFeatures.labels.slice(0, 10),
                detectedObjects: queryFeatures.objects.slice(0, 5),
                dominantColors: queryFeatures.colors.slice(0, 3),
                imageInfo: queryFeatures.imageInfo
            },
            total: filteredResults.length,
            message: `Found ${filteredResults.length} similar products using enhanced analysis`
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process image search',
            error: error.message
        });
    }
});

// Search similar products by URL
app.post('/api/search/url', async (req, res) => {
    try {
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: 'No image URL provided'
            });
        }

        console.log('🔍 Processing URL image search:', imageUrl);

        // Download image from URL
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error('Failed to download image from URL');
        }

        const imageBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(imageBuffer);

        // Process image
        const processedImage = await sharp(buffer)
            .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 90 })
            .toBuffer();

        // Analyze image
        const queryFeatures = await analyzeImage(processedImage);

        console.log('📊 URL analysis detected:', {
            labels: queryFeatures.labels.slice(0, 5).map(l => `${l.description} (${l.confidence}%)`),
            imageInfo: queryFeatures.imageInfo
        });

        // Calculate similarity for each product
        const productsWithSimilarity = products.map(product => {
            const similarity = calculateSimilarityScore(queryFeatures, product);
            const matchReasons = getMatchReasons(queryFeatures, product);
            
            return {
                ...product,
                similarity: Math.round(similarity * 100) / 100,
                matchReasons: matchReasons.slice(0, 3),
                matchScore: Math.round(similarity * 100)
            };
        });

        // Filter and sort results
        const filteredResults = productsWithSimilarity
            .filter(product => product.similarity > 0.15)
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 15);

        console.log(`✅ Found ${filteredResults.length} similar products from URL`);

        res.json({
            success: true,
            data: filteredResults,
            analysis: {
                detectedLabels: queryFeatures.labels.slice(0, 10),
                detectedObjects: queryFeatures.objects.slice(0, 5),
                dominantColors: queryFeatures.colors.slice(0, 3),
                imageInfo: queryFeatures.imageInfo,
                source: 'url'
            },
            total: filteredResults.length,
            message: `Found ${filteredResults.length} similar products from URL`
        });

    } catch (error) {
        console.error('URL search error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process image URL search',
            error: error.message
        });
    }
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }

    res.json({
        success: true,
        data: product
    });
});

// Get products by category
app.get('/api/products/category/:category', (req, res) => {
    const categoryProducts = products.filter(p => 
        p.category.toLowerCase() === req.params.category.toLowerCase()
    );

    res.json({
        success: true,
        data: categoryProducts,
        total: categoryProducts.length
    });
});

// Get match reasons
function getMatchReasons(queryFeatures, product) {
    const reasons = [];
    
    // Label matches
    queryFeatures.labels.forEach(label => {
        product.labels.forEach(productLabel => {
            if (stringSimilarity(label.description.toLowerCase(), productLabel.toLowerCase()) > 0.6) {
                reasons.push(`Label match: "${label.description}" → "${productLabel}"`);
            }
        });
    });

    // Feature matches
    queryFeatures.labels.forEach(label => {
        product.features.forEach(feature => {
            if (stringSimilarity(label.description.toLowerCase(), feature.toLowerCase()) > 0.7) {
                reasons.push(`Feature match: "${label.description}" → "${feature}"`);
            }
        });
    });

    // Category matches
    queryFeatures.labels.forEach(label => {
        if (stringSimilarity(label.description.toLowerCase(), product.category.toLowerCase()) > 0.7) {
            reasons.push(`Category match: "${label.description}" → "${product.category}"`);
        }
    });

    return reasons.length > 0 ? reasons : ['Product match based on general characteristics'];
}

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Please upload an image smaller than 10MB.'
            });
        }
    }
    res.status(500).json({
        success: false,
        message: error.message
    });
});

// Handle undefined routes
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.originalUrl}`,
        availableRoutes: [
            'GET /api',
            'GET /api/health',
            'GET /api/products',
            'POST /api/search',
            'POST /api/search/url',
            'GET /api/products/:id',
            'GET /api/products/category/:category'
        ]
    });
});

// Export for Vercel
module.exports = app;

// Only listen if not in Vercel environment (for local development)
  if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}