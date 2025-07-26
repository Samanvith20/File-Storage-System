
'use client'
import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react"
import Link from "next/link"
import toast, { Toaster } from "react-hot-toast"
import { useRouter } from 'next/navigation';


export default function AuthForm({type}) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [focusedField, setFocusedField] = useState(null)
const router=useRouter()
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSignUp = async (e) => {
    
    e.preventDefault()
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all fields")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    try {
        const toastloading = toast.loading("Creating account...")
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        const data = await response.json()
        if (!response.ok) {
          toast.error(data.message || "Something went wrong",{
            id: toastloading
          })
        }
        else {
          toast.success("Account created successfully!",{
            id: toastloading
          })
          setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          })
          router.push("/signin")
        }
    } catch (error) {
        console.error("Registration error:", error)
        toast.error("Failed to create account. Please try again later.")
    }
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields")
      return
    }
    try {
        const toastloading = toast.loading("Signing in...")
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email.trim().toLowerCase(),
            password: formData.password.trim(),
          }),
        })
        const data = await response.json()
        console.log("Login Response:", data)
        // set the accesstoken in the localStorage
        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
        }
        if (!response.ok) {
          toast.error(data.message || "Something went wrong",{
            id: toastloading
          })
        } else {
          toast.success("Signed in successfully!",{
            id: toastloading
          })
          setFormData({
            email: "",
            password: "",
          })
           router.push("/")
        }
    } catch (error) {
        console.error("Login error:", error)
        toast.error("Failed to sign in. Please try again later.")
    }
  }
  return (
    <>
    <Toaster />
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply blur-[100px] opacity-20 animate-pulse-bg" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply blur-[100px] opacity-20 animate-pulse-bg delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply blur-[100px] opacity-10 transform -translate-x-1/2 -translate-y-1/2 animate-pulse-bg delay-500" />
      </div>

      <div className="w-full max-w-lg bg-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-2xl shadow-2xl p-8 z-10 animate-slide-in">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mx-auto mb-4 flex items-center justify-center hover:scale-110 transition-transform">
            <User className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white mb-1">Create Account</h1>
          <p className="text-sm text-slate-400">Join us today and start your journey</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={
          type === "signup" ? handleSignUp : handleSignIn}>
            { type === "signup" && (
          <div>
            <label htmlFor="name" className="block text-sm text-slate-400 mb-2">Username</label>
            <input
              id="name"
              type="text"
              placeholder="John"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField(null)}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition-all"
            />
          </div>
)}

          <div>
            <label htmlFor="email" className="block text-sm text-slate-400 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-slate-400 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-10 pr-10 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

{ type === "signup" &&(
          <div>
            <label htmlFor="confirmPassword" className="block text-sm text-slate-400 mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                onFocus={() => setFocusedField("confirmPassword")}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-10 pr-10 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
)}
        { type==="signup" && (
          <button type="submit" className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold text-sm flex items-center justify-center gap-2 hover:scale-105 transition-transform group">
            Create Account
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
)}
 { type==="signin" && (
          <button type="submit" className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold text-sm flex items-center justify-center gap-2 hover:scale-105 transition-transform group">
            Sign In 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
)}

        </form>
     { type==="signup" &&
        <div className="text-center mt-4 text-slate-400 text-sm">
          Already have an account?{" "}
          <Link href="/signin" className="text-purple-300 hover:text-purple-200 font-semibold transition-colors">
            Sign in
          </Link>
        </div>
}
        { type==="signin" &&
         <div className="text-center mt-4 text-slate-400 text-sm">
          Don't have an account?{" "}
          <Link href="/signup" className="text-purple-300 hover:text-purple-200 font-semibold transition-colors">
            Sign up
          </Link>
        </div>
}
      </div>
    </div>
    </>
  )
}

