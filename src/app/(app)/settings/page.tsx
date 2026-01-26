import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Palette, ShieldCheck, SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <SettingsIcon className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
      </div>
      <p className="text-muted-foreground">
        Manage your application preferences and system configurations.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5 text-primary" />
              Notification Settings
            </CardTitle>
            <CardDescription>Control how you receive notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotifications" className="flex flex-col space-y-1">
                <span>Email Notifications</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Receive important updates via email.
                </span>
              </Label>
              <Switch id="emailNotifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="shiftReminders" className="flex flex-col space-y-1">
                <span>Shift Reminders</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Get reminders for upcoming shifts.
                </span>
              </Label>
              <Switch id="shiftReminders" defaultChecked />
            </div>
             <div className="flex items-center justify-between">
              <Label htmlFor="feedbackAlerts" className="flex flex-col space-y-1">
                <span>Feedback Alerts</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Notify me when I receive new feedback.
                </span>
              </Label>
              <Switch id="feedbackAlerts" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="mr-2 h-5 w-5 text-primary" />
              Appearance
            </CardTitle>
            <CardDescription>Customize the look and feel of the application.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="darkMode" className="flex flex-col space-y-1">
                <span>Dark Mode</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Enable dark theme for the interface.
                </span>
              </Label>
              <Switch id="darkMode" />
            </div>
            {/* More appearance settings can be added here */}
            <p className="text-sm text-muted-foreground">Theme selection and font size options will be available here.</p>
          </CardContent>
        </Card>
      </div>

      {/* Administrator specific settings (conceptual) */}
      <Card className="border-primary border-2">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <ShieldCheck className="mr-2 h-5 w-5" />
            System Configuration (Admin)
          </CardTitle>
          <CardDescription>Manage global system settings. (Visible to Administrators only)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Administrators can configure certification requirements, manage skill lists, customize patient care forms, manage user roles, and set up integrations from this section.
          </p>
          <Button variant="default" className="bg-primary hover:bg-primary/90">Access Admin Panel</Button>
        </CardContent>
      </Card>
    </div>
  );
}
