import "./globals.css";
import { UserProvider } from "./context/UserContext";
import { ProjectProvider } from "./context/ProjectContext";

export const metadata = {
  title: "DeployNow",
  description: "DeployNow lets you deploy any GitHub repo in seconds using ECS & Docker.",
  icons: {
    icon: '/favicon.ico',
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <UserProvider>
          <ProjectProvider>{children}</ProjectProvider>
        </UserProvider>
      </body>
    </html>
  );
}
