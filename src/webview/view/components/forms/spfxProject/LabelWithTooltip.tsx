import * as React from "react";
import { InfoIcon } from "../../icons/InfoIcon";


interface ILabelWithTooltipProps {
  label: string;
  tooltip: string;
}

export const LabelWithTooltip: React.FC<ILabelWithTooltipProps> = ({
  label,
  tooltip,
}) => {
  return (
    <label className={"block mb-1 flex items-center gap-2"}>
      <p>{label}</p>
      <h2 title={tooltip}>
        <InfoIcon />
      </h2>
    </label>
  );
};
