import { toInitialCap } from "@/util/funcitons";
import React from "react";
import { Check } from "lucide-react";

type ProgressBarProps = {
  currentStep: number;
  options: {
    step: number;
    label: string;
  }[];
};

function ProgressBar({ currentStep, options }: ProgressBarProps) {
  const getStatus = (currentStep, step) => {
    if (step == currentStep) return "active";
    if (currentStep > step) return "complete";
    return "in-active";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        {options.map((option) => (
          <Step
            state={getStatus(currentStep, option.step)}
            step={option.step}
            label={option.label}
            key={option.step}
          />
        ))}
      </div>
      <div className="h-0.5 w-full relative mb-12 overflow-hidden">
        <div
          style={{
            width: `${(currentStep / options.length) * 100}%`,
          }}
          className={`h-full bg-blue-500  transition-[width] duration-500 absolute top-0 left-0 z-10`}
        ></div>
        <div className="h-full w-full bg-slate-400 absolute top-0 left-0"></div>
      </div>
    </div>
  );
}

type StepPorops = {
  step: number;
  label: string;
  state: "complete" | "active" | "in-active";
};

function Step({ step, label, state = "in-active" }: StepPorops) {
  const style: Record<StepPorops["state"], string> = {
    complete: "bg-blue-600 text-white",
    active: "bg-blue-600 text-white",
    "in-active": "bg-white text-gray-600",
  };

  return (
    <div className="flex flex-row gap-x-4  items-center">
      <div
        style={{
          boxShadow: "1px 2px 3px rgba(0,0,0,.2)",
        }}
        className={`flex items-center justify-center w-8 h-8 rounded-full shadow-round  ${style[state]}`}
      >
        {state !== "complete" ? step : <Check size={24} />}
      </div>
      <span
        className={`text-sm ${
          state === "active" ? "font-bold" : "font-semibold"
        }`}
      >
        {toInitialCap(label)}
      </span>
    </div>
  );
}

export default ProgressBar;
