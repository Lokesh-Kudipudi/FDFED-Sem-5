import Header from "../components/Header";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";
import ItineraryCard from "../components/ItineraryCard";

export default function Home({ user }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        <img
          src="https://static3.businessinsider.com/image/54cfea306bb3f7d1181b774b/10-travel-destinations-that-are-trending-right-now.jpg"
          alt="hero"
          className="absolute inset-0 w-full h-full object-cover brightness-50"
        />
        <div className="relative z-10 text-white px-4">
          <h1 className="text-5xl font-bold mb-4">
            Chasing Horizons
          </h1>
          <p className="text-lg opacity-80">
            Explore, Dream, Achieve.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-6 text-center max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-red-600 mb-8">
          Our Services
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="w-64 bg-white rounded-xl p-6 shadow hover:shadow-lg transform hover:-translate-y-1 transition">
            <img
              className="w-20 h-20 mx-auto mb-4"
              src="https://cdn-icons-png.flaticon.com/128/12238/12238406.png"
              alt=""
            />
            <h3 className="font-semibold mb-2">
              Personalized Travel Packages
            </h3>
            <p className="text-sm text-gray-600">
              Tailored itineraries crafted for your preferences.
            </p>
          </div>
          <div className="w-64 bg-white rounded-xl p-6 shadow hover:shadow-lg transform hover:-translate-y-1 transition">
            <img
              className="w-20 h-20 mx-auto mb-4"
              src="https://cdn-icons-png.flaticon.com/128/3009/3009489.png"
              alt=""
            />
            <h3 className="font-semibold mb-2">Hotel Booking</h3>
            <p className="text-sm text-gray-600">
              Book Hotels at your destination place.
            </p>
          </div>
          <div className="w-64 bg-white rounded-xl p-6 shadow hover:shadow-lg transform hover:-translate-y-1 transition">
            <img
              className="w-20 h-20 mx-auto mb-4"
              src="https://cdn-icons-png.flaticon.com/128/1052/1052866.png"
              alt=""
            />
            <h3 className="font-semibold mb-2">Affordable</h3>
            <p className="text-sm text-gray-600">
              Competitive pricing and great value.
            </p>
          </div>
        </div>
      </section>

      {/* Itineraries */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-semibold text-red-600">
            Find your next adventure
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-3">
            Browse through itineraries and guides crafted by
            fellow travelers. Get inspired by real experiences
            and detailed plans for your next adventure.
          </p>
        </div>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ItineraryCard
            title="Golden Triangle Tour: Delhi, Agra & Jaipur"
            description="Discover India's rich history and architectural wonders with this Golden Triangle Tour covering Delhi, Agra, and Jaipur."
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Lotus_Temple_in_New_Delhi_03-2016.jpg/1024px-Lotus_Temple_in_New_Delhi_03-2016.jpg"
            href="/tours/tour/T67890"
          />
          <ItineraryCard
            title="JW Marriott Hotel Mumbai"
            description="Located in the heart of Mumbai, JW Marriott Hotel Mumbai offers luxurious accommodations."
            image="https://cf.bstatic.com/xdata/images/hotel/max1024x768/519403307.jpg?k=f0b5f969ab27c629a8528b5aab3b757ed2db8a6e15f62b846a6034c31323f355&o=&hp=1"
            href="/hotels/hotel/H12345"
          />
          <ItineraryCard
            title="Puerto Rico Coast Escape"
            description="Relax by beautiful beaches and explore local culture."
            image="https://images.pexels.com/photos/2859515/pexels-photo-2859515.jpeg"
            href="/tours/tour/T23456"
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-red-600 text-center mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="p-4 border rounded">
              <summary className="cursor-pointer font-medium">
                How do I find travel deals?
              </summary>
              <p className="mt-2 text-gray-600">
                Subscribe to our newsletter and follow seasonal
                promotions on the deals page.
              </p>
            </details>
            <details className="p-4 border rounded">
              <summary className="cursor-pointer font-medium">
                What payment methods are accepted?
              </summary>
              <p className="mt-2 text-gray-600">
                We accept major credit cards, debit cards and
                selected digital wallets.
              </p>
            </details>
            <details className="p-4 border rounded">
              <summary className="cursor-pointer font-medium">
                How can I manage my bookings?
              </summary>
              <p className="mt-2 text-gray-600">
                Log in to your account and go to Dashboard &gt;
                Bookings to view and modify reservations.
              </p>
            </details>
          </div>
        </div>
      </section>

      <Footer />

      <Chatbot />
    </div>
  );
}
