import React, { useEffect, useState } from 'react';
import axios from 'axios';
const CATEGORIES = ["King","Queen","Prince","Princess","Best Costume Male","Best Costume Female","Best Performance Award"]
export default function App(){
  const [counts, setCounts] = useState<Record<string,number>>({});
  useEffect(()=>{
    const fetchCounts = async ()=>{
      const r = await axios.get('/api/v1/counts');
      setCounts(r.data);
    };
    fetchCounts();
    const id = setInterval(fetchCounts,2000);
    return ()=>clearInterval(id);
  },[]);
  return (
    <div className="min-h-screen bg-wednesday-900 text-wednesday-100 p-6">
      <h1 className="text-4xl font-bold mb-6">Voting Live Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        {CATEGORIES.map(c=>(
          <div key={c} className="p-4 rounded-xl shadow-md bg-wednesday-800">
            <h2 className="text-xl">{c}</h2>
            <p className="text-3xl font-semibold">{counts[c] ?? 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
