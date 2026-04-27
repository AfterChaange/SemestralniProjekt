package cz.osu.swi_projekt.service;

import cz.osu.swi_projekt.entities.SkladovaPolozka;
import cz.osu.swi_projekt.entities.SkladovyPohyb;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SkladService {
    private List<SkladovaPolozka> seznamPolozek = new ArrayList<>();
    private List<SkladovyPohyb> historie = new ArrayList<>();

    public SkladService() {
        naskladnit("NVIDIA RTX 4070", 3, 5);
        naskladnit("AMD Radeon RX 7800 XT", 4, 3);
        naskladnit("SSD 2TB Samsung 980 Pro", 12, 5);
        naskladnit("HDD 4TB WD Red Plus", 8, 4);
        naskladnit("Externí disk 1TB", 25, 10);
        naskladnit("Zdroj 750W Gold", 10, 6);
        naskladnit("Chladič CPU Noctua", 6, 4);
        naskladnit("Vodní chlazení 240mm", 3, 2);
        naskladnit("Mechanická klávesnice RGB", 15, 8);
        naskladnit("Herní myš optická", 22, 10);
        naskladnit("Monitor 27\" IPS 144Hz", 7, 5);
        naskladnit("HDMI kabel 2m", 50, 20);
        naskladnit("Teplovodivá pasta", 30, 15);
        naskladnit("USB Flash disk 64GB", 45, 15);
    }

    public void naskladnit(String nazev, int mnozstvi, int limit) {
        SkladovaPolozka polozka = seznamPolozek.stream()
                .filter(p -> p.getNazev().equalsIgnoreCase(nazev))
                .findFirst()
                .orElse(null);

        int idPolozky;

        if (polozka != null) {
            polozka.setMnozstvi(polozka.getMnozstvi() + mnozstvi);
            idPolozky = polozka.getId();
        } else {
            int noveId = seznamPolozek.stream().mapToInt(SkladovaPolozka::getId).max().orElse(0) + 1;
            SkladovaPolozka novaPolozka = new SkladovaPolozka(noveId, nazev, mnozstvi, limit);
            seznamPolozek.add(novaPolozka);
            idPolozky = novaPolozka.getId();
        }

        historie.add(new SkladovyPohyb(
                historie.stream().mapToInt(SkladovyPohyb::getId).max().orElse(0) + 1,
                idPolozky,
                mnozstvi,
                LocalDateTime.now(),
                "Naskladnění"
        ));
    }

    public void vyskladnit(SkladovaPolozka polozka, int pocet) {
        if (polozka.getMnozstvi() >= pocet) {
            polozka.setMnozstvi(polozka.getMnozstvi() - pocet);
            historie.add(new SkladovyPohyb(
                    historie.stream().mapToInt(SkladovyPohyb::getId).max().orElse(0) + 1,
                    polozka.getId(),
                    -pocet,
                    LocalDateTime.now(),
                    "Vyskladnění"
            ));
        }
    }

    public void smazatPolozku(SkladovaPolozka polozka) {
        if (polozka != null) {
            seznamPolozek.remove(polozka);
        }
    }

    public double vypocitejDenniSpotrebu(int idPolozky) {
        List<SkladovyPohyb> odchozi = historie.stream()
                .filter(h -> h.getPolozkaId() == idPolozky && h.getZmenaMnozstvi() < 0)
                .sorted((h1, h2) -> h1.getDatum().compareTo(h2.getDatum()))
                .collect(Collectors.toList());

        if (odchozi.isEmpty()) {
            return 0.0;
        }

        int celkemOdchozi = odchozi.stream().mapToInt(h -> Math.abs(h.getZmenaMnozstvi())).sum();
        LocalDateTime firstDate = odchozi.get(0).getDatum();
        long days = Math.max(1L, Duration.between(firstDate, LocalDateTime.now()).toDays());

        return (double) celkemOdchozi / days;
    }

    public List<SkladovaPolozka> getSeznamPolozek() { return seznamPolozek; }
    public List<SkladovyPohyb> getHistorie() { return historie; }
}