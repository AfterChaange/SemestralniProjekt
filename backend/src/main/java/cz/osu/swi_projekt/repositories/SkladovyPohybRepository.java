package cz.osu.swi_projekt.repositories;

import cz.osu.swi_projekt.entities.SkladovyPohyb;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SkladovyPohybRepository extends JpaRepository<SkladovyPohyb, String> {
    List<SkladovyPohyb> findByCilSklad_Id(String skladId);
    List<SkladovyPohyb> findByZdrojSklad_Id(String skladId);
    void deleteByPolozka_Id(String polozkaId);
}