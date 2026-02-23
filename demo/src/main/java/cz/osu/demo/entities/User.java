package cz.osu.demo.entities;

import jakarta.persistence.*;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String name;

    public User() {
        this.id = UUID.randomUUID().toString();
    }

    public User(String name, String email) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.email = email;
    }

    // getters
    public String getId() { return id; }
    public String getEmail() { return email; }
    public String getName() { return name; }

    // setters
    public void setEmail(String email) { this.email = email; }
    public void setName(String name) { this.name = name; }
}