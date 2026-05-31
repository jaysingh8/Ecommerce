import React, { useState } from "react";
import { useAuth } from "../hook/useAuth";
import { useNavigate , Link} from "react-router";

const Login = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
        try {
            const user = await handleLogin({ email: formData.email, password: formData.password });
           
                navigate("/");
            
        } catch (error) {
            console.error("Login failed", error);
        }
  };

  return (
    <div
      className="min-h-screen bg-[#F8F6F1] flex items-center justify-center p-4 lg:p-8"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="w-full lg:w-[92%] lg:h-[88vh] max-w-[1700px] bg-white rounded-[40px] border border-[#EEE7D8] shadow-[0_25px_80px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="grid lg:grid-cols-2 h-full">
          {/* LEFT SIDE */}
          <div className="flex items-center px-8 lg:px-20 py-12 lg:py-0 border-b lg:border-b-0 lg:border-r border-[#F1ECE0]">
            <div className="max-w-xl">
              <p className="uppercase tracking-[0.4em] text-xs text-[#B79A4A] font-medium mb-6">
                Premium Fashion House
              </p>

              <h1
                className="text-6xl lg:text-[96px] leading-none text-[#18181B]"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                }}
              >
                Clothy
              </h1>

              <div className="w-24 h-[2px] bg-[#B79A4A] mt-6"></div>

              <h2
                className="mt-10 text-3xl lg:text-5xl leading-tight text-[#18181B]"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                }}
              >
                Timeless Fashion.
                <br />
                Modern Confidence.
              </h2>

              <p className="mt-8 text-[17px] leading-8 text-[#6B7280]">
                Discover elevated essentials and refined fashion designed for
                individuals who appreciate quality, simplicity, and
                sophistication.
              </p>

              <p className="mt-10 text-[15px] leading-8 text-[#8A8A8A]">
                Crafted with precision.
                <br />
                Designed with intention.
                <br />
                Made to be worn, remembered, and loved.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center justify-center px-8 lg:px-20 py-12">
            <div className="w-full max-w-2xl">
              <div className="mb-12">
                <p className="uppercase tracking-[0.25em] text-xs text-[#B79A4A] font-medium mb-4">
                  Welcome Back
                </p>

                <h2
                  className="text-4xl lg:text-5xl text-[#18181B]"
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                  }}
                >
                  Sign In
                </h2>

                <p className="mt-4 text-[#71717A] text-[15px]">
                  Access your account and continue shopping.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* INPUT FIELDS */}
                <div className="space-y-6">
                  <div>
                    <label className="block mb-3 text-sm text-[#444] font-medium">
                      Email Address
                    </label>

                    <input
                      type="email"
                      placeholder="Enter your email address"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full h-14 rounded-2xl border border-[#E7E1D2] bg-white px-5 text-[15px] outline-none transition-all focus:border-[#B79A4A] focus:ring-4 focus:ring-[#B79A4A]/10"
                    />
                  </div>

                  <div>
                    <label className="block mb-3 text-sm text-[#444] font-medium">
                      Password
                    </label>

                    <input
                      type="password"
                      placeholder="Enter your password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full h-14 rounded-2xl border border-[#E7E1D2] bg-white px-5 text-[15px] outline-none transition-all focus:border-[#B79A4A] focus:ring-4 focus:ring-[#B79A4A]/10"
                    />
                  </div>
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  className="w-full h-14 rounded-2xl bg-[#B79A4A] text-white font-medium tracking-wide hover:bg-[#A48A42] transition-all duration-300"
                >
                  Sign In
                </button>

                {/* REGISTER */}
                <p className="text-center text-[14px] text-[#71717A]">
                  Don't have an account?
                  <span className="ml-2 text-[#B79A4A] font-medium cursor-pointer hover:underline">
                    <Link to="/register">
                    Create Account
                    </Link>
                  </span>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;