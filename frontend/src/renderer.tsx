import { DynamicButton } from "@/components/dynamic/button"
import { DynamicSlider } from "@/components/dynamic/slider"
import { DynamicText } from "@/components/dynamic/text"
import { DynamicDropdown } from "@/components/dynamic/dropdown"
import { DynamicDatePicker } from "@/components/dynamic/date-picker"
import { DynamicTextInput } from "@/components/dynamic/text-input"

import type { UICommand } from "./store/types";


export const renderElement = (element : UICommand, idx: number) => {
  switch (element.command) {
    case 'ADD_BUTTON':
      return <DynamicButton key={idx}>{element.text}</DynamicButton>;
    case 'ADD_SLIDER':
      return (
        <DynamicSlider
          key={idx}
          container_id={element.container_id}
          slider_id={element.slider_id}
          label={element.label}
          min_val={element.min_val}
          max_val={element.max_val}
          default_val={element.default_val}
        />
      );
    case 'ADD_TEXT':
      return(
        <DynamicText
          key={idx}
          container_id={element.container_id}
          style={element.style}
          text={element.text}
        />
      );
    case 'ADD_DROPDOWN':
      return (
        <DynamicDropdown
          key={idx}
          container_id={element.container_id}
          dropdown_id={element.dropdown_id}
          label={element.label}
          options={element.options}
          default_value={element.default_value}
          placeholder={element.placeholder}
        />
      );
      case 'ADD_DATE_PICKER':
    return (
      <DynamicDatePicker
        key={idx}
        container_id={element.container_id}
        date_picker_id={element.date_picker_id}
        label={element.label}
        default_date={element.default_date}
        min_date={element.min_date}
        max_date={element.max_date}
        date_format={element.date_format}
      />
    );

  case 'ADD_TEXT_INPUT':
    return (
      <DynamicTextInput
        key={idx}
        container_id={element.container_id}
        input_id={element.input_id}
        label={element.label}
        placeholder={element.placeholder}
        default_value={element.default_value}
        input_type={element.input_type}
        required={element.required}
        max_length={element.max_length}
      />
    );
    default:
      return null;
  }
};