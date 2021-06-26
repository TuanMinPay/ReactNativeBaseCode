package com.codebase.utils;

import android.content.Context;

import java.util.UUID;

public class DeviceUtil {

    public static String getImei(Context context) {
        String imei = SharedPreferencesUtil.getInstance(context).get("KEY_IMEI", "");
        if (imei == null || imei.equals("")) {
            imei = FileUtil.getInstance(context).get();
            if (imei == null || imei.equals("")) {
                imei = UUID.randomUUID().toString().toUpperCase();
            }
        }
        SharedPreferencesUtil.getInstance(context).put("KEY_IMEI", imei);
        FileUtil.getInstance(context).put(imei);
        return imei;
    }
}
