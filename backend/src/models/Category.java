package models;

import java.util.ArrayList;
import java.util.List;

public class Category {

    private String name;
    private List<MenuItem> items;

    public Category(String name) {
        this.name = name;
        this.items = new ArrayList<>();
    }

    public String getName() { return name; }
    public List<MenuItem> getItems() { return items; }

    public void addItem(MenuItem item) { if (item != null) items.add(item); }
    public void removeItem(String englishName) {
        items.removeIf(item -> item.getEnglishName().equalsIgnoreCase(englishName));
    }

    public String listItems() {
        StringBuilder sb = new StringBuilder();
        sb.append("🍱 Category: ").append(name).append("\n");
        for (MenuItem item : items) sb.append(" - ").append(item).append("\n");
        return sb.toString();
    }
}
