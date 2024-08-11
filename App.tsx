import React, { useEffect, useState } from 'react';
import { View, Text, NativeModules, Button, PermissionsAndroid, Platform } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import SystemSetting from 'react-native-system-setting';

const { BLEAdvertiser } = NativeModules;
const manager = new BleManager();

const App = () => {
  const [isLocationOn, setIsLocationOn] = useState(false);
  const [isAdvertising, setIsAdvertising] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Not advertising');

  useEffect(() => {
    if (!BLEAdvertiser) {
      console.error('BLEAdvertiser module is not available');
      setStatusMessage('BLEAdvertiser module is not available');
      return;
    }

    const stateChangeListener = manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        scan();
      }
    }, true);

    requestPermissions();

    return () => {
      stateChangeListener?.remove();
    };
  }, []);

  useEffect(() => {
    const addLocationListener = async () => {
      const subscription = await SystemSetting.addLocationListener((data) => {
        setIsLocationOn(data);
      });

      return () => subscription.remove();
    };

    addLocationListener();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      try {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);
        console.log('Permissions requested');
      } catch (error) {
        console.error('Error requesting permissions:', error);
      }
    }
  };

  const scan = () => {
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Error during scan:', error);
        return;
      }

      // Example: Looking for a specific device
      if (device?.name === 'My BLE Device') {
        manager.stopDeviceScan();
        connectToDevice(device);
      }
    });
  };

  const connectToDevice = async (device) => {
    try {
      const connectedDevice = await device.connect();
      await connectedDevice.discoverAllServicesAndCharacteristics();
      console.log('Connected to device:', connectedDevice.name);
    } catch (error) {
      console.error('Error connecting to device:', error);
    }
  };

  const startAdvertising = async () => {
    try {
      if (!BLEAdvertiser) {
        throw new Error('BLEAdvertiser module is not available');
      }
  
      const uuid = '00000000-0000-0000-0000-000000000000'; // This remains the same
      const companyId = 0x004C; // Example Company ID
      const major = 12454; 
      const minor = 0; 
      const payload = ''; // No additional payload for simplicity
  
      await BLEAdvertiser.broadcast(uuid, major, minor, companyId, payload);
      setIsAdvertising(true);
      setStatusMessage('Advertising started with Major: 12454');
    } catch (error) {
      console.error('Error starting advertising:', error);
      setStatusMessage(`Error: ${error.message}`);
    }
  };
  

  const stopAdvertising = async () => {
    try {
      if (!BLEAdvertiser) {
        throw new Error('BLEAdvertiser module is not available');
      }
      await BLEAdvertiser.stopBroadcast();
      setIsAdvertising(false);
      setStatusMessage('Advertising stopped');
    } catch (error) {
      console.error('Error stopping advertising:', error);
      setStatusMessage(`Error: ${error.message}`);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>BLE Advertising & Scanning App</Text>
      <Text style={{ fontSize: 16, marginBottom: 10 }}>Status: {statusMessage}</Text>
      <Button
        title={isAdvertising ? "Stop Advertising" : "Start Advertising"}
        onPress={isAdvertising ? stopAdvertising : startAdvertising}
      />
    </View>
  );
};

export default App;