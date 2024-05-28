import React from 'react';
import { View } from 'react-native';
import { AdMobBanner } from 'react-native-admob';

const AdMob = ({ adUnitID }) => {
  return (
    <View>
      <AdMobBanner
        adSize="banner"
        adUnitID={adUnitID}
        testDevices={[AdMobBanner.simulatorId]}
        onAdFailedToLoad={(error) => console.error(error)}
      />
    </View>
  );
};

export default AdMob;
