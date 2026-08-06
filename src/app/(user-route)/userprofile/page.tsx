"use client";

import { useAuth } from "@/context/AuthContext";
import { User, Mail, Shield, Calendar } from "lucide-react";

export default function UserProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-muted-foreground animate-pulse">
          Loading profile...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-red-500 font-medium">
          Please login to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-card rounded-xl shadow-md border border-border mt-8">
      <div className="flex items-center gap-4 border-b border-border pb-6 mb-6">
        <div className="w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-full text-2xl font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
          <div className="flex items-center gap-3 text-muted-foreground">
            <User className="w-5 h-5" />
            <span className="text-sm font-medium">Full Name</span>
          </div>
          <span className="font-semibold text-foreground">{user.name}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Mail className="w-5 h-5" />
            <span className="text-sm font-medium">Email Address</span>
          </div>
          <span className="font-semibold text-foreground">{user.email}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-medium">Account Role</span>
          </div>
          <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
            {user.role}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Calendar className="w-5 h-5" />
            <span className="text-sm font-medium">Joined Date</span>
          </div>
          <span className="font-semibold text-foreground">
            {new Date(user.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
