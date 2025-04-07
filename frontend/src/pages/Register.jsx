
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '@/context/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { toast } from '@/hooks/use-toast';

// const Register = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { register } = useAuth();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!name || !email || !password || !confirmPassword) {
//       toast({
//         title: "Error",
//         description: "Please fill in all fields",
//         variant: "destructive"
//       });
//       return;
//     }
    
//     if (password !== confirmPassword) {
//       toast({
//         title: "Error",
//         description: "Passwords do not match",
//         variant: "destructive"
//       });
//       return;
//     }
    
//     if (password.length < 6) {
//       toast({
//         title: "Error",
//         description: "Password must be at least 6 characters long",
//         variant: "destructive"
//       });
//       return;
//     }
    
//     try {
//       setIsSubmitting(true);
//       await register(name, email, password);
//     } catch (error) {
//       toast({
//         title: "Registration Failed",
//         description: error.message || "Something went wrong",
//         variant: "destructive"
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background p-4">
//       <Card className="w-full max-w-md">
//         <CardHeader className="space-y-1">
//           <div className="flex justify-center mb-4">
//             <Link to="/" className="flex items-center gap-2">
//               <span className="text-primary text-2xl">●</span>
//               <span className="text-xl font-semibold">ProjectHub</span>
//             </Link>
//           </div>
//           <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
//           <CardDescription className="text-center">
//             Enter your information to create an account
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="name">Full Name</Label>
//               <Input 
//                 id="name" 
//                 type="text" 
//                 placeholder="John Doe" 
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input 
//                 id="email" 
//                 type="email" 
//                 placeholder="example@email.com" 
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input 
//                 id="password" 
//                 type="password" 
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="confirmPassword">Confirm Password</Label>
//               <Input 
//                 id="confirmPassword" 
//                 type="password" 
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 required
//               />
//             </div>
//             <Button 
//               type="submit" 
//               className="w-full" 
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? "Creating Account..." : "Create Account"}
//             </Button>
//           </form>
//         </CardContent>
//         <CardFooter className="flex justify-center">
//           <p className="text-sm text-muted-foreground">
//             Already have an account?{" "}
//             <Link to="/login" className="text-primary font-medium hover:underline">
//               Sign in
//             </Link>
//           </p>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// };

// export default Register;






import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!name || !email || !password || !confirmPassword) {
      setErrorMsg("Please fill in all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      return;
    }
    
    try {
      setIsSubmitting(true);
      await register(name, email, password);
      // We don't need to manually navigate here as the AuthContext will handle it
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMsg(error.message || "Could not create account");
      toast({
        title: "Registration failed",
        description: error.message || "Could not create account",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-primary text-2xl">●</span>
              <span className="text-xl font-semibold">ProjectHub</span>
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                type="text" 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="example@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </span>
              ) : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;