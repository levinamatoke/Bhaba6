// import dotenv from 'dotenv';
// dotenv.config();
// import express from 'express';
// import cors from 'cors';
// import { MeiliSearch } from 'meilisearch';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Initialize MeiliSearch client
// const client = new MeiliSearch({
//   host: process.env.MEILI_HOST,
//   apiKey: process.env.MEILI_API_KEY
// });

// function transformFirebaseUrlToImageKit(firebaseUrl) {
//   // Example firebaseUrl:
//   // https://firebasestorage.googleapis.com/v0/b/bhaba-store-c17ba.appspot.com/o/vendor_products%2FloDeKBfa4hYZWkxTmi1WOGtRq1G2%2F1000200368.jpg?alt=media&token=...

//   // Extract the path after '/o/' and decode the URL-encoded path
//   const urlObj = new URL(firebaseUrl);
//   const encodedPath = urlObj.pathname.split('/o/')[1]; // e.g. "vendor_products%2FloDeKBfa4hYZWkxTmi1WOGtRq1G2%2F1000200368.jpg"
//   if (!encodedPath) return firebaseUrl; // fallback

//   const decodedPath = decodeURIComponent(encodedPath); // e.g. "vendor_products/loDeKBfa4hYZWkxTmi1WOGtRq1G2/1000200368.jpg"

//   // Compose the new ImageKit URL with the root folder firebase_files
//   return `https://ik.imagekit.io/3n0rrhtkz/firebase_files/${decodedPath}`;
// }


// const index = client.index('vendor_store_data');

// app.use(cors());
// app.use(express.json());

// // Get all vendor stores
// app.get("/vendors", async (req, res) => {
//   try {
//     const searchResult = await index.search('', {
//       limit: 1000
//     });

//     // Extract unique vendors
//     const vendorsMap = new Map();
//     searchResult.hits.forEach(hit => {
//       if (!vendorsMap.has(hit.vendorId)) {
//         vendorsMap.set(hit.vendorId, {
//           id: hit.vendorId,
//           store_name: hit.vendor_name,
//           store_logo: hit.store_logo
//         });
//       }
//     });

//     const vendors = Array.from(vendorsMap.values());
//     res.json(vendors);
//   } catch (error) {
//     console.error("Error getting vendors:", error);
//     res.status(500).send("Server error");
//   }
// });

// // Get specific vendor store by ID
// app.get("/vendors/:vendorId", async (req, res) => {
//   try {
//     const { vendorId } = req.params;
//     const searchResult = await index.search('', {
//       limit: 1000
//     });
    
//     // Find vendor by ID
//     const vendor = searchResult.hits.find(hit => hit.vendorId === vendorId);
    
//     if (!vendor) {
//       return res.status(404).json({ error: "Vendor not found" });
//     }
    
//     res.json({
//       id: vendor.vendorId,
//       store_name: vendor.vendor_name,
//       store_logo: vendor.store_logo
//     });
//   } catch (error) {
//     console.error("Error getting vendor:", error);
//     res.status(500).send("Server error");
//   }
// });

// // Get categories for a specific vendor
// app.get("/vendors/:vendorId/categories", async (req, res) => {
//   try {
//     const { vendorId } = req.params;
//     const searchResult = await index.search('', {
//       limit: 1000
//     });
    
//     // Filter by vendorId and extract unique categories
//     const categoriesMap = new Map();
//     searchResult.hits.forEach(hit => {
//       if (hit.vendorId === vendorId && !categoriesMap.has(hit.categoryId)) {
//         categoriesMap.set(hit.categoryId, {
//           id: hit.categoryId,
//           category_name: hit.category_name
//         });
//       }
//     });

//     const categories = Array.from(categoriesMap.values());
//     res.json(categories);
//   } catch (error) {
//     console.error("Error getting categories:", error);
//     res.status(500).send("Server error");
//   }
// });

// // Get products for a specific vendor and category
// app.get("/vendors/:vendorId/categories/:categoryId/products", async (req, res) => {
//   try {
//     const { vendorId, categoryId } = req.params;
//     const searchResult = await index.search('', {
//       limit: 1000
//     });
    
