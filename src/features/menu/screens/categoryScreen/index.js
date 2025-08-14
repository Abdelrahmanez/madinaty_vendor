import { View, Text, StyleSheet } from 'react-native';
import TopBar from '../../../../components/TopBar';
import { useTheme } from 'react-native-paper';
import { useGetCategory } from '../../../menu/hooks/useGetCategory.js';        
import DishesList from '../../../menu/components/dishes/DishesList.js';
import { useDishes } from '../../../menu/hooks/useDishes.js';   


export default function CategoryScreen({ navigation, route }) {
    const theme = useTheme();
    const styles = createStyles(theme);
    
    // Extract categoryId from route params
    const { categoryId } = route.params || {};

    const { category, loading, error } = useGetCategory(categoryId);

    const { dishes, loading: dishesLoading, error: dishesError } = useDishes({ categoryId });
    console.log(dishes);

    return (
        <View style={styles.container}>
            <TopBar title={category?.name} />
            {loading && <Text>Loading...</Text>}
            {error && <Text>Error: {error.message}</Text>}
            {category && <Text>Category: {category.name}</Text>}
            <DishesList data={dishes} />
        </View>
    );
}

const createStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
});
