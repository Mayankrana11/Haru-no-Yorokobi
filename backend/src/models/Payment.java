package models;

public class Payment {

    public enum PaymentType { UPI, CARD, CASH }
    public enum PaymentStatus { PENDING, SUCCESS, FAILED }

    private PaymentType type;
    private PaymentStatus status;
    private double amount;
    private String transactionId;

    public Payment(PaymentType type, double amount) {
        this.type = type;
        this.amount = amount;
        this.status = PaymentStatus.PENDING;
        this.transactionId = "TXN" + System.currentTimeMillis();
    }

    public void processPayment() { this.status = PaymentStatus.SUCCESS; }

    @Override
    public String toString() {
        return String.format("Payment[%s | ₹%.2f | %s | %s]",
                type, amount, status, transactionId);
    }
}
