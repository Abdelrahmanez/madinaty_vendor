import { View, Text, StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useTheme } from 'react-native-paper';
import RestaurantItem from './RestaurantItem';


export default function RestaurantsList({ data }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <FlatList
            data={data}
            renderItem={({ item }) => <RestaurantItem item={item} />}
            keyExtractor={(item) => item.id?.toString()}
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        />
    );
}

const createStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        width: '100%',
    },
    contentContainer: {
        padding: 16,
    },
});
