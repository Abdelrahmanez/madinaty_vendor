import { View, Text , TouchableOpacity , StyleSheet , ActivityIndicator } from "react-native";
import useAuthStore from "../../stores/authStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
import { I18nManager } from "react-native";
import { fontSize } from "../../theme/fontSizes";
import { useGetCurrentAddress } from "../../hooks/useGetCurrentAddress";
import LoadingIndicator from "../LoadingIndicator";
import { useTranslation } from 'react-i18next';

const AddressBar = ({navigation}) => {
    const {user} = useAuthStore();
    const theme = useTheme();
    const { t } = useTranslation();

    const handleAddressPress = () => {
        navigation.navigate("Address");
    }

    const { currentAddress, loading: addressLoading, error: addressError } = useGetCurrentAddress();
    

    return (
        <View style={[styles.addressContainer , {backgroundColor:theme.colors.primary}]}>
            <TouchableOpacity onPress={handleAddressPress} style={styles.addressItem}>
                {addressLoading ? <LoadingIndicator message="" size="small" color={theme.colors.surface} /> : (
                    <>
                <MaterialCommunityIcons name="map-marker" size={24} color={theme.colors.surface} />
                <View>
                <Text
                  style={[
                    styles.addressText,
                    { 
                      color: theme.colors.surface, 
                      textAlign: I18nManager.isRTL ? 'right' : 'left',
                      fontSize: fontSize.sm // Use font size from fontSizes
                    }
                  ]}
                >
                  {t('deliveryTo')}
                </Text>
                <Text style={[styles.addressText , {color:theme.colors.surface , fontSize:fontSize.xs}]}>{currentAddress?.street}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.surface} />
                </>
                )}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
  addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        height: 50,
    },

    addressText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    addressItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 10,
      width: '100%',
    },
    
  });
  
export default AddressBar;