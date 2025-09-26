import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

const Footer = ({ categories = [] }) => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <ShoppingBag className="h-8 w-8 text-purple-400" />
              <span className="text-2xl font-bold">MegaMart</span>
            </div>
            <p className="text-gray-400">
              Your destination for premium fashion and style.
            </p>
          </div>
          <div>
            <span className="text-lg font-semibold mb-4 block">
              Quick Links
            </span>
            <div className="space-y-2">
              <Link
                to="/"
                className="text-gray-400 hover:text-white transition-colors block"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-gray-400 hover:text-white transition-colors block"
              >
                Products
              </Link>
              <Link
                to="/contact"
                className="text-gray-400 hover:text-white transition-colors block"
              >
                Contact
              </Link>
              <Link
                to="/cart"
                className="text-gray-400 hover:text-white transition-colors block"
              >
                Cart
              </Link>
            </div>
          </div>
          <div>
            <span className="text-lg font-semibold mb-4 block">Categories</span>
            <div className="space-y-2">
              {categories.length > 0 ? (
                categories.slice(1, 4).map((cat) => (
                  <Link
                    key={cat}
                    to={`/products?category=${cat}`}
                    className="text-gray-400 hover:text-white transition-colors block capitalize"
                  >
                    {cat}
                  </Link>
                ))
              ) : (
                <>
                  <span className="text-gray-400 block">Shoes</span>
                  <span className="text-gray-400 block">Apparel</span>
                  <span className="text-gray-400 block">Accessories</span>
                </>
              )}
            </div>
          </div>
          <div>
            <span className="text-lg font-semibold mb-4 block">
              Contact Info
            </span>
            <div className="space-y-2 text-gray-400">
              <p>Email: jiridavidproise@gmail.com</p>
              <p>Phone: +91 904 098 9360</p>
              <p>
                Address: Kings Palace 26 (Star City), KIIT University,
                Bhubaneswar, Odisha
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 MegaMart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
