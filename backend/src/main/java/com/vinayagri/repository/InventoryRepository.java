package com.vinayagri.repository;

import com.vinayagri.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    List<Inventory> findByFirmId(Long firmId);
    List<Inventory> findByProductId(Long productId);
    Optional<Inventory> findByProductIdAndFirmIdAndBatchNumber(Long productId, Long firmId, String batchNumber);
}
