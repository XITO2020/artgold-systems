import Link from "next/link";
import Button from "@/components/ui/button";
import {
  LayoutDashboard,
  AlertTriangle,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

export function Sidebar() {
  return (
    <div className="w-64 border-r bg-muted/10 p-6">
      <div className="flex flex-col h-full">
        <div className="space-y-2">
          <Link href="/admin">
            <Button
              variant="ghost"
              className="w-full justify-start"
            >
              <LayoutDashboard className="h-5 w-5 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href="/admin/moderation">
            <Button
              variant="ghost"
              className="w-full justify-start"
            >
              <AlertTriangle className="h-5 w-5 mr-2" />
              Moderation
            </Button>
          </Link>
          <Link href="/admin/articles">
            <Button
              variant="ghost"
              className="w-full justify-start"
            >
              <FileText className="h-5 w-5 mr-2" />
              Articles
            </Button>
          </Link>
          <Link href="/admin/settings">
            <Button
              variant="ghost"
              className="w-full justify-start"
            >
              <Settings className="h-5 w-5 mr-2" />
              Settings
            </Button>
          </Link>
        </div>

        <div className="mt-auto">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => signOut()}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}