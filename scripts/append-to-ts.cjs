const fs = require('fs');
const { TRIBAL_CATALOG } = require('./seed-tribal-products.cjs');

// 1. Update src/data/products.ts
let productsContent = fs.readFileSync('src/data/products.ts', 'utf8');

if (!productsContent.includes('rass-trb-01')) {
  const codeBlocks = TRIBAL_CATALOG.map((item, idx) => {
    return `  // Tribal ${idx + 1}. ${item.name}
  {
    id: '${item.id}',
    name: '${item.name}',
    category: 'tribal',
    categoryDisplay: 'Tribal Jewellery',
    price: ${item.price},
    originalPrice: ${item.originalPrice},
    costPrice: ${item.costPrice},
    image: '${item.image}',
    cleanImage: '${item.cleanImage}',
    description: ${JSON.stringify(item.description)},
    details: ${JSON.stringify(item.details, null, 6).replace(/\n/g, '\n    ')},
    metal: '${item.metal}',
    gemstones: '${item.gemstones}',
    inStock: true,
    isBestseller: ${item.isBestseller},
    isNew: true,
    dimensions: '${item.dimensions}',
    weight: '${item.weight}',
    sku: '${item.sku}',
    stockCount: 1
  }`;
  }).join(',\n\n');

  const lastBracketIndex = productsContent.lastIndexOf('];');
  if (lastBracketIndex !== -1) {
    productsContent = productsContent.slice(0, lastBracketIndex) + ',\n\n' + codeBlocks + '\n];\n';
    fs.writeFileSync('src/data/products.ts', productsContent, 'utf8');
    console.log('Successfully appended 23 tribal products to src/data/products.ts!');
  }
} else {
  console.log('src/data/products.ts already contains rass-trb-01');
}

// 2. Update src/services/storeService.ts INITIAL_VARIANTS
let storeServiceContent = fs.readFileSync('src/services/storeService.ts', 'utf8');
if (!storeServiceContent.includes('var-rass-trb-01-std')) {
  const variantBlocks = TRIBAL_CATALOG.map((item) => {
    return `  {
    id: 'var-${item.id}-std',
    productId: '${item.id}',
    sku: '${item.sku}',
    variantName: 'Standard (1 Piece)',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  }`;
  }).join(',\n');

  const variantArrayEnd = storeServiceContent.indexOf('];', storeServiceContent.indexOf('const INITIAL_VARIANTS: ProductVariant[] = ['));
  if (variantArrayEnd !== -1) {
    storeServiceContent = storeServiceContent.slice(0, variantArrayEnd) + ',\n' + variantBlocks + '\n' + storeServiceContent.slice(variantArrayEnd);
    fs.writeFileSync('src/services/storeService.ts', storeServiceContent, 'utf8');
    console.log('Successfully appended 23 tribal variants to src/services/storeService.ts!');
  }
} else {
  console.log('src/services/storeService.ts already contains tribal variants');
}
