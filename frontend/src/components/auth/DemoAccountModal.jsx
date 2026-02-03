import PropTypes from 'prop-types';

const DemoAccountModal = ({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null;

  const demoUsers = [
    { 
      label: "User", 
      role: "Traveler",
      email: "user@gmail.com",
      color: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    },
    { 
      label: "Admin", 
      role: "Administrator",
      email: "admin@gmail.com",
      color: "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    },
    { 
      label: "Hotel Manager", 
      role: "Manager",
      email: "hotelmanager@gmail.com",
      color: "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    },
    { 
      label: "Tour Guide", 
      role: "Guide",
      email: "tourguide@gmail.com",
      color: "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100",
      icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-slide-up relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white z-10 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#003366] to-[#001a33] px-6 py-8 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
           <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Select Demo Account</h2>
            <p className="text-blue-100">
              Choose a role to explore the platform
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-3">
            {demoUsers.map((user) => (
              <button
                key={user.label}
                onClick={() => {
                    onLogin(user.email, "12345678");
                    onClose();
                }}
                className={`flex items-center gap-4 p-4 border rounded-xl transition-all duration-200 group relative overflow-hidden ${user.color}`}
              >
                <div className="p-3 bg-white rounded-full shadow-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={user.icon} />
                  </svg>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-lg font-bold">{user.label}</span>
                  <span className="text-sm opacity-75">{user.role}</span>
                </div>
                
                {/* Hover Effect */}
                <div className="absolute right-4 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                   </svg>
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-6 text-center">
             <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium hover:underline transition-all"
             >
                Cancel
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

DemoAccountModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
};

export default DemoAccountModal;
