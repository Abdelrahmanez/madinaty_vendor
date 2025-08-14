import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

export default function DishItem({dish}) {
    const theme = useTheme();
    const navigation = useNavigation();
    const { t } = useTranslation();

    const handlePress = () => {
        navigation.navigate('DishScreen', { dishId: dish.id });
    };

    return (
        <TouchableOpacity 
            style={createStyles(theme).container}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            <Image source={{ uri: dish.imageUrl }} style={createStyles(theme).image} />
            <View style={createStyles(theme).info}>
                <Text style={createStyles(theme).name}>{dish.name}</Text>
                <Text style={createStyles(theme).price}>{dish.sizes[0].price} {t('currency')}</Text>
            </View>
            
        </TouchableOpacity>
    )
}

const createStyles = (theme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
        },
        image: {
            width: 100,
            height: 100,
            borderRadius: 10,
        },
        name: {
            fontSize: 16,
            fontWeight: 'bold',
        },
        info: {
            marginLeft: 12,
        },
        price: {
            fontSize: 14,
            color: theme.colors.primary,
        },
    })