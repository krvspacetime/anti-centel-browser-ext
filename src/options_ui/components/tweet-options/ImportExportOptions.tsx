import { Button, Group, Text, Stack, Alert, FileButton } from "@mantine/core";
import {
  LuDownload,
  LuUpload,
  LuAlertCircle,
  LuCheckCircle,
} from "react-icons/lu";

interface ImportExportOptionsProps {
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  status: {
    type: string;
    message: string;
  };
}

export const ImportExportOptions = ({
  onExport,
  onImport,
  status,
}: ImportExportOptionsProps) => {
  return (
    <Stack className="flex w-[350px] flex-col gap-2">
      <Text size="lg" fw={500} className="mb-2">
        Backup and Restore Settings
      </Text>

      <Group justify="space-between" className="w-full">
        <Button
          leftSection={<LuDownload size={16} />}
          onClick={onExport}
          variant="filled"
          color="blue"
          className="w-[48%]"
        >
          Export Settings
        </Button>

        <FileButton
          onChange={(file) => {
            if (file) {
              const event = {
                target: {
                  files: [file],
                  value: "",
                },
              } as unknown as React.ChangeEvent<HTMLInputElement>;
              onImport(event);
            }
          }}
          accept="application/json"
        >
          {(props) => (
            <Button
              {...props}
              leftSection={<LuUpload size={16} />}
              variant="outline"
              color="blue"
              className="w-[48%]"
            >
              Import Settings
            </Button>
          )}
        </FileButton>
      </Group>

      {status.message && (
        <Alert
          icon={
            status.type === "error" ? (
              <LuAlertCircle size={16} />
            ) : (
              <LuCheckCircle size={16} />
            )
          }
          title={status.type === "error" ? "Error" : "Success"}
          color={status.type === "error" ? "red" : "green"}
          variant="filled"
          className="mt-4"
        >
          {status.message}
        </Alert>
      )}

      <div className="mt-4 rounded border border-gray-300 bg-gray-100 p-4 dark:border-gray-700 dark:bg-gray-800">
        <Text size="sm" fw={500} className="mb-2">
          What gets exported:
        </Text>
        <ul className="list-inside list-disc text-sm">
          <li>All style settings (highlight, blur, hide options)</li>
          <li>Your complete target list with tags and actions</li>
        </ul>
      </div>

      <div className="rounded border border-gray-300 bg-gray-100 p-4 dark:border-gray-700 dark:bg-gray-800">
        <Text size="sm" fw={500} className="mb-2">
          Note:
        </Text>
        <Text size="sm">
          Importing settings will overwrite your current configuration. Make
          sure to export your current settings first if you want to keep them.
        </Text>
      </div>
    </Stack>
  );
};
