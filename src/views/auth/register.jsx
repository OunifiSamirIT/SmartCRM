import { useState, useEffect } from "react";
import axios from "axios";
import InputField from "components/fields/InputField";
import Checkbox from "components/checkbox";
import { useNavigate } from "react-router-dom"; // import useNavigate hook

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Map role names to their corresponding IDs
  const roleIdMapping = {
    superadmin: 2,
    agent: 3
    // Add other roles as needed
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/roles');
        setRoles(response.data);
      } catch (error) {
        setError("Failed to fetch roles");
      }
    };

    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Map role name to role ID
    const roleId = roleIdMapping[role.toLowerCase()];
    
    if (!roleId) {
      setError("Invalid role selected");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', role); // Send role ID
    formData.append('roleId', roleId); // Send role ID
    formData.append('profileImage', profileImage);

    try {
        const token = sessionStorage.getItem('token');

      await axios.post('http://localhost:5000/auth/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Add Authorization header

        }
      });

      navigate("/auth/sign-in"); // Redirect to login page after successful registration
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

  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Register
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your details to create a new account.
        </p>

        <form onSubmit={handleSubmit}>
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

          <InputField
            variant="auth"
            extra="mb-3"
            label="Confirm Password*"
            placeholder="Re-enter password"
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-navy-700 dark:text-white">
              Role*
            </label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              required
            >
              <option value="">Select a role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="profileImage" className="block text-sm font-medium text-navy-700 dark:text-white">
              Profile Image
            </label>
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              accept="image/*"
              onChange={(e) => setProfileImage(e.target.files[0])}
              className="mt-1 block w-full text-gray-900 dark:text-gray-100"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="mt-4">
          <span className="text-sm font-medium text-navy-700 dark:text-gray-600">
            Already have an account?
          </span>
          <a
            href="/login"
            className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
