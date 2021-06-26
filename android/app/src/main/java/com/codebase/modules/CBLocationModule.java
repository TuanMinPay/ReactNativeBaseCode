package com.codebase.modules;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;

public class CBLocationModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    private Location location;
    private LocationListener locationListener;
    private LocationManager locationManager;
    private FusedLocationProviderClient fusedLocationProviderClient;

    public CBLocationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        locationManager = (LocationManager) this.reactContext.getSystemService(Context.LOCATION_SERVICE);
        fusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(this.reactContext);
    }

    @Override
    public String getName() {
        return "CBLocation";
    }

    @ReactMethod
    public void getCurrentLocation(final Callback callback) {
        if (checkPermission()) {
            location = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
            if (location != null) {
                WritableMap params = Arguments.createMap();
                params.putDouble("longitude", location.getLongitude());
                params.putDouble("latitude", location.getLatitude());
                params.putDouble("speed", location.getSpeed());
                params.putDouble("altitude", location.getAltitude());
                params.putDouble("accuracy", location.getAccuracy());
                params.putDouble("course", location.getBearing());
                callback.invoke(params);
            } else {
                fusedLocationProviderClient.getLastLocation()
                        .addOnSuccessListener(getCurrentActivity(), new OnSuccessListener<Location>() {
                            @Override
                            public void onSuccess(Location location) {
                                if (location != null) {
                                    WritableMap params = Arguments.createMap();
                                    params.putDouble("longitude", location.getLongitude());
                                    params.putDouble("latitude", location.getLatitude());
                                    params.putDouble("speed", location.getSpeed());
                                    params.putDouble("altitude", location.getAltitude());
                                    params.putDouble("accuracy", location.getAccuracy());
                                    params.putDouble("course", location.getBearing());
                                    callback.invoke(params);
                                } else {
                                    callback.invoke("");
                                }
                            }
                        })
                        .addOnFailureListener(getCurrentActivity(), new OnFailureListener() {
                            @Override
                            public void onFailure(@NonNull Exception e) {
                                callback.invoke("");
                            }
                        });
            }
        } else {
            callback.invoke("");
        }
    }

    @ReactMethod
    public void startUpdatingLocation() {
        locationListener = new LocationListener() {
            @Override
            public void onLocationChanged(Location loc) {
                location = loc;
                if (location != null) {
                    WritableMap params = Arguments.createMap();
                    params.putDouble("longitude", location.getLongitude());
                    params.putDouble("latitude", location.getLatitude());
                    params.putDouble("speed", location.getSpeed());
                    params.putDouble("altitude", location.getAltitude());
                    params.putDouble("accuracy", location.getAccuracy());
                    params.putDouble("course", location.getBearing());

                    sendEvent(reactContext, "CBLocationChange", params);
                }
            }

            @Override
            public void onStatusChanged(String provider, int status, Bundle extras) {

            }

            @Override
            public void onProviderEnabled(String provider) {

            }

            @Override
            public void onProviderDisabled(String provider) {

            }
        };

        if (checkPermission()) {
            locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1000, 100, locationListener);
        }
    }

    @ReactMethod
    public void stopUpdatingLocation() {
        try {
            locationManager.removeUpdates(locationListener);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private boolean checkPermission() {
        return ContextCompat.checkSelfPermission(getReactApplicationContext(), Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
                && ContextCompat.checkSelfPermission(getReactApplicationContext(), Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED;
    }

    private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        if (reactContext.hasActiveCatalystInstance()) {
            reactContext
                    .getJSModule(RCTDeviceEventEmitter.class)
                    .emit(eventName, params);
        }
    }
}
