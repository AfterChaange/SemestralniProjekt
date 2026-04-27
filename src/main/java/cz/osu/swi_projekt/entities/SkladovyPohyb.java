package cz.osu.swi_projekt.entities;

import java.time.LocalDateTime;

public class SkladovyPohyb {
    private int id;
    private int polozkaId;
    private int zmenaMnozstvi;
    private LocalDateTime datum = LocalDateTime.now();
    private String typPohybu = "";

    public SkladovyPohyb() {}

    public SkladovyPohyb(int id, int polozkaId, int zmenaMnozstvi, LocalDateTime datum, String typPohybu) {
        this.id = id;
        this.polozkaId = polozkaId;
        this.zmenaMnozstvi = zmenaMnozstvi;
        this.datum = datum;
        this.typPohybu = typPohybu;
    }


    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getPolozkaId() { return polozkaId; }
    public void setPolozkaId(int polozkaId) { this.polozkaId = polozkaId; }

    public int getZmenaMnozstvi() { return zmenaMnozstvi; }
    public void setZmenaMnozstvi(int zmenaMnozstvi) { this.zmenaMnozstvi = zmenaMnozstvi; }

    public LocalDateTime getDatum() { return datum; }
    public void setDatum(LocalDateTime datum) { this.datum = datum; }

    public String getTypPohybu() { return typPohybu; }
    public void setTypPohybu(String typPohybu) { this.typPohybu = typPohybu; }
}