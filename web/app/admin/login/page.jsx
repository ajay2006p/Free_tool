import { Suspense } from "react";
import LoginForm from "../../../components/admin/LoginForm";

export const metadata = { title: "Sign in" };

export default function AdminLoginPage() {
  return (
    <div className="adm auth-wrap">
      <Suspense fallback={<div className="sheet empty">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
