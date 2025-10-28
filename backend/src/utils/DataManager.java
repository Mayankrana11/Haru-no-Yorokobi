package utils;

import models.*;
import java.io.*;
import java.nio.file.*;
import java.util.*;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

/**
 * Handles reading and writing of data files (menu.json and reviews.csv).
 * Acts as a lightweight data access layer for the restaurant app.
 */
public class DataManager {

    //  Corrected paths
    private static final String MENU_FILE = "data/menu.json";
    private static final String REVIEWS_FILE = "data/reviews.csv";

    // LOAD MENU DATA 
    public static List<Category> loadMenu() {
        List<Category> categories = new ArrayList<>();
        JSONParser parser = new JSONParser();

        try (Reader reader = Files.newBufferedReader(Paths.get(MENU_FILE))) {
            JSONArray categoryArray = (JSONArray) parser.parse(reader);

            for (Object obj : categoryArray) {
                JSONObject categoryJson = (JSONObject) obj;
                String categoryName = (String) categoryJson.get("category");
                JSONArray itemsArray = (JSONArray) categoryJson.get("items");

                Category category = new Category(categoryName);

                for (Object itemObj : itemsArray) {
                    JSONObject itemJson = (JSONObject) itemObj;

                    String jpName = (String) itemJson.get("japaneseName");
                    String enName = (String) itemJson.get("englishName");
                    String desc = (String) itemJson.get("description");
                    double price = ((Number) itemJson.get("price")).doubleValue();
                    String imagePath = (String) itemJson.get("imagePath");

                    MenuItem item = new MenuItem(jpName, enName, desc, price, categoryName, imagePath);
                    category.addItem(item);
                }

                categories.add(category);
            }
        } catch (IOException | ParseException e) {
            System.err.println("⚠️ Error loading menu: " + e.getMessage());
        }

        return categories;
    }

    //  LOAD REVIEWS 
    public static List<Review> loadReviews() {
        List<Review> reviews = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new FileReader(REVIEWS_FILE))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] parts = line.split(",", 4);
                if (parts.length == 4) {
                    String name = parts[0].trim();
                    int rating = Integer.parseInt(parts[1].trim());
                    String comment = parts[2].trim();
                    reviews.add(new Review(name, rating, comment));
                }
            }
        } catch (IOException e) {
            System.err.println("⚠️ Error loading reviews: " + e.getMessage());
        }

        return reviews;
    }

    //  SAVE NEW REVIEW 
    public static void saveReview(Review review) {
        try (FileWriter writer = new FileWriter(REVIEWS_FILE, true)) {
            writer.write(review.toCSV() + "\n");
        } catch (IOException e) {
            System.err.println("⚠️ Error saving review: " + e.getMessage());
        }
    }

    //  HELPER: CALCULATE AVERAGE RATING 
    public static double calculateAverageRating(List<Review> reviews) {
        if (reviews.isEmpty()) return 0.0;
        double total = 0;
        for (Review r : reviews) total += r.getRating();
        return total / reviews.size();
    }

    //  DEBUG / DEMO 
    public static void printMenu(List<Category> categories) {
        for (Category cat : categories) {
            System.out.println(cat.listItems());
        }
    }
}