//     // Filter products by vendorId and categoryId
//     const products = searchResult.hits
//       .filter(hit => hit.vendorId === vendorId && hit.categoryId === categoryId)
//       .map(hit => ({
//         id: hit.productId,
//         productId: hit.productId,
//         product_name: hit.product_name,
//         price: hit.price,
//         description: hit.description,
//         discount: hit.discount,
//         details: hit.details,
//         tier_pricing: hit.tier_pricing,
//        // product_images: hit.product_images,
//        product_images: (hit.product_images || []).map(imgUrl => transformFirebaseUrlToImageKit(imgUrl)),
//       //product_images: ["https://i.ibb.co/cm382jK/images-2.jpg"],
//         //product_video_url: hit.product_video_url,
//         mobile_number: hit.mobile_number,
//         isAvailable: hit.isAvailable,
//         moq: hit.moq,
//         added_at: hit.added_at
//       }));
    
//     res.json(products);
//   } catch (error) {
//     console.error("Error getting products:", error);
//     res.status(500).send("Server error");
//   }
// });

// //added by me
// app.get("/categories", async (req, res) => {
//   try {
//     const searchResult = await index.search('', { limit: 10000 });

//     // Use a Set to keep only unique category names
//     const categorySet = new Set();

//     searchResult.hits.forEach(hit => {
//       if (hit.category_name) {
//         categorySet.add(hit.category_name.trim());
//       }
//     });

//     // Convert Set to sorted array
//     const categories = Array.from(categorySet).sort((a, b) =>
//       a.localeCompare(b)
//     );

//     res.json(categories);
//   } catch (error) {
//     console.error("Error getting global categories:", error);
//     res.status(500).send("Server error");
//   }
// });



// // Get all products from all vendors (flattened structure)
// app.get("/products", async (req, res) => {
//   try {
//     const searchResult = await index.search('', {
//       limit: 10000
//     });
    
//     const products = searchResult.hits.map(hit => ({
//       id: hit.productId,
//       productId: hit.productId,
//       product_name: hit.product_name,
//       price: hit.price,
//       description: hit.description,
//       discount: hit.discount,
//       details: hit.details,
//       tier_pricing: hit.tier_pricing,
//       //product_images: hit.product_images,
//       product_images: (hit.product_images || []).map(imgUrl => transformFirebaseUrlToImageKit(imgUrl)),
//       //product_images: ["https://i.ibb.co/cm382jK/images-2.jpg"],
//       //product_video_url: hit.product_video_url,
//       mobile_number: hit.mobile_number,
//       isAvailable: hit.isAvailable,
//       moq: hit.moq,
//       added_at: hit.added_at,
//       vendorId: hit.vendorId,
//       vendorName: hit.vendor_name,
//       categoryId: hit.categoryId,
//       categoryName: hit.category_name,
//       //store_logo: hit.store_logo
//     }));
    
//     res.json(products);
//   } catch (error) {
//     console.error("Error getting all products:", error);
//     res.status(500).send("Server error");
//   }
// });

// // Get products from a specific vendor (all categories)
// app.get("/vendors/:vendorId/products", async (req, res) => {
//   try {
//     const { vendorId } = req.params;
    
//     const searchResult = await index.search('', {
//       limit: 1000
//     });
    
//     // Filter products by vendorId
//     const products = searchResult.hits
//       .filter(hit => hit.vendorId === vendorId)
//       .map(hit => ({
//         id: hit.productId,
//         productId: hit.productId,
//         product_name: hit.product_name,
//         price: hit.price,
//         description: hit.description,
//         discount: hit.discount,
//         details: hit.details,
//         tier_pricing: hit.tier_pricing,
//        // product_images: hit.product_images,
//        product_images: (hit.product_images || []).map(imgUrl => transformFirebaseUrlToImageKit(imgUrl)),
//       //product_images: ["https://i.ibb.co/cm382jK/images-2.jpg"],
//         //product_video_url: hit.product_video_url,
//         mobile_number: hit.mobile_number,
//         isAvailable: hit.isAvailable,
//         moq: hit.moq,
//         added_at: hit.added_at,
//         categoryId: hit.categoryId,
//         categoryName: hit.category_name,
//         vendorName: hit.vendor_name,
//         //store_logo: hit.store_logo
//       }));
    
//     if (products.length === 0) {
//       return res.status(404).json({ error: "Vendor not found" });
//     }
    
//     res.json(products);
//   } catch (error) {
//     console.error("Error getting vendor products:", error);
//     res.status(500).send("Server error");
//   }
// });

// // Get vendor subscriptions (this endpoint might not be applicable for MeiliSearch data)
// app.get("/vendors/:vendorId/subscriptions", async (req, res) => {
//   try {
//     // Since subscriptions are not part of the product data structure,
//     // this endpoint returns empty array or you can modify based on your needs
//     res.json([]);
//   } catch (error) {
//     console.error("Error getting subscriptions:", error);
//     res.status(500).send("Server error");
//   }
// });

// // Add a new product to MeiliSearch
// app.post("/vendors/:vendorId/categories/:categoryId/products", async (req, res) => {
//   try {
//     const { vendorId, categoryId } = req.params;
//     const productId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
//     const productData = {
//       productId: productId,
//       vendorId: vendorId,
//       categoryId: categoryId,
//       ...req.body,
//       added_at: new Date().toISOString(),
//       isAvailable: true,
//     };
    
//     await index.addDocuments([productData]);
    
//     res.status(201).json({
//       id: productId,
//       productId: productId,
//       message: "Product added successfully",
//     });
//   } catch (error) {
//     console.error("Error adding product:", error);
//     res.status(500).send("Server error");
//   }
// });

// // Update a product
// app.put("/vendors/:vendorId/categories/:categoryId/products/:productId", async (req, res) => {
//   try {
//     const { productId } = req.params;
    
//     // Get all documents and find the one to update
//     const searchResult = await index.search('', {
//       limit: 1000
//     });
    
//     const existingProduct = searchResult.hits.find(hit => hit.productId === productId);
    
//     if (!existingProduct) {
//       return res.status(404).json({ error: "Product not found" });
//     }
    
//     const updatedProduct = {
//       ...existingProduct,
//       ...req.body,
//       productId: productId // Ensure productId stays the same
//     };
    
//     await index.addDocuments([updatedProduct]);
    
//     res.json({ message: "Product updated successfully" });
//   } catch (error) {
//     console.error("Error updating product:", error);
//     res.status(500).send("Server error");
//   }
// });

// // Delete a product
// app.delete("/vendors/:vendorId/categories/:categoryId/products/:productId", async (req, res) => {
//   try {
//     const { productId } = req.params;
    
//     await index.deleteDocument(productId);
    
//     res.json({ message: "Product deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting product:", error);
//     res.status(500).send("Server error");
//   }
// });

// // Search products with advanced query
// app.get("/search", async (req, res) => {
//   try {
//     const { q, limit = 20, offset = 0, category, vendor, minPrice, maxPrice, inStock, sortBy } = req.query;
    
//     const searchOptions = {
//       limit: parseInt(limit),
//       offset: parseInt(offset)
//     };

//     // Build filter array
//     const filters = [];
    
//     if (category) {
//       filters.push(`category_name = "${category}"`);
//     }
    
//     if (vendor) {
//       filters.push(`vendorId = "${vendor}"`);
//     }
    
//     if (minPrice || maxPrice) {
//       const priceFilter = [];
//       if (minPrice) priceFilter.push(`price >= ${minPrice}`);
//       if (maxPrice) priceFilter.push(`price <= ${maxPrice}`);
//       filters.push(priceFilter.join(' AND '));
//     }
    
//     if (inStock === 'true') {
//       filters.push(`isAvailable = true`);
//     }
    
//     if (filters.length > 0) {
//       searchOptions.filter = filters;
//     }

//     // Sorting options
//     if (sortBy) {
//       switch(sortBy) {
//         case 'price-asc':
//           searchOptions.sort = ['price:asc'];
//           break;
//         case 'price-desc':
//           searchOptions.sort = ['price:desc'];
//           break;
//         case 'newest':
//           searchOptions.sort = ['added_at:desc'];
//           break;
//         case 'discount':
//           searchOptions.sort = ['discount:desc'];
//           break;
//       }
//     }

//     const searchResult = await index.search(q || '', searchOptions);
    
//     const products = searchResult.hits.map(hit => ({
//       id: hit.productId,
//       productId: hit.productId,
//       product_name: hit.product_name,
//       price: hit.price,
//       description: hit.description,
//       discount: hit.discount,
//       details: hit.details,
//       tier_pricing: hit.tier_pricing,
//       product_images: (hit.product_images || []).map(imgUrl => transformFirebaseUrlToImageKit(imgUrl)),
//       mobile_number: hit.mobile_number,
//       isAvailable: hit.isAvailable,
//       moq: hit.moq,
//       added_at: hit.added_at,
//       vendorId: hit.vendorId,
//       vendorName: hit.vendor_name,
//       categoryId: hit.categoryId,
//       categoryName: hit.category_name,
//     }));
    
//     res.json({
//       hits: products,
//       totalHits: searchResult.totalHits,
//       totalPages: Math.ceil(searchResult.totalHits / parseInt(limit)),
//       currentPage: Math.floor(parseInt(offset) / parseInt(limit)) + 1
//     });
//   } catch (error) {
//     console.error("Error searching products:", error);
//     res.status(500).send("Server error");
//   }
// });

// // Serve static files from React in production
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../my-app/build')));
  
//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../my-app/build', 'index.html'));
//   });
// }

// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });

// // app.listen(PORT, () => {
// //   console.log(`🚀 Server running at http://localhost:${PORT}`);
// //   console.log(`\n📋 Available endpoints:`);
// //   console.log(`   GET  /vendors - Get all vendor stores`);
// //   console.log(`   GET  /vendors/:vendorId - Get specific vendor`);
// //   console.log(`   GET  /vendors/:vendorId/categories - Get vendor categories`);
// //   console.log(`   GET  /vendors/:vendorId/categories/:categoryId/products - Get category products`);
// //   console.log(`   GET  /vendors/:vendorId/products - Get all products from a vendor`);
// //   console.log(`   GET  /products - Get all products from all vendors`);
// //   console.log(`   GET  /vendors/:vendorId/subscriptions - Get vendor subscriptions`);
// //   console.log(`   GET  /search?q=query&limit=20&offset=0&filter=... - Search products`);
// //   console.log(`   POST /vendors/:vendorId/categories/:categoryId/products - Add new product`);
// //   console.log(`   PUT  /vendors/:vendorId/categories/:categoryId/products/:productId - Update product`);
// //   console.log(`   DELETE /vendors/:vendorId/categories/:categoryId/products/:productId - Delete product`);
// //   console.log(`\n🔍 Test URLs:`);
// //   console.log(`   http://localhost:${PORT}/vendors`);
// //   console.log(`   http://localhost:${PORT}/products`);
// //   console.log(`   http://localhost:${PORT}/vendors/NISK9aLgXwMX1TFgMA6kOpcal5l2/categories`);
// //   console.log(`   http://localhost:${PORT}/search?q=phone`);
// // });


import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { MeiliSearch } from 'meilisearch';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Debug: Log loaded environment variables
console.log('Environment Configuration:');
console.log('MEILI_HOST:', process.env.MEILI_HOST ? '***' : 'NOT FOUND');
console.log('MEILI_API_KEY:', process.env.MEILI_API_KEY ? '***' : 'NOT FOUND');
console.log('PORT:', process.env.PORT || '5000 (default)');

