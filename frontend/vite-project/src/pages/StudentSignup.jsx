import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StudentDataContext } from '../context/StudentContext';
import ProfileImageUpload from '../context/ProfileImageUpload';
import { useToast } from '../hooks/useToast';
import AnimatedPage from '../components/AnimatedPage';
import { GlassCard } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { FiUser, FiMail, FiLock, FiBookOpen, FiHash, FiEye, FiEyeOff } from 'react-icons/fi';

const StudentSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [roll_no, setRoll_no] = useState('');
  const [section, setSection] = useState('');
  const [semester, setSemester] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { setStudent } = useContext(StudentDataContext);
  const addToast = useToast();

  React.useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/section/sections`);
        setSections(response.data);
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };
    fetchSections();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('roll_no', roll_no);
    formData.append('section', section);
    formData.append('semester', semester);
    if (avatar) formData.append('avatar', avatar);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/student/register`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 201) {
        const data = response.data;
        setStudent(data.student);
        localStorage.setItem('token', data.token);
        addToast({ title: "Account Created!", description: "Welcome to the Digital Evaluation System.", status: "success" });
        navigate('/studentDashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || "Something went wrong during signup.";
      addToast({ 
        title: "Registration Failed", 
        description: errorMessage, 
        status: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedPage className="flex items-center justify-center relative overflow-hidden p-6 py-12 min-h-screen">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none fixed" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none fixed" />

      <div className="w-full max-w-lg relative z-10 m-auto">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary-gradient flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
            <span className="text-white font-bold font-heading text-2xl">D</span>
          </div>
          <h2 className="font-heading text-2xl font-bold bg-clip-text text-transparent bg-primary-gradient mb-2">
            Create Student Account
          </h2>
          <p className="text-[--color-text-secondary] text-center max-w-sm">
            Join the platform to view your evaluated answer papers and track your academic progress
          </p>
        </div>

        <GlassCard padding="p-8">
          <form onSubmit={submitHandler} className="space-y-5">
            <ProfileImageUpload avatar={avatar} setAvatar={setAvatar} />

            <Input
              label="Full Name"
              type="text"
              icon={FiUser}
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Email Address"
              type="email"
              icon={FiMail}
              placeholder="student@example.com"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Roll Number"
                type="text"
                icon={FiHash}
                placeholder="e.g. 2023001"
                value={roll_no}
                onChange={(e) => setRoll_no(e.target.value)}
                required
              />
              <div className="flex flex-col">
                <label className="text-sm font-medium text-[--color-text-secondary] mb-2 px-1">Section</label>
                <div className="relative">
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full bg-[--color-bg-elevated] border border-[--color-border-default] rounded-xl pl-11 pr-4 py-3 text-[--color-text-primary] focus:outline-none focus:border-[--color-accent-blue] focus:ring-1 focus:ring-[--color-accent-blue]/50 transition-all font-sans appearance-none cursor-pointer"
                    required
                  >
                    <option value="" disabled>Select Section</option>
                    {sections.map((sec) => (
                      <option key={sec._id} value={sec.sectionName}>
                        {sec.sectionName}
                      </option>
                    ))}
                  </select>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[--color-text-muted]">
                    <FiUser className="w-4 h-4" />
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[--color-text-muted]">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            <Input
              label="Semester"
              type="number"
              icon={FiBookOpen}
              placeholder="e.g. 3"
              min="1"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              required
            />

            <Button type="submit" fullWidth isLoading={isLoading} className="mt-4">
              Create Account
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-[--color-border-default] text-center">
            <p className="text-sm text-[--color-text-muted]">
              Already have an account?{' '}
              <Link to="/student/login" className="text-[--color-accent-blue] hover:underline font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </GlassCard>
      </div>
    </AnimatedPage>
  );
};

export default StudentSignup;
