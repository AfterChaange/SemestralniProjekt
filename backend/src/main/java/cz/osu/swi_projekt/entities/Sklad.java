package cz.osu.swi_projekt.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sklady")
public class Sklad {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "VARCHAR(36)")
    private String id;

    @Column(nullable = false)
    private String nazev_skladu;

    @Column(nullable = false)
    private String lokalita;

    @JsonIgnore
    @OneToMany(mappedBy = "sklad", cascade = CascadeType.ALL)
    private List<SkladovaPolozka> polozky = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "zdrojSklad")
    private List<SkladovyPohyb> vydaje = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "cilSklad")
    private List<SkladovyPohyb> prijmy = new ArrayList<>();

    @JsonIgnore
    @ManyToMany(mappedBy = "sklady")
    private List<User> users = new ArrayList<>();

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    public Sklad() {}

    public String getId() {
        return id;
    }

    public String getNazev_skladu() {
        return nazev_skladu;
    }

    public void setNazev_skladu(String nazev_skladu) {
        this.nazev_skladu = nazev_skladu;
    }

    public String getLokalita() {
        return lokalita;
    }

    public void setLokalita(String lokalita) {
        this.lokalita = lokalita;
    }

    public List<SkladovaPolozka> getPolozky() {
        return polozky;
    }

    public void setPolozky(List<SkladovaPolozka> polozky) {
        this.polozky = polozky;
    }
}