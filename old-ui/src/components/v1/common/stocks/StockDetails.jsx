import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getStockDetails } from '../api';

const StockDetails = () => {

    let { symbol } = useParams();

    const [stockDetail, setStockDetail] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        // first
        try {
            const response = await getStockDetails(symbol)
            if (response.status === 200) {
                setStockDetail(response.data.stock)
            }
        } catch (error) {
          console.error(error);
        }
      }

      fetchData(symbol);
    
      return () => {
        // second
      }
    }, [symbol])
    

  return (
    <div>StockDetails {symbol}</div>
  )
}

export default StockDetails