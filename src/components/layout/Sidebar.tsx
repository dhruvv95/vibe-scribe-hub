
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Plus,
  FileText,
  Settings,
  User,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  return (
    <aside className="bg-primary h-screen w-64 flex flex-col text-white">
      <div className="p-6">
        <h2 className="text-xl font-bold">AI Social Hub</h2>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-4">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary-dark text-white"
                    : "text-white/80 hover:bg-primary-dark hover:text-white"
                )
              }
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/create"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary-dark text-white"
                    : "text-white/80 hover:bg-primary-dark hover:text-white"
                )
              }
            >
              <Plus className="h-5 w-5" />
              <span>Create Content</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/drafts"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary-dark text-white"
                    : "text-white/80 hover:bg-primary-dark hover:text-white"
                )
              }
            >
              <FileText className="h-5 w-5" />
              <span>Drafts</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary-dark text-white"
                    : "text-white/80 hover:bg-primary-dark hover:text-white"
                )
              }
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="border-t border-primary-dark p-4">
        <div className="flex items-center gap-3 px-4 py-2">
          <User className="h-5 w-5" />
          <span className="text-sm opacity-70">My Account</span>
        </div>
      </div>
    </aside>
  );
};
