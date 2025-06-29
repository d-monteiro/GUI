import { useStore } from "@/store/useStore";
import { renderElement } from "@/renderer";

export function DynamicUI() {
  const uiSchema = useStore((s) => s.uiSchema);

  return (
    console.log(uiSchema),
    <div>
      {uiSchema.map((element, idx) => renderElement(element, idx))}
    </div>
  );
}