import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Package, Heart, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { getOrdersEnhanced } from "@/lib/storage";
import Header from "@/components/Header";
import { Link, useNavigate } from "react-router-dom";

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const { currentUser, logout, updateProfile } = useAuth();
  const { cart, wishlist } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser) {
        setProfileData({
          name: currentUser.name || "",
          email: currentUser.email || "",
          phone: currentUser.phone || "",
        });

        // Load user's orders
        const userOrders = await getOrdersEnhanced().filter(
          (order) => order.customerInfo?.email === currentUser.email
        );
        setOrders(userOrders);
      }
    };

    loadUserData();
  }, [currentUser]);

  const handleProfileUpdate = async () => {
    const result = updateProfile(profileData);
    if (result.success) {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
    } else {
      toast({
        title: "Update Failed",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold">
            Please log in to view your profile
          </h1>
          <Link
            to="/login"
            className="text-purple-600 hover:underline mt-4 inline-block"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {currentUser.name}
                </h2>
                <p className="text-gray-600">{currentUser.email}</p>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "profile"
                      ? "bg-purple-100 text-purple-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </button>

                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "orders"
                      ? "bg-purple-100 text-purple-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Package className="h-5 w-5" />
                  <span>My Orders ({orders.length})</span>
                </button>

                <Link
                  to="/wishlist"
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Heart className="h-5 w-5" />
                  <span>Wishlist ({wishlist.length})</span>
                </Link>

                <Link
                  to="/cart"
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Package className="h-5 w-5" />
                  <span>Cart ({cart.length})</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-bold text-gray-900">
                    My Profile
                  </h1>
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant={isEditing ? "outline" : "default"}
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-lg text-gray-900">
                        {profileData.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <p className="text-lg text-gray-900">{profileData.email}</p>
                    <p className="text-sm text-gray-500">
                      Email cannot be changed
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-lg text-gray-900">
                        {profileData.phone || "Not provided"}
                      </p>
                    )}
                  </div>

                  {isEditing && (
                    <Button
                      onClick={handleProfileUpdate}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Save Changes
                    </Button>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>

                {orders.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      No Orders Yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      You haven't placed any orders yet.
                    </p>
                    <Link to="/">
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        Start Shopping
                      </Button>
                    </Link>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl shadow-lg p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order.id}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()} •
                            Total: ₹{order.total.toFixed(2)}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3 text-sm"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                            <span className="flex-1">{item.name}</span>
                            <span>Qty: {item.quantity}</span>
                            <span>Size: {item.size}</span>
                            <span>Color: {item.color}</span>
                            <span>
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <Link to={`/track-order/${order.id}`}>
                        <Button variant="outline" size="sm">
                          Track Order
                        </Button>
                      </Link>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfilePage;
