package com.codebase.modules;

import android.content.pm.PackageManager;

import com.codebase.utils.DeviceUtil;
import com.codebase.widgets.ProgressDialog;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;
import java.util.Map;

public class CBNativeModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    private static final String APP_VERSION = "appVersion";
    private static final String APP_BUILD = "buildVersion";
    private static final String APP_ID = "bundleIdentifier";
    private static final String IMEI = "imei";

    public CBNativeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "CBNative";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        final PackageManager packageManager = this.reactContext.getPackageManager();
        final String packageName = this.reactContext.getPackageName();
        try {
            constants.put(APP_VERSION, packageManager.getPackageInfo(packageName, 0).versionName);
            constants.put(APP_BUILD, packageManager.getPackageInfo(packageName, 0).versionCode);
            constants.put(APP_ID, packageName);
            constants.put(IMEI, DeviceUtil.getImei(reactContext));
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return constants;
    }

    @ReactMethod
    public void showLoading() {
        ProgressDialog.showLoading(getCurrentActivity());
    }

    @ReactMethod
    public void hideLoading() {
        ProgressDialog.hideLoading(getCurrentActivity());
    }

    @ReactMethod
    public void exitApp() {
        System.exit(0);
    }
}
