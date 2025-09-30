import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { SignIn } from "@clerk/clerk-react";
import Header from "@/components/Header";

const LoginPage = () => {
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
            <LogIn className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">
              Sign in to your MegaMart account
            </p>
          </div>

          <SignIn
            path="/login"
            routing="path"
            signUpUrl="/register"
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
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                Create Account
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default LoginPage;
