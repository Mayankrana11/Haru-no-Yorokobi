import { useEffect, useState } from "react";
import IpadFrame from "../components/IpadFrame";

export default function Reviews() {
  const [reviews,setReviews]=useState([]);
  const [name,setName]=useState("");
  const [rating,setRating]=useState(0);
  const [comment,setComment]=useState("");

  useEffect(()=>{
    const r = JSON.parse(localStorage.getItem("reviews")||"[]");
    setReviews(r);
  },[]);

  const submit=()=>{
    const newR = [...reviews,{name,rating,comment,ts:Date.now()}];
    localStorage.setItem("reviews",JSON.stringify(newR));
    setReviews(newR);
    setName(""); setRating(0); setComment("");
  };

  return (
    <IpadFrame>
      <div className="p-10 overflow-y-auto h-full">
        <h1 className="text-3xl font-bold text-center mb-6">Customer Reviews</h1>

        <div className="bg-white p-6 rounded-2xl shadow mb-6">
          <p className="font-bold mb-2">Your Rating</p>
          <div className="flex gap-2">
            {[1,2,3,4,5].map(n=>(
              <button key={n} onClick={()=>setRating(n)}>
                <div className={`text-3xl ${rating>=n?'text-yellow-400':'text-gray-300'}`}>★</div>
              </button>
            ))}
          </div>

          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" className="border p-2 w-full rounded mt-4" />
          <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Write a review..." className="border p-2 w-full rounded mt-4 h-24"></textarea>

          <button onClick={submit} className="bg-pink-500 text-white w-full mt-4 py-2 rounded-xl">
            Submit Review
          </button>
        </div>

        <h2 className="text-xl font-bold mb-4">Recent Reviews</h2>

        {reviews.map((r,i)=>(
          <div key={i} className="bg-white p-4 rounded-xl shadow mb-3">
            <div className="font-bold">{r.name||"Anonymous"}</div>
            <div className="text-yellow-400">{'★'.repeat(r.rating)}</div>
            <div className="text-sm mt-1">{r.comment}</div>
          </div>
        ))}
      </div>
    </IpadFrame>
  );
}
