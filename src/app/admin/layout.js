import AuthWrapper from "@/components/admin/AuthWrapper";
import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
  title: 'Admin Dashboard - Dream Consultancy',
  description: 'Admin dashboard to manage your consultancy content',
};

export default function Layout({ children }) {
  return (
    <AuthWrapper>
      <AdminLayout>{children}</AdminLayout>
    </AuthWrapper>
  );
} 