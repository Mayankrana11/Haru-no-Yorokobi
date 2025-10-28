import models.*;
import utils.*;
import java.util.*;

/**
 * Main test class for Haru no Yorokobi backend.
 * Simulates menu loading, ordering, payments, and review saving.
 */
public class Main {

    public static void main(String[] args) {

        System.out.println("🌸 Welcome to Haru no Yorokobi - Backend Simulation 🌸");
        System.out.println("----------------------------------------------------\n");

        //  Load Menu
        List<Category> categories = DataManager.loadMenu();
        if (categories.isEmpty()) {
            System.out.println("⚠️ No menu data found. Please check 'menu.json'.");
            return;
        }

        System.out.println("✅ Menu loaded successfully!\n");
        DataManager.printMenu(categories);

        //  Create a new order
        Order order = new Order();

        // Example: add 1 item from Sushi and 2 from Ramen (for testing)
        MenuItem sushiItem = categories.get(0).getItems().get(0);
        MenuItem ramenItem = categories.get(1).getItems().get(0);

        order.addItem(sushiItem, 1);
        order.addItem(ramenItem, 2);

        System.out.println("\n🧾 Current Order:");
        System.out.println(order.getOrderSummary());

        //  Simulate Payment
        Payment payment = new Payment(Payment.PaymentType.UPI, order.getTotalAmount());
        payment.processPayment();
        order.setPaid(true);

        System.out.println("\n💳 Payment Details:");
        System.out.println(payment);

        //  Save a sample review
        Review review = new Review("Mayank", 5, "Excellent sushi and ramen! Loved the ambiance.");
        DataManager.saveReview(review);
        System.out.println("\n⭐ New review saved successfully!");

        // Show average rating (after saving)
        List<Review> reviews = DataManager.loadReviews();
        double avgRating = DataManager.calculateAverageRating(reviews);

        System.out.printf("\n📊 Current Average Rating: %.1f / 5 (%d reviews)\n",
                avgRating, reviews.size());

        System.out.println("\n🌸 Simulation complete. Backend working perfectly!");
    }
}
