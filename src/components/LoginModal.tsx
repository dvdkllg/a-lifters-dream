import React, { useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, User, Mail, Info } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 pt-safe pb-safe">
      <Card className={cn(
        "w-full max-w-md border-gray-700 max-h-[calc(100vh-2rem)] overflow-y-auto",
        isDarkMode ? "bg-gray-900" : "bg-white"
      )}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className={cn("flex items-center space-x-2", isDarkMode ? "text-white" : "text-black")}>
              <User size={20} />
              <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {Capacitor.isNativePlatform() && (
            <div className={cn(
              "p-3 rounded-lg border flex items-start space-x-2",
              isDarkMode ? "bg-blue-900/20 border-blue-700" : "bg-blue-50 border-blue-200"
            )}>
              <Info size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className={cn(isDarkMode ? "text-blue-300" : "text-blue-700")}>
                  <strong>Mobile Note:</strong> Authentication is currently in development for the mobile app. 
                  Your data is saved locally on your device and will persist until the app is uninstalled.
                </p>
              </div>
            </div>
          )}
          
          {/* Google Login Button */}
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className={cn(
              "w-full flex items-center justify-center space-x-2 border-2",
              isDarkMode 
                ? "border-gray-600 bg-gray-800 hover:bg-gray-700 text-white" 
                : "border-gray-300 bg-white hover:bg-gray-50 text-black"
            )}
          >
            <Mail size={20} />
            <span>Continue with Google</span>
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className={cn("w-full border-t", isDarkMode ? "border-gray-700" : "border-gray-300")} />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className={cn("px-2", isDarkMode ? "bg-gray-900 text-gray-400" : "bg-white text-gray-500")}>
                Or continue with
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                  Name
                </Label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className={cn(
                    "border-gray-700",
                    isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                  )}
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                Email
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={cn(
                  "border-gray-700",
                  isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                )}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                Password
              </Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={cn(
                  "border-gray-700",
                  isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                )}
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className={cn(
                  "text-sm underline",
                  isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"
                )}
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginModal;
