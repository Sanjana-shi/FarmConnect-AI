package com.farmconnect.app.utils;

import android.content.Context;
import android.content.SharedPreferences;

public class SessionManager {

    private static final String PREF_NAME = "farmconnect_session";
    private static final String KEY_TOKEN = "jwt_token";
    private static final String KEY_ROLE = "user_role";
    private static final String KEY_USER_ID = "user_id";
    private static final String KEY_MOBILE = "mobile_number";
    private static final String KEY_LANGUAGE = "app_language";
    private static final String KEY_BACKEND_URL = "backend_url";
    public static final String DEFAULT_BACKEND_URL = "http://10.0.2.2:8080/";

    private final SharedPreferences prefs;

    public SessionManager(Context context) {
        prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
    }

    public void saveAuthSession(String token, String role, Long userId, String mobile) {
        prefs.edit()
                .putString(KEY_TOKEN, token)
                .putString(KEY_ROLE, role)
                .putLong(KEY_USER_ID, userId != null ? userId : -1)
                .putString(KEY_MOBILE, mobile)
                .apply();
    }

    public String getToken() { return prefs.getString(KEY_TOKEN, null); }
    public String getRole() { return prefs.getString(KEY_ROLE, null); }
    public Long getUserId() { return prefs.getLong(KEY_USER_ID, 1L); }
    public String getMobile() { return prefs.getString(KEY_MOBILE, null); }

    public void saveLanguage(String langCode) {
        prefs.edit().putString(KEY_LANGUAGE, langCode).apply();
    }

    public String getLanguage() {
        return prefs.getString(KEY_LANGUAGE, "en");
    }

    public String getBackendUrl() {
        return prefs.getString(KEY_BACKEND_URL, DEFAULT_BACKEND_URL);
    }

    public void saveBackendUrl(String url) {
        if (url != null && !url.trim().isEmpty()) {
            String sanitized = url.trim();
            if (!sanitized.endsWith("/")) {
                sanitized += "/";
            }
            prefs.edit().putString(KEY_BACKEND_URL, sanitized).apply();
        }
    }

    public void resetBackendUrl() {
        prefs.edit().remove(KEY_BACKEND_URL).apply();
    }

    public boolean isLoggedIn() {
        return getToken() != null && !getToken().isEmpty();
    }

    public void clearSession() {
        prefs.edit().clear().apply();
    }
}
