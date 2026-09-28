package com.farmconnect.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OfflineSyncDto {
    private List<SyncActionItem> actions;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SyncActionItem {
        private String clientActionId;
        private String actionType; // 'APPLY_JOB', 'POST_JOB', 'SEND_MESSAGE', 'STRUCTURED_RATING'
        private String payloadJson;
        private Long timestamp;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SyncResult {
        private String clientActionId;
        private String status; // 'PROCESSED', 'FAILED', 'CONFLICT'
        private String message;
    }
}
