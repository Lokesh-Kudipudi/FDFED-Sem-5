import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BsArrowLeft } from "react-icons/bs";
import ContactForm from "../components/contact/ContactForm";
import InboxModal from "../components/contact/InboxModal";
import ContactImage from "../components/contact/ContactImage";

function Contact() {
  const navigate = useNavigate();
  const [showInbox, setShowInbox] = useState(false);
  const [myQueries, setMyQueries] = useState([]);
  const [loadingQueries, setLoadingQueries] = useState(false);

  const fetchMyQueries = async () => {
    setLoadingQueries(true);
    setShowInbox(true);
    try {
      const response = await fetch("http://localhost:5500/dashboard/api/user/queries", {
        credentials: "include",
      });
      if (response.status === 401 || response.status === 403) {
        toast.error("Please login to view your inbox");
        setShowInbox(false);
        return;
      }
      const data = await response.json();
      if (data.success) {
        setMyQueries(data.data);
      } else {
        toast.error("Failed to load queries");
      }
    } catch (error) {
      console.error("Error fetching queries:", error);
      toast.error("Error loading inbox");
    } finally {
      setLoadingQueries(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative font-sans py-4 px-4"
      style={{
        backgroundImage:
          "url('https://www.tripsavvy.com/thmb/gDYDVvjwO5oQxcE_x4lfmqOdLQ8=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-545247233-5bb7e6a146e0fb0026919fb4.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"></div>

      <div className="flex w-full max-w-[1100px] bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden z-10 animate-slide-up h-[580px] relative">
        
        {/* Back Button */}
        <button 
            onClick={() => navigate("/")}
            className="absolute top-4 left-4 z-20 flex items-center gap-2 text-gray-600 hover:text-[#003366] transition-colors text-sm"
        >
            <BsArrowLeft /> <span>Back to Home</span>
        </button>

        <ContactForm onOpenInbox={fetchMyQueries} />
        <ContactImage />
      </div>

      <InboxModal 
        isOpen={showInbox} 
        onClose={() => setShowInbox(false)} 
        queries={myQueries} 
        loading={loadingQueries} 
      />
    </div>
  );
}

export default Contact;