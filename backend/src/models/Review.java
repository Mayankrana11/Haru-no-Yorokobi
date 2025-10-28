package models;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Review {

    private String customerName;
    private int rating;
    private String comment;
    private LocalDateTime timestamp;

    public Review(String customerName, int rating, String comment) {
        this.customerName = (customerName == null || customerName.isEmpty()) ? "Anonymous" : customerName;
        this.rating = Math.max(1, Math.min(rating, 5));
        this.comment = comment;
        this.timestamp = LocalDateTime.now();
    }

    public int getRating() { return rating; }

    public String toCSV() {
        return String.format("%s,%d,%s,%s",
                customerName.replace(",", ""),
                rating,
                comment.replace(",", ""),
                timestamp.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    }

    @Override
    public String toString() {
        return String.format("⭐ %d/5 by %s: \"%s\" (%s)",
                rating, customerName, comment,
                timestamp.format(DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm")));
    }
}
