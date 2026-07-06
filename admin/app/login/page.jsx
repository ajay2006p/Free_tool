import { Suspense } from "react";
import LoginForm from "../../components/LoginForm";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="auth-wrap">
      <Suspense fallback={<div className="sheet empty">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
