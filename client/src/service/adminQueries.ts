import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  checkIsInstructorService,
  getActiveInstructorsService,
  getInstructorRequestsService,
  promoteToInstructorService,
  rejectRequestService,
  requestToBeInstructorService,
  revokeInstructorRoleService,
  sendWarningToInstructorService,
} from "@/service";

const QUERY_KEYS = {
  activeInstructors: ["activeInstructors"],
  instructorRequests: ["instructorRequests"],
  isInstructor: (userId: string) => ["isInstructor", userId],
};

export function useGetActiveInstructorsService() {
  return useSuspenseQuery({
    queryKey: QUERY_KEYS.activeInstructors,
    queryFn: getActiveInstructorsService,
  });
}

export function useGetInstructorRequestsService() {
  return useSuspenseQuery({
    queryKey: QUERY_KEYS.instructorRequests,
    queryFn: getInstructorRequestsService,
  });
}

export function useRequestToBeInstructorService() {
  return useMutation({
    mutationFn: requestToBeInstructorService,
    onSuccess: () => {
      toast.success("Application submitted! An admin will review it shortly.");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to submit application",
      );
    },
  });
}

export function usePromoteToInstructorService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: promoteToInstructorService,
    onSuccess: () => {
      toast.success("User promoted to Instructor successfully");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.instructorRequests,
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activeInstructors });
    },
    onError: () => {
      toast.error("Failed to promote user");
    },
  });
}

export function useRejectRequestService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectRequestService,
    onSuccess: () => {
      toast.success("Request rejected");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.instructorRequests,
      });
    },
    onError: () => {
      toast.error("Failed to reject request");
    },
  });
}

export function useRevokeInstructorRoleService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: revokeInstructorRoleService,
    onSuccess: () => {
      toast.success("Instructor privileges revoked");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activeInstructors });
    },
    onError: () => {
      toast.error("Failed to revoke role");
    },
  });
}

export function useSendWarningToInstructorService() {
  return useMutation({
    mutationFn: sendWarningToInstructorService,
    onSuccess: () => {
      toast.success("Warning sent to instructor");
    },
    onError: () => {
      toast.error("Failed to send warning");
    },
  });
}

export function useCheckIsInstructorService({ userId }: { userId: string }) {
  return useQuery({
    queryKey: QUERY_KEYS.isInstructor(userId),
    queryFn: () => checkIsInstructorService({ userId }),
  });
}
