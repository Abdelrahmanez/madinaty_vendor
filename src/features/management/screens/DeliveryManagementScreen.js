import React from 'react';
import FeatureGridScreen from '../components/FeatureGridScreen';
import { DELIVERY_FEATURES } from '../data/managementFeatures';

const DeliveryManagementScreen = ({ navigation }) => {
  return (
    <FeatureGridScreen
      title="إدارة التوصيل"
      subtitle="إدارة السائقين وتخصيص الطلبات"
      features={DELIVERY_FEATURES}
      navigation={navigation}
    />
  );
};

export default DeliveryManagementScreen;
