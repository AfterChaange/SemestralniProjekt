package cz.osu.demo.entities;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @Column(length = 36)
    private String id;

    private String name;
    private double price;

    public Product() {
        this.id = UUID.randomUUID().toString();
    }

    public Product(String name, double price) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.price = price;
    }

    // getters
    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public double getPrice() {
        return price;
    }

    // setters
    public void setName(String name) {
        this.name = name;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}
