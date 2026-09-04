/**
 * Beyond Financials - Pre-Launch Admin Authentication Modal
 * 
 * Provides an administrative authorization gatekeeper for /admin/leads.
 * Persists the administrative key safely in browser sessionStorage during runtime.
 */

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Key, ShieldAlert, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: (adminKey: string) => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticated,
}) => {
  const [adminKey, setAdminKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) {
      setError('Please enter your administrator access key.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey.trim(),
        },
        body: JSON.stringify({ adminKey: adminKey.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('bf_admin_key', adminKey.trim());
        }
        onAuthenticated(adminKey.trim());
        onClose();
      } else {
        setError(data.message || 'Invalid administrator key provided.');
      }
    } catch (err: any) {
      setError(err.message || 'Unable to verify administrator key.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseDevKey = () => {
    setAdminKey('bf_admin_dev_key_2026');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Administrator Lead Access"
      subtitle="Administrative authorization required to inspect and manage prospective acquisition leads."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-xl flex items-start gap-2.5 text-xs text-blue-900">
          <Lock className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Pre-Launch Security Architecture</p>
            <p className="text-blue-800 leading-relaxed">
              This administrative interface is strictly protected server-side via environment-configured key credentials.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-900">
            <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <Input
          id="admin-auth-key-input"
          label="Administrator Access Key"
          type="password"
          required
          placeholder="Enter server ADMIN_API_KEY..."
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
          helperText="Configured in server environment (Default dev key: bf_admin_dev_key_2026)"
        />

        <div className="pt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={handleUseDevKey}
            className="text-xs text-blue-700 hover:text-blue-900 underline font-medium cursor-pointer"
          >
            Insert Default Dev Key
          </button>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button variant="ghost" size="md" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            type="submit"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Unlock Lead Interface
          </Button>
        </div>
      </form>
    </Modal>
  );
};
