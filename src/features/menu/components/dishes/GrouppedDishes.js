import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTheme } from 'react-native-paper';
import { groupDishesByCategory } from '../../../../utils/dishUtils';
import DishItem from './DishItem';
import { useDishes } from '../../hooks/useDishes';

export default function GrouppedDishes({ restaurantId }) {
    const theme = useTheme();
    const styles = createStyles(theme);
    const { dishes, loading, error } = useDishes({ restaurant: restaurantId });
    const groupedDishes = groupDishesByCategory(dishes);

    const renderDishItem = ({ item }) => (
        <DishItem dish={item} />
    );

    const renderCategorySection = (category) => (
        <View key={category.title}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{category.title}</Text>
            </View>
            {category.data.map((dish, index) => (
                <DishItem key={dish.id || index} dish={dish} />
            ))}
        </View>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>جاري تحميل الأطباق...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>حدث خطأ في تحميل الأطباق</Text>
            </View>
        );
    }

    if (groupedDishes.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.emptyText}>لا توجد أطباق متاحة</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.mainTitle}>الأطباق</Text>
            {groupedDishes.map(renderCategorySection)}
        </View>
    );
}

const createStyles = (theme) => StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
    },
    mainTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: 16,
        textAlign: 'center',
    },
    sectionHeader: {
        backgroundColor: theme.colors.surface,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.outline,
        marginTop: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    loadingText: {
        fontSize: 16,
        textAlign: 'center',
        color: theme.colors.onSurface,
        marginTop: 20,
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
        color: theme.colors.error,
        marginTop: 20,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        color: theme.colors.onSurface,
        marginTop: 20,
    },
});