import { DynamicButton } from "@/components/dynamic/button"
import { DynamicSlider } from "@/components/dynamic/slider"
import type { UICommand } from "./store/types";


export const renderElement = (element : UICommand, idx: number) => {
  switch (element.command) {
    case 'ADD_BUTTON':
      return <DynamicButton key={idx}>{element.text}</DynamicButton>;
    case 'ADD_SLIDER':
      return (
        <DynamicSlider
          key={idx}
          label={element.label}
          min_val={element.min_val}
          max_val={element.max_val}
          default_val={element.default_val}
        />
      );
    default:
      return null;
  }
};