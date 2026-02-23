package cz.osu.demo;

import cz.osu.demo.entities.Product;
import cz.osu.demo.repositories.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @Bean
    CommandLineRunner initDatabase(ProductRepository productRepository) {
        return args -> {

            Product p1 = new Product("Notebook", 25000);
            Product p2 = new Product("Myš", 500);
            Product p3 = new Product("Klávesnice", 1200);

            productRepository.save(p1);
            productRepository.save(p2);
            productRepository.save(p3);

            System.out.println("Produkty byly vytvořeny.");
        };
    }
}