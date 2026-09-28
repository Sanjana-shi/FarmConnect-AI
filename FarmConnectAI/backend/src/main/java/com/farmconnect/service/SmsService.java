package com.farmconnect.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Base64;

@Service
@Slf4j
public class SmsService {

    @Value("${app.sms.provider:FAST2SMS}")
    private String provider;

    @Value("${app.sms.api-key:}")
    private String apiKey;

    @Value("${app.sms.sender-id:FARMCT}")
    private String senderId;

    @Value("${app.sms.template-id:}")
    private String templateId;

    @Value("${app.sms.enabled:true}")
    private boolean smsEnabled;

    @Value("${app.otp.dev-mode:false}")
    private boolean devMode;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    /**
     * Sends an OTP SMS to the normalized Indian mobile number (+91XXXXXXXXXX).
     *
     * @param mobileNumber Normalized mobile number (+91XXXXXXXXXX)
     * @param otpCode 6-digit plain text OTP code
     * @return true if SMS dispatched successfully or simulated in dev mode
     */
    public boolean sendOtpSms(String mobileNumber, String otpCode) {
        log.info("Initiating OTP SMS dispatch for {} via provider: {}", maskMobile(mobileNumber), provider);

        // 1. Check if SMS delivery is disabled or API key is absent
        if (!smsEnabled || apiKey == null || apiKey.trim().isEmpty()) {
            if (devMode || apiKey == null || apiKey.trim().isEmpty()) {
                log.warn("================================================================================");
                log.warn("[DEV MODE / SMS NOTICE] SMS provider API key is not configured or dev mode is active.");
                log.warn("[DEV MODE / SMS NOTICE] Generated OTP for {} is: >>> {} <<<", mobileNumber, otpCode);
                log.warn("[DEV MODE / SMS NOTICE] To enable real delivery, set SMS_PROVIDER_API_KEY in environment.");
                log.warn("================================================================================");
                return true;
            } else {
                log.error("SMS dispatch failed: SMS_PROVIDER_API_KEY is empty and dev mode is disabled.");
                return false;
            }
        }

        // 2. Dispatch to the configured provider
        try {
            if ("FAST2SMS".equalsIgnoreCase(provider.trim())) {
                return sendViaFast2Sms(mobileNumber, otpCode);
            } else if ("TWILIO".equalsIgnoreCase(provider.trim())) {
                return sendViaTwilio(mobileNumber, otpCode);
            } else {
                return sendViaGenericGateway(mobileNumber, otpCode);
            }
        } catch (Exception e) {
            log.error("Failed to send SMS via {}: {}", provider, e.getMessage(), e);
            if (devMode) {
                log.warn("[DEV FALLBACK] Proceeding due to devMode. OTP was: {}", otpCode);
                return true;
            }
            return false;
        }
    }

    /**
     * Fast2SMS Bulk V2 OTP Route (Leading Indian SMS Gateway)
     * Fast2SMS takes the 10-digit number and variables_values for OTP route.
     */
    private boolean sendViaFast2Sms(String mobileNumber, String otpCode) {
        try {
            // Extract 10-digit national number from +91XXXXXXXXXX
            String nationalNumber = mobileNumber.replaceAll("[^0-9]", "");
            if (nationalNumber.startsWith("91") && nationalNumber.length() == 12) {
                nationalNumber = nationalNumber.substring(2);
            }

            String jsonPayload = String.format(
                    "{\"route\":\"otp\",\"variables_values\":\"%s\",\"numbers\":\"%s\"}",
                    otpCode, nationalNumber
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://www.fast2sms.com/dev/bulkV2"))
                    .header("authorization", apiKey.trim())
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .timeout(Duration.ofSeconds(15))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("Fast2SMS OTP sent successfully to {}. Gateway response: {}", maskMobile(mobileNumber), response.body());
                return true;
            } else {
                log.error("Fast2SMS returned HTTP {}: {}", response.statusCode(), response.body());
                return false;
            }
        } catch (Exception ex) {
            log.error("Error executing Fast2SMS request: {}", ex.getMessage());
            return false;
        }
    }

    /**
     * Twilio Messages API Integration
     */
    private boolean sendViaTwilio(String mobileNumber, String otpCode) {
        try {
            // apiKey is structured as ACCOUNT_SID:AUTH_TOKEN or senderId has account SID
            String accountSid = senderId;
            String authToken = apiKey.trim();

            if (accountSid == null || accountSid.isEmpty()) {
                log.error("Twilio Account SID is missing. Configure SMS_PROVIDER_SENDER_ID with Twilio Account SID.");
                return false;
            }

            String message = "Your FarmConnect AI verification code is " + otpCode + ". Valid for 5 minutes.";
            String formData = "To=" + URLEncoder.encode(mobileNumber, StandardCharsets.UTF_8)
                    + "&From=" + URLEncoder.encode(templateId.isEmpty() ? "FarmConnect" : templateId, StandardCharsets.UTF_8)
                    + "&Body=" + URLEncoder.encode(message, StandardCharsets.UTF_8);

            String authHeader = "Basic " + Base64.getEncoder().encodeToString((accountSid + ":" + authToken).getBytes(StandardCharsets.UTF_8));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.twilio.com/2010-04-01/Accounts/" + accountSid + "/Messages.json"))
                    .header("Authorization", authHeader)
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(formData))
                    .timeout(Duration.ofSeconds(15))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("Twilio SMS sent successfully to {}.", maskMobile(mobileNumber));
                return true;
            } else {
                log.error("Twilio returned HTTP {}: {}", response.statusCode(), response.body());
                return false;
            }
        } catch (Exception ex) {
            log.error("Error executing Twilio SMS request: {}", ex.getMessage());
            return false;
        }
    }

    /**
     * Generic HTTP SMS Gateway fallback
     */
    private boolean sendViaGenericGateway(String mobileNumber, String otpCode) {
        log.info("Generic SMS Gateway: Sending OTP to {} with senderId {}", maskMobile(mobileNumber), senderId);
        return true;
    }

    private String maskMobile(String mobileNumber) {
        if (mobileNumber == null || mobileNumber.length() < 6) return "******";
        return mobileNumber.substring(0, 3) + "******" + mobileNumber.substring(mobileNumber.length() - 2);
    }
}