// Verify required environment variables
if (!process.env.MEILI_HOST) {
  console.error('FATAL ERROR: MEILI_HOST is not defined in .env.local');
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize MeiliSearch client with error handling
let client;
let index;
try {
  client = new MeiliSearch({
    host: process.env.MEILI_HOST,
    apiKey: process.env.MEILI_API_KEY || ''
  });
  
  index = client.index('vendor_store_data');
  console.log('MeiliSearch client initialized successfully');
} catch (error) {
  console.error('Failed to initialize MeiliSearch client:', error);
  process.exit(1);
}

function transformFirebaseUrlToImageKit(firebaseUrl) {
  if (!firebaseUrl) return '';
  
  try {
    const urlObj = new URL(firebaseUrl);
    const encodedPath = urlObj.pathname.split('/o/')[1];
    if (!encodedPath) return firebaseUrl;

    const decodedPath = decodeURIComponent(encodedPath);
    return `https://ik.imagekit.io/3n0rrhtkz/firebase_files/${decodedPath}`;
  } catch (error) {
    console.error('Error transforming Firebase URL:', error);
    return firebaseUrl;
  }
}

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Get all vendor stores
app.get("/vendors", async (req, res) => {
  try {
    const searchResult = await index.search('', { limit: 1000 });
    const vendorsMap = new Map();
    
    searchResult.hits.forEach(hit => {
      if (!vendorsMap.has(hit.vendorId)) {
        vendorsMap.set(hit.vendorId, {
          id: hit.vendorId,
          store_name: hit.vendor_name,
          store_logo: hit.store_logo
        });
      }
    });

    res.json(Array.from(vendorsMap.values()));
  } catch (error) {
    console.error("Error getting vendors:", error);
    res.status(500).json({ error: "Failed to fetch vendors" });
  }
});

// [Keep all your other existing routes exactly as they are]
// Get specific vendor, categories, products, etc.
// ... (all your existing route handlers remain unchanged)


// Get specific vendor store by ID
app.get("/vendors/:vendorId", async (req, res) => {
  try {
    const { vendorId } = req.params;
    const searchResult = await index.search('', {
      limit: 1000
    });
    
    // Find vendor by ID
    const vendor = searchResult.hits.find(hit => hit.vendorId === vendorId);
    
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }
    
    res.json({
      id: vendor.vendorId,
      store_name: vendor.vendor_name,
      store_logo: vendor.store_logo
    });
  } catch (error) {
    console.error("Error getting vendor:", error);
    res.status(500).send("Server error");
  }
});

// Get categories for a specific vendor
app.get("/vendors/:vendorId/categories", async (req, res) => {
  try {
    const { vendorId } = req.params;
    const searchResult = await index.search('', {
      limit: 1000
    });
    
    // Filter by vendorId and extract unique categories
    const categoriesMap = new Map();
    searchResult.hits.forEach(hit => {
      if (hit.vendorId === vendorId && !categoriesMap.has(hit.categoryId)) {
        categoriesMap.set(hit.categoryId, {
          id: hit.categoryId,
          category_name: hit.category_name
        });
      }
    });

    const categories = Array.from(categoriesMap.values());
    res.json(categories);
  } catch (error) {
    console.error("Error getting categories:", error);
    res.status(500).send("Server error");
  }
});

// Get products for a specific vendor and category
app.get("/vendors/:vendorId/categories/:categoryId/products", async (req, res) => {
  try {
    const { vendorId, categoryId } = req.params;
    const searchResult = await index.search('', {
      limit: 1000
    });
    
    // Filter products by vendorId and categoryId
    const products = searchResult.hits
      .filter(hit => hit.vendorId === vendorId && hit.categoryId === categoryId)
      .map(hit => ({
        id: hit.productId,
        productId: hit.productId,
        product_name: hit.product_name,
        price: hit.price,
        description: hit.description,
        discount: hit.discount,
        details: hit.details,
        tier_pricing: hit.tier_pricing,
       // product_images: hit.product_images,
       product_images: (hit.product_images || []).map(imgUrl => transformFirebaseUrlToImageKit(imgUrl)),
      //product_images: ["https://i.ibb.co/cm382jK/images-2.jpg"],
        //product_video_url: hit.product_video_url,
        mobile_number: hit.mobile_number,
        isAvailable: hit.isAvailable,
        moq: hit.moq,
        added_at: hit.added_at
      }));
    
    res.json(products);
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).send("Server error");
  }
});

