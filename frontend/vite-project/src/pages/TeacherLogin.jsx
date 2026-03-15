import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TeacherDataContext } from "../context/TeacherContext";
import { useToast } from "../hooks/useToast";
import axios from "axios";
import AnimatedPage from "../components/AnimatedPage";
import { GlassCard } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const TeacherLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { setTeacher } = useContext(TeacherDataContext);
  const navigate = useNavigate();
  const addToast = useToast();

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/teacher/login`,
        { email, password }
      );

      if (response.status === 200) {
        const data = response.data;
        setTeacher({
          email: data.teacher.email,
          name: data.teacher.name,
        });
        localStorage.setItem("token", data.token);
        addToast({ title: "Welcome back!", description: "Logged in successfully.", status: "success" });
        navigate("/teacherDashboard");
      }
    } catch (error) {
      console.error("Error during teacher login:", error);
      addToast({ 
        title: "Login Failed", 
        description: error.response?.data?.message || "Please check your credentials and try again.", 
        status: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedPage className="flex items-center justify-center relative overflow-hidden p-6 relative">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[440px] relative z-10">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary-gradient flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
            <span className="text-white font-bold font-heading text-2xl">D</span>
          </div>
          <h2 className="font-heading text-2xl font-bold bg-clip-text text-transparent bg-primary-gradient">
            Teacher Portal
          </h2>
          <p className="text-[--color-text-secondary] mt-2">Sign in to manage evaluations</p>
        </div>

        <GlassCard>
          <form onSubmit={submitHandler} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              icon={FiMail}
              placeholder="teacher@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                icon={FiLock}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
               <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-[--color-text-secondary] hover:text-[--color-text-primary] transition-colors focus-ring-custom rounded p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>

            <Button type="submit" fullWidth isLoading={isLoading} className="mt-2 text-md h-12">
              Sign In
            </Button>
            
            <Button 
              type="button" 
              fullWidth 
              variant="secondary"
              className="mt-2 border border-blue-500/30 hover:bg-blue-500/10 text-blue-300 h-10 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
              onClick={() => {
                setEmail("teacher@demo.com");
                setPassword("teacher123");
                addToast({ title: "Demo Credentials Loaded", description: "Click 'Sign In' to continue.", status: "success" });
              }}
            >
              Load Demo Teacher Credentials
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-[--color-border-default] space-y-4">
            <div className="flex gap-3 mt-4">
              <Link to="/student/login" className="flex-1">
                <Button variant="secondary" size="sm" fullWidth>Student Login</Button>
              </Link>
              <Link to="/admin/login" className="flex-1">
                <Button variant="secondary" size="sm" fullWidth>Admin Login</Button>
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>
    </AnimatedPage>
  );
};

export default TeacherLogin;