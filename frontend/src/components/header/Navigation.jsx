import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <nav className="flex gap-8 items-center">
      <Link
        className="text-[#003366] font-semibold hover:text-[#003366] transition-colors relative group"
        to="/tours"
      >
        Tours
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#003366] group-hover:w-full transition-all duration-300"></span>
      </Link>
      <Link
        className="text-[#003366] font-semibold hover:text-[#003366] transition-colors relative group"
        to="/hotels"
      >
        Hotels
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#003366] group-hover:w-full transition-all duration-300"></span>
      </Link>
      <Link
        className="text-[#003366] font-semibold hover:text-[#003366] transition-colors relative group"
        to="/contact"
      >
        Contact Us
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#003366] group-hover:w-full transition-all duration-300"></span>
      </Link>
    </nav>
  );
}