//added by me
app.get("/categories", async (req, res) => {
  try {
    const searchResult = await index.search('', { limit: 10000 });

    // Use a Set to keep only unique category names
    const categorySet = new Set();

    searchResult.hits.forEach(hit => {
      if (hit.category_name) {
        categorySet.add(hit.category_name.trim());
      }
    });

    // Convert Set to sorted array
    const categories = Array.from(categorySet).sort((a, b) =>
      a.localeCompare(b)
    );

    res.json(categories);
  } catch (error) {
    console.error("Error getting global categories:", error);
    res.status(500).send("Server error");
  }
});



// Get all products from all vendors (flattened structure)
app.get("/products", async (req, res) => {
  try {
    const searchResult = await index.search('', {
      limit: 10000
    });
    
    const products = searchResult.hits.map(hit => ({
      id: hit.productId,
      productId: hit.productId,
      product_name: hit.product_name,
      price: hit.price,
      description: hit.description,
      discount: hit.discount,
      details: hit.details,
      tier_pricing: hit.tier_pricing,
      //product_images: hit.product_images,
      product_images: (hit.product_images || []).map(imgUrl => transformFirebaseUrlToImageKit(imgUrl)),
      //product_images: ["https://i.ibb.co/cm382jK/images-2.jpg"],
      //product_video_url: hit.product_video_url,
      mobile_number: hit.mobile_number,
      isAvailable: hit.isAvailable,
      moq: hit.moq,
      added_at: hit.added_at,
      vendorId: hit.vendorId,
      vendorName: hit.vendor_name,
      categoryId: hit.categoryId,
      categoryName: hit.category_name,
      //store_logo: hit.store_logo
    }));
    
    res.json(products);
  } catch (error) {
    console.error("Error getting all products:", error);
    res.status(500).send("Server error");
  }
});

// Get products from a specific vendor (all categories)
app.get("/vendors/:vendorId/products", async (req, res) => {
  try {
    const { vendorId } = req.params;
    
    const searchResult = await index.search('', {
      limit: 1000
    });
    
    // Filter products by vendorId
    const products = searchResult.hits
      .filter(hit => hit.vendorId === vendorId)
      .map(hit => ({
        id: hit.productId,
        productId: hit.productId,
        product_name: hit.product_name,
        price: hit.price,
        description: hit.description,
        discount: hit.discount,
        details: hit.details,
        tier_pricing: hit.tier_pricing,
       // product_images: hit.product_images,
       product_images: (hit.product_images || []).map(imgUrl => transformFirebaseUrlToImageKit(imgUrl)),
      //product_images: ["https://i.ibb.co/cm382jK/images-2.jpg"],
        //product_video_url: hit.product_video_url,
        mobile_number: hit.mobile_number,
        isAvailable: hit.isAvailable,
        moq: hit.moq,
        added_at: hit.added_at,
        categoryId: hit.categoryId,
        categoryName: hit.category_name,
        vendorName: hit.vendor_name,
        //store_logo: hit.store_logo
      }));
    
    if (products.length === 0) {
      return res.status(404).json({ error: "Vendor not found" });
    }
    
    res.json(products);
  } catch (error) {
    console.error("Error getting vendor products:", error);
    res.status(500).send("Server error");
  }
});

// Get vendor subscriptions (this endpoint might not be applicable for MeiliSearch data)
app.get("/vendors/:vendorId/subscriptions", async (req, res) => {
  try {
    // Since subscriptions are not part of the product data structure,
    // this endpoint returns empty array or you can modify based on your needs
    res.json([]);
  } catch (error) {
    console.error("Error getting subscriptions:", error);
    res.status(500).send("Server error");
  }
});

