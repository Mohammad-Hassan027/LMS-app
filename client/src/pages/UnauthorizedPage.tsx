import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 text-center">
            <div className="bg-red-100/80 dark:bg-red-800/20 p-6 rounded-full mb-6">
                <ShieldAlert className="w-24 h-24 text-red-500 dark:text-red-400" />
            </div>
            <h1 className="text-4xl font-bold lg:text-5xl mb-4">
                Access Denied
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md text-lg">
                You do not have permission to view this page. Please contact your administrator if you believe this is an error.
            </p>
            <div className="flex gap-4">
                <Button onClick={() => navigate(-1)} variant="outline">
                    Go Back
                </Button>
                <Button onClick={() => navigate("/")}>Go to Home</Button>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
