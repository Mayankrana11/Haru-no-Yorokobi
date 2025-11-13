import { useEffect, useState } from "react";
import IpadFrame from "../components/IpadFrame";
import PaymentQR from "../components/PaymentQR";

export default function Payment() {
  const [amount,setAmount]=useState(0);

  useEffect(()=>{
    const stored = sessionStorage.getItem("orderTotal");
    setAmount(stored?Number(stored):0);
  },[]);

  const handlePaid=()=>{
    setTimeout(()=>{
      window.location.href="/confirmation";
    },1500);
  };

  return (
    <IpadFrame>
      <div className="w-full h-full flex flex-col items-center justify-center gap-8">
        <h1 className="text-3xl font-bold">Scan to Pay</h1>
        <PaymentQR amount={amount} />
        <button
          onClick={handlePaid}
          className="bg-pink-500 text-white px-8 py-3 rounded-xl text-lg shadow-lg">
          I Have Paid
        </button>
      </div>
    </IpadFrame>
  );
}
