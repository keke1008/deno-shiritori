import {
  forwardRef,
  KeyboardEvent,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Icon } from "@iconify/react";

export interface WordInputBoxHandler {
  value: string;
  clear: () => void;
  focus: () => void;
}

interface Props {
  onConfirm(): void;
  disabled: boolean;
}

export const WordInputBox = forwardRef<WordInputBoxHandler, Props>(
  ({ onConfirm, disabled }, ref) => {
    const textBox = useRef<HTMLInputElement>(null!);
    useImperativeHandle(ref, () => ({
      get value() {
        return textBox.current.value;
      },
      clear() {
        textBox.current.value = "";
      },
      focus() {
        textBox.current.focus();
      },
    }));

    const [hasFocus, setHasFocus] = useState(false);
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !disabled) {
        onConfirm();
      }
    };

    return (
      <div className="h-auto bg-white">
        <div className="h-auto flex bg-gray-200">
          <input
            type="text"
            ref={textBox}
            onFocus={() => setHasFocus(true)}
            onBlur={() => setHasFocus(false)}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-none outline-none m-0 p-2 w-full text-2xl overflow-y-hidden"
          />

          <Icon
            icon="ant-design:send-outlined"
            onClick={() => disabled || onConfirm()}
            className={`
                text-4xl my-auto mx-2
                ${disabled ? "text-gray-500" : "text-green-500"}
              `}
          />
        </div>
        <div
          className={`
              h-0.5
              ${(hasFocus && !disabled) ? " bg-green-500" : "bg-gray-500"}
            `}
        />
      </div>
    );
  },
);