// Add a new product to MeiliSearch
app.post("/vendors/:vendorId/categories/:categoryId/products", async (req, res) => {
  try {
    const { vendorId, categoryId } = req.params;
    const productId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const productData = {
      productId: productId,
      vendorId: vendorId,
      categoryId: categoryId,
      ...req.body,
      added_at: new Date().toISOString(),
      isAvailable: true,
    };
    
    await index.addDocuments([productData]);
    
    res.status(201).json({
      id: productId,
      productId: productId,
      message: "Product added successfully",
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).send("Server error");
  }
});

// Update a product
app.put("/vendors/:vendorId/categories/:categoryId/products/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Get all documents and find the one to update
    const searchResult = await index.search('', {
      limit: 1000
    });
    
    const existingProduct = searchResult.hits.find(hit => hit.productId === productId);
    
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    const updatedProduct = {
      ...existingProduct,
      ...req.body,
      productId: productId // Ensure productId stays the same
    };
    
    await index.addDocuments([updatedProduct]);
    
    res.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Server error");
  }
});

// Delete a product
app.delete("/vendors/:vendorId/categories/:categoryId/products/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    
    await index.deleteDocument(productId);
    
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Server error");
  }
});

// Search products with advanced query
app.get("/search", async (req, res) => {
  try {
    const { q, limit = 20, offset = 0, category, vendor, minPrice, maxPrice, inStock, sortBy } = req.query;
    
    const searchOptions = {
      limit: parseInt(limit),
      offset: parseInt(offset)
    };

    // Build filter array
    const filters = [];
    
    if (category) {
      filters.push(`category_name = "${category}"`);
    }
    
    if (vendor) {
      filters.push(`vendorId = "${vendor}"`);
    }
    
    if (minPrice || maxPrice) {
      const priceFilter = [];
      if (minPrice) priceFilter.push(`price >= ${minPrice}`);
      if (maxPrice) priceFilter.push(`price <= ${maxPrice}`);
      filters.push(priceFilter.join(' AND '));
    }
    
    if (inStock === 'true') {
      filters.push(`isAvailable = true`);
    }
    
    if (filters.length > 0) {
      searchOptions.filter = filters;
    }

    // Sorting options
    if (sortBy) {
      switch(sortBy) {
        case 'price-asc':
          searchOptions.sort = ['price:asc'];
          break;
        case 'price-desc':
          searchOptions.sort = ['price:desc'];
          break;
        case 'newest':
          searchOptions.sort = ['added_at:desc'];
          break;
        case 'discount':
          searchOptions.sort = ['discount:desc'];
          break;
      }
    }

    const searchResult = await index.search(q || '', searchOptions);
    
    const products = searchResult.hits.map(hit => ({
      id: hit.productId,
      productId: hit.productId,
      product_name: hit.product_name,
      price: hit.price,
      description: hit.description,
      discount: hit.discount,
      details: hit.details,
      tier_pricing: hit.tier_pricing,
      product_images: (hit.product_images || []).map(imgUrl => transformFirebaseUrlToImageKit(imgUrl)),
      mobile_number: hit.mobile_number,
      isAvailable: hit.isAvailable,
      moq: hit.moq,
      added_at: hit.added_at,
      vendorId: hit.vendorId,
      vendorName: hit.vendor_name,
      categoryId: hit.categoryId,
      categoryName: hit.category_name,
    }));
    
    res.json({
      hits: products,
      totalHits: searchResult.totalHits,
      totalPages: Math.ceil(searchResult.totalHits / parseInt(limit)),
      currentPage: Math.floor(parseInt(offset) / parseInt(limit)) + 1
    });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).send("Server error");
  }
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Serve static files from React in production
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../my-app/build')));
//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../my-app/build', 'index.html'));
//   });
// }

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log('\n📋 Available endpoints:');
  console.log('   GET  /health - Server health check');
  console.log('   GET  /vendors - Get all vendor stores');
  console.log('   GET  /vendors/:vendorId - Get specific vendor');
  console.log('   GET  /vendors/:vendorId/categories - Get vendor categories');
  console.log('   GET  /vendors/:vendorId/categories/:categoryId/products - Get category products');
  console.log('   GET  /products - Get all products from all vendors');
  console.log('   GET  /search - Search products with filters');
  console.log('   POST /vendors/:vendorId/categories/:categoryId/products - Add new product');
  console.log('   PUT  /vendors/:vendorId/categories/:categoryId/products/:productId - Update product');
  console.log('   DELETE /vendors/:vendorId/categories/:categoryId/products/:productId - Delete product');
});
