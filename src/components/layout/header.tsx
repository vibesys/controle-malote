
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfileMenu } from "@/components/auth/UserProfileMenu";

export interface HeaderProps {
  title?: string;
  backUrl?: string;
  children?: React.ReactNode;
}

export function Header({ title = "", backUrl, children }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white border-b shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          {backUrl && (
            <Link to={backUrl}>
              <Button size="icon" variant="ghost">
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
          )}
          {title && <h1 className="text-xl font-semibold md:text-2xl">{title}</h1>}
        </div>
        <div className="flex items-center gap-2">
          {children}
          {user && <UserProfileMenu />}
        </div>
      </div>
    </header>
  );
}
