import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Footer from "@/components/student-view/Footer";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    toast.success("Message sent successfully!", {
      description: "We'll get back to you as soon as possible.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-primary py-12 md:py-16 text-primary-foreground text-center">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-base md:text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Have questions about a course? Need technical support? We're here to
            help!
          </p>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 md:px-6 -mt-6 md:-mt-8 mb-10 grow">
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-4 lg:col-span-1">
            <Card className="shadow-lg border-0">
              <CardContent className="flex items-start md:items-center gap-4 p-4 md:p-6">
                <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                  <Mail className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900">Email Us</h3>
                  <p className="text-sm text-muted-foreground break-all">
                    support@pathos.com <br />
                    shaikhmohammadhassan027@gmail.com
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardContent className="flex items-center gap-4 p-4 md:p-6">
                <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                  <Phone className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Call Us</h3>
                  <p className="text-sm text-muted-foreground">
                    +1 (555) 123-4567
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardContent className="flex items-start md:items-center gap-4 p-4 md:p-6">
                <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                  <MapPin className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Visit Us</h3>
                  <p className="text-sm text-muted-foreground">
                    123 Education Lane, Tech City
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="lg:col-span-2 shadow-xl border-0">
            <CardContent className="p-5 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Send us a message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    className="min-h-37.5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button type="submit" className="w-full md:w-auto text-lg px-8">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ContactPage;
