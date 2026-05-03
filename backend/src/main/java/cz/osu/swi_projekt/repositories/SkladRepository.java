package cz.osu.swi_projekt.repositories;

import cz.osu.swi_projekt.entities.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SkladRepository extends JpaRepository<Sklad, String> {}

