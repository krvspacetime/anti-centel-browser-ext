import {
  Button,
  Group,
  Text,
  Stack,
  Alert,
  FileButton,
  Paper,
  Progress,
  Divider,
  Badge,
  Tooltip,
} from "@mantine/core";
import { useState, useEffect } from "react";
import {
  LuDownload,
  LuUpload,
  LuAlertCircle,
  LuCheckCircle,
  LuInfo,
  LuCloudLightning,
  LuCloudOff,
} from "react-icons/lu";

interface ImportExportOptionsProps {
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  status: {
    type: string;
    message: string;
  };
  targetCount: number;
}

export const ImportExportOptions = ({
  onExport,
  onImport,
  status,
  targetCount,
}: ImportExportOptionsProps) => {
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Simulate fetching last backup date from storage
  useEffect(() => {
    chrome.storage.local.get("lastBackupDate", (data) => {
      if (data.lastBackupDate) {
        setLastBackup(data.lastBackupDate);
      }
    });
  }, []);

  // Handle export with animation
  const handleExport = async () => {
    setIsExporting(true);

    // Store backup date
    const now = new Date().toISOString();
    chrome.storage.local.set({ lastBackupDate: now });
    setLastBackup(now);

    // Call the actual export function
    onExport();

    // Reset after animation
    setTimeout(() => {
      setIsExporting(false);
    }, 1000);
  };

  // Handle import with animation
  const handleImport = (file: File | null) => {
    if (!file) return;

    setIsImporting(true);

    const event = {
      target: {
        files: [file],
        value: "",
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    onImport(event);

    // Reset after animation
    setTimeout(() => {
      setIsImporting(false);
    }, 1000);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (e) {
      return "Unknown date";
    }
  };

  return (
    <Stack className="flex w-full flex-col gap-4">
      <Text
        size="lg"
        fw={600}
        className="mb-2 text-gray-800 dark:text-gray-100"
      >
        Backup and Restore Settings
      </Text>

      <Divider className="my-2" />

      {lastBackup && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <LuInfo size={14} />
          <Text size="sm">Last backup: {formatDate(lastBackup)}</Text>
        </div>
      )}

      <Group justify="space-between" className="w-full">
        <Button
          leftSection={
            isExporting ? (
              <LuCloudLightning size={16} className="animate-pulse" />
            ) : (
              <LuDownload size={16} />
            )
          }
          onClick={handleExport}
          variant="filled"
          color="blue"
          className="relative w-[48%] overflow-hidden"
          disabled={isExporting}
        >
          {isExporting ? "Exporting..." : "Export Settings"}
          {isExporting && (
            <Progress
              value={100}
              color="blue.3"
              size="sm"
              className="absolute bottom-0 left-0 right-0"
              animated
            />
          )}
        </Button>

        <FileButton
          onChange={handleImport}
          accept="application/json"
          disabled={isImporting}
        >
          {(props) => (
            <Button
              {...props}
              leftSection={
                isImporting ? (
                  <LuCloudLightning size={16} className="animate-pulse" />
                ) : (
                  <LuUpload size={16} />
                )
              }
              variant="outline"
              color="blue"
              className="relative w-[48%] overflow-hidden"
              disabled={isImporting}
            >
              {isImporting ? "Importing..." : "Import Settings"}
              {isImporting && (
                <Progress
                  value={100}
                  color="blue.3"
                  size="sm"
                  className="absolute bottom-0 left-0 right-0"
                  animated
                />
              )}
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
          className="mt-2"
        >
          {status.message}
        </Alert>
      )}

      <Paper
        withBorder
        p="md"
        radius="md"
        className="mt-4 bg-gray-50 dark:bg-gray-800/50"
      >
        <Group className="mb-2">
          <Text size="sm" fw={600} className="text-gray-800 dark:text-gray-100">
            What gets exported:
          </Text>
          <Badge color="blue" variant="light">
            {targetCount} targets
          </Badge>
        </Group>
        <ul className="list-inside list-disc text-sm text-gray-700 dark:text-gray-300">
          <li>All style settings (highlight, blur, hide options)</li>
          <li>Your complete target list with tags and actions</li>
          <li>Export timestamp and version information</li>
        </ul>
      </Paper>

      <Paper
        withBorder
        p="md"
        radius="md"
        className="bg-amber-50 dark:bg-amber-900/20"
      >
        <Group className="mb-2">
          <Text
            size="sm"
            fw={600}
            className="text-amber-800 dark:text-amber-200"
          >
            Important Note:
          </Text>
          <Tooltip label="This will replace your current settings">
            <Badge color="yellow" variant="light">
              Caution
            </Badge>
          </Tooltip>
        </Group>
        <Text size="sm" className="text-amber-700 dark:text-amber-300">
          Importing settings will overwrite your current configuration. Make
          sure to export your current settings first if you want to keep them.
        </Text>
      </Paper>

      {!lastBackup && (
        <Paper
          withBorder
          p="md"
          radius="md"
          className="bg-blue-50 dark:bg-blue-900/20"
        >
          <Group className="mb-2">
            <Text
              size="sm"
              fw={600}
              className="text-blue-800 dark:text-blue-200"
            >
              Recommendation:
            </Text>
            <LuCloudOff
              size={16}
              className="text-blue-600 dark:text-blue-300"
            />
          </Group>
          <Text size="sm" className="text-blue-700 dark:text-blue-300">
            You haven't backed up your settings yet. We recommend exporting your
            settings regularly to avoid data loss.
          </Text>
        </Paper>
      )}
    </Stack>
  );
};
