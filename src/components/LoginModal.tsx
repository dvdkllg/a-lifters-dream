
import React, { useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, User, Mail, Info, Shield, Database } from 'lucide-react';
import { SettingsContext } from '@/pages/Index';
import { cn } from '@/lib/utils';
import { Capacitor } from '@capacitor/core';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { isDarkMode } = useContext(SettingsContext);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual authentication logic
    console.log('Authentication attempt:', { email, password, isLogin });
    onClose();
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log('Google login attempted');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 pt-safe pb-safe">
      <Card className={cn(
        "w-full max-w-md border shadow-2xl max-h-[calc(100vh-2rem)] overflow-y-auto modal-content",
        isDarkMode ? "bg-gray-900/95 border-gray-700" : "bg-white/95 border-gray-200"
      )}>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className={cn("flex items-center space-x-3 text-lg", isDarkMode ? "text-white" : "text-black")}>
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <User size={20} className="text-white" />
              </div>
              <span>{isLogin ? 'Welcome Back' : 'Create Account'}</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white touch-manipulation"
            >
              <X size={20} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Security Notice */}
          <div className={cn(
            "p-4 rounded-xl border flex items-start space-x-3",
            isDarkMode ? "bg-blue-900/20 border-blue-700/50" : "bg-blue-50/80 border-blue-200"
          )}>
            <Shield size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className={cn("font-medium mb-1", isDarkMode ? "text-blue-300" : "text-blue-700")}>
                Secure Authentication Required
              </p>
              <p className={cn(isDarkMode ? "text-blue-400" : "text-blue-600")}>
                To enable login functionality and secure data storage, please connect to Supabase using the integration button above.
              </p>
            </div>
          </div>

          {Capacitor.isNativePlatform() && (
            <div className={cn(
              "p-4 rounded-xl border flex items-start space-x-3",
              isDarkMode ? "bg-purple-900/20 border-purple-700/50" : "bg-purple-50/80 border-purple-200"
            )}>
              <Database size={18} className="text-purple-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className={cn("font-medium mb-1", isDarkMode ? "text-purple-300" : "text-purple-700")}>
                  Mobile Storage
                </p>
                <p className={cn(isDarkMode ? "text-purple-400" : "text-purple-600")}>
                  Your data is currently stored securely on your device and will persist until the app is uninstalled.
                </p>
              </div>
            </div>
          )}
          
          {/* Google Login Button */}
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className={cn(
              "w-full flex items-center justify-center space-x-3 h-12 border-2 touch-manipulation mobile-tap-highlight",
              isDarkMode 
                ? "border-gray-600 bg-gray-800/50 hover:bg-gray-700 text-white" 
                : "border-gray-300 bg-white hover:bg-gray-50 text-black"
            )}
          >
            <Mail size={20} />
            <span className="font-medium">Continue with Google</span>
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className={cn("w-full border-t", isDarkMode ? "border-gray-700" : "border-gray-300")} />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className={cn("px-3 font-medium", isDarkMode ? "bg-gray-900 text-gray-400" : "bg-white text-gray-500")}>
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label className={cn("font-medium", isDarkMode ? "text-gray-300" : "text-gray-700")}>
                  Full Name
                </Label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className={cn(
                    isDarkMode ? "bg-gray-800/50 border-gray-700 text-white" : "bg-white border-gray-300 text-black"
                  )}
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label className={cn("font-medium", isDarkMode ? "text-gray-300" : "text-gray-700")}>
                Email Address
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className={cn(
                  isDarkMode ? "bg-gray-800/50 border-gray-700 text-white" : "bg-white border-gray-300 text-black"
                )}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label className={cn("font-medium", isDarkMode ? "text-gray-300" : "text-gray-700")}>
                Password
              </Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={cn(
                  isDarkMode ? "bg-gray-800/50 border-gray-700 text-white" : "bg-white border-gray-300 text-black"
                )}
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium touch-manipulation mobile-tap-highlight"
            >
              {isLogin ? 'Sign In to Your Account' : 'Create Your Account'}
            </Button>
            
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className={cn(
                  "text-sm font-medium underline-offset-2 hover:underline touch-manipulation",
                  isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"
                )}
              >
                {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign in"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginModal;
