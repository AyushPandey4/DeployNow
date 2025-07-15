import "./globals.css";
import { UserProvider } from "./context/UserContext";
import { ProjectProvider } from "./context/ProjectContext";

export const metadata = {
  title: "DeployNow",
  description:
    "DeployNow lets you deploy any GitHub repo in seconds using ECS & Docker.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body>
        <UserProvider>
          <ProjectProvider>{children}</ProjectProvider>
        </UserProvider>
      </body>
    </html>
  );
}
