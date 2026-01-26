// src/app/(app)/admin/users/page.tsx
'use client';

import * as React from 'react';
import { RoleProtectedRoute } from '@/components/auth/RoleProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, Search, Users, CheckCircle, Clock, XCircle, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAllUsers, updateUserApproval } from '@/actions/userActions';
import type { UserProfile } from '@/types';
import { format } from 'date-fns';

function AdminUsersContent() {
  const { toast } = useToast();
  const [users, setUsers] = React.useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = React.useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<string>('all');
  const [approvalFilter, setApprovalFilter] = React.useState<string>('all');
  const [updatingUserId, setUpdatingUserId] = React.useState<string | null>(null);

  // Fetch all users on mount
  React.useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      const result = await getAllUsers();
      
      if (result.success && result.data) {
        setUsers(result.data);
        setFilteredUsers(result.data);
      } else {
        toast({
          title: 'Error Loading Users',
          description: result.error || 'Failed to fetch users',
          variant: 'destructive',
        });
      }
      setIsLoading(false);
    }

    fetchUsers();
  }, [toast]);

  // Apply filters whenever search term or filters change
  React.useEffect(() => {
    let filtered = [...users];

    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.fullName.toLowerCase().includes(lowerSearch) ||
        user.email.toLowerCase().includes(lowerSearch)
      );
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Apply approval filter
    if (approvalFilter !== 'all') {
      if (approvalFilter === 'approved') {
        filtered = filtered.filter(user => user.approved === true);
      } else if (approvalFilter === 'pending') {
        filtered = filtered.filter(user => 
          user.role === 'Instructor' && user.approved !== true
        );
      }
    }

    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, approvalFilter, users]);

  // Handle approval toggle
  const handleToggleApproval = async (userId: string, currentApproval: boolean | undefined) => {
    const newApproval = !currentApproval;
    setUpdatingUserId(userId);

    const result = await updateUserApproval(userId, newApproval);

    if (result.success) {
      // Update local state
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, approved: newApproval } : user
        )
      );

      toast({
        title: newApproval ? 'Instructor Approved' : 'Approval Revoked',
        description: newApproval 
          ? 'The instructor can now access the system.' 
          : 'The instructor has been blocked from system access.',
      });
    } else {
      toast({
        title: 'Update Failed',
        description: result.error || 'Could not update approval status',
        variant: 'destructive',
      });
    }

    setUpdatingUserId(null);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setApprovalFilter('all');
  };

  // Get role badge variant
  const getRoleBadgeVariant = (role: string): "default" | "secondary" | "destructive" => {
    switch (role) {
      case 'Student':
        return 'default'; // Blue
      case 'Instructor':
        return 'secondary'; // Gray
      case 'Administrator':
        return 'destructive'; // Red
      default:
        return 'secondary';
    }
  };

  // Get approval badge
  const getApprovalBadge = (user: UserProfile) => {
    // Students and admins don't need approval
    if (user.role === 'Student' || user.role === 'Administrator') {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
          <CheckCircle className="h-3 w-3 mr-1" />
          Active
        </Badge>
      );
    }

    // Instructors need approval
    if (user.approved === true) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    }
  };

  // Format date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    
    try {
      // Handle Firestore Timestamp
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Get statistics
  const stats = React.useMemo(() => {
    const totalUsers = users.length;
    const students = users.filter(u => u.role === 'Student').length;
    const instructors = users.filter(u => u.role === 'Instructor').length;
    const admins = users.filter(u => u.role === 'Administrator').length;
    const pendingInstructors = users.filter(u => 
      u.role === 'Instructor' && u.approved !== true
    ).length;

    return { totalUsers, students, instructors, admins, pendingInstructors };
  }, [users]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center">
          <Shield className="h-8 w-8 mr-3 text-primary" />
          User Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage all system users, approve instructors, and monitor account status.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.students}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Instructors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.instructors}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.admins}</div>
          </CardContent>
        </Card>

        <Card className={stats.pendingInstructors > 0 ? 'border-yellow-300 bg-yellow-50' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingInstructors}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Users</CardTitle>
          <CardDescription>Search and filter to find specific users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Role Filter */}
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Student">Students</SelectItem>
                <SelectItem value="Instructor">Instructors</SelectItem>
                <SelectItem value="Administrator">Administrators</SelectItem>
              </SelectContent>
            </Select>

            {/* Approval Filter */}
            <Select value={approvalFilter} onValueChange={setApprovalFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            All Users ({filteredUsers.length})
          </CardTitle>
          <CardDescription>
            {filteredUsers.length === users.length 
              ? 'Showing all users'
              : `Showing ${filteredUsers.length} of ${users.length} users`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No users found matching your criteria.</p>
              <Button variant="link" onClick={handleClearFilters} className="mt-2">
                Clear filters to see all users
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{getApprovalBadge(user)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        {user.role === 'Instructor' && (
                          <Button
                            size="sm"
                            variant={user.approved ? 'outline' : 'default'}
                            onClick={() => handleToggleApproval(user.id, user.approved)}
                            disabled={updatingUserId === user.id}
                          >
                            {updatingUserId === user.id ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                Updating...
                              </>
                            ) : user.approved ? (
                              <>
                                <XCircle className="h-3 w-3 mr-1" />
                                Revoke
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approve
                              </>
                            )}
                          </Button>
                        )}
                        {user.role === 'Student' && (
                          <span className="text-xs text-muted-foreground">No action needed</span>
                        )}
                        {user.role === 'Administrator' && (
                          <span className="text-xs text-muted-foreground">Admin account</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <RoleProtectedRoute allowedRoles={['Administrator']}>
      <AdminUsersContent />
    </RoleProtectedRoute>
  );
}

