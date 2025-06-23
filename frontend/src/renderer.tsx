import { DynamicButton } from "@/components/dynamic/button"
import { DynamicCard } from "@/components/dynamic/card"
import { DynamicSlider } from "@/components/dynamic/slider"
import { DynamicToggle } from "@/components/dynamic/toggle"


const renderElement = (element) => {
  switch (element.command) {
    case 'ADD_TEXT':
      return <DynamicText content={element.params.text} />;
    case 'ADD_BUTTON':
      // The button needs a function to send its ID back to the backend
      return <DynamicButton onClick={() => sendEventToServer(element.params.id)}>{element.params.text}</DynamicButton>;
    case 'ADD_SLIDER':
      return <DynamicSlider {...element.params} />;
    // ... more cases
    default:
      return null;
  }
};

// It would receive the uiSchema from your global state and map over it
return <div>{uiSchema.map(element => renderElement(element))}</div>;