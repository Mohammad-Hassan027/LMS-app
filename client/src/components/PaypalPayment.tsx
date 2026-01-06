import { PayPalButtons } from "@paypal/react-paypal-js";
import {
  useCapturePaymentAndFinalizeOrderService,
  useCreateOrderService,
} from "@/service/studentQueries";
import { toast } from "sonner";
import type { Course } from "@/@types/types";
import type { UserResource } from "@clerk/shared/types";

const PaypalPayment = ({
  user,
  course,
}: {
  user: UserResource | null | undefined;
  course: Course;
}) => {
  const { mutateAsync: createOrder } = useCreateOrderService();
  const { mutateAsync: captureOrder } =
    useCapturePaymentAndFinalizeOrderService();

  const handleCreateOrder = async () => {
    if (!user || !user.primaryEmailAddress) {
      throw new Error("User details missing");
    }
    try {
      // 1. Call your backend to create the order
      const response = await createOrder({
        userId: user.id,
        userName:
          user.username ||
          user.fullName ||
          user.firstName ||
          user.primaryEmailAddress.emailAddress.split("@")[0],
        userEmail: user.primaryEmailAddress?.emailAddress,
        orderStatus: "pending",
        paymentMethod: "paypal",
        paymentStatus: "pending",
        orderDate: new Date(),
        instructorId: course.instructorId,
        instructorName: course.instructorName,
        courseImage: course.image,
        courseTitle: course.title,
        courseId: course._id,
        coursePricing: course.pricing,
      });

      console.log("Backend Order Response:", response);

      // 2. Return the PayPal Order ID (response.id) to the button
      if (response?.id) return response.id;
      if (response?.data?.id) return response.data.id;

      throw new Error("No Order ID found in backend response");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Could not initiate payment. Please try again.");
      throw error;
    }
  };

  const handleApprove = async (data: { orderID: string }) => {
    try {
      // 1. Capture the payment using the PayPal Order ID
      await captureOrder({ paymentId: data.orderID });

      toast.success("You have successfully enrolled in the course.");

      window.location.href = "/my-courses";
    } catch (error) {
      console.error("Payment Capture Failed:", error);
      toast.error("Payment was authorized but could not be captured.");
    }
  };

  console.log("PaypalPayment Render - User:", user);
  console.log("PaypalPayment Render - Course:", course);

  if (!user || !user.primaryEmailAddress || !course) {
    return (
      <div className="p-4 border border-yellow-200 bg-yellow-50 text-yellow-800 rounded-md">
        <p className="animate-pulse">Loading user details... Please wait.</p>
        {/* <SignInButton />*/}
      </div>
    );
  }

  return (
    <div className="mt-4">
      <PayPalButtons
        key={course._id}
        style={{ layout: "vertical" }}
        createOrder={handleCreateOrder}
        onApprove={handleApprove}
        onError={(err) => {
          console.error("PayPal Error:", err);
          toast.error("Something went wrong with PayPal");
        }}
      />
    </div>
  );
};

export default PaypalPayment;
