package com.farmconnect.repository;

import com.farmconnect.entity.OfflineSyncRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OfflineSyncRecordRepository extends JpaRepository<OfflineSyncRecord, Long> {
    List<OfflineSyncRecord> findByUserIdAndSyncStatus(Long userId, OfflineSyncRecord.SyncStatus syncStatus);
    Optional<OfflineSyncRecord> findByClientActionId(String clientActionId);
}
