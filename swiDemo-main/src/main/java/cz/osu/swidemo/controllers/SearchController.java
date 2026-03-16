package cz.osu.swidemo.controllers;

import cz.osu.swidemo.entities.Subject;
import cz.osu.swidemo.entities.User;
import cz.osu.swidemo.repositories.SubjectRepository;
import cz.osu.swidemo.repositories.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SearchController {

    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;

    public SearchController(UserRepository userRepository, SubjectRepository subjectRepository) {
        this.userRepository = userRepository;
        this.subjectRepository = subjectRepository;
    }

    @GetMapping("/search")
    public Object search(
            @RequestParam("type") String type,
            @RequestParam("id") String id
    ) {
        if ("user".equalsIgnoreCase(type)) {
            User user = userRepository.findById(id).orElse(null);
            if (user != null) {
                return user.getSubjects(); // vrátí seznam předmětů
            } else {
                return List.of(); // prázdný seznam
            }
        } else if ("subject".equalsIgnoreCase(type)) {
            Subject subject = subjectRepository.findById(id).orElse(null);
            if (subject != null) {
                return subject.getUsers(); // předpokládáš metodu getUsers() v Subject
            } else {
                return List.of();
            }
        }
        return List.of();
    }
}