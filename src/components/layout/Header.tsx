"use client";
import Link from "next/link";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

// Helper function to get navigation items based on user role
function getNavigationItems(role: string) {
  switch (role) {
    case 'Student':
      return [
        { name: "Dashboard", href: "/dashboard" },
        { name: "My Shifts", href: "/shifts" },
        { name: "My Encounters", href: "/encounters" },
        { name: "Log Encounter", href: "/patient-care-form" },
        { name: "Profile", href: "/profile" },
      ];
    case 'Instructor':
      return [
        { name: "Dashboard", href: "/dashboard" },
        { name: "My Shifts", href: "/shifts" },
        { name: "Profile", href: "/profile" },
      ];
    case 'Administrator':
      return [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Shifts", href: "/shifts" },
        { name: "Users", href: "/admin/users" },
        { name: "Profile", href: "/profile" },
      ];
    default:
      return [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Profile", href: "/profile" },
      ];
  }
}

// Helper function to get role badge color
function getRoleBadgeVariant(role: string): "default" | "secondary" | "destructive" | "outline" {
  switch (role) {
    case 'Student':
      return 'default'; // Blue
    case 'Instructor':
      return 'secondary'; // Gray
    case 'Administrator':
      return 'destructive'; // Red
    default:
      return 'outline';
  }
}

export function Header() {
  const { currentUser, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Get navigation items based on current user's role
  const navigation = useMemo(() => {
    return currentUser ? getNavigationItems(currentUser.role) : [];
  }, [currentUser]);

  // Use user initials as avatar instead of image
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  const roleBadgeVariant = currentUser ? getRoleBadgeVariant(currentUser.role) : 'outline';

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await signOut();
      router.push('/login');
    } catch (err) {
      // Optionally show a toast or error message
      // eslint-disable-next-line no-console
      console.error('Sign out failed:', err);
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <Disclosure as="nav" className="bg-white shadow-sm">
      {({ open }: { open: boolean }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex shrink-0 items-center">
                  <Link href="/">
                    <img
                      alt="CPUT Logo"
                      src="/logo.png"
                      className="h-8 w-auto"
                    />
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium",
                        pathname === item.href
                          ? "border-indigo-500 text-gray-900"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <button
                  type="button"
                  className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="size-6" />
                </button>
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="relative flex rounded-full bg-primary text-primary-foreground text-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <div className="size-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground font-semibold text-xs">
                        {currentUser ? getInitials(currentUser.fullName) : 'U'}
                      </div>
                    </MenuButton>
                  </div>
                  <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{currentUser?.fullName || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{currentUser?.email || ''}</p>
                      {currentUser && (
                        <div className="mt-2">
                          <Badge variant={roleBadgeVariant} className="text-xs">
                            {currentUser.role}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <MenuItem>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Your Profile
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Settings
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <button
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                      >
                        {isSigningOut ? 'Signing out...' : 'Sign out'}
                      </button>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:ring-inset">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon aria-hidden="true" className="block size-6" />
                  ) : (
                    <Bars3Icon aria-hidden="true" className="block size-6" />
                  )}
                </DisclosureButton>
              </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 pt-2 pb-3">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as={Link}
                  href={item.href}
                  className={classNames(
                    "block border-l-4 py-2 pr-4 pl-3 text-base font-medium",
                    pathname === item.href
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                  )}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="flex items-center px-4">
                <div className="shrink-0">
                  <div className="size-10 rounded-full flex items-center justify-center bg-primary text-primary-foreground font-semibold">
                    {currentUser ? getInitials(currentUser.fullName) : 'U'}
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <div className="text-base font-medium text-gray-800">{currentUser?.fullName || "User"}</div>
                  <div className="text-sm font-medium text-gray-500">{currentUser?.email || ""}</div>
                  {currentUser && (
                    <div className="mt-1">
                      <Badge variant={roleBadgeVariant} className="text-xs">
                        {currentUser.role}
                      </Badge>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="relative ml-auto shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="size-6" />
                </button>
              </div>
              <div className="mt-3 space-y-1">
                <DisclosureButton
                  as={Link}
                  href="/profile"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                >
                  Your Profile
                </DisclosureButton>
                <DisclosureButton
                  as={Link}
                  href="/settings"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                >
                  Settings
                </DisclosureButton>
                <DisclosureButton
                  as="button"
                  type="button"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-50"
                >
                  {isSigningOut ? 'Signing out...' : 'Sign out'}
                </DisclosureButton>
              </div>
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
} 