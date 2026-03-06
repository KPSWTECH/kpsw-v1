import { useState, useEffect } from "react";
import { UserPlus, Shield, Mail, Trash2, Lock as LockIcon } from "lucide-react";
import { motion } from "motion/react";

export const Settings = ({ token, user }: { token: string, user: any }) => {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-serif font-bold text-heritage-900">Vault Settings</h2>
        <p className="text-heritage-500">Manage your family vault and access permissions.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-heritage-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-heritage-100">
              <h3 className="text-lg font-serif font-bold">Family Access</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 bg-heritage-50 rounded-xl border border-heritage-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-lg border border-heritage-200 text-accent">
                    <UserPlus size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-heritage-900">Invite Family Member</p>
                    <p className="text-xs text-heritage-500">Grant access to another family member.</p>
                  </div>
                </div>
                <button className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors">
                  Send Invite
                </button>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-heritage-400 uppercase tracking-widest">Active Members</h4>
                <div className="divide-y divide-heritage-100">
                  <div className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xs">
                        {user.email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-heritage-900">{user.email}</p>
                        <p className="text-xs text-heritage-500 capitalize">{user.role}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-heritage-100 text-heritage-500 px-2 py-1 rounded uppercase tracking-wider">You</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-heritage-200 shadow-sm">
            <h3 className="text-lg font-serif font-bold mb-4">Vault Security</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Shield size={18} className="text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-heritage-900">AES-256 Encryption</p>
                  <p className="text-xs text-heritage-500">All documents are encrypted at rest using industry standard protocols.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <LockIcon size={18} className="text-accent mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-heritage-900">Private Access</p>
                  <p className="text-xs text-heritage-500">Only invited family members can access this vault.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
            <h3 className="text-lg font-serif font-bold text-red-900 mb-2">Danger Zone</h3>
            <p className="text-xs text-red-700 mb-4">Permanently delete this family vault and all its contents.</p>
            <button className="w-full bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
              <Trash2 size={16} />
              Delete Vault
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
