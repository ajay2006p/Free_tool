import DashboardShell from "../../../components/admin/DashboardShell";

// The `.adm` wrapper scopes every admin style so it never touches the public
// site. Everything inside renders in the colorful dashboard shell.
export default function PanelLayout({ children }) {
  return (
    <div className="adm">
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
}
