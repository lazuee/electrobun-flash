import { platform, arch } from "os";

export type SupportedOS = "macos" | "win" | "linux";
export type SupportedArch = "x64";

// Cache platform() result to avoid multiple system calls
const platformName = platform();
const archName = arch();

// Determine OS once
export const OS: SupportedOS = (() => {
	switch (platformName) {
		case "win32":
			return "win";
		case "darwin":
			return "macos";
		case "linux":
			return "linux";
		default:
			throw new Error(`Unsupported platform: ${platformName}`);
	}
})();

// Determine ARCH once, with Windows override
export const ARCH = (() => {
	// Always use x64 since we only build x64 Windows binaries
	switch (archName) {
		case "arm64":
		case "x64":
			return "x64";
		default:
			throw new Error(`Unsupported architecture: ${archName}`);
	}
})() as SupportedArch;

// Export functions for backwards compatibility if needed
export function getPlatformOS(): SupportedOS {
	return OS;
}

export function getPlatformArch(): SupportedArch {
	return ARCH;
}
