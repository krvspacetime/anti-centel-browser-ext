import { ColorSelect } from "./ColorSelect";
import { StyleConfig } from "./styleConfig";

interface StyleSelectProps {
  styleConfig: StyleConfig;
  onChangeStyleConfig: (configName: string, key: string, value: string) => void;
}

export const StyleSelect = ({
  styleConfig,
  onChangeStyleConfig,
}: StyleSelectProps) => {
  return (
    <div
      className="bg-zinc-900 rounded-md p-4"
      style={{
        width: "350px",
      }}
    >
      <h1 className="text-lg font-bold text-center">{styleConfig.label}</h1>
      <div className="flex flex-col gap-1">
        {styleConfig.overlayColor && (
          <ColorSelect
            label="Overlay Color"
            value={styleConfig.overlayColor}
            defaultColor={styleConfig.overlayColor}
            onChangeColor={(newColor) =>
              onChangeStyleConfig(styleConfig.label, "overlayColor", newColor)
            }
          />
        )}

        {styleConfig.borderColor && (
          <ColorSelect
            label="Border Color"
            value={styleConfig.borderColor}
            defaultColor={styleConfig.borderColor}
            onChangeColor={(newColor) =>
              onChangeStyleConfig(styleConfig.label, "borderColor", newColor)
            }
          />
        )}

        {styleConfig.borderWidth && (
          <div className="flex items-center gap-2">
            <p style={{ width: "120px" }}>Border Width</p>
            <input
              type="number"
              value={styleConfig.borderWidth}
              onChange={(e) =>
                onChangeStyleConfig(
                  styleConfig.label,
                  "borderWidth",
                  e.target.value
                )
              }
            />
          </div>
        )}

        {styleConfig.borderRadius && (
          <div className="flex items-center gap-2">
            <p style={{ width: "120px" }}>Border Radius</p>
            <input
              type="number"
              value={styleConfig.borderRadius}
              onChange={(e) =>
                onChangeStyleConfig(
                  styleConfig.value,
                  "borderRadius",
                  e.target.value
                )
              }
            />
          </div>
        )}

        {styleConfig.overlayOpacity && (
          <div className="flex items-center gap-2">
            <p style={{ width: "120px" }}>Overlay Opacity</p>
            <input
              type="number"
              value={styleConfig.overlayOpacity}
              onChange={(e) =>
                onChangeStyleConfig(
                  styleConfig.label,
                  "overlayOpacity",
                  e.target.value
                )
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};
