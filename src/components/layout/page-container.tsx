
import { ReactNode } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  backUrl?: string;
}

export function PageContainer({ children, title, backUrl }: PageContainerProps) {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (backUrl) {
      navigate(backUrl);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {title && (
          <div className="flex justify-between items-center mb-6 bg-blue-dark text-white p-4 rounded-md">
            <div className="flex items-center">
              {backUrl && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleBack}
                  className="mr-2 text-white hover:text-white hover:bg-blue-medium/20"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              )}
              <h1 className="text-2xl font-bold text-white">{title}</h1>
            </div>
          </div>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
}
