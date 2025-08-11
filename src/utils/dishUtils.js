/**
 * Sorts dish sizes by price in ascending order
 * @param {Array} sizes - Array of size objects
 * @returns {Array} Sorted sizes array
 */
export const sortSizesByPrice = (sizes) => {
    if (!Array.isArray(sizes)) return [];
    return [...sizes].sort((a, b) => a.price - b.price);
};

/**
 * Gets the lowest price from dish sizes
 * @param {Array} sizes - Array of size objects
 * @returns {number} Lowest price
 */
export const getLowestPrice = (sizes) => {
    if (!Array.isArray(sizes) || sizes.length === 0) return 0;
    const sortedSizes = sortSizesByPrice(sizes);
    return sortedSizes[0].price;
};

/**
 * Gets the highest price from dish sizes
 * @param {Array} sizes - Array of size objects
 * @returns {number} Highest price
 */
export const getHighestPrice = (sizes) => {
    if (!Array.isArray(sizes) || sizes.length === 0) return 0;
    const sortedSizes = sortSizesByPrice(sizes);
    return sortedSizes[sortedSizes.length - 1].price;
};

/**
 * Formats price range for display
 * @param {Array} sizes - Array of size objects
 * @returns {string} Formatted price range
 */
export const formatPriceRange = (sizes) => {
    if (!Array.isArray(sizes) || sizes.length === 0) return '0 جنيه';
    
    const lowest = getLowestPrice(sizes);
    const highest = getHighestPrice(sizes);
    
    if (lowest === highest) {
        return `${lowest} جنيه`;
    }
    
    return `${lowest} - ${highest} جنيه`;
};

/**
 * Groups dishes by their category for SectionList rendering
 * @param {Array} dishes - Array of dish objects
 * @returns {Array} Array of section objects for SectionList
 */
export const groupDishesByCategory = (dishes) => {
    if (!Array.isArray(dishes) || dishes.length === 0) {
        return [];
    }

    // Create a map to group dishes by category
    const categoryMap = new Map();

    dishes.forEach(dish => {
        const categoryId = dish.category;
        const categoryName = dish.category.name || dish.restaurant?.categories?.find(cat => cat.id === categoryId)?.name || 'Unknown Category';
        
        if (!categoryMap.has(categoryId)) {
            categoryMap.set(categoryId, {
                title: categoryName,
                data: []
            });
        }
        
        categoryMap.get(categoryId).data.push(dish);
    });

    // Convert map to array and sort by category name
    const groupedDishes = Array.from(categoryMap.values());
    groupedDishes.sort((a, b) => a.title.localeCompare(b.title));

    return groupedDishes;
};