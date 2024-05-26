import axios from "axios";
import { config } from "../config";

export const fetchMovies = async (page, sortBy) => {
  const res = await axios.get(
    `${config.baseUrl}/discover/movie?api_key=${config.api_key}&page=${page}&sort_by=${sortBy}`
  );
  return res?.data;
};

export const fetchTvSeries = async (page, sortBy) => {
  const res = await axios.get(
    `${config.baseUrl}/discover/tv?api_key=${config.api_key}&page=${page}&sort_by=${sortBy}`
  );
  return res?.data;
};