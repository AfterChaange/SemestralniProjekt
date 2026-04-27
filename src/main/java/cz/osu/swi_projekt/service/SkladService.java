package cz.osu.swi_projekt.service;

import cz.osu.swi_projekt.entities.SkladovaPolozka;
import cz.osu.swi_projekt.entities.SkladovyPohyb;
import cz.osu.swi_projekt.repositories.SkladovaPolozkaRepository;
import cz.osu.swi_projekt.repositories.SkladovyPohybRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SkladService {

    private final SkladovaPolozkaRepository polozkaRepo;
    private final SkladovyPohybRepository pohybRepo;

    public SkladService(SkladovaPolozkaRepository polozkaRepo,
                        SkladovyPohybRepository pohybRepo) {
        this.polozkaRepo = polozkaRepo;
        this.pohybRepo = pohybRepo;
    }

    public void naskladnit(String nazev, int mnozstvi, int limit) {

        SkladovaPolozka polozka = polozkaRepo.findAll()
                .stream()
                .filter(p -> p.getNazev().equalsIgnoreCase(nazev))
                .findFirst()
                .orElse(null);

        if (polozka != null) {
            polozka.setMnozstvi(polozka.getMnozstvi() + mnozstvi);
        } else {
            polozka = new SkladovaPolozka();
            polozka.setNazev(nazev);
            polozka.setMnozstvi(mnozstvi);
            polozka.setMinLimit(limit);
        }

        polozkaRepo.save(polozka);

        SkladovyPohyb pohyb = new SkladovyPohyb();
        pohyb.setPolozka(polozka);
        pohyb.setMnozstvi(mnozstvi);
        pohyb.setTypPohybu("NASKLADNENI");

        pohybRepo.save(pohyb);
    }

    public void vyskladnit(String polozkaId, int pocet) {

        SkladovaPolozka polozka = polozkaRepo.findById(polozkaId)
                .orElseThrow();

        if (polozka.getMnozstvi() < pocet) return;

        polozka.setMnozstvi(polozka.getMnozstvi() - pocet);
        polozkaRepo.save(polozka);

        SkladovyPohyb pohyb = new SkladovyPohyb();
        pohyb.setPolozka(polozka);
        pohyb.setMnozstvi(-pocet);
        pohyb.setTypPohybu("VYSKLADNENI");

        pohybRepo.save(pohyb);
    }

    public void smazatPolozku(String polozkaId) {
        polozkaRepo.deleteById(polozkaId);
    }

    public double vypocitejDenniSpotrebu(String polozkaId) {

        List<SkladovyPohyb> odchozi = pohybRepo.findAll()
                .stream()
                .filter(h -> h.getPolozka().getId().equals(polozkaId)
                        && h.getMnozstvi() < 0)
                .sorted((a, b) -> a.getDatum().compareTo(b.getDatum()))
                .toList();

        if (odchozi.isEmpty()) {
            return 0.0;
        }

        int celkemOdchozi = odchozi.stream()
                .mapToInt(h -> Math.abs(h.getMnozstvi()))
                .sum();

        LocalDateTime firstDate = odchozi.get(0).getDatum();

        long days = Math.max(1,
                Duration.between(firstDate, LocalDateTime.now()).toDays()
        );

        return (double) celkemOdchozi / days;
    }

    public List<SkladovaPolozka> getSeznamPolozek() {
        return polozkaRepo.findAll();
    }

    public List<SkladovyPohyb> getHistorie() {
        return pohybRepo.findAll();
    }
}