package cz.osu.swidemo.repositories;

import cz.osu.swidemo.entities.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, String> {
    // zde můžeš přidat vlastní metody, pokud budeš chtít např. hledat podle kódu
    // Optional<Subject> findByCode(String code);
}