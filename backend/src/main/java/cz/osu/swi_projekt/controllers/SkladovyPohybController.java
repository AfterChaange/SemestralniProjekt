package cz.osu.swi_projekt.controllers;

import cz.osu.swi_projekt.entities.SkladovyPohyb;
import cz.osu.swi_projekt.service.SkladService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/sklad/pohyby")
public class SkladovyPohybController {

    private final SkladService service;

    public SkladovyPohybController(SkladService service) {
        this.service = service;
    }

    @GetMapping
    public List<SkladovyPohyb> getAllPohyby() {
        return service.getHistorie();
    }

    @GetMapping("/sklad/{id}")
    public List<SkladovyPohyb> getBySklad(@PathVariable String id) {
        return service.getHistorie()
                .stream()
                .filter(p ->
                        (p.getCilSklad() != null && p.getCilSklad().getId().equals(id)) ||
                                (p.getZdrojSklad() != null && p.getZdrojSklad().getId().equals(id))
                )
                .toList();
    }
}