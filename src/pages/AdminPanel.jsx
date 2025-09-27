import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  Users,
  BarChart3,
  Settings,
  Home,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ProductForm from "@/components/ProductForm";
import ProductList from "@/components/ProductList";
import {
  getProducts,
  getOrders, 
  updateOrder,
  saveProduct,
  deleteProduct,
} from "@/api/EcommerceApi";
import { getUsersEnhanced } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("products");
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const { toast } = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
    loadOrders();
    loadCustomers();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const loadProducts = async () => {
    const storedProducts = await getProducts();
    setProducts(storedProducts);
  };

  const loadOrders = async () => {
    const storedOrders = await getOrders();
    setOrders(storedOrders);
  };

  const loadCustomers = async () => {
    const storedUsers = await getUsersEnhanced();
    // Filter out admin users and only show regular customers
    const customersOnly = storedUsers.filter((user) => user.role !== "admin");
    setCustomers(customersOnly);
  };

  const handleOrderUpdate = async (orderId, status) => {
    try {
      await updateOrder(orderId, { status });
      await loadOrders();
      toast({
        title: "Order Updated",
        description: `Order status changed to ${status}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        await saveProduct({ ...productData, id: editingProduct.id });
        toast({
          title: "Product Updated!",
          description: "Product has been successfully updated.",
        });
      } else {
        await saveProduct(productData);
        toast({
          title: "Product Added!",
          description: "New product has been successfully added.",
        });
      }
      await loadProducts();
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId);
      await loadProducts();
      toast({
        title: "Product Deleted!",
        description: "Product has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const sidebarItems = [
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: BarChart3 },
    { id: "customers", label: "Customers", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "products":
        return (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Products</h2>
                <p className="text-gray-600 mt-2">
                  Manage your product catalog
                </p>
              </div>
              <Button
                onClick={() => {
                  setEditingProduct(null);
                  setShowProductForm(true);
                }}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            {showProductForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <ProductForm
                  product={editingProduct}
                  onSave={handleSaveProduct}
                  onCancel={() => {
                    setShowProductForm(false);
                    setEditingProduct(null);
                  }}
                />
              </motion.div>
            )}

            <ProductList
              products={products}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          </div>
        );
      case "orders":
        return (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Orders</h2>
                <p className="text-gray-600 mt-2">
                  Manage customer orders and track their status.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {orders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    No Orders Yet
                  </h3>
                  <p className="text-gray-600">
                    Orders will appear here once customers place them.
                  </p>
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
                          Total: ₹
                          {order.totalAmount?.toFixed(2) ||
                            order.total?.toFixed(2) ||
                            "0.00"}
                        </p>
                        {order.customerInfo && (
                          <p className="text-sm text-gray-600">
                            Customer: {order.customerInfo.name} •{" "}
                            {order.customerInfo.phone}
                            {order.customerInfo.email &&
                              ` • ${order.customerInfo.email}`}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "confirmed"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "paid"
                              ? "bg-green-100 text-green-800"
                              : order.status === "shipped"
                              ? "bg-purple-100 text-purple-800"
                              : order.status === "delivered"
                              ? "bg-indigo-100 text-indigo-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                        {order.paymentMethod && (
                          <p className="text-xs text-gray-500 mt-1">
                            Payment: {order.paymentMethod.replace("_", " ")}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2 mb-4">
                      <h4 className="font-medium text-gray-900">Items:</h4>
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 text-sm bg-gray-50 p-2 rounded"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <span className="flex-1 font-medium">
                            {item.name}
                          </span>
                          <span>Qty: {item.quantity}</span>
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                          <span className="font-semibold">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address */}
                    {order.shippingAddress && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-1">
                          Shipping Address:
                        </h4>
                        <p className="text-sm text-blue-800">
                          {order.shippingAddress.street ||
                            order.shippingAddress.address}
                          {order.shippingAddress.city &&
                            `, ${order.shippingAddress.city}`}
                          {order.shippingAddress.state &&
                            `, ${order.shippingAddress.state}`}
                          {order.shippingAddress.zipCode &&
                            ` - ${order.shippingAddress.zipCode}`}
                          {order.shippingAddress.country &&
                            `, ${order.shippingAddress.country}`}
                        </p>
                      </div>
                    )}

                    {/* Order Notes */}
                    {order.notes && (
                      <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                        <h4 className="font-medium text-yellow-900 mb-1">
                          Order Notes:
                        </h4>
                        <p className="text-sm text-yellow-800">{order.notes}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      {order.status === "pending" && (
                        <>
                          <Button
                            onClick={() =>
                              handleOrderUpdate(order.id, "confirmed")
                            }
                            className="bg-green-600 hover:bg-green-700"
                          >
                            ✓ Confirm Order
                          </Button>
                          <Button
                            onClick={() =>
                              handleOrderUpdate(order.id, "cancelled")
                            }
                            variant="destructive"
                          >
                            ✗ Cancel Order
                          </Button>
                        </>
                      )}
                      {order.status === "confirmed" && (
                        <Button
                          onClick={() => handleOrderUpdate(order.id, "paid")}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          💰 Mark as Paid
                        </Button>
                      )}
                      {order.status === "paid" && (
                        <Button
                          onClick={() => handleOrderUpdate(order.id, "shipped")}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          📦 Mark as Shipped
                        </Button>
                      )}
                      {order.status === "shipped" && (
                        <Button
                          onClick={() =>
                            handleOrderUpdate(order.id, "delivered")
                          }
                          className="bg-indigo-600 hover:bg-indigo-700"
                        >
                          ✅ Mark as Delivered
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      case "customers":
        return (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Customers</h2>
                <p className="text-gray-600 mt-2">
                  Manage and view customer information and order history.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {customers.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    No Customers Yet
                  </h3>
                  <p className="text-gray-600">
                    Customer accounts will appear here once users register.
                  </p>
                </div>
              ) : (
                customers.map((customer) => (
                  <div
                    key={customer.id}
                    className="bg-white rounded-2xl shadow-lg p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {customer.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {customer.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          Joined:{" "}
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          Last login:{" "}
                          {customer.lastLogin
                            ? new Date(customer.lastLogin).toLocaleDateString()
                            : "Never"}
                        </p>
                      </div>
                    </div>

                    {/* Customer Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900">
                          Total Orders
                        </h4>
                        <p className="text-2xl font-bold text-blue-600">
                          {customer.orderCount || 0}
                        </p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-green-900">
                          Total Spent
                        </h4>
                        <p className="text-2xl font-bold text-green-600">
                          ₹{customer.totalSpent?.toFixed(2) || "0.00"}
                        </p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-medium text-purple-900">
                          Avg Order Value
                        </h4>
                        <p className="text-2xl font-bold text-purple-600">
                          ₹{customer.avgOrderValue?.toFixed(2) || "0.00"}
                        </p>
                      </div>
                    </div>

                    {/* Customer Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          Contact Information
                        </h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>
                            <strong>Email:</strong> {customer.email}
                          </p>
                          {customer.phone && (
                            <p>
                              <strong>Phone:</strong> {customer.phone}
                            </p>
                          )}
                          <p>
                            <strong>Username:</strong> {customer.username}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          Account Status
                        </h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>
                            <strong>Status:</strong>{" "}
                            <span className="text-green-600">Active</span>
                          </p>
                          <p>
                            <strong>Role:</strong> Customer
                          </p>
                          <p>
                            <strong>Member since:</strong>{" "}
                            {new Date(customer.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Recent Orders Preview */}
                    {customer.recentOrders &&
                      customer.recentOrders.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Recent Orders
                          </h4>
                          <div className="space-y-2">
                            {customer.recentOrders
                              .slice(0, 3)
                              .map((order, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-center bg-gray-50 p-2 rounded"
                                >
                                  <span className="text-sm">
                                    Order #{order.id}
                                  </span>
                                  <span className="text-sm font-medium">
                                    ₹{order.total?.toFixed(2)}
                                  </span>
                                  <span
                                    className={`px-2 py-1 rounded text-xs ${
                                      order.status === "delivered"
                                        ? "bg-green-100 text-green-800"
                                        : order.status === "shipped"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                                  >
                                    {order.status}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                  </div>
                ))
              )}
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="text-center py-16">
            <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Settings
            </h3>
            <p className="text-gray-600">
              🚧 This feature isn't implemented yet—but don't worry! You can
              request it in your next prompt! 🚀
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 admin-sidebar text-white flex flex-col justify-between">
        <div>
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-8">
              <Package className="h-8 w-8" />
              <span className="text-xl font-bold">Admin Panel</span>
            </div>

            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? "bg-white bg-opacity-20"
                        : "hover:bg-white hover:bg-opacity-10"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="p-6 border-t border-white border-opacity-20">
          <Link
            to="/"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors mb-2"
          >
            <Home className="h-5 w-5" />
            <span>Back to Store</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors text-red-300"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;
