import Header from "@/components/layout/header";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="">
      <Header />
      <Toaster richColors />
      {children}
    </div>
  );
}
