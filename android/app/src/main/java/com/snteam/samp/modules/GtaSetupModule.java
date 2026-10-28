package com.snteam.samp.modules;

import android.app.Activity;
import android.content.Intent;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.snteam.samp.MainGTA;

public class GtaSetupModule extends ReactContextBaseJavaModule {

    ReactApplicationContext context = getReactApplicationContext();

    GtaSetupModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void startGame(Promise promise) {
        try {
            Activity activity = getCurrentActivity();
            if (activity == null) {
                promise.reject("Error", "No current activity");
                return;
            }

            Intent intent = new Intent(context, MainGTA.class);
            intent.putExtras(activity.getIntent());
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(intent);

            // Resolve before finishing so the JS promise settles cleanly.
            promise.resolve(null);

            // Move launcher to background instead of destroying it so the
            // React Native instance stays alive for the return trip.
            activity.moveTaskToBack(true);

        } catch (Exception e) {
            promise.reject("Error", e);
        }
    }

    @NonNull
    @Override
    public String getName() {
        return "GtaSetupModule";
    }
}
