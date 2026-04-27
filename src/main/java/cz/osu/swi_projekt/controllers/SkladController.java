package cz.osu.swi_projekt.controllers;

import cz.osu.swi_projekt.service.SkladService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sklad")
public class SkladController {

    private final SkladService service;

    public SkladController(SkladService service) {
        this.service = service;
    }

    @PostMapping("/naskladnit")
    public void naskladnit(
            @RequestParam String nazev,
            @RequestParam int mnozstvi,
            @RequestParam int limit
    ) {
        service.naskladnit(nazev, mnozstvi, limit);
    }

    @PostMapping("/vyskladnit")
    public void vyskladnit(
            @RequestParam String polozkaId,
            @RequestParam int mnozstvi
    ) {
        service.vyskladnit(polozkaId, mnozstvi);
    }

    @DeleteMapping("/smazat")
    public void smazat(@RequestParam String polozkaId) {
        service.smazatPolozku(polozkaId);
    }

    @GetMapping("/spotreba")
    public double spotreba(@RequestParam String polozkaId) {
        return service.vypocitejDenniSpotrebu(polozkaId);
    }

    @GetMapping("/polozky")
    public Object getPolozky() {
        return service.getSeznamPolozek();
    }

    @GetMapping("/historie")
    public Object getHistorie() {
        return service.getHistorie();
    }
}