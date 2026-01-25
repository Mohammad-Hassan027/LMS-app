import { PayPalButtons } from "@paypal/react-paypal-js";
import {
  useCapturePaymentAndFinalizeOrderService,
  useCreateOrderService,
} from "@/service/studentQueries";
import { toast } from "sonner";
import type { Course } from "@/@types/types";
import type { UserResource } from "@clerk/shared/types";
import { SignInButton } from "@clerk/clerk-react";
import { Button } from "./ui/button";
import type { CartItem } from "@/contexts/student";
import { useShoppingCart } from "@/contexts/student/hook"; // Import the hook

const PaypalPayment = ({
  user,
  courses,
}: {
  user: UserResource | null | undefined;
  courses: Course | CartItem[];
}) => {
  const { mutateAsync: createOrder } = useCreateOrderService();
  const { mutateAsync: captureOrder } =
    useCapturePaymentAndFinalizeOrderService();

  const { clearCart } = useShoppingCart();

  const handleCreateOrder = async () => {
    if (!user || !user.primaryEmailAddress) {
      toast.error("User details missing. Please sign in.");
      throw new Error("User details missing");
    }

    const isBulk = Array.isArray(courses);

    const baseOrderData = {
      userId: user.id,
      userName:
        user.username ||
        user.fullName ||
        user.firstName ||
        user.primaryEmailAddress.emailAddress.split("@")[0],
      userEmail: user.primaryEmailAddress.emailAddress,
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      orderDate: new Date(),
    };

    let payload;

    if (isBulk) {
      // CART CHECKOUT PAYLOAD
      payload = {
        ...baseOrderData,
        cartItems: courses.map((item) => ({
          id: item._id,
          title: item.title,
          image: item.image,
          pricing: item.pricing,
          instructorId: item.instructorId,
          instructorName: item.instructorName,
        })),
      };
    } else {
      // SINGLE COURSE PAYLOAD
      const course = courses as Course;
      payload = {
        ...baseOrderData,
        instructorId: course.instructorId,
        instructorName: course.instructorName,
        courseImage: course.image,
        courseTitle: course.title,
        courseId: course._id,
        coursePricing: course.pricing,
      };
    }

    try {
      const response = await createOrder(payload);

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
      await captureOrder({ paymentId: data.orderID });

      toast.success("Purchase successful! You are now enrolled.");

      // CRITICAL: Clear the cart if this was a bulk purchase
      // We do this BEFORE redirecting so localStorage is cleaned up
      if (Array.isArray(courses)) {
        clearCart();
      }

      window.location.href = "/my-courses";
    } catch (error) {
      console.error("Payment Capture Failed:", error);
      toast.error("Payment was authorized but could not be captured.");
    }
  };

  const hasValidData = Array.isArray(courses) ? courses.length > 0 : !!courses;

  if (!user || !user.primaryEmailAddress || !hasValidData) {
    return (
      <div className="p-4 border border-yellow-200 bg-yellow-50 text-yellow-800 rounded-md">
        {!user ? (
          <>
            <p className="mb-2">Please sign in to proceed with payment.</p>
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          </>
        ) : (
          <p>Loading payment details...</p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-4 w-full">
      <PayPalButtons
        key={Array.isArray(courses) ? "bulk-order" : (courses as Course)._id}
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
