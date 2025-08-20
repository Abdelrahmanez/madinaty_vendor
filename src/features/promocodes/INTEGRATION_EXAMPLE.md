# Promocodes Feature Integration Example

## Adding to Navigation

### 1. Import the screens in your navigation file
```javascript
// In your navigation file (e.g., src/navigation/AppNavigator.js)
import { 
  PromocodesScreen,
  CreatePromocodeScreen,
  EditPromocodeScreen,
  PromocodeDetailsScreen 
} from '../features/promocodes';
```

### 2. Add screens to your Stack Navigator
```javascript
// Inside your Stack.Navigator
<Stack.Screen 
  name="Promocodes" 
  component={PromocodesScreen}
  options={{
    title: 'أكواد الخصم',
    headerShown: false
  }}
/>

<Stack.Screen 
  name="CreatePromocode" 
  component={CreatePromocodeScreen}
  options={{
    title: 'إنشاء كود خصم',
    headerShown: false
  }}
/>

<Stack.Screen 
  name="EditPromocode" 
  component={EditPromocodeScreen}
  options={{
    title: 'تعديل كود الخصم',
    headerShown: false
  }}
/>

<Stack.Screen 
  name="PromocodeDetails" 
  component={PromocodeDetailsScreen}
  options={{
    title: 'تفاصيل كود الخصم',
    headerShown: false
  }}
/>
```

### 3. Navigate to the screens
```javascript
// Navigate to promocodes list
navigation.navigate('Promocodes');

// Navigate to create new promocode
navigation.navigate('CreatePromocode');

// Navigate to edit promocode
navigation.navigate('EditPromocode', { promocode: promocodeData });

// Navigate to promocode details
navigation.navigate('PromocodeDetails', { promocode: promocodeData });
```

## Adding to Menu/Drawer

### 1. Add menu item
```javascript
// In your menu/drawer component
const menuItems = [
  // ... other menu items
  {
    id: 'promocodes',
    title: 'أكواد الخصم',
    icon: 'ticket-percent',
    onPress: () => navigation.navigate('Promocodes')
  }
];
```

### 2. Render menu item
```javascript
{menuItems.map(item => (
  <TouchableOpacity
    key={item.id}
    style={styles.menuItem}
    onPress={item.onPress}
  >
    <MaterialCommunityIcons 
      name={item.icon} 
      size={24} 
      color={theme.colors.onSurface} 
    />
    <Text style={styles.menuText}>{item.title}</Text>
  </TouchableOpacity>
))}
```

## Using in Restaurant Dashboard

### 1. Add to restaurant dashboard
```javascript
// In your restaurant dashboard screen
import { PromocodesScreen } from '../features/promocodes';

const RestaurantDashboard = () => {
  return (
    <View style={styles.container}>
      {/* Other dashboard content */}
      
      {/* Promocodes section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>أكواد الخصم</Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Promocodes')}
          icon="ticket-percent"
        >
          إدارة أكواد الخصم
        </Button>
      </View>
    </View>
  );
};
```

## Using the Hook in Other Components

### 1. Import and use the hook
```javascript
import usePromocodes from '../features/promocodes/hooks/usePromocodes';

const MyComponent = () => {
  const { promocodes, loading, createPromocode } = usePromocodes();

  const handleCreatePromo = async () => {
    try {
      await createPromocode({
        code: 'SUMMER2024',
        description: 'خصم صيفي',
        type: 'percentage',
        value: 10,
        minOrderAmount: 50,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        usageLimit: 100,
        perUserLimit: 1,
        isActive: true
      });
    } catch (error) {
      console.error('Error creating promocode:', error);
    }
  };

  return (
    <View>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <Text>عدد أكواد الخصم: {promocodes.length}</Text>
      )}
    </View>
  );
};
```

## Using Components in Other Screens

### 1. Import components
```javascript
import { 
  PromocodeCard, 
  PromocodeForm, 
  PromocodeStatusBadge 
} from '../features/promocodes';
```

### 2. Use in your component
```javascript
const MyScreen = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <View>
      {/* Display a promocode card */}
      <PromocodeCard
        promocode={promocodeData}
        onEdit={(promo) => console.log('Edit:', promo)}
        onDelete={(id) => console.log('Delete:', id)}
        onToggleStatus={(id, active) => console.log('Toggle:', id, active)}
      />

      {/* Show status badge */}
      <PromocodeStatusBadge promocode={promocodeData} />

      {/* Show form in modal */}
      <Modal visible={showForm}>
        <PromocodeForm
          onSubmit={(data) => {
            console.log('Submit:', data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </View>
  );
};
```

## Error Handling

### 1. Handle API errors
```javascript
const { promocodes, error, loading } = usePromocodes();

if (error) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
      <Button onPress={() => refreshPromocodes()}>
        إعادة المحاولة
      </Button>
    </View>
  );
}
```

### 2. Handle form errors
```javascript
const handleSubmit = async (formData) => {
  try {
    await createPromocode(formData);
    Alert.alert('نجح', 'تم إنشاء كود الخصم بنجاح');
  } catch (error) {
    Alert.alert('خطأ', error.message || 'حدث خطأ في إنشاء كود الخصم');
  }
};
```

## Styling Integration

### 1. Use theme colors
```javascript
import { useTheme } from 'react-native-paper';

const MyComponent = () => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={{ color: theme.colors.onSurface }}>
        محتوى المكون
      </Text>
    </View>
  );
};
```

### 2. Consistent styling
```javascript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  section: {
    marginVertical: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12
  }
});
```

This integration example shows how to seamlessly add the promocodes feature to your existing app structure while maintaining consistency with your current design and navigation patterns.
