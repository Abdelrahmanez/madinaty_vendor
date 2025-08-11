// hooks/useSearchFilters.js
import { useState, useMemo } from 'react';


// هنا ممكن اضيف فلترة التصنيف على حسب model في الباك اند دا احسن

export const useQueryFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);

  // طريقة لتعديل أي فلتر بسهولة
  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const removeFilter = (key) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  // إزالة القيم الفارغة تلقائيًا قبل الإرسال
  const cleanedFilters = useMemo(() => {
    const result = {};
    for (const key in filters) {
      const value = filters[key];
      if (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0)
      ) {
        result[key] = value;
      }
    }
    return result;
  }, [filters]);

  return { filters, updateFilter, removeFilter, cleanedFilters };
};
