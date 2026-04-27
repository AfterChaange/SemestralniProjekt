package cz.osu.swi_projekt.entities;

public class SkladovaPolozka {
    private int id;
    private String nazev = "";
    private int mnozstvi;
    private int minLimit;


    public SkladovaPolozka() {}


    public SkladovaPolozka(int id, String nazev, int mnozstvi, int minLimit) {
        this.id = id;
        this.nazev = nazev;
        this.mnozstvi = mnozstvi;
        this.minLimit = minLimit;
    }

    public boolean isJePodLimit() {
        return this.mnozstvi < this.minLimit;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getNazev() { return nazev; }
    public void setNazev(String nazev) { this.nazev = nazev; }

    public int getMnozstvi() { return mnozstvi; }
    public void setMnozstvi(int mnozstvi) { this.mnozstvi = mnozstvi; }

    public int getMinLimit() { return minLimit; }
    public void setMinLimit(int minLimit) { this.minLimit = minLimit; }
}