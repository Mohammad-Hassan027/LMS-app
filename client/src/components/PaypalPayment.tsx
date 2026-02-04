import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
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
import { useShoppingCart } from "@/contexts/student/hook";

const PaypalPayment = ({
  user,
  courses,
}: {
  user: UserResource | null | undefined;
  courses: Course | CartItem[];
}) => {
  const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  if (!PAYPAL_CLIENT_ID) {
    throw new Error("Missing PayPal Client ID");
  }

  const { mutateAsync: createOrder } = useCreateOrderService();
  const { mutateAsync: captureOrder } =
    useCapturePaymentAndFinalizeOrderService();

  const { clearCart } = useShoppingCart();

  const isBulk = Array.isArray(courses);
  const totalPrice = isBulk
    ? (courses as CartItem[]).reduce(
        (acc, item) => acc + Number(item?.pricing || 0),
        0,
      )
    : Number((courses as Course)?.pricing || 0);

  const getOrderPayload = () => {
    if (!user || !user.primaryEmailAddress) {
      return null;
    }

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

    if (isBulk) {
      return {
        ...baseOrderData,
        cartItems: (courses as CartItem[]).map((item) => ({
          id: item._id,
          title: item.title,
          image: item.image,
          pricing: item.pricing,
          instructorId: item.instructorId,
          instructorName: item.instructorName,
        })),
      };
    } else {
      const course = courses as Course;
      return {
        ...baseOrderData,
        instructorId: course.instructorId,
        instructorName: course.instructorName,
        courseImage: course.image,
        courseTitle: course.title,
        courseId: course._id,
        coursePricing: course.pricing,
      };
    }
  };

  // Handle Paid Orders (PayPal)
  const handlePaypalCreateOrder = async () => {
    const payload = getOrderPayload();
    if (!payload) {
      throw new Error("User details missing");
    }

    try {
      // The backend returns a PayPal Order ID here
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

  const handlePaypalApprove = async (data: { orderID: string }) => {
    try {
      await captureOrder({ paymentId: data.orderID });
      toast.success("Purchase successful! You are now enrolled.");

      if (isBulk) {
        clearCart();
      }

      window.location.href = "/my-courses";
    } catch (error) {
      console.error("Payment Capture Failed:", error);
      toast.error("Payment was authorized but could not be captured.");
    }
  };

  // 3. Handle Free Orders (Bypass PayPal)
  const handleFreeEnrollment = async () => {
    const payload = getOrderPayload();
    if (!payload) return;

    try {
      // Backend detects $0 and returns success immediately
      const response = await createOrder(payload);

      if (
        response?.success ||
        response?.data?.success ||
        response?.data?.isFree
      ) {
        toast.success("Enrollment successful!");
        if (isBulk) clearCart();
        window.location.href = "/my-courses";
      } else {
        // Fallback if backend doesn't explicitly flag success but returns 201
        toast.success("Enrollment successful!");
        if (isBulk) clearCart();
        window.location.href = "/my-courses";
      }
    } catch (error) {
      console.error("Free Enrollment Failed:", error);
      toast.error("Failed to enroll. Please try again.");
    }
  };

  const hasValidData = Array.isArray(courses) ? courses.length > 0 : !!courses;

  if (!user || !user.primaryEmailAddress || !hasValidData) {
    return (
      <div className="p-4 border border-yellow-200 bg-yellow-50 text-yellow-800 rounded-md">
        {!user ? (
          <>
            <p className="mb-2">Please sign in to proceed.</p>
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

  if (totalPrice === 0) {
    return (
      <div className="mt-4 w-full">
        <Button
          onClick={handleFreeEnrollment}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3"
        >
          Enroll for Free
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-4 w-full">
      <PayPalScriptProvider
        options={{
          clientId: PAYPAL_CLIENT_ID,
          currency: "USD",
          intent: "capture",
        }}
      >
        <PayPalButtons
          key={isBulk ? "bulk-order" : (courses as Course)._id}
          style={{ layout: "vertical" }}
          createOrder={handlePaypalCreateOrder}
          onApprove={handlePaypalApprove}
          onError={(err) => {
            console.error("PayPal Error:", err);
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default PaypalPayment;
