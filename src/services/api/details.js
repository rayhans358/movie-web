import axios from "axios";
import { config } from "../config";

export const fetchDetails = async (type, id) => {
  const res = await axios.get(
    `${config.baseUrl}/${type}/${id}?api_key=${config.api_key}`
  );
  return res?.data;
};