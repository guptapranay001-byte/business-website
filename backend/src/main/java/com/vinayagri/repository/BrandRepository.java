package com.vinayagri.repository;

import com.vinayagri.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {
    Optional<Brand> findByCode(String code);
    List<Brand> findByActiveTrue();
}
