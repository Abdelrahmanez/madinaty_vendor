import React, { useState } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { useTheme } from 'react-native-paper';

const { width } = Dimensions.get('window');

export default function DishImageSlider({ images = [], mainImageUrl }) {
    const theme = useTheme();
    const styles = createStyles(theme);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Combine main image with additional images
    const allImages = mainImageUrl ? [mainImageUrl, ...images] : images;

    if (!allImages || allImages.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.mainImageContainer}>
                    <View style={styles.noImageContainer}>
                        <Text style={styles.noImageText}>لا توجد صورة</Text>
                    </View>
                </View>
            </View>
        );
    }

    const handleImagePress = (index) => {
        setCurrentIndex(index);
    };

    return (
        <View style={styles.container}>
            {/* Main Image Display */}
            <View style={styles.mainImageContainer}>
                <Image
                    source={{ uri: allImages[currentIndex] }}
                    style={styles.mainImage}
                    resizeMode="cover"
                />
            </View>

            {/* Thumbnail Images (if more than one image) */}
            {allImages.length > 1 && (
                <View style={styles.thumbnailContainer}>
                    {allImages.map((image, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.thumbnail,
                                currentIndex === index && styles.activeThumbnail
                            ]}
                            onPress={() => handleImagePress(index)}
                        >
                            <Image
                                source={{ uri: image }}
                                style={styles.thumbnailImage}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
}

const createStyles = (theme) => StyleSheet.create({
    container: {
        height: 180,
        backgroundColor: theme.colors.surface,
        position: 'relative',
    },
    mainImageContainer: {
        height: 140,
        borderRadius: 0,
        overflow: 'hidden',
        backgroundColor: theme.colors.surfaceVariant,
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    thumbnailContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        gap: 8,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
    },
    thumbnail: {
        width: 40,
        height: 40,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: 'transparent',
        overflow: 'hidden',
        backgroundColor: theme.colors.surfaceVariant,
    },
    activeThumbnail: {
        borderColor: theme.colors.primary,
        borderWidth: 2,
        transform: [{ scale: 1.1 }],
    },
    thumbnailImage: {
        width: '100%',
        height: '100%',
    },
    noImageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.surfaceVariant,
    },
    noImageText: {
        fontSize: 14,
        color: theme.colors.onSurfaceVariant,
        textAlign: 'center',
    },
}); 