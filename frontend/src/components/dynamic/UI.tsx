import { useStore } from "@/store/useStore";
import { renderElement } from "@/renderer";

export function DynamicUI() {
  const uiSchema = useStore((s) => s.uiSchema);

  return (
    <div>
      {uiSchema.map((element, idx) => renderElement(element, idx))}
    </div>
  );
}