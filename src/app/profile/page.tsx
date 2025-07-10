"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageContainer from "@/components/shared/PageContainer";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import type { User } from "@/types";
import { UserCircle, Edit3, Trash2, LogOut, Briefcase, ShieldCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Mock user data and bookings
const mockUser: User = {
  id: "user_123",
  firstName: "Alex",
  lastName: "Wanderer",
  email: "alex.wanderer@example.com",
  avatarUrl: "https://placehold.co/100x100.png?text=AW",
};

const mockBookings = [
  { id: "bk_abc123", hotelName: "Grand Parisian Hotel", dates: "Oct 15, 2023 - Oct 18, 2023", status: "Confirmed" },
  { id: "bk_def456", hotelName: "Tokyo Imperial Palace View", dates: "Nov 20, 2023 - Nov 25, 2023", status: "Confirmed" },
  { id: "bk_ghi789", hotelName: "Chic Montmartre Boutique", dates: "Jan 05, 2024 - Jan 07, 2024", status: "Cancelled" },
];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    // Simulate checking auth state
    const authData = localStorage.getItem('nomad-navigator-auth');
    if (authData) {
        const parsedAuth = JSON.parse(authData);
        if (parsedAuth.isAuthenticated) {
            setIsAuthenticated(true);
            // Use mock user data, but could fetch real user data here
            setUser({
                ...mockUser,
                email: parsedAuth.userName || mockUser.email, // Use logged-in email if available
                firstName: parsedAuth.userName?.split('@')[0] || mockUser.firstName
            });
        } else {
             router.push("/login");
        }
    } else {
        router.push("/login");
    }
  }, [router]);

  const handleDeleteAccount = async () => {
    // Simulate API call for account deletion
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({ title: "Account Deletion Requested", description: "Your account deletion process has started." });
    // Clear auth state and redirect
    localStorage.removeItem('nomad-navigator-auth');
    router.push("/");
    router.refresh();
  };

  const handleLogout = () => {
    localStorage.removeItem('nomad-navigator-auth');
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    router.push("/");
    router.refresh();
  };

  if (!isAuthenticated || !user) {
    // This will briefly show while redirecting or if auth check is async
    return <div className="flex flex-col min-h-screen"><Header /><PageContainer className="text-center"><p>Loading profile...</p></PageContainer><Footer /></div>;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <PageContainer>
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/80 to-accent/80 p-8 text-primary-foreground">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                  <AvatarImage src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} data-ai-hint="user portrait" />
                  <AvatarFallback className="text-3xl bg-background text-primary">{user.firstName.charAt(0)}{user.lastName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-4xl font-headline">{user.firstName} {user.lastName}</CardTitle>
                  <CardDescription className="text-lg text-primary-foreground/80 mt-1">{user.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <Tabs defaultValue="bookings" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 rounded-none border-b">
                <TabsTrigger value="bookings" className="py-3 text-base">My Bookings</TabsTrigger>
                <TabsTrigger value="profileInfo" className="py-3 text-base">Profile Details</TabsTrigger>
                <TabsTrigger value="security" className="py-3 text-base">Security</TabsTrigger>
                <TabsTrigger value="settings" className="py-3 text-base">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="bookings" className="p-6 md:p-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center"><Briefcase className="mr-3 text-primary"/> My Bookings</h2>
                {mockBookings.length > 0 ? (
                  <div className="space-y-4">
                    {mockBookings.map(booking => (
                      <Card key={booking.id} className="p-4 border-l-4_ border-primary_ shadow-sm hover:shadow-md transition-shadow"> {/* Custom border removed due to tailwind rules */}
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg text-primary">{booking.hotelName}</h3>
                            <p className="text-sm text-muted-foreground">{booking.dates}</p>
                          </div>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${booking.status === "Confirmed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="mt-3 flex gap-2">
                            <Button variant="outline" size="sm">View Details</Button>
                            {booking.status === "Confirmed" && <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">Cancel Booking</Button>}
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">You have no bookings yet.</p>
                )}
              </TabsContent>

              <TabsContent value="profileInfo" className="p-6 md:p-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center"><UserCircle className="mr-3 text-primary"/> Profile Information</h2>
                <div className="space-y-4 text-md">
                    <div className="grid grid-cols-3 items-center">
                        <span className="font-medium text-muted-foreground">Full Name:</span>
                        <span className="col-span-2">{user.firstName} {user.lastName}</span>
                    </div>
                     <div className="grid grid-cols-3 items-center">
                        <span className="font-medium text-muted-foreground">Email:</span>
                        <span className="col-span-2">{user.email}</span>
                    </div>
                    {/* Add more profile fields here */}
                </div>
                <Button variant="outline" className="mt-6"><Edit3 size={16} className="mr-2"/> Edit Profile</Button>
              </TabsContent>

              <TabsContent value="security" className="p-6 md:p-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center"><ShieldCheck className="mr-3 text-primary"/> Security Settings</h2>
                <div className="space-y-4">
                    <Button variant="outline">Change Password</Button>
                    <Button variant="outline">Two-Factor Authentication</Button>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="p-6 md:p-8">
                 <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>
                 <div className="space-y-4">
                    <Button variant="outline" onClick={handleLogout} className="w-full sm:w-auto mr-2">
                        <LogOut size={16} className="mr-2"/> Log Out
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full sm:w-auto">
                          <Trash2 size={16} className="mr-2"/> Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                            Yes, Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                 </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </PageContainer>
      <Footer />
    </div>
  );
}

