import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import HomePage from "./pages/home/HomePage";
import CourseSearchPage from "./pages/home/CourseSearchPage";
import LoginPage from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/customer/DashboardPage";
import InstructorDashboardPage from "./pages/provider/InstructorDashboardPage";
import InstructorProfilePage from "./pages/provider/InstructorProfilePage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import CustomerLayout from "./layouts/CustomerLayout";
import CustomerDashboardLayout from "./layouts/CustomerDashboardLayout";
import ChangePasswordPage from "./pages/customer/ChangePasswordPage";
import AccountSettingPage from "./pages/customer/AccountSettingPage";
import ShoppingCartPage from "./pages/customer/ShoppingCartPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import DetailPage from "./pages/detailPage/DetailPage";
import ProviderLayout from "./layouts/ProviderLayout";
import ManagementCoursePage from "./pages/provider/ManagementCoursePage/ManagementCoursePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BoxShowDetailCourses from "./pages/provider/ManagementCoursePage/BoxShowDetailCoures/BoxShowDetailCourses";
import MyCoursePage from "./pages/mycourse/MyCoursePage";
import OrdersPage from "./pages/customer/OrdersPage";
import OrderDetailPage from "./pages/customer/OrderDetailPage";
import WishlistPage from "./pages/customer/WishlistPage";
import AboutPage from "./pages/about/AboutPage";
import ProviderListPage from "./pages/provider/ProviderListPage";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import CourseLearningPage from "./pages/learningPage/CourseLearningPage";
import RegisterProviderPage from "./pages/customer/RegisterProviderPage/RegisterProviderPage";
import ProviderRequestPage from "./pages/admin/AdminProviderRequestPage";
import AdminProviderRequestPage from "./pages/admin/AdminProviderRequestPage";
import AdminProviderRequestDetailPage from "./pages/admin/AdminProviderRequestDetailPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <Routes>
                {/* Customer layout */}
                <Route path="/" element={<CustomerLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="cart" element={<ShoppingCartPage />} />
                  <Route
                    path="checkout"
                    element={
                      <ProtectedRoute roles={["customer"]}>
                        <CheckoutPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="course/detail/:id" element={<DetailPage />} />
                  <Route path="all-courses" element={<CourseSearchPage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="providers" element={<ProviderListPage />} />
                  <Route
                    path="development"
                    element={<Navigate to="courses/search" replace />}
                  />

                  <Route
                    path="courses-provider"
                    element={<InstructorProfilePage />}
                  />
                  <Route
                    path="my-courses"
                    element={
                      <ProtectedRoute roles={["customer", "provider"]}>
                        <MyCoursePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="learn/:courseId"
                    element={
                      <ProtectedRoute roles={["customer", "provider"]}>
                        <CourseLearningPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="wishlist"
                    element={
                      <ProtectedRoute roles={["customer", "provider"]}>
                        <WishlistPage />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                {/* Customer dashboard */}
                <Route path="/user" element={<CustomerDashboardLayout />}>
                  <Route
                    path="dashboard"
                    element={
                      <ProtectedRoute roles={["customer", "provider"]}>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="change-password"
                    element={
                      <ProtectedRoute roles={["customer", "provider"]}>
                        <ChangePasswordPage />
                      </ProtectedRoute>
                    }
                  />

                   <Route
                    path="register-provider"
                    element={
                      <ProtectedRoute roles={["customer"]}>
                        <RegisterProviderPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="account-settings"
                    element={
                      <ProtectedRoute roles={["customer","provider"]}>
                        <AccountSettingPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="orders"
                    element={
                      <ProtectedRoute roles={["customer","provider"]}>
                        <OrdersPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="orders/:orderId"
                    element={
                      <ProtectedRoute roles={["customer","provider"]}>
                        <OrderDetailPage />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                {/* Provider*/}
                <Route path="/provider" element={<ProviderLayout />}>
                  <Route
                    index
                    element={
                      <ProtectedRoute roles={["provider"]}>
                        <InstructorDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="courses"
                    element={
                      <ProtectedRoute roles={["provider"]}>
                        <ManagementCoursePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="courses/detail/:id"
                    element={
                      <ProtectedRoute roles={["provider"]}>
                        <BoxShowDetailCourses />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="settings"
                    element={
                      <ProtectedRoute roles={["provider"]}>
                        <div className="text-center h-125 flex justify-center items-center bg-[#e9e9e9] rounded-lg">
                          <p>Tính năng còn đang phát triển!</p>
                        </div>
                      </ProtectedRoute>
                    }
                  />
                </Route>

                {/* Auth */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/forgot-password"
                  element={<ForgotPasswordPage />}
                />
                <Route path="/verify-email" element={<VerifyEmailPage />} />

                {/* Admin */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute roles={["admin"]}>
                      <AdminLayout title="Dashboard">
                        <AdminDashboardPage />
                      </AdminLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute roles={["admin"]}>
                      <AdminLayout title="Users">
                        <AdminUsersPage />
                      </AdminLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/categories"
                  element={
                    <ProtectedRoute roles={["admin"]}>
                      <AdminLayout title="Categories">
                        <AdminCategoriesPage />
                      </AdminLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedRoute roles={["admin"]}>
                      <AdminLayout title="Orders">
                        <AdminOrdersPage />
                      </AdminLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/providers-requests"
                  element={
                    <ProtectedRoute roles={["admin"]}>
                      <AdminLayout title="Provider Requests">
                        <AdminProviderRequestPage />
                      </AdminLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/providers-requests/:providerId"
                  element={
                    <ProtectedRoute roles={["admin"]}>
                      <AdminLayout title="Provider Requests Detail">
                        <AdminProviderRequestDetailPage />
                      </AdminLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses/detail/:id"
                  element={
                    <ProtectedRoute roles={["provider"]}>
                      <BoxShowDetailCourses />
                    </ProtectedRoute>
                  }
                />

                {/* Auth */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/forgot-password"
                  element={<ForgotPasswordPage />}
                />
                <Route path="/verify-email" element={<VerifyEmailPage />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
