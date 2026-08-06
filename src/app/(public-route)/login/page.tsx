import LoginForm from "@/components/auth/LoginForm";
import React from "react";

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <h1 className="text-4xl text-center mb-6">Log In here</h1>
      <div className="w-full flex justify-center">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
