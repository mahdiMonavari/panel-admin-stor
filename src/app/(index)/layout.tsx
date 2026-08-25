import "@/src/styles/globals.css";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fa">
      <body className="h-full">{children}</body>
    </html>
  );
}
