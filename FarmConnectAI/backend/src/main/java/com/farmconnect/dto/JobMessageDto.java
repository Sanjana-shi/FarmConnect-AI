package com.farmconnect.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobMessageDto {
    private Long id;
    private Long jobId;
    private Long senderUserId;
    private String senderName;
    private String senderRole;
    private Long receiverUserId;
    private String receiverName;
    private String messageText;
    private Boolean isTemplate;
    private String templateType;
    private Boolean isRead;
    private LocalDateTime sentAt;
}
