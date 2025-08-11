import { View, Text, TextInput, Button } from 'react-native';
import { useTheme } from 'react-native-paper';
import { validatePromoCode } from '../../__apis__/promocode';
import { useState } from 'react';


export default function Promocode({ totalPrice }) {
    const theme = useTheme();
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);

    const handleValidatePromoCode = async () => {
        const response = await validatePromoCode(promoCode);
        console.log(response);
    };

    return (
        <View>
            {/* <Text>{message}</Text> */}
            <Text>Promocode</Text>
            <TextInput
                placeholder="Enter promo code"
                value={promoCode}
                onChangeText={setPromoCode}
            />
            <Button
                title="Apply"
                onPress={() => {
                    handleValidatePromoCode();
                }}
            />
            <Text>Total Price: {totalPrice.toFixed(2)}</Text>
            <Text>Discount: {discount.toFixed(2)}</Text>
            <Text>Total Price after discount: {(totalPrice - discount).toFixed(2)}</Text>
            
        </View>
    );
}

