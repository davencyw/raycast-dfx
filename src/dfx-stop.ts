import { Detail, ActionPanel, Action, showToast, Toast } from "@raycast/api";
import { spawn } from "child_process";
import React, { useEffect, useState } from "react";

export default function Command(): React.ReactNode {
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const process = spawn("/bin/zsh", ["-c", "dfx stop"]);
    let outputData = "";

    process.stdout.on("data", (data) => {
      const newOutput = data.toString();
      outputData += newOutput;
      setOutput(outputData);
    });

    process.stderr.on("data", (data) => {
      const errorOutput = data.toString();
      outputData += errorOutput;
      setOutput(outputData);
    });

    process.on("close", (code) => {
      setIsLoading(false);
      if (code === 0) {
        showToast({
          style: Toast.Style.Success,
          title: "dfx stopped successfully"
        });
      } else {
        showToast({
          style: Toast.Style.Failure,
          title: "Failed to stop dfx",
          message: `Process exited with code ${code}`
        });
      }
    });

    process.on("error", (err) => {
      setError(err.message);
      setIsLoading(false);
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to stop dfx",
        message: err.message
      });
    });

    return () => {
      process.kill();
    };
  }, []);

  if (error) {
    return React.createElement(Detail, {
      markdown: `# Error\n\`\`\`\n${error}\n\`\`\``,
      actions: React.createElement(ActionPanel, null,
        React.createElement(Action.CopyToClipboard, {
          title: "Copy Error",
          content: error
        })
      )
    });
  }

  return React.createElement(Detail, {
    isLoading,
    markdown: `# dfx stop output\n\`\`\`\n${output || "Waiting for output..."}\n\`\`\``,
    actions: React.createElement(ActionPanel, null,
      React.createElement(Action.CopyToClipboard, {
        title: "Copy Output",
        content: output
      })
    )
  });
} 