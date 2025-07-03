
import React, { useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, User } from 'lucide-react';
import { SettingsContext } from '@/pages/Index';
import { cn } from '@/lib/utils';

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className={cn(
        "w-full max-w-md border-gray-700",
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
        <CardContent>
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
          
          <div className={cn("text-xs mt-4 p-3 rounded", isDarkMode ? "text-gray-500 bg-gray-800" : "text-gray-600 bg-gray-100")}>
            <p><strong>Note:</strong> This is a demo login interface. For full authentication functionality, you'll need to integrate with a backend service like Supabase.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginModal;
