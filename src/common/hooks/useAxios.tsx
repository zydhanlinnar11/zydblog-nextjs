import { useState, useEffect } from 'react'
import axios from 'axios'

export const backendFetcher = axios.create({
  withCredentials: true,
})
type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

const useAxios = (
  url: string,
  method: HttpMethod,
  body: object = {},
  headers: object = {},
  axiosInstance = backendFetcher
) => {
  const [response, setResponse] = useState(null)
  const [error, setError] = useState('')
  const [loading, setloading] = useState(true)

  useEffect(() => {
    const fetchData = () => {
      axiosInstance[method](url, headers, body)
        .then((res) => {
          setResponse(res.data)
        })
        .catch((err) => {
          setError(err)
        })
        .finally(() => {
          setloading(false)
        })
    }

    fetchData()
  }, [method, url, body, headers, axiosInstance])

  return { response, error, loading }
}

export default useAxios
