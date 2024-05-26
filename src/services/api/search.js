import axios from "axios";
import { config } from "../config";

export const fetchSearch = async (query, page) => {
  const res = await axios.get(
    `${config.baseUrl}/search/multi?api_key=${config.api_key}&query=${query}&page=${page}`
  );
  return res?.data;
};