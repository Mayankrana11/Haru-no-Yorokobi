package models;

public class MenuItem {

    private String japaneseName;
    private String englishName;
    private String description;
    private double price;
    private String category;
    private String imagePath;

    public MenuItem(String japaneseName, String englishName, String description,
                    double price, String category, String imagePath) {
        this.japaneseName = japaneseName;
        this.englishName = englishName;
        this.description = description;
        this.price = price;
        this.category = category;
        this.imagePath = imagePath;
    }

    public String getJapaneseName() { return japaneseName; }
    public String getEnglishName() { return englishName; }
    public String getDescription() { return description; }
    public double getPrice() { return price; }
    public String getCategory() { return category; }
    public String getImagePath() { return imagePath; }

    public String getDisplayName() {
        return japaneseName + " (" + englishName + ")";
    }

    @Override
    public String toString() {
        return String.format("%s (%s) - ₹%.2f | %s",
                japaneseName, englishName, price, category);
    }
}
