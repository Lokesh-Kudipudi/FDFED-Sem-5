import PropTypes from 'prop-types';

const AuthLayout = ({ backgroundImage, children }) => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative py-4 px-4"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"></div>
      {children}
    </div>
  );
};

AuthLayout.propTypes = {
  backgroundImage: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default AuthLayout;
