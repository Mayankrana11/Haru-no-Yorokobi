package models;

import java.util.LinkedHashMap;
import java.util.Map;

public class Order {

    private Map<MenuItem, Integer> items = new LinkedHashMap<>();
    private double totalAmount;
    private boolean isPaid;

    public void addItem(MenuItem item, int quantity) {
        if (item == null || quantity <= 0) return;
        items.put(item, items.getOrDefault(item, 0) + quantity);
        calculateTotal();
    }

    private void calculateTotal() {
        totalAmount = 0;
        for (Map.Entry<MenuItem, Integer> entry : items.entrySet()) {
            totalAmount += entry.getKey().getPrice() * entry.getValue();
        }
    }

    public double getTotalAmount() { return totalAmount; }
    public void setPaid(boolean paid) { isPaid = paid; }

    public String getOrderSummary() {
        StringBuilder sb = new StringBuilder("🧾 Order Summary:\n");
        for (Map.Entry<MenuItem, Integer> entry : items.entrySet()) {
            sb.append(String.format(" - %s x%d = ₹%.2f\n",
                    entry.getKey().getDisplayName(),
                    entry.getValue(),
                    entry.getKey().getPrice() * entry.getValue()));
        }
        sb.append(String.format("Total: ₹%.2f\n", totalAmount));
        return sb.toString();
    }
}
