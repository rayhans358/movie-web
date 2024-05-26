import { config } from "../config";

export const getImagePath = () => {
  return `${config.image_path}/w500`;
};

export const getImagePathOriginal = () => {
  return `${config.image_path}/original`;
};
