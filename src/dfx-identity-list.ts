import { List, ActionPanel, Action, showToast, Toast, Detail } from "@raycast/api";
import { spawn } from "child_process";
import React, { useEffect, useState, useCallback } from "react";

interface Identity {
  name: string;
  isDefault: boolean;
  principalId?: string;
}

export default function Command(): React.ReactNode {
  const [identities, setIdentities] = useState<Identity[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [debug, setDebug] = useState<string>("");

  const getPrincipalId = async (identityName: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const process = spawn("/bin/zsh", ["-c", `dfx identity get-principal --identity ${identityName}`]);
      let output = "";
      let errorOutput = "";

      process.stdout.on("data", (data) => {
        output += data.toString();
      });

      process.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });

      process.on("close", (code) => {
        if (code === 0) {
          resolve(output.trim());
        } else {
          reject(new Error(errorOutput || "Failed to get principal ID"));
        }
      });
    });
  };

  const loadIdentities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setDebug("");

    // First check if dfx is available
    const checkDfx = spawn("/bin/zsh", ["-c", "which dfx"]);
    
    checkDfx.on("close", (code) => {
      if (code !== 0) {
        setError("dfx command not found. Please make sure dfx is installed and in your PATH");
        setIsLoading(false);
        return;
      }

      // Get the default identity first
      const whoamiProcess = spawn("/bin/zsh", ["-c", "dfx identity whoami"]);
      let defaultIdentity = "";

      whoamiProcess.stdout.on("data", (data) => {
        defaultIdentity = data.toString().trim();
        setDebug(prev => prev + `\n[DEFAULT IDENTITY] "${defaultIdentity}"`);
      });

      whoamiProcess.on("close", async (code) => {
        if (code !== 0) {
          setError("Failed to get default identity");
          setIsLoading(false);
          return;
        }

        // Now get the list of identities
        const process = spawn("/bin/zsh", ["-c", "dfx identity list"]);
        let outputData = "";
        let errorData = "";
        let parsedIdentities: Identity[] = [];

        process.stdout.on("data", (data) => {
          const newOutput = data.toString();
          outputData += newOutput;
          setDebug(prev => prev + `\n[RAW STDOUT] "${newOutput}"`);
          
          // Parse the output into identities
          const lines = outputData.split("\n")
            .map(line => line.trim())
            .filter(line => line.length > 0);
          
          setDebug(prev => prev + `\n[LINES AFTER SPLIT] ${JSON.stringify(lines)}`);
          
          if (lines.length > 0) {
            parsedIdentities = lines.map(line => {
              const name = line.trim();
              const isDefault = name === defaultIdentity;
              setDebug(prev => prev + `\n[PARSING LINE] "${line}" -> name: "${name}", isDefault: ${isDefault}`);
              return { name, isDefault };
            });
            
            setDebug(prev => prev + `\n[PARSED IDENTITIES] ${JSON.stringify(parsedIdentities)}`);
            setIdentities(parsedIdentities);
            setError(null);
            setDebug(prev => prev + `\n[STATE UPDATED] Identities count: ${parsedIdentities.length}`);

            // Get principal ID for the default identity
            if (defaultIdentity) {
              getPrincipalId(defaultIdentity)
                .then(principalId => {
                  setIdentities(prev => prev.map(identity => 
                    identity.name === defaultIdentity 
                      ? { ...identity, principalId }
                      : identity
                  ));
                  setDebug(prev => prev + `\n[PRINCIPAL ID] ${principalId}`);
                })
                .catch(err => {
                  setDebug(prev => prev + `\n[PRINCIPAL ID ERROR] ${err.message}`);
                });
            }
          } else {
            setDebug(prev => prev + `\n[NO LINES FOUND] Output was: "${outputData}"`);
          }
        });

        process.stderr.on("data", (data) => {
          const errorOutput = data.toString().trim();
          errorData += errorOutput;
          setDebug(prev => prev + `\n[STDERR] "${errorOutput}"`);
          
          if (errorOutput && errorOutput !== "*") {
            setError(errorOutput);
            setIdentities([]);
          }
        });

        process.on("close", (code) => {
          setIsLoading(false);
          setDebug(prev => prev + `\n[EXIT CODE] ${code}`);
          setDebug(prev => prev + `\n[FINAL STDOUT] "${outputData}"`);
          setDebug(prev => prev + `\n[FINAL STDERR] "${errorData}"`);
          setDebug(prev => prev + `\n[IDENTITIES LENGTH] ${parsedIdentities.length}`);
          setDebug(prev => prev + `\n[CURRENT STATE] ${JSON.stringify(identities)}`);
          
          if (code === 0 && parsedIdentities.length > 0) {
            showToast({
              style: Toast.Style.Success,
              title: "Identities loaded"
            });
          } else if (code !== 0 || parsedIdentities.length === 0) {
            const errorMessage = error || "No identities found";
            showToast({
              style: Toast.Style.Failure,
              title: "Failed to load identities",
              message: errorMessage
            });
          }
        });

        process.on("error", (err) => {
          const errorMessage = err.message || "Unknown error occurred";
          setDebug(prev => prev + `\n[PROCESS ERROR] ${errorMessage}`);
          setError(errorMessage);
          setIdentities([]);
          setIsLoading(false);
          showToast({
            style: Toast.Style.Failure,
            title: "Failed to load identities",
            message: errorMessage
          });
        });
      });

      whoamiProcess.stderr.on("data", (data) => {
        const errorOutput = data.toString().trim();
        setDebug(prev => prev + `\n[WHOAMI ERROR] ${errorOutput}`);
      });
    });

    checkDfx.stderr.on("data", (data) => {
      const errorOutput = data.toString().trim();
      setDebug(prev => prev + `\n[DFX CHECK ERROR] ${errorOutput}`);
    });
  }, []);

  const switchIdentity = async (identityName: string) => {
    const toast = await showToast({
      style: Toast.Style.Animated,
      title: `Switching to ${identityName}...`
    });

    const process = spawn("/bin/zsh", ["-c", `dfx identity use ${identityName}`]);
    let errorOutput = "";

    process.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    process.on("close", (code) => {
      if (code === 0) {
        toast.style = Toast.Style.Success;
        toast.title = `Switched to ${identityName}`;
        // Reload the list after successful switch
        loadIdentities();
      } else {
        toast.style = Toast.Style.Failure;
        toast.title = "Failed to switch identity";
        toast.message = errorOutput || "Unknown error occurred";
      }
    });
  };

  const copyPrincipalId = async (principalId: string) => {
    await showToast({
      style: Toast.Style.Success,
      title: "Principal ID copied to clipboard",
      message: principalId
    });
  };

  useEffect(() => {
    loadIdentities();
  }, [loadIdentities]);

  const debugMarkdown = `# Debug Information

## Command Execution
\`\`\`
${debug}
\`\`\`

## Current State
- Loading: ${isLoading}
- Error: ${error || "None"}
- Identities found: ${identities.length}
- Current identities: ${JSON.stringify(identities, null, 2)}
`;

  if (error) {
    return React.createElement(Detail, {
      markdown: `# Error Loading Identities

## Error Message
\`\`\`
${error}
\`\`\`

${debugMarkdown}`,
      actions: React.createElement(ActionPanel, null,
        React.createElement(Action.CopyToClipboard, {
          title: "Copy Debug Information",
          content: debug
        })
      )
    });
  }

  if (!isLoading && identities.length === 0) {
    return React.createElement(Detail, {
      markdown: `# No Identities Found

Run \`dfx identity new\` to create an identity.

${debugMarkdown}`,
      actions: React.createElement(ActionPanel, null,
        React.createElement(Action.CopyToClipboard, {
          title: "Copy Debug Information",
          content: debug
        })
      )
    });
  }

  return React.createElement(List, {
    isLoading,
    searchBarPlaceholder: "Search identities...",
    children: [
      ...identities.map(identity => 
        React.createElement(List.Item, {
          key: identity.name,
          title: identity.name,
          accessories: [
            ...(identity.isDefault ? [{ text: "Default" }] : []),
            ...(identity.principalId ? [{ text: identity.principalId }] : [])
          ],
          actions: React.createElement(ActionPanel, null,
            React.createElement(Action, {
              title: "Use Identity",
              onAction: () => switchIdentity(identity.name)
            }),
            ...(identity.principalId ? [
              React.createElement(Action, {
                title: "Copy Principal ID",
                shortcut: { modifiers: ["cmd"], key: "p" },
                onAction: () => copyPrincipalId(identity.principalId!)
              })
            ] : []),
            React.createElement(Action.CopyToClipboard, {
              title: "Copy Identity Name",
              content: identity.name
            }),
            React.createElement(Action.Push, {
              title: "Show Debug Info",
              target: React.createElement(Detail, {
                markdown: debugMarkdown,
                actions: React.createElement(ActionPanel, null,
                  React.createElement(Action.CopyToClipboard, {
                    title: "Copy Debug Information",
                    content: debug
                  })
                )
              })
            })
          )
        })
      )
    ]
  });
} 