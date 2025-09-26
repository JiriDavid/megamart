import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const SuccessPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex items-center justify-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center max-w-2xl w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 200,
              damping: 10,
            }}
          >
            <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase. Your order is being processed and you
            will receive a confirmation email shortly.
          </p>
          <Link to="/">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Continue Shopping
            </Button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
};

export default SuccessPage;
