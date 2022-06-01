import * as os from "os";

export const getPlatform = (): "windows" | "linux" | "osx" => {
  const platform = os.platform();
  if (platform === "win32") {
    return "windows";
  } else if (platform === "darwin") {
    return "osx";
  } else {
    return "linux";
  }
}