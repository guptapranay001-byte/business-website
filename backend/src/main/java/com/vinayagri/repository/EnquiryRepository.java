package com.vinayagri.repository;

import com.vinayagri.entity.Enquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {
    List<Enquiry> findByTargetFirmId(Long firmId);
    List<Enquiry> findByStatus(Enquiry.EnquiryStatus status);
}
