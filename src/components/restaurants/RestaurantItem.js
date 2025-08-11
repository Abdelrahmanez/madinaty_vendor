import React from 'react';
import { View, Text, StyleSheet , Image , TouchableOpacity} from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { I18nManager } from 'react-native';

export default function RestaurantItem({ item} ) {
    const theme = useTheme();
    const styles = createStyles(theme);
    const navigation = useNavigation();
    const { t } = useTranslation();
    const isRTL = I18nManager.isRTL;
    
    const handleRestaurantPress = () => {
        navigation.navigate('RestaurantScreen', { id: item.id });
    }
    return (
        <TouchableOpacity style={styles.container} onPress={handleRestaurantPress}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.infoContainer}>
            <Text style={[styles.name , isRTL && { textAlign: 'right' }]}>{item.name}</Text>
            <Text style={[styles.description , isRTL && { textAlign: 'right' }]}>{item.description}</Text>
            </View>
            
        </TouchableOpacity>
    );
}

const createStyles = (theme) => StyleSheet.create({
    container: {
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 10,
        elevation: 1,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.surfaceVariant,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 12,
    },
    infoContainer: {
        flex: 1,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: theme.colors.surfaceVariant,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#666',
    },
});
