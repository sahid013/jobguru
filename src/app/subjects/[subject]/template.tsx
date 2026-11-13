import { FadeIn } from "@/components/motion";

// Templates re-mount on every navigation, so each topic settles in softly
// while the sidebar (in the layout) stays put.
export default function SubjectTemplate({ children }: { children: React.ReactNode }) {
  return <FadeIn>{children}</FadeIn>;
}
