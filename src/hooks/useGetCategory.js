import {useState , useEffect} from 'react';
import { fetchCategory } from '../__apis__/categories';


export const useGetCategory = (categoryId) => {
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                const categoryData = await fetchCategory(categoryId);
                setCategory(categoryData);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategoryData();
    }, [categoryId]);

    return { category, loading, error };
}