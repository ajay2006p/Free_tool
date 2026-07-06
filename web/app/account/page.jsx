import { Suspense } from "react";
import AccountForm from "../../components/AccountForm";

export const metadata = { title: "Log in or sign up", robots: { index: false } };

export default function AccountPage() {
  return (
    <div className="container section">
      <Suspense fallback={<div className="sheet empty">Loading…</div>}>
        <AccountForm />
      </Suspense>
    </div>
  );
}
