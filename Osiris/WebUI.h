#pragma once

namespace WebUI {
    extern bool enabled;
    extern char url[256];
    extern bool isConnected;

    void toggleConnection() noexcept;
    void start() noexcept;
    void stop() noexcept;
    void poll() noexcept;
}
