import "./admin.css";

export const metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

// Top-level admin layout: only loads the (scoped) admin stylesheet. The sidebar
// shell lives in the (panel) route group so the login page can opt out of it.
export default function AdminLayout({ children }) {
  return children;
}
