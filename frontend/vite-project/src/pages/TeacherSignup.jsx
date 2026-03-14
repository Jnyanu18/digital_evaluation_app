import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TeacherDataContext } from '../context/TeacherContext';
import ProfileImageUpload from '../context/ProfileImageUpload';
import { useToast } from '../hooks/useToast';
import AnimatedPage from '../components/AnimatedPage';
import { GlassCard } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { FiUser, FiMail, FiLock, FiBriefcase, FiEye, FiEyeOff } from 'react-icons/fi';

const TeacherSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { setTeacher } = useContext(TeacherDataContext);
  const addToast = useToast();

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('department', department);
    if (avatar) formData.append('avatar', avatar);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/teacher/register`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 201) {
        const data = response.data;
        setTeacher({
          email: data.teacher.email,
          name: data.teacher.name,
        });
        localStorage.setItem('token', data.token);
        addToast({ title: "Registration Successful", description: "You can now start evaluating papers.", status: "success" });
        navigate('/teacherDashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      addToast({ 
        title: "Registration Failed", 
        description: error.response?.data?.message || "Something went wrong during signup.", 
        status: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedPage className="flex items-center justify-center relative overflow-hidden p-6 py-12 min-h-screen">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-600/20 rounded-full blur-[120px] pointer-events-none fixed" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none fixed" />

      <div className="w-full max-w-lg relative z-10 m-auto">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary-gradient flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
            <span className="text-white font-bold font-heading text-2xl">D</span>
          </div>
          <h2 className="font-heading text-2xl font-bold bg-clip-text text-transparent bg-primary-gradient mb-2">
            Teacher Registration
          </h2>
          <p className="text-[--color-text-secondary] text-center max-w-sm">
            Create an account to evaluate answer papers and manage examination records
          </p>
        </div>

        <GlassCard padding="p-8">
          <form onSubmit={submitHandler} className="space-y-5">
            <ProfileImageUpload avatar={avatar} setAvatar={setAvatar} />

            <Input
              label="Full Name"
              type="text"
              icon={FiUser}
              placeholder="e.g. Dr. Rajesh Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

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
              >
                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>

            <Input
              label="Department"
              type="text"
              icon={FiBriefcase}
              placeholder="e.g. Computer Science"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />


            <Button type="submit" fullWidth isLoading={isLoading} className="mt-4">
              Create Account
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-[--color-border-default] text-center">
            <p className="text-sm text-[--color-text-muted]">
              Already have an account?{' '}
              <Link to="/teacher/login" className="text-[--color-accent-blue] hover:underline font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </GlassCard>
      </div>
    </AnimatedPage>
  );
};

export default TeacherSignup;
