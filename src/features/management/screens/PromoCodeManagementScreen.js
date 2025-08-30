import React from 'react';
import FeatureGridScreen from '../components/FeatureGridScreen';
import { PROMO_CODE_FEATURES } from '../data/managementFeatures';

const PromoCodeManagementScreen = ({ navigation }) => {
  return (
    <FeatureGridScreen
      title="إدارة رموز الخصم"
      subtitle="إدارة العروض الترويجية ورموز الخصم"
      features={PROMO_CODE_FEATURES}
      navigation={navigation}
    />
  );
};

export default PromoCodeManagementScreen;
