package com.vinayagri.repository;

import com.vinayagri.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySku(String sku);
    List<Product> findByActiveTrue();
    List<Product> findByCategoryIdAndActiveTrue(Long categoryId);
    List<Product> findByFirmIdAndActiveTrue(Long firmId);
    List<Product> findByCategoryIdAndFirmIdAndActiveTrue(Long categoryId, Long firmId);
    List<Product> findByBrandIdAndActiveTrue(Long brandId);

    Page<Product> findByActiveTrue(Pageable pageable);
    Page<Product> findByCategoryIdAndActiveTrue(Long categoryId, Pageable pageable);
    Page<Product> findByFirmIdAndActiveTrue(Long firmId, Pageable pageable);
    Page<Product> findByCategoryIdAndFirmIdAndActiveTrue(Long categoryId, Long firmId, Pageable pageable);
}
