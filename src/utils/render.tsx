import { type ReactNode, StrictMode } from "react";
import { createRoot } from "react-dom/client";

const container = document.getElementById("root");
const root = createRoot(container!);

export function render(component: ReactNode) {
	root.render(<StrictMode>{component}</StrictMode>);
}
