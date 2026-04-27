package cz.osu.swi_projekt.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "skladove_polozky")
public class SkladovaPolozka {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(columnDefinition = "VARCHAR(36)")
    private String id;

    @Column(nullable = false)
    private String nazev = "";

    private int mnozstvi;

    private int minLimit;

    @JsonIgnore
    @OneToMany(mappedBy = "polozka")
    private List<SkladovyPohyb> pohyby = new ArrayList<>();

    public SkladovaPolozka() {}

    public SkladovaPolozka(String id, String nazev, int mnozstvi, int minLimit) {
        this.id = id;
        this.nazev = nazev;
        this.mnozstvi = mnozstvi;
        this.minLimit = minLimit;
    }


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNazev() {
        return nazev;
    }

    public void setNazev(String nazev) {
        this.nazev = nazev;
    }

    public int getMnozstvi() {
        return mnozstvi;
    }

    public void setMnozstvi(int mnozstvi) {
        this.mnozstvi = mnozstvi;
    }

    public int getMinLimit() {
        return minLimit;
    }

    public void setMinLimit(int minLimit) {
        this.minLimit = minLimit;
    }

    public boolean isJePodLimit() {
        return mnozstvi < minLimit;
    }
}