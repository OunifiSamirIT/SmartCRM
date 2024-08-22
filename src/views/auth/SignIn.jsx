import { useState } from "react";
import axios from "axios";
import InputField from "components/fields/InputField";
import Checkbox from "components/checkbox";
import { useNavigate } from "react-router-dom"; // import useNavigate hook

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleCheckboxChange = () => {
    setRememberMe(!rememberMe);
  };

  const Auth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        email,
        password,
      });
  
      const { token, user } = response.data;
      const role = user.role;  // Extract the role
      const userId = user.id;  // Extract the user ID
  
      // Store user token, info, and role in sessionStorage
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(user));  // Store the entire user object
      sessionStorage.setItem('role', role);  // Store the role separately
      sessionStorage.setItem('userId', userId);  // Store the user ID separately
  
      // Navigate to a page based on user role
      if (role === "admin") {
        navigate("/admin/default");
      } else if (role === "superadmin") {
        navigate("/admin/default");
      } else if (role === "agent") {
        navigate("/admin/Commande");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || error.response.data.msg);
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
  const role = localStorage.getItem('role') || sessionStorage.getItem('role');
  console.log("User: ", user, "Role: ", role);

  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Login
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your email and password to login.
        </p>

       

        <form onSubmit={Auth}>
          <InputField
            variant="auth"
            extra="mb-3"
            label="Email*"
            placeholder="mail@simmmple.com"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputField
            variant="auth"
            extra="mb-3"
            label="Password*"
            placeholder="Min. 8 characters"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="mb-4 flex items-center justify-between px-2">
            <div className="flex items-center">
              <Checkbox checked={rememberMe} onChange={handleCheckboxChange} />
              <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
                Keep me logged In
              </p>
            </div>
            <a
              className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
              href="/forgot-password"
            >
              Forgot Password?
            </a>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
            disabled={isLoading}
          >
            {isLoading ? 'Logging In...' : 'Login'}
          </button>
        </form>

        
      </div>
    </div>
  );
}

