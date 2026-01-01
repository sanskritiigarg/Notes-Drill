import React, { useState, useEffect, useRef } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import authService from '../../services/auth.service.js';
import { useAuth } from '../../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import { User, Mail, Lock } from 'lucide-react';

function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data } = await authService.getProfile();

        setUsername(data.user.username);
        setEmail(data.user.email);
      } catch (error) {
        toast.error(error.message || 'Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long.');
      return;
    }

    setPasswordLoading(true);
    try {
      await authService.updatePassword({ currPassword, newPassword });
      toast.success('Password changed successfully');
      setCurrPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      toast.error(error.error || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <PageHeader title="Profile Settings" />

      <div className="space-y-8">
        <div className="bg-gray-950 border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">User Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block font-medium text-sm mb-1.5">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4" />
                </div>
                <p className="w-full h-9 pl-9 pr-3 pt-1.5 border border-foreground/80 text-base rounded-lg bg-gray-900/70">
                  {username}
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1.5 font-medium">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4" />
                </div>
                <p className="w-full h-9 pl-9 pr-3 pt-1 border border-foreground/80 text-base rounded-lg bg-gray-900/70">
                  {email}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-950 border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block font-medium text-sm mb-1.5">Current Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={currPassword}
                  onChange={(e) => setCurrPassword(e.target.value)}
                  required
                  className="w-full h-9 border rounded-lg text-base pl-9 transition-colors duration-200 focus:outline-none focus:border-accent bg-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-sm mb-1.5">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full h-9 border rounded-lg text-base pl-9 transition-colors duration-200 focus:outline-none focus:border-accent bg-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-sm mb-1.5">Confirm New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  className="w-full h-9 border rounded-lg text-base pl-9 transition-colors duration-200 focus:outline-none focus:border-accent bg-gray-900"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={passwordLoading}>
                {passwordLoading ? 'Changing...' : 'Change password'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
