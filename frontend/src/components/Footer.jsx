import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="bg-[url('https://images.pexels.com/photos/1955134/pexels-photo-1955134.jpeg')] bg-center bg-cover relative text-white mt-12">
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative max-w-6xl mx-auto px-6 py-16 flex flex-wrap gap-8 justify-around">
        <div className="min-w-[220px]">
          <h3 className="text-xl font-semibold">
            Chasing Horizons
          </h3>
          <p className="mt-2 text-sm opacity-90">
            Explore, Dream, Achieve.
          </p>
        </div>

        <div className="min-w-[180px]">
          <h4 className="font-medium">Quick Links</h4>
          <ul className="mt-2 space-y-1">
            <li>
              <Link to="/tours" className="text-sm">
                Tours
              </Link>
            </li>
            <li>
              <Link to="/hotels" className="text-sm">
                Hotels
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-sm">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="min-w-[180px]">
          <h4 className="font-medium">Follow Us</h4>
          <div className="flex gap-3 mt-2">
            <Link
              to="https://www.youtube.com"
              className="w-8 h-8 bg-white/20 rounded flex items-center justify-center"
            >
              Y
            </Link>
            <Link
              to="https://www.instagram.com"
              className="w-8 h-8 bg-white/20 rounded flex items-center justify-center"
            >
              I
            </Link>
            <Link
              to="https://www.facebook.com"
              className="w-8 h-8 bg-white/20 rounded flex items-center justify-center"
            >
              F
            </Link>
          </div>
        </div>
      </div>

      <div className="relative bg-black/40 text-center py-4 text-sm">
        © {new Date().getFullYear()} Chasing Horizons. All Rights
        Reserved.
      </div>
    </footer>
  );
}
