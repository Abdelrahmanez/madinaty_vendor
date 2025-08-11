import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function DishAddons({ addons, selectedAddons = [], onAddonToggle }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    if (!addons || addons.length === 0) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>الإضافات المتاحة</Text>
            <View style={styles.addonsContainer}>
                {addons.map((addon) => {
                    const isSelected = selectedAddons.includes(addon._id);
                    return (
                        <TouchableOpacity
                            key={addon._id}
                            style={[
                                styles.addonItem,
                                isSelected && styles.selectedAddon
                            ]}
                            onPress={() => onAddonToggle(addon._id)}
                        >
                            <View style={styles.addonInfo}>
                                <Text style={[
                                    styles.addonName,
                                    isSelected && styles.selectedAddonText
                                ]}>
                                    {addon.name}
                                </Text>
                                {addon.description && (
                                    <Text style={[
                                        styles.addonDescription,
                                        isSelected && styles.selectedAddonText
                                    ]}>
                                        {addon.description}
                                    </Text>
                                )}
                            </View>
                            <View style={styles.addonPrice}>
                                <Text style={[
                                    styles.price,
                                    isSelected && styles.selectedAddonText
                                ]}>
                                    +{addon.price} جنيه
                                </Text>
                                {isSelected && (
                                    <View style={styles.checkmark}>
                                        <Text style={styles.checkmarkText}>✓</Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const createStyles = (theme) => StyleSheet.create({
    container: {
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        margin: 16,
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.onSurface,
        marginBottom: 12,
    },
    addonsContainer: {
        gap: 8,
    },
    addonItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.outline,
        backgroundColor: theme.colors.surface,
    },
    selectedAddon: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primaryContainer,
    },
    addonInfo: {
        flex: 1,
        marginRight: 12,
    },
    addonName: {
        fontSize: 16,
        fontWeight: '500',
        color: theme.colors.onSurface,
        marginBottom: 2,
    },
    addonDescription: {
        fontSize: 14,
        color: theme.colors.onSurfaceVariant,
    },
    selectedAddonText: {
        color: theme.colors.onPrimaryContainer,
    },
    addonPrice: {
        alignItems: 'flex-end',
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    checkmark: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
    },
    checkmarkText: {
        color: theme.colors.onPrimary,
        fontSize: 12,
        fontWeight: 'bold',
    },
}); 