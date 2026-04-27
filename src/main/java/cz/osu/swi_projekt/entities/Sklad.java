package cz.osu.swi_projekt.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sklady")
public class Sklad {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(columnDefinition = "VARCHAR(36)")
    private String id;

    @Column(nullable = false)
    private String nazev_skladu;

    private String lokalita;

    @JsonIgnore
    @OneToMany(mappedBy = "zdrojSklad")
    private List<SkladovyPohyb> vydaje = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "cilSklad")
    private List<SkladovyPohyb> prijmy = new ArrayList<>();

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
}