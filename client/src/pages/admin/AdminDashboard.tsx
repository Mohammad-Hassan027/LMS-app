import { useState } from "react";
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
import { Check, X, ShieldAlert, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetActiveInstructorsService,
  useGetInstructorRequestsService,
  usePromoteToInstructorService,
  useRejectRequestService,
  useRevokeInstructorRoleService,
  useSendWarningToInstructorService,
} from "@/service/adminQueries";

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
  const { data: requests } = useGetInstructorRequestsService();
  const { data: instructors } = useGetActiveInstructorsService();

  const { mutate: promoteUser } = usePromoteToInstructorService();
  const { mutate: rejectRequest } = useRejectRequestService();
  const { mutate: revokeRole } = useRevokeInstructorRoleService();
  const { mutate: sendWarning } = useSendWarningToInstructorService();

  const [warnDialogOpen, setWarnDialogOpen] = useState(false);
  const [selectedInstructorId, setSelectedInstructorId] = useState<
    string | null
  >(null);
  const [warnReason, setWarnReason] = useState("");

  const handleRevoke = (userId: string) => {
    if (!confirm("Are you sure you want to revoke instructor privileges?"))
      return;
    revokeRole({ instructorId: userId });
  };

  const openWarnDialog = (userId: string) => {
    setSelectedInstructorId(userId);
    setWarnReason("");
    setWarnDialogOpen(true);
  };

  const handleSendWarning = () => {
    if (!selectedInstructorId || !warnReason.trim()) return;

    sendWarning(
      { instructorId: selectedInstructorId, message: warnReason },
      {
        onSuccess: () => {
          setWarnDialogOpen(false);
        },
      },
    );
  };

  return (
    <div className="p-8 space-y-6 min-h-screen bg-gray-50/50">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Total Instructors:{" "}
          <span className="font-bold">{instructors?.length || 0}</span>
        </div>
      </div>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="requests">
            Pending Requests ({requests?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="instructors">Active Instructors</TabsTrigger>
        </TabsList>

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
                    <TableHead>Date</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-10 text-muted-foreground"
                      >
                        No pending applications.
                      </TableCell>
                    </TableRow>
                  ) : (
                    requests?.map((req: Request) => (
                      <TableRow key={req._id}>
                        <TableCell className="font-medium">
                          {req.userName}
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
                            className="text-red-500 hover:bg-red-50"
                            onClick={() =>
                              rejectRequest({ requestId: req._id })
                            }
                          >
                            <X className="w-4 h-4 mr-1" /> Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() =>
                              promoteUser({
                                requestId: req._id,
                                userId: req.userId,
                              })
                            }
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
                  {instructors?.map((inst: Instructor) => (
                    <TableRow key={inst.id}>
                      <TableCell className="font-medium">
                        {inst.firstName} {inst.lastName}
                      </TableCell>
                      <TableCell>
                        {inst.emailAddresses?.[0]?.emailAddress}
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {inst.publicMetadata?.role}
                        </span>
                      </TableCell>
                      <TableCell className="text-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-amber-600 hover:bg-amber-50"
                          onClick={() => openWarnDialog(inst.id)}
                        >
                          <ShieldAlert className="w-4 h-4 mr-1" /> Warn
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRevoke(inst.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Revoke
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={warnDialogOpen} onOpenChange={setWarnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue Warning</DialogTitle>
            <DialogDescription>
              This will be emailed to the instructor.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Reason..."
              value={warnReason}
              onChange={(e) => setWarnReason(e.target.value)}
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
