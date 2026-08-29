import { getCookies } from "@/src/lib/utiles/utiles";
import "@/src/styles/globals.css";
import AdminPanelSidBar from "./components/AdminPanelSidBar";
import AdminPanelTopBar from "./components/AdminPanelTopBar";
import AdminShell from "./components/AdminShell";
export default async function RootLayout({ children }: LayoutProps<"/">) {
  const theme = await getCookies("theme");
  return (
    <html
      lang="en"
      className={`h-full antialiased ${theme === "ligth" ? "dark" : ""}`}
    >
      <body className="min-h-full flex flex-col">
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
