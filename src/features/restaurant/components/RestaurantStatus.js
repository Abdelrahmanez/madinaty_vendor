import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useGetRestaurant } from '../hooks/useGetRestaurant';
import { useUpdateRestaurant } from '../hooks/useUpdateRestaurant';
import { PrimaryButton } from '../../../components/AppButton';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useAlertStore from '../../../stores/alertStore';

export default function RestaurantStatus() {
    const theme = useTheme();
    const styles = createStyles(theme);
    const { restaurant, loading, error, refresh } = useGetRestaurant();
    const { updateRestaurantStatus, updating, error: updateError } = useUpdateRestaurant();
    const { triggerAlert } = useAlertStore();

    const handleStatusToggle = () => {
        if (!restaurant) return;

        const newStatus = !restaurant.isOpen;
        const statusText = newStatus ? 'مفتوح' : 'مقفل';
        
        Alert.alert(
            'تأكيد تغيير الحالة',
            `هل تريد تغيير حالة المطعم إلى ${statusText}؟`,
            [
                { text: 'إلغاء', style: 'cancel' },
                {
                    text: 'تأكيد',
                    onPress: async () => {
                        const result = await updateRestaurantStatus(restaurant.id, { isOpen: newStatus });
                        if (result.success) {
                            triggerAlert('success', `تم تغيير حالة المطعم إلى ${statusText} بنجاح`);
                            await refresh();
                        } else {
                            triggerAlert('error', result.error || 'حدث خطأ أثناء تحديث حالة المطعم');
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>جاري التحميل...</Text>
            </View>
        );
    }

    if (error || !restaurant) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>حدث خطأ في تحميل بيانات المطعم</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.statusCard}>
                {/* Single Row Layout - All elements in one horizontal line */}
                <View style={styles.mainRow}>
                    {/* Restaurant Name */}
                    <Text style={styles.restaurantName} numberOfLines={1}>
                        {restaurant.name}
                    </Text>
                    
                    {/* Status Indicator */}
                    <View style={[
                        styles.statusIndicator,
                        { backgroundColor: restaurant.isOpen ? theme.colors.success : theme.colors.error }
                    ]}>
                        <MaterialCommunityIcons 
                            name={restaurant.isOpen ? 'store-open' : 'store-off'} 
                            size={14} 
                            color="white" 
                        />
                    </View>
                    
                    {/* Status Text */}
                    <View style={styles.statusInfo}>
                        <Text style={[
                            styles.statusText,
                            { color: restaurant.isOpen ? theme.colors.success : theme.colors.error }
                        ]}>
                            {restaurant.isOpen ? 'مفتوح' : 'مقفل'}
                        </Text>
                    </View>
                    
                    {/* Toggle Button */}
                    <PrimaryButton
                        mode="contained"
                        onPress={handleStatusToggle}
                        loading={updating}
                        disabled={updating}
                        style={styles.toggleButton}
                        labelStyle={styles.buttonLabel}
                        compact
                    >
                        {restaurant.isOpen ? 'إغلاق' : 'فتح'}
                    </PrimaryButton>
                </View>

                {/* Error Message - Below the main row if needed */}
                {updateError && (
                    <Text style={styles.errorText} numberOfLines={1}>
                        {updateError}
                    </Text>
                )}
            </View>
        </View>
    );
}

const createStyles = (theme) => StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'transparent', // Make container transparent to show the card properly
    },
    statusCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: 8,
        padding: 12,
        elevation: 1,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
    },
    mainRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    restaurantName: {
        fontSize: 15,
        fontWeight: '600',
        color: theme.colors.onSurface,
        flex: 2,
        textAlign: 'right',
        marginRight: 8,
    },
    statusIndicator: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    statusInfo: {
        flex: 1,
        alignItems: 'center',
    },
    statusText: {
        fontSize: 13,
        fontWeight: '600',
    },
    toggleButton: {
        borderRadius: 6,
        elevation: 0,
        minWidth: 60,
        height: 32,
        marginLeft: 8,
    },
    buttonLabel: {
        fontSize: 11,
        fontWeight: '600',
    },
    loadingText: {
        fontSize: 13,
        color: theme.colors.onSurfaceVariant,
        textAlign: 'center',
        padding: 12,
    },
    errorText: {
        fontSize: 11,
        color: theme.colors.error,
        textAlign: 'center',
        marginTop: 6,
        paddingHorizontal: 8,
    },
});
