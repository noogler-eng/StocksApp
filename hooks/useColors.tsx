import { useTheme } from "@/context/ThemeContext";
import { Colors } from "@/constants/colors";

export default function useColors() {
  const { isDark } = useTheme();
  return isDark ? Colors.dark : Colors.light;
}
