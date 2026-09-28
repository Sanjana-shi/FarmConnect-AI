package com.farmconnect.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StructuredRatingDto {
    private Long id;
    private Long jobId;
    private Long fromUserId;
    private String fromUserName;
    private Long toUserId;
    private String toUserName;
    private BigDecimal overallRating;
    private BigDecimal attendanceRating;
    private BigDecimal workQualityRating;
    private BigDecimal punctualityRating;
    private BigDecimal communicationRating;
    private String feedbackComments;
    private LocalDateTime createdAt;
}
