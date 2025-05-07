import axios from 'axios';
import React, { useEffect, useState, useRef, useCallback } from 'react';

const Dashboard = () => {
  const [materials, setMaterials] = useState([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const loader = useRef(null);

  const fetchMaterials = useCallback(async () => {
    const filter = btoa(JSON.stringify({ Skip: skip, Limit: 20, Types: [1] }));
    setLoading(true);

    try {
      const res = await axios.get(
        `https://sugarytestapi.azurewebsites.net/Materials/GetAll/?filter=${filter}`
      );
      setMaterials((prev) => [...prev, ...res.data.Materials]);
      console.log(res);
    } catch (err) {
      console.error('api error', err);
    } finally {
      setLoading(false);
    }
  }, [skip]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log('Reached bottom — loading more...');
          setSkip((prev) => prev + 20);
        }
      },
      { threshold: 1 }
    );

    if (loader.current) observer.observe(loader.current);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
        Material Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {materials.map((item) => (
          <div
            key={item.Id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4"
          >
            <img
              src={`https://d1wh1xji6f82aw.cloudfront.net/${item.CoverPhoto}`}
              alt={item.Title}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h4 className="text-lg font-semibold text-gray-800 mb-1">
              {item.Title}
            </h4>
            <p className="text-sm text-gray-600 mb-1">
              Brand: {item.BrandName}
            </p>
            <p className="text-sm font-medium text-indigo-600">
              {item.SalesPrice} BDT ($
              {parseFloat(item.SalesPriceInUsd).toFixed(2)})
            </p>
          </div>
        ))}
      </div>

      {/* laoding spinner*/}
      {loading && (
        <div className="flex justify-center mt-6">
          <div className="w-8 h-8 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
        </div>
      )}

      {/* laoder */}
      <div ref={loader} className="h-10 mt-10 flex justify-center items-center">
        <span className="text-sm text-gray-500 animate-pulse">
          Loading more...
        </span>
      </div>
    </div>
  );
};

export default Dashboard;
