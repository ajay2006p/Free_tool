import UsersTable from "../../../../components/admin/UsersTable";

export const metadata = { title: "Users" };

export default function UsersPage() {
  return (
    <div className="container">
      <div className="page-head">
        <div>
          <span className="kicker">Registered accounts</span>
          <h1>Users</h1>
          <p className="sub">Everyone who has created an account on your site.</p>
        </div>
      </div>
      <UsersTable />
    </div>
  );
}
