import Header from "@/components/Header";
import "@/app/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { TodoProvider } from "@/context/TodoContext";

export const metadata = {
  title: "Todo App",
  description: "Una aplicación para gestionar tareas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-100 text-gray-900">
        <AuthProvider>
          <TodoProvider>{children}</TodoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
