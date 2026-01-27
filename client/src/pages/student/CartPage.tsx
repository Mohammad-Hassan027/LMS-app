import PaypalPayment from "@/components/PaypalPayment";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useShoppingCart } from "@/contexts/student/hook";
import { useUser } from "@clerk/clerk-react";
import { Trash2, BookOpen, FilterX } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CartPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, cartTotal, clearCart } = useShoppingCart();
  const { user } = useUser();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="bg-primary/10 p-6 rounded-full text-primary">
          <BookOpen className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-muted-foreground max-w-md">
          Looks like you haven't added any courses yet. Explore our catalog to
          find your next learning adventure.
        </p>
        <Button size="lg" onClick={() => navigate("/courses")} className="mt-4">
          Browse Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="container mx-auto px-6">
        <div className="w-full flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <Button
            variant="ghost"
            size="sm"
            className="justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors mt-2"
            onClick={() => clearCart()}
          >
            <FilterX className="w-4 h-4 mr-2" />
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <Card
                key={item._id}
                className="shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-48 h-32 shrink-0 rounded-lg overflow-hidden bg-gray-200">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        By {item.instructorName} • {item.level}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 -ml-2"
                        onClick={() => removeFromCart(item._id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                      <span className="text-lg font-bold text-gray-900">
                        ${Number(item.pricing).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-lg border-0 bg-gray-50/50">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Summary</h2>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>

                  <div className="h-px bg-gray-200 my-4" />

                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <PaypalPayment user={user} courses={cartItems} />

                <p className="text-xs text-center text-muted-foreground mt-4">
                  30-Day Money-Back Guarantee
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
