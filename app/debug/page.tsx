import { db } from "@/lib/db";

export default async function DebugPage() {
  try {
    await db.$connect();
    return (
      <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>Database Connection Test</h1>
        <p style={{ color: "green", fontWeight: "bold", fontSize: "1.2rem" }}>
          SUCCESS: Successfully connected to the database.
        </p>
        <p>
          This means your `DATABASE_URL` is correct. The authentication issue lies elsewhere.
        </p>
      </div>
    );
  } catch (error: any) {
    return (
      <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>Database Connection Test</h1>
        <p style={{ color: "red", fontWeight: "bold", fontSize: "1.2rem" }}>
          ERROR: Failed to connect to the database.
        </p>
        <pre style={{ background: "#eee", padding: "1rem", borderRadius: "5px" }}>
          <strong>Error Message:</strong> {error.message}
        </pre>
        <hr style={{ margin: "2rem 0" }} />
        <h2>Next Step</h2>
        <p>
          This error confirms that your `DATABASE_URL` environment variable on Netlify is incorrect.
        </p>
        <ol>
          <li>Go to your Supabase project settings.</li>
          <li>Navigate to the "Database" section.</li>
          <li>Copy the **Prisma** connection string again.</li>
          <li>Make sure you replace `[YOUR-PASSWORD]` with your actual database password.</li>
          <li>Go to your Netlify site settings > Environment variables.</li>
          <li>Edit the `DATABASE_URL` variable and paste the correct, complete string.</li>
          <li>Redeploy your site with a cleared cache.</li>
        </ol>
      </div>
    );
  } finally {
    await db.$disconnect();
  }
}