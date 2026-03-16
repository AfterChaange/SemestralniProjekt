package cz.osu.swidemo.repositories;

import cz.osu.swidemo.entities.ShoppingCartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ShoppingCartItemRepository extends JpaRepository<ShoppingCartItem, String> {

    // metoda podle názvu vytvoří query: SELECT * FROM shopping_cart_items WHERE user_id = ?
    List<ShoppingCartItem> findByUserId(String userId);

}