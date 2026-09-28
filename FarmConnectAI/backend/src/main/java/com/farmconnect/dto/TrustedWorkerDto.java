package com.farmconnect.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrustedWorkerDto {
    private Long id;
    private Long farmerId;
    private Long workerId;
    private String workerName;
    private String workerMobile;
    private String photoUrl;
    private List<String> skills;
    private BigDecimal rating;
    private Integer reliabilityScore;
    private Integer timesHired;
    private LocalDateTime lastHiredAt;
    private String notes;
    private Boolean isFavorite;
    private Double mutualRating;
}
