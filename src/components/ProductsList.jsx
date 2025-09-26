import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getProducts } from "@/api/EcommerceApi";
import ProductCard from "@/components/ProductCard";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import { Loader2, ShoppingBag } from "lucide-react";

const ProductsList = ({ searchTerm, categoryFilter }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        toast({
          title: "Error fetching products",
          description:
            "Could not load products from the store. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [toast]);

  useEffect(() => {
    let tempProducts = products;
    if (categoryFilter && categoryFilter !== "all") {
      tempProducts = tempProducts.filter(
        (p) => p.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    if (searchTerm) {
      tempProducts = tempProducts.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredProducts(tempProducts);
  }, [searchTerm, categoryFilter, products]);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast({
      title: "Added to Cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          No Products Found
        </h3>
        <p className="text-gray-600">
          No products match your search criteria. Try adjusting your filters.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {filteredProducts.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <ProductCard product={product} onAddToCart={handleAddToCart} />
        </motion.div>
      ))}
    </div>
  );
};

export default ProductsList;
