import type { Form } from "@/data/products";

type Props = {
  form: Form;
  body: string;
  bodyDark: string;
  trim: string;
  view?: "front" | "back";
  brand?: string;
  model?: string;
  uid: string;
  seed?: string;
  className?: string;
  powered?: boolean;
};

const PHOTOS: Record<Form, string> = {
  slim: "/images/cameras/slim-cutout.png",
  compact: "/images/cameras/compact-cutout.png",
  boxy: "/images/cameras/boxy-cutout.png",
  rugged: "/images/cameras/rugged-cutout.png",
  bridge: "/images/cameras/bridge-cutout.png",
  swivel: "/images/cameras/swivel-cutout.png",
};

/** Real, transparent product photography used throughout the catalogue. */
export default function CameraArt({ form, brand = "", model = "", view = "front", className }: Props) {
  const label = `${brand} ${model}`.trim() || "Vintage compact digital camera";

  return (
    <img
      src={PHOTOS[form]}
      alt={`${label}${view === "back" ? " product view" : ""}`}
      className={className}
      draggable={false}
      style={{ width: "100%", height: "auto", display: "block", objectFit: "contain" }}
    />
  );
}
