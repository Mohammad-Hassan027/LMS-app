import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Check, X } from "lucide-react";
import {
  getInstructorRequestsService,
  promoteToInstructorService,
  rejectRequestService,
} from "@/service";

interface Request {
  _id: string;
  userId: string;
  userName: string;
  email: string;
  reason: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const data = await getInstructorRequestsService();
      setRequests(data);
    } catch (error) {
      toast.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (requestId: string, userId: string) => {
    try {
      await promoteToInstructorService({ requestId, userId });
      toast.success("User promoted to Instructor");
      fetchRequests(); // Refresh list
    } catch (error) {
      toast.error("Failed to promote user");
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await rejectRequestService({ requestId });
      toast.success("Request rejected");
      fetchRequests();
    } catch (error) {
      toast.error("Failed to reject request");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-muted-foreground"
                >
                  No pending instructor requests.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((req) => (
                <TableRow key={req._id}>
                  <TableCell className="font-medium">
                    {req.userName || "N/A"}
                  </TableCell>
                  <TableCell>{req.email}</TableCell>
                  <TableCell className="max-w-xs truncate" title={req.reason}>
                    {req.reason}
                  </TableCell>
                  <TableCell>
                    {new Date(req.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleReject(req._id)}
                    >
                      <X className="w-4 h-4 mr-1" /> Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(req._id, req.userId)}
                    >
                      <Check className="w-4 h-4 mr-1" /> Approve
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminDashboard;
