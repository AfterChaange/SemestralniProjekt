package cz.osu.swi_projekt.controllers;

import cz.osu.swi_projekt.dto.AuthRequest;
import cz.osu.swi_projekt.dto.AuthResponse;
import cz.osu.swi_projekt.entities.User;
import cz.osu.swi_projekt.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody AuthRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return new ResponseEntity<>("Uživatel s tímto jménem již existuje!", HttpStatus.BAD_REQUEST);
        }

        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));

            newUser.setRole("ROLE_USER");

        userRepository.save(newUser);
        return new ResponseEntity<>("Uživatel úspěšně zaregistrován!", HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUser(@RequestBody AuthRequest request) {
        Optional<User> userOptional = userRepository.findByUsername(request.getUsername());

        if (userOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        User user = userOptional.get();

        if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            AuthResponse response = new AuthResponse(user.getUsername(), user.getRole());
            return ResponseEntity.ok(response);
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }
}
