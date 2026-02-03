import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";

const AuthHeader = ({ title, subtitle }) => {
  const navigate = useNavigate();
  
  return (
    <>
      <div
      onClick={() => navigate("/")} 
        className="absolute  top-6 right-6 flex items-center gap-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
      >
         <span className="text-sm font-medium text-gray-600" >Back to Home</span>
      </div>

      <div className="mb-8 text-center md:text-left animate-slide-up">
        <div className="flex justify-center md:justify-start items-center gap-3 mb-4">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="h-10 w-10 cursor-pointer"
            onClick={() => navigate("/")}
          />
          <span className="text-xl font-bold text-[#003366]">
            Chasing Horizons
          </span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-500 mt-2">{subtitle}</p>
      </div>
    </>
  );
};

AuthHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
};

export default AuthHeader;
