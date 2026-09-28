package com.farmconnect.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiInsightDto {
    private Long id;
    private Long userId;
    private String role;
    private String insightType;
    private String headline;
    private String detailedText;
    private String metricHighlight;
    private String actionableCta;
    private Boolean isDismissed;
    private LocalDateTime createdAt;
}
