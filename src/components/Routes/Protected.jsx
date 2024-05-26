import { Navigate } from "react-router-dom";
import { useAuth } from "../../services/context/useAuth";
import PropTypes from "prop-types";

const Protected = ({ children }) => {
  const { user, loadingUser } = useAuth();

  if (loadingUser) {
    return null;
  }

  return <>{user ? children : <Navigate to={"/"} />}</>
};

export default Protected;

Protected.propTypes = {
  children: PropTypes.node.isRequired
};