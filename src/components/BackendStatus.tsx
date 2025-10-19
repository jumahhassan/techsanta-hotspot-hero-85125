import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export const BackendStatus = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["backend-health"],
    queryFn: async () => {
      const response = await fetch(
        import.meta.env.VITE_API_URL?.replace('/api', '') + '/api/health' || 'http://localhost:3001/api/health',
        { signal: AbortSignal.timeout(3000) }
      );
      if (!response.ok) throw new Error("Backend not responding");
      return response.json();
    },
    retry: 1,
    refetchInterval: 10000, // Check every 10 seconds
  });

  if (isLoading) {
    return (
      <Alert className="border-blue-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertTitle>Checking backend connection...</AlertTitle>
      </Alert>
    );
  }

  if (error || !data?.success) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Backend Server Not Running</AlertTitle>
        <AlertDescription className="mt-2 space-y-2">
          <p>The TechSanta backend server is not accessible.</p>
          <p className="font-mono text-xs bg-destructive/10 p-2 rounded">
            Please start the backend server:
            <br />
            <code>cd server && node index.js</code>
          </p>
          <p className="text-xs">
            See <strong>START_HERE.md</strong> for complete setup instructions.
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
      <CheckCircle2 className="h-4 w-4 text-green-600" />
      <AlertTitle className="text-green-600">Backend Connected</AlertTitle>
      <AlertDescription className="text-green-600">
        Connected to {data.connectedRouters || 0} router(s)
      </AlertDescription>
    </Alert>
  );
};
