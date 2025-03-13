import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Shield,
  User,
  Lock,
  Fingerprint,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Form validation schemas
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

const registerSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

interface AuthContainerProps {
  onAuthenticated?: () => void;
}

const AuthContainer = ({ onAuthenticated = () => {} }: AuthContainerProps) => {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "verifying" | "success" | "error"
  >("idle");

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { login, register } = useAuth();

  const onLoginSubmit = async (data: LoginFormValues) => {
    // Simulate hardware verification process
    setVerificationStatus("verifying");
    try {
      await login(data.email, data.password);
      setVerificationStatus("success");
      setTimeout(() => {
        onAuthenticated();
      }, 1000);
    } catch (error) {
      setVerificationStatus("error");
      console.error("Login failed:", error);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    // Simulate hardware verification process
    setVerificationStatus("verifying");
    try {
      await register(data.name, data.email, data.password);
      setVerificationStatus("success");
      setTimeout(() => {
        onAuthenticated();
      }, 1000);
    } catch (error) {
      setVerificationStatus("error");
      console.error("Registration failed:", error);
    }
  };

  const renderVerificationStatus = () => {
    switch (verificationStatus) {
      case "idle":
        return null;
      case "verifying":
        return (
          <div className="flex items-center justify-center p-4 bg-amber-50 border border-amber-200 rounded-lg mt-4">
            <Fingerprint className="h-5 w-5 text-amber-500 animate-pulse mr-2" />
            <p className="text-sm text-amber-700">Verifying your device...</p>
          </div>
        );
      case "success":
        return (
          <div className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg mt-4">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-sm text-green-700">
              Device verified successfully!
            </p>
          </div>
        );
      case "error":
        return (
          <div className="flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-lg mt-4">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700">
              Device verification failed. Please try again.
            </p>
          </div>
        );
    }
  };

  return (
    <Card className="w-[450px] bg-white">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 flex items-center justify-center rounded-full mb-4">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Secure Messaging</CardTitle>
        <CardDescription>
          {activeTab === "login"
            ? "Sign in to your account"
            : "Create a new account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="login"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="you@example.com"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={verificationStatus !== "idle"}
                >
                  Sign In
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="register">
            <Form {...registerForm}>
              <form
                onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={registerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="John Doe"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="you@example.com"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={verificationStatus !== "idle"}
                >
                  Create Account
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>

        {renderVerificationStatus()}
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="text-xs text-center text-muted-foreground mt-4">
          Protected by hardware device verification for enhanced security
        </p>
      </CardFooter>
    </Card>
  );
};

export default AuthContainer;
