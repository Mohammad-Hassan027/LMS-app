import { PlayCircle, Users, Trophy, Target, Heart, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Suspense, lazy } from "react";
const Footer = lazy(() => import("@/components/student-view/Footer"));

function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative w-full border-b bg-linear-to-b from-primary/5 via-background to-background py-20 md:py-32">
        <div className="container mx-auto px-6 flex flex-col items-center text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl mb-6">
            Empowering the World to <span className="text-primary">Learn</span>
          </h1>
          <p className="max-w-3xl text-lg text-muted-foreground md:text-xl mb-8">
            At PathOS, we believe education is the passport to the future. Our
            mission is to make quality education accessible, affordable, and
            engaging for learners everywhere.
          </p>
        </div>
      </section>

      <section className="px-6 py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block p-3 rounded-full bg-primary/10 text-primary mb-2">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We are dedicated to bridging the gap between talent and
                opportunity. Whether you're a student looking to upskill or an
                instructor sharing your expertise, PathOS provides the platform
                you need to succeed.
              </p>
              <div className="flex gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Users className="w-5 h-5 text-primary" />
                  <span>Student-Centric</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Heart className="w-5 h-5 text-primary" />
                  <span>Passionate Community</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-2xl p-8 md:p-12 min-h-100 flex items-center justify-center relative overflow-hidden">
              {/* Placeholder for an image or illustration */}
              <div className="absolute inset-0 bg-primary/5 opacity-50 pattern-grid-lg"></div>
              <div className="relative z-10 text-center space-y-4">
                <Globe className="w-24 h-24 text-primary mx-auto opacity-80" />
                <h3 className="text-2xl font-bold text-gray-900">
                  Global Reach
                </h3>
                <p className="text-gray-600">
                  Connecting learners from 50+ countries
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50/50 border-y border-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
              Driving Innovation in Education
            </h2>
            <p className="text-muted-foreground">
              We leverage technology to create immersive and effective learning
              experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <PlayCircle className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">High Quality Content</h3>
              <p className="text-muted-foreground">
                Curated courses from industry veterans and academic experts.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <Users className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Community First</h3>
              <p className="text-muted-foreground">
                Peer-to-peer learning, discussion forums, and collaborative
                projects.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <Trophy className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Recognized Certs</h3>
              <p className="text-muted-foreground">
                Certificates that hold value in the job market and boost your
                resume.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Join the PathOS Journey</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8 text-lg">
            Ready to start learning or teaching? Become a part of our growing
            community today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" onClick={() => navigate("/courses")}>
              Explore Courses
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/become-instructor")}
            >
              Become an Instructor
            </Button>
          </div>
        </div>
      </section>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default AboutPage;
