package cz.osu.swidemo.controllers;

import cz.osu.swidemo.entities.ShoppingCartItem;
import cz.osu.swidemo.repositories.ShoppingCartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ShoppingCartItemController {

    @Autowired
    private ShoppingCartItemRepository shoppingCartItemRepository;

    @GetMapping("/shopping-cart-items")
    public List<ShoppingCartItem> getAllShoppingCartItems() {
        return shoppingCartItemRepository.findAll();
    }
}