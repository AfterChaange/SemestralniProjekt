package cz.osu.swi_projekt.repositories;

import cz.osu.swi_projekt.entities.SkladovaPolozka;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SkladovaPolozkaRepository extends JpaRepository<SkladovaPolozka, String> {
    List<SkladovaPolozka> findByNazevIgnoreCase(String nazev);
}
