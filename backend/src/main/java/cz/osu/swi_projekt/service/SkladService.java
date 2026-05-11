package cz.osu.swi_projekt.service;

import cz.osu.swi_projekt.entities.SkladovaPolozka;
import cz.osu.swi_projekt.entities.SkladovyPohyb;
import cz.osu.swi_projekt.entities.Sklad;
import cz.osu.swi_projekt.entities.User;
import cz.osu.swi_projekt.repositories.SkladovaPolozkaRepository;
import cz.osu.swi_projekt.repositories.SkladovyPohybRepository;
import cz.osu.swi_projekt.repositories.SkladRepository;
import cz.osu.swi_projekt.repositories.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SkladService {

    private final SkladovaPolozkaRepository polozkaRepo;
    private final SkladovyPohybRepository pohybRepo;
    private final SkladRepository skladRepo;
    private UserRepository userRepository;

    public SkladService(SkladovaPolozkaRepository polozkaRepo,
                        SkladovyPohybRepository pohybRepo,
                        SkladRepository skladRepo,
                        UserRepository userRepository) {
        this.polozkaRepo = polozkaRepo;
        this.pohybRepo = pohybRepo;
        this.skladRepo = skladRepo;
        this.userRepository = userRepository;
    }

    public void naskladnit(String nazev, int mnozstvi, int limit, String skladId) {

        Sklad sklad = null;
        if (skladId != null && !skladId.isEmpty()) {
            sklad = skladRepo.findById(skladId).orElse(null);
        }

        Sklad finalSklad = sklad;

        SkladovaPolozka polozka = polozkaRepo.findAll()
                .stream()
                .filter(p -> p.getNazev().equalsIgnoreCase(nazev)
                        && (finalSklad == null || (p.getSklad() != null && p.getSklad().getId().equals(finalSklad.getId()))))
                .findFirst()
                .orElse(null);

        boolean isNew = false;

        if (polozka != null) {
            polozka.setMnozstvi(polozka.getMnozstvi() + mnozstvi);
        } else {
            isNew = true;

            polozka = new SkladovaPolozka();
            polozka.setNazev(nazev);
            polozka.setMnozstvi(mnozstvi);
            polozka.setMinLimit(limit);
            polozka.setSklad(sklad);
        }

        polozkaRepo.save(polozka);

        SkladovyPohyb pohyb = new SkladovyPohyb();
        pohyb.setPolozka(polozka);
        pohyb.setMnozstvi(mnozstvi);
        pohyb.setCilSklad(sklad);
        pohyb.setTypPohybu(isNew ? "VYTVORENI_A_NASKLADNENI" : "NASKLADNENI");

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
        pohyb.setZdrojSklad(polozka.getSklad());
        pohybRepo.save(pohyb);
    }

    @Transactional
    public void smazatPolozku(String polozkaId) {
        pohybRepo.deleteByPolozka_Id(polozkaId);
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

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Not authenticated");
        }

        String username = auth.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getSklady()
                .stream()
                .flatMap(sklad -> sklad.getPolozky().stream())
                .toList();
    }


    public List<Sklad> getSeznamSkladu() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();


        System.out.println("AUTH: " + auth);
        System.out.println("NAME: " + auth.getName());
        System.out.println("AUTHENTICATED: " + auth.isAuthenticated());

        User user = userRepository.findByUsername(username)
                .orElseThrow();


        return user.getSklady();
    }

    public List<SkladovyPohyb> getHistorie() {
        return pohybRepo.findAll();
    }
}
