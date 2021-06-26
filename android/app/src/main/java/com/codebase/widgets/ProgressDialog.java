package com.codebase.widgets;

import android.app.Activity;
import android.app.Dialog;
import android.view.Window;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ProgressBar;

import com.codebase.R;

public class ProgressDialog {

    private static Dialog dialog;

    public static void showLoading(final Activity activity) {
        if (activity != null) {
            activity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    if (dialog != null && dialog.isShowing()) {
                        dialog.dismiss();
                        dialog = null;
                    }

                    dialog = new Dialog(activity, R.style.ProgressDialog);
                    dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
                    dialog.setContentView(R.layout.layout_progress_dialog);

                    Animation animation = AnimationUtils.loadAnimation(activity.getApplicationContext(), R.anim.rotate);
                    ProgressBar progressBar = (ProgressBar) dialog.findViewById(R.id.circular_progress_bar);
                    progressBar.startAnimation(animation);

                    if (dialog != null && !dialog.isShowing()) {
                        dialog.show();
                    }
                }
            });
        }
    }

    public static void hideLoading(final Activity activity) {
        if (activity != null) {
            activity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    if (dialog != null && dialog.isShowing()) {
                        dialog.dismiss();
                        dialog = null;
                    }
                }
            });
        }
    }
}
