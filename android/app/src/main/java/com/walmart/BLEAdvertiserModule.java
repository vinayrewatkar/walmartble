package com.walmart;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.module.annotations.ReactModule;

import java.nio.ByteBuffer;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.Hashtable;
import java.util.Set;

import android.util.Log;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.le.AdvertiseCallback;
import android.bluetooth.le.AdvertiseData;
import android.bluetooth.le.AdvertiseSettings;
import android.bluetooth.le.BluetoothLeAdvertiser;
import java.util.Arrays;

@ReactModule(name = BLEAdvertiserModule.NAME)
public class BLEAdvertiserModule extends ReactContextBaseJavaModule {
    public static final String NAME = "BLEAdvertiser";
    private BluetoothAdapter mBluetoothAdapter;
    private static Hashtable<String, BluetoothLeAdvertiser> mAdvertiserList;
    private static Hashtable<String, AdvertiseCallback> mAdvertiserCallbackList;
    private int companyId;
    private Boolean mObservedState;

    public BLEAdvertiserModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mAdvertiserList = new Hashtable<>();
        mAdvertiserCallbackList = new Hashtable<>();
        mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        if (mBluetoothAdapter != null) {
            mObservedState = mBluetoothAdapter.isEnabled();
        }
        this.companyId = 0x0000;
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("ADVERTISE_MODE_BALANCED", AdvertiseSettings.ADVERTISE_MODE_BALANCED);
        constants.put("ADVERTISE_MODE_LOW_LATENCY", AdvertiseSettings.ADVERTISE_MODE_LOW_LATENCY);
        constants.put("ADVERTISE_MODE_LOW_POWER", AdvertiseSettings.ADVERTISE_MODE_LOW_POWER);
        constants.put("ADVERTISE_TX_POWER_HIGH", AdvertiseSettings.ADVERTISE_TX_POWER_HIGH);
        constants.put("ADVERTISE_TX_POWER_LOW", AdvertiseSettings.ADVERTISE_TX_POWER_LOW);
        constants.put("ADVERTISE_TX_POWER_MEDIUM", AdvertiseSettings.ADVERTISE_TX_POWER_MEDIUM);
        constants.put("ADVERTISE_TX_POWER_ULTRA_LOW", AdvertiseSettings.ADVERTISE_TX_POWER_ULTRA_LOW);
        return constants;
    }

    @ReactMethod
    public void setCompanyId(int companyId) {
        this.companyId = companyId;
    }

    @ReactMethod
    public void broadcast(String sUUID, int major, int minor, int companyId, String payload, Promise promise) {
        try {
            if (mBluetoothAdapter == null) {
                Log.w("BleAdvertiserModule", "Device does not support Bluetooth. Adapter is Null");
                promise.reject("Device does not support Bluetooth. Adapter is Null");
                return;
            }

            if (!mBluetoothAdapter.isEnabled()) {
                Log.w("BleAdvertiserModule", "Bluetooth disabled");
                promise.reject("Bluetooth disabled");
                return;
            }

            BluetoothLeAdvertiser tempAdvertiser;
            AdvertiseCallback tempCallback;

            if (mAdvertiserList.containsKey(sUUID)) {
                tempAdvertiser = mAdvertiserList.remove(sUUID);
                tempCallback = mAdvertiserCallbackList.remove(sUUID);
                tempAdvertiser.stopAdvertising(tempCallback);
            } else {
                tempAdvertiser = mBluetoothAdapter.getBluetoothLeAdvertiser();
                tempCallback = new SimpleAdvertiseCallback(promise);
            }

            if (tempAdvertiser == null) {
                Log.w("BleAdvertiserModule", "Advertiser Not Available");
                promise.reject("Advertiser unavailable on this device");
                return;
            }

            byte[] majorBytes = intToByteArray(major);
            byte[] minorBytes = intToByteArray(minor);
            byte[] payloadBytes = payload.getBytes();

            AdvertiseSettings settings = buildAdvertiseSettings();
            AdvertiseData data = buildAdvertiseData(UUID.fromString(sUUID), majorBytes, minorBytes, payloadBytes,
                    companyId);

            tempAdvertiser.startAdvertising(settings, data, tempCallback);

            mAdvertiserList.put(sUUID, tempAdvertiser);
            mAdvertiserCallbackList.put(sUUID, tempCallback);
        } catch (Exception e) {
            promise.reject("Broadcast failed", e);
        }
    }

    private byte[] intToByteArray(int value) {
        return new byte[] {
                (byte) (value >>> 8),
                (byte) value
        };
    }

    private AdvertiseSettings buildAdvertiseSettings() {
        AdvertiseSettings.Builder settingsBuilder = new AdvertiseSettings.Builder();
        settingsBuilder.setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_LOW_LATENCY);
        settingsBuilder.setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_HIGH);
        return settingsBuilder.build();
    }

    // In the BLEAdvertiserModule.java file

    private AdvertiseData buildAdvertiseData(UUID uuid, byte[] major, byte[] minor, byte[] payload, int companyId) {
        byte[] uuidBytes = uuidToByteArray(uuid);
        AdvertiseData.Builder dataBuilder = new AdvertiseData.Builder();
        ByteBuffer mManufacturerData = ByteBuffer.allocate(23); // Reduced from 31 to 23
        mManufacturerData.put((byte) 0x02); // Beacon Identifier
        mManufacturerData.put((byte) 0x15); // Beacon Identifier
        mManufacturerData.put(uuidBytes);
        mManufacturerData.put(major);
        mManufacturerData.put(minor);
        mManufacturerData.put((byte) 0xC5); // Tx power

        // Only add payload if there's space left
        int remainingSpace = mManufacturerData.remaining();
        if (remainingSpace > 0 && payload.length > 0) {
            mManufacturerData.put(payload, 0, Math.min(remainingSpace, payload.length));
        }

        byte[] manufacturerData = new byte[mManufacturerData.position()];
        mManufacturerData.rewind();
        mManufacturerData.get(manufacturerData);

        dataBuilder.addManufacturerData(companyId, manufacturerData);
        return dataBuilder.build();
    }

    private byte[] uuidToByteArray(UUID uuid) {
        ByteBuffer byteBuffer = ByteBuffer.allocate(16);
        byteBuffer.putLong(uuid.getMostSignificantBits());
        byteBuffer.putLong(uuid.getLeastSignificantBits());
        return byteBuffer.array();
    }

    @ReactMethod
    public void stopBroadcast(Promise promise) {
        Log.w("BleAdvertiseModule", "Stop Broadcast call");

        if (mBluetoothAdapter == null) {
            Log.w("BleAdvertiseModule", "mBluetoothAdapter unavailable");
            promise.reject("mBluetoothAdapter unavailable");
            return;
        }

        if (!mBluetoothAdapter.isEnabled()) {
            Log.w("BleAdvertiseModule", "Bluetooth disabled");
            promise.reject("Bluetooth disabled");
            return;
        }

        WritableArray promiseArray = Arguments.createArray();
        Set<String> keys = mAdvertiserList.keySet();
        for (String key : keys) {
            BluetoothLeAdvertiser tempAdvertiser = mAdvertiserList.remove(key);
            AdvertiseCallback tempCallback = mAdvertiserCallbackList.remove(key);
            if (tempAdvertiser != null) {
                tempAdvertiser.stopAdvertising(tempCallback);
                promiseArray.pushString(key);
            }
        }
        promise.resolve(promiseArray);
    }

    @ReactMethod
    public void enableAdapter() {
        if (mBluetoothAdapter == null) {
            return;
        }

        if (mBluetoothAdapter.getState() != BluetoothAdapter.STATE_ON
                && mBluetoothAdapter.getState() != BluetoothAdapter.STATE_TURNING_ON) {
            mBluetoothAdapter.enable();
        }
    }

    @ReactMethod
    public void disableAdapter() {
        if (mBluetoothAdapter == null) {
            return;
        }

        if (mBluetoothAdapter.getState() != BluetoothAdapter.STATE_OFF
                && mBluetoothAdapter.getState() != BluetoothAdapter.STATE_TURNING_OFF) {
            mBluetoothAdapter.disable();
        }
    }

    @ReactMethod
    public void checkIfBLESupported(Promise promise) {
        if (mBluetoothAdapter != null) {
            promise.resolve("80");
        } else {
            promise.resolve("100");
        }
    }

    private class SimpleAdvertiseCallback extends AdvertiseCallback {
        Promise promise;

        public SimpleAdvertiseCallback(Promise promise) {
            this.promise = promise;
        }

        @Override
        public void onStartFailure(int errorCode) {
            super.onStartFailure(errorCode);
            Log.i(NAME, "Advertising failed with code " + errorCode);

            if (promise == null)
                return;

            switch (errorCode) {
                case ADVERTISE_FAILED_FEATURE_UNSUPPORTED:
                    promise.reject("Feature Unsupported", "This feature is not supported on this platform.");
                    break;
                case ADVERTISE_FAILED_TOO_MANY_ADVERTISERS:
                    promise.reject("Too Many Advertisers", "No advertising instance available.");
                    break;
                case ADVERTISE_FAILED_ALREADY_STARTED:
                    promise.reject("Already Started", "Advertising is already started.");
                    break;
                case ADVERTISE_FAILED_DATA_TOO_LARGE:
                    promise.reject("Data Too Large", "Advertising data is too large.");
                    break;
                case ADVERTISE_FAILED_INTERNAL_ERROR:
                    promise.reject("Internal Error", "Internal error occurred.");
                    break;
                default:
                    promise.reject("Unknown Error", "Unknown advertising error occurred.");
                    break;
            }

            promise = null;
        }

        @Override
        public void onStartSuccess(AdvertiseSettings settingsInEffect) {
            super.onStartSuccess(settingsInEffect);
            Log.i(NAME, "Advertising started successfully.");
            if (promise != null) {
                promise.resolve("Advertising started successfully.");
            }
        }
    }
}
