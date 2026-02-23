package cz.osu.demo.controllers;

import cz.osu.demo.entities.User;
import cz.osu.demo.repositories.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class TestController {

    private final UserRepository userRepository;

    public TestController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // GET http://localhost:8080/users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


}