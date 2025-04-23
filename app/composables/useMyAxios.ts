import { useState } from 'react';
import axios from 'axios';


const useMyAxios = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const request = async (url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any, headers?: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const fullUrl = new URL(url, process.env.NEXT_PUBLIC_BASE_URL).toString()
      const response = await axios({
        url: fullUrl,
        method,
        data: body,
        headers: headers
      });
      
      setData(response.data);
      return response; // Возвращаем данные для дальнейшего использования
    } catch (err) {
      setError(err);
      throw err; // Пробрасываем ошибку для обработки в компоненте
    } finally {
      setLoading(false);
    }
  };

  return { request, loading, error, data };
};

export default useMyAxios;