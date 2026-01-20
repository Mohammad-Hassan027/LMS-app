import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Loader2,
  Check,
  X,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import {
  getActiveInstructorsService,
  getInstructorRequestsService,
  promoteToInstructorService,
  rejectRequestService,
  revokeInstructorRoleService,
  sendWarningToInstructorService,
} from "@/service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Request {
  _id: string;
  userId: string;
  userName: string;
  email: string;
  reason: string;
  createdAt: string;
}

interface Instructor {
  id: string;
  firstName: string;
  lastName: string;
  emailAddresses: { emailAddress: string }[];
  publicMetadata: { role: string };
}

const AdminDashboard = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [warnDialogOpen, setWarnDialogOpen] = useState(false);
  const [selectedInstructorId, setSelectedInstructorId] = useState<
    string | null
  >(null);
  const [warnReason, setWarnReason] = useState("");

  const handleRevoke = async (userId: string) => {
    if (
      !confirm(
        "Are you sure you want to revoke instructor privileges? This action cannot be undone.",
      )
    )
      return;

    try {
      await revokeInstructorRoleService({ instructorId: userId });
      toast.success("Instructor privileges revoked");
      fetchInstructors();
    } catch (error) {
      toast.error("Failed to revoke role");
    }
  };

  const openWarnDialog = (userId: string) => {
    setSelectedInstructorId(userId);
    setWarnReason("");
    setWarnDialogOpen(true);
  };

  const handleSendWarning = async () => {
    if (!selectedInstructorId || !warnReason.trim()) return;

    try {
      await sendWarningToInstructorService({
        instructorId: selectedInstructorId,
        message: warnReason,
      });
      toast.success("Warning sent to instructor");
      setWarnDialogOpen(false);
    } catch (error) {
      toast.error("Failed to send warning");
    }
  };

  // Fetch pending requests
  const fetchRequests = async () => {
    try {
      const data = await getInstructorRequestsService();
      setRequests(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch active instructors
  const fetchInstructors = async () => {
    try {
      const data = await getActiveInstructorsService();
      setInstructors(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchRequests(), fetchInstructors()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleApprove = async (requestId: string, userId: string) => {
    try {
      await promoteToInstructorService({ requestId, userId });
      toast.success("User promoted to Instructor");
      fetchRequests();
      fetchInstructors();
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
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );

  return (
    <div className="p-8 space-y-6 min-h-screen bg-gray-50/50">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Total Instructors:{" "}
          <span className="font-bold">{instructors.length}</span>
        </div>
      </div>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="requests">
            Pending Requests ({requests.length})
          </TabsTrigger>
          <TabsTrigger value="instructors">Active Instructors</TabsTrigger>
        </TabsList>

        {/* --- TAB 1: REQUESTS --- */}
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Instructor Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Applied On</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-10 text-muted-foreground"
                      >
                        No pending applications.
                      </TableCell>
                    </TableRow>
                  ) : (
                    requests.map((req) => (
                      <TableRow key={req._id}>
                        <TableCell className="font-medium">
                          {req.userName || "N/A"}
                        </TableCell>
                        <TableCell>{req.email}</TableCell>
                        <TableCell
                          className="max-w-xs truncate"
                          title={req.reason}
                        >
                          {req.reason}
                        </TableCell>
                        <TableCell>
                          {new Date(req.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- TAB 2: INSTRUCTORS --- */}
        <TabsContent value="instructors">
          <Card>
            <CardHeader>
              <CardTitle>Current Instructor Team</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {instructors.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-10 text-muted-foreground"
                      >
                        No active instructors found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    instructors.map((inst) => (
                      <TableRow key={inst.id}>
                        <TableCell className="font-medium">
                          {inst.firstName} {inst.lastName}
                        </TableCell>
                        <TableCell>
                          {inst.emailAddresses?.[0]?.emailAddress}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {inst.publicMetadata?.role}
                          </span>
                        </TableCell>
                        <TableCell className="text-center space-x-2">
                          {/* Warn Button */}
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-amber-600 border-amber-200 hover:bg-amber-50"
                            onClick={() => openWarnDialog(inst.id)}
                          >
                            <ShieldAlert className="w-4 h-4 mr-1" /> Warn
                          </Button>

                          {/* Revoke Button */}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRevoke(inst.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Revoke
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* Warning Dialog */}
      <Dialog open={warnDialogOpen} onOpenChange={setWarnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue Official Warning</DialogTitle>
            <DialogDescription>
              This message will be emailed directly to the instructor.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Reason for warning (e.g., Low course quality, violation of terms...)"
              value={warnReason}
              onChange={(e) => setWarnReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWarnDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendWarning}>Send Warning</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
