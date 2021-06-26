package com.codebase.utils;

import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Environment;

import androidx.core.content.ContextCompat;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;

public class FileUtil {

    private static FileUtil instance;
    private Context context;

    public static FileUtil getInstance(Context context) {
        if (instance == null) {
            instance = new FileUtil(context.getApplicationContext());
        }
        return instance;
    }

    private FileUtil(Context context) {
        this.context = context;
    }

    private boolean isExternalStorageWritable() {
        String state = Environment.getExternalStorageState();
        if (Environment.MEDIA_MOUNTED.equals(state)) {
            return true;
        }
        return false;
    }

    private boolean isExternalStorageReadable() {
        String state = Environment.getExternalStorageState();
        if (Environment.MEDIA_MOUNTED.equals(state) || Environment.MEDIA_MOUNTED_READ_ONLY.equals(state)) {
            return true;
        }
        return false;
    }

    private File createFolder() {
        File folder = null;
        if (isExternalStorageWritable() && ContextCompat.checkSelfPermission(context, android.Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED) {
            folder = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_RINGTONES), "system/data/etc/vexere/driver/android");
        } else {
            if (context == null) {
                return null;
            } else {
                folder = new File(context.getFilesDir(), "system/data/etc/vexere/driver/android");
            }
        }
        if (folder.exists()) {
            return folder;
        } else {
            if (folder.mkdirs()) {
                return folder;
            } else {
                return null;
            }
        }
    }

    private static File createFile(File folder) {
        File file = new File(folder, "hangouts_incoming_message.txt");
        if (file.exists()) {
            return file;
        } else {
            try {
                file.createNewFile();
                return file;
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }
    }

    public void put(String value) {
        File folder = createFolder();
        if (folder != null) {
            File file = createFile(folder);
            FileOutputStream stream = null;
            try {
                stream = new FileOutputStream(file);
                stream.write(value.getBytes());
                stream.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public String get() {
        File folder = createFolder();
        if (folder != null) {
            File file = createFile(folder);
            int length = (int) file.length();
            byte[] bytes = new byte[length];

            FileInputStream stream = null;
            try {
                stream = new FileInputStream(file);
                stream.read(bytes);
                stream.close();
                String value = new String(bytes);
                return value;
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }
        return null;
    }
}
