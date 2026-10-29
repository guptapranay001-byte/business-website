package com.vinayagri.repository;

import com.vinayagri.entity.Firm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FirmRepository extends JpaRepository<Firm, Long> {
    Optional<Firm> findByCode(String code);
    List<Firm> findByActiveTrue();
}
