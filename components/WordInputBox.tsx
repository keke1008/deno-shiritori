import {
  forwardRef,
  KeyboardEvent,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Icon } from "@iconfy/react";

export interface WordInputBoxHandler {
  value: string;
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
    }));

    const [hasFocus, setHasFocus] = useState(false);
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !disabled) {
        onConfirm();
      }
    };

    const fontSize = "clamp(150%, 8vw, 100px)";

    return (
      <div className="w-full">
        <div className="m-auto w-4/5 max-w-3xl">
          <div className="flex bg-gray-200">
            <input
              type="text"
              ref={textBox}
              onFocus={() => setHasFocus(true)}
              onBlur={() => setHasFocus(false)}
              onKeyDown={handleKeyDown}
              style={{ fontSize }}
              className="bg-transparent border-none outline-none m-0 w-full"
            />

            <Icon
              icon="ant-design:send-outlined"
              fontSize={fontSize}
              onClick={() => disabled || onConfirm()}
              className={`
                m-auto
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
      </div>
    );
  },
);
