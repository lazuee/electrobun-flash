// ppapi_flash.h - Cross-platform Pepper Flash plugin path resolution
// Returns the path to the PepperFlashPlayer plugin bundled alongside
// the application executable.

#ifndef ELECTROBUN_PPAPI_FLASH_H
#define ELECTROBUN_PPAPI_FLASH_H

#include <string>

#ifdef __APPLE__
#include <mach-o/dyld.h>
#include <libgen.h>
#elif defined(_WIN32)
#include <windows.h>
#else
#include <unistd.h>
#include <libgen.h>
#endif

namespace electrobun {

inline std::string getPepperFlashPath() {
#ifdef __APPLE__
    // macOS: Contents/MacOS/PepperFlashPlayer.plugin
    char buf[4096];
    uint32_t size = sizeof(buf);
    if (_NSGetExecutablePath(buf, &size) != 0) return "";
    std::string dir = dirname(buf);
    return dir + "/PepperFlashPlayer.plugin";
#elif defined(_WIN32)
    // Windows: <exe_dir>/pepflashplayer.dll
    char buf[MAX_PATH];
    GetModuleFileNameA(NULL, buf, MAX_PATH);
    std::string path(buf);
    size_t pos = path.find_last_of('\\');
    if (pos == std::string::npos) return "";
    return path.substr(0, pos) + "\\pepflashplayer.dll";
#else
    // Linux: <exe_dir>/libpepflashplayer.so
    char buf[4096];
    ssize_t len = readlink("/proc/self/exe", buf, sizeof(buf) - 1);
    if (len <= 0) return "";
    buf[len] = '\0';
    std::string path(buf);
    size_t pos = path.find_last_of('/');
    if (pos == std::string::npos) return "";
    return path.substr(0, pos) + "/libpepflashplayer.so";
#endif
}

} // namespace electrobun

#endif // ELECTROBUN_PPAPI_FLASH_H