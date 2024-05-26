import axios from "axios";
import { config } from "../config";

export const fetchTrendingAll = async (timeWindow = 'day') => {
  const { data } = await axios.get(
    `${config.baseUrl}/trending/all/${timeWindow}?api_key=${config.api_key}`
  );
  return data?.results;
};

export const fetchTrendingMovies = async (timeWindow = 'day') => {
  const { data } = await axios.get(
    `${config.baseUrl}/trending/movie/${timeWindow}?api_key=${config.api_key}`
  );
  return data?.results;
};

export const fetchTrendingTv = async (timeWindow = 'day') => {
  const { data } = await axios.get(
    `${config.baseUrl}/trending/tv/${timeWindow}?api_key=${config.api_key}`
  );
  return data?.results;
};