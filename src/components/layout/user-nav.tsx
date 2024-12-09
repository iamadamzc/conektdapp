import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  Settings,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuthStore } from '@/stores/auth-store';

export const UserNav = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <User className="h-4 w-4" />
        <span>{user?.firstName || 'Account'}</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account Settings</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => {
                setIsOpen(false);
                navigate('/settings');
              }}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            
            <Button
              variant="outline"
              className="justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};