package cz.osu.swi_projekt.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "skladove_pohyby")
public class SkladovyPohyb {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "VARCHAR(36)")
    private String id;

    @ManyToOne
    @JoinColumn(name = "polozka_id", nullable = false)
    private SkladovaPolozka polozka;

    @ManyToOne
    @JoinColumn(name = "zdroj_sklad_id")
    private Sklad zdrojSklad;

    @ManyToOne
    @JoinColumn(name = "cil_sklad_id")
    private Sklad cilSklad;

    private LocalDateTime datum;

    private Integer mnozstvi;

    private String typPohybu;

    @PrePersist
    public void onCreate() {
        this.datum = LocalDateTime.now();
    }

    public SkladovyPohyb() {}

    public String getId() {
        return id;
    }

    public LocalDateTime getDatum() {
        return datum;
    }

    public SkladovaPolozka getPolozka() {
        return polozka;
    }

    public void setPolozka(SkladovaPolozka polozka) {
        this.polozka = polozka;
    }

    public Sklad getZdrojSklad() {
        return zdrojSklad;
    }

    public void setZdrojSklad(Sklad zdrojSklad) {
        this.zdrojSklad = zdrojSklad;
    }

    public Sklad getCilSklad() {
        return cilSklad;
    }

    public void setCilSklad(Sklad cilSklad) {
        this.cilSklad = cilSklad;
    }

    public Integer getMnozstvi() {
        return mnozstvi;
    }

    public void setMnozstvi(Integer mnozstvi) {
        this.mnozstvi = mnozstvi;
    }

    public String getTypPohybu() {
        return typPohybu;
    }

    public void setTypPohybu(String typPohybu) {
        this.typPohybu = typPohybu;
    }

}