import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";

const AuthCard = ({ imageSrc, imageAlt, imageClassName, children, className }) => {
  return (
    <div className={`flex w-full max-w-[1000px] bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl z-10 animate-slide-up ${className || 'h-[580px]'}`}>
      {/* Left Side - Image */}
      <div className="hidden md:flex w-5/12 relative overflow-hidden">
        <div className="absolute inset-0">
           <img 
            src={imageSrc} 
            alt={imageAlt}
            className={`w-full h-full object-cover opacity-85 ${imageClassName || ''}`}
          />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-7/12 py-6 px-8 flex flex-col justify-center bg-white relative">
        {children}
      </div>
    </div>
  );
};

AuthCard.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  imageAlt: PropTypes.string.isRequired,
  imageClassName: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default AuthCard;
