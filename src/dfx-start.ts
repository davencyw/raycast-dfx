import { exec } from "child_process";
import { showToast, Toast } from "@raycast/api";

export default async function Command() {
  try {
    const toast = await showToast({
      style: Toast.Style.Animated,
      title: "Starting dfx...",
    });

    exec("dfx start", (error, stdout, stderr) => {
      if (error) {
        toast.style = Toast.Style.Failure;
        toast.title = "Failed to start dfx";
        toast.message = error.message;
        return;
      }

      if (stderr) {
        toast.style = Toast.Style.Failure;
        toast.title = "Error starting dfx";
        toast.message = stderr;
        return;
      }

      toast.style = Toast.Style.Success;
      toast.title = "dfx started successfully";
    });
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to start dfx",
      message: String(error),
    });
  }
}
