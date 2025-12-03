// This file is the root layout for the admin section.
// It applies the authentication wrapper and the admin layout to its children (the protected routes).

import AuthWrapper from "@/components/admin/AuthWrapper";
import AdminLayout from "@/components/admin/AdminLayout";

export default function ProtectedAdminLayout({ children }) {
  return (
    <AuthWrapper>
      <AdminLayout>{children}</AdminLayout>
    </AuthWrapper>
  );
} 