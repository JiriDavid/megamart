import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import { SignUp } from "@clerk/clerk-react";
import Header from "@/components/Header";

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <UserPlus className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-600 mt-2">Join MegaMart today</p>
          </div>

          <SignUp
            path="/register"
            routing="path"
            signInUrl="/login"
            redirectUrl="/"
            appearance={{
              elements: {
                formButtonPrimary: "bg-purple-600 hover:bg-purple-700",
                card: "shadow-none p-0",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "bg-gray-100 hover:bg-gray-200 text-gray-900",
                formFieldInput:
                  "border-gray-300 focus:ring-purple-500 focus:border-transparent",
                footerActionLink: "text-purple-600 hover:text-purple-800",
              },
            }}
          />

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default RegisterPage;
