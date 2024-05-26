import PropTypes from "prop-types";

const VideoPoster = ({ id, small }) => {
  return (
    <iframe
      width="100%"
      height={small ? "150" : "500"}
      src={`https://www.youtube.com/embed/${id}`}
      title="YouTube video player"
      allowFullScreen
    ></iframe >
  );
};

VideoPoster.propTypes = {
  id: PropTypes.string.isRequired,
  small: PropTypes.bool
};

export default VideoPoster;