import { ConfigPlugin, withAndroidManifest, AndroidConfig } from 'expo/config-plugins';

const pkg = { name: 'react-native-beacons-manager', version: '1.2.0' };

interface BeaconsPluginProps {
  locationAlwaysAndWhenInUsePermission?: string;
  locationAlwaysPermission?: string;
  locationWhenInUsePermission?: string;
  bluetoothAlwaysPermission?: string;
}



const withAndroidPlugin: ConfigPlugin<BeaconsPluginProps> = (config, props = {}) => {
  return withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;

    // Add location permissions
    AndroidConfig.Permissions.addPermission(
      androidManifest,
      'android.permission.ACCESS_COARSE_LOCATION'
    );
    AndroidConfig.Permissions.addPermission(
      androidManifest,
      'android.permission.ACCESS_FINE_LOCATION'
    );

    // Add legacy Bluetooth permissions
    AndroidConfig.Permissions.addPermission(
      androidManifest,
      'android.permission.BLUETOOTH'
    );
    AndroidConfig.Permissions.addPermission(
      androidManifest,
      'android.permission.BLUETOOTH_ADMIN'
    );

    // Add modern Bluetooth permissions (API 31+)
    AndroidConfig.Permissions.addPermission(
      androidManifest,
      'android.permission.BLUETOOTH_SCAN'
    );
    AndroidConfig.Permissions.addPermission(
      androidManifest,
      'android.permission.BLUETOOTH_ADVERTISE'
    );
    AndroidConfig.Permissions.addPermission(
      androidManifest,
      'android.permission.BLUETOOTH_CONNECT'
    );

    // Add uses-feature for Bluetooth LE
    if (!androidManifest.manifest['uses-feature']) {
      androidManifest.manifest['uses-feature'] = [];
    }

    const hasBluetoothLE = androidManifest.manifest['uses-feature'].some(
      (feature) =>
        feature.$?.['android:name'] === 'android.hardware.bluetooth_le'
    );

    if (!hasBluetoothLE) {
      androidManifest.manifest['uses-feature'].push({
        $: {
          'android:name': 'android.hardware.bluetooth_le',
          'android:required': 'true',
        },
      });
    }

    return config;
  });
};

export default withAndroidPlugin;
