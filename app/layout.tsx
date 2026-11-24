import "./globals.css";
export const metadata = { title: "Exam Scare Me", description: "Exams are scary. Preparing together isn't." };
export default function Root({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><main><h1>EXAM SCARE ME</h1><p>Exams are scary. Preparing together isn’t.</p>{children}</main></body></html>;
}
