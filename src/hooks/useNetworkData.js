import { useState, useEffect } from 'react';

export const useNetworkData = (selectedDataset) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Update the path to use the correct public URL
        const basePath = import.meta.env.BASE_URL || '/';
        const response = await fetch(`${basePath}data/${selectedDataset}.json`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const processedData = await response.json();
        setData(processedData);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDataset]);

  return { data, loading, error };
};