package com.codebase.utils;

import android.content.Context;
import android.content.SharedPreferences;

public class SharedPreferencesUtil {

    private static SharedPreferencesUtil instance;
    private Context context;

    public static SharedPreferencesUtil getInstance(Context context) {
        if (instance == null) {
            instance = new SharedPreferencesUtil(context.getApplicationContext());
        }
        return instance;
    }

    private SharedPreferencesUtil(Context context) {
        this.context = context;
    }

    public void put(String key, Object value) {
        SharedPreferences mPreferences = context.getSharedPreferences("AppSharedPreferences", Context.MODE_PRIVATE);
        SharedPreferences.Editor mEditor = mPreferences.edit();

        if (value instanceof Boolean) {
            mEditor.putBoolean(key, (Boolean) value);
        } else if (value instanceof Integer) {
            mEditor.putInt(key, (Integer) value);
        } else if (value instanceof Float) {
            mEditor.putFloat(key, (Float) value);
        } else if (value instanceof Long) {
            mEditor.putLong(key, (Long) value);
        } else if (value instanceof String) {
            mEditor.putString(key, (String) value);
        } else if (value instanceof Enum) {
            mEditor.putString(key, value.toString());
        } else if (value != null) {
            throw new RuntimeException("Attempting to save non-supported preference");
        }

        mEditor.apply();
    }

    public <T> T get(String key, T defValue) {
        SharedPreferences mPreferences = context.getSharedPreferences("AppSharedPreferences", Context.MODE_PRIVATE);
        T returnValue = (T) mPreferences.getAll().get(key);
        return returnValue == null ? defValue : returnValue;
    }
}
