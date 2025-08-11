import { View, Text, StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useTheme } from 'react-native-paper';
import CartItem from './CartItem';


export default function CartList({ data, refreshControl }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <FlatList
            data={data}
            renderItem={({ item }) => <CartItem item={item} />}
            keyExtractor={(item) => item._id?.toString()}
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={refreshControl}
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
