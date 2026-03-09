#include "WebUI.h"
#include "mongoose.h"
#include "nlohmann/json.hpp"
#include "Config.h"
#include "Hacks/SkinChanger.h"

#include <thread>
#include <atomic>
#include <mutex>

namespace WebUI {
    bool enabled = false;
    char url[256] = "ws://127.0.0.1:9001";
    bool isConnected = false;

    static struct mg_mgr mgr;
    static struct mg_connection* nc = nullptr;
    static std::thread workerThread;
    static std::atomic<bool> isRunning = false;
    static std::atomic<bool> shouldToggle = false;

    static void handleJSONUpdate(const nlohmann::json& j) {
        if (!j.is_object() || !j.contains("type") || j["type"] != "config_update")
            return;

        if (!j.contains("key") || !j.contains("value"))
            return;

        std::string key = j["key"];

        try {
            if (key == "Watermark")
                config->misc.watermark.enabled = j["value"].get<bool>();
            else if (key == "Fov")
                config->visuals.fov = j["value"].get<float>();
            else if (key == "Aspect Ratio")
                config->misc.aspectratio = j["value"].get<float>();
            else if (key == "No 3d sky")
                config->visuals.no3dSky = j["value"].get<bool>();
            else if (key == "Disable post-processing")
                config->visuals.disablePostProcessing = j["value"].get<bool>();
            else if (key == "Thirdperson")
                config->visuals.thirdperson = j["value"].get<bool>();
            else if (key == "Freecam")
                config->visuals.freeCam = j["value"].get<bool>();
            else if (key == "Enabled" && j.contains("category") && j["category"] == "Ragebot")
                config->ragebot[0].enabled = j["value"].get<bool>();
            else if (key == "Bunny hop")
                config->misc.bunnyHop = j["value"].get<bool>();
            else if (key == "Auto strafe")
                config->misc.autoStrafe = j["value"].get<bool>();
            else if (key == "Sv pure bypass")
                config->misc.svPureBypass = j["value"].get<bool>();
            else if (key == "Unlock inventory")
                config->misc.inventoryUnlocker = j["value"].get<bool>();
        } catch(...) {
            // catch JSON conversion errors
        }
    }

    static void ev_handler(struct mg_connection* c, int ev, void* ev_data) {
        if (ev == MG_EV_OPEN) {
            // Connection created
        } else if (ev == MG_EV_WS_OPEN) {
            isConnected = true;
            // Send our identification to the Node.js server
            nlohmann::json authMsg;
            authMsg["type"] = "game_connect";
            std::string msgStr = authMsg.dump();
            mg_ws_send(c, msgStr.data(), msgStr.size(), WEBSOCKET_OP_TEXT);
        } else if (ev == MG_EV_WS_MSG) {
            struct mg_ws_message* wm = (struct mg_ws_message*)ev_data;
            std::string msg((const char*)wm->data.ptr, wm->data.len);
            try {
                auto j = nlohmann::json::parse(msg);
                handleJSONUpdate(j);
            } catch (...) {}
        } else if (ev == MG_EV_ERROR || ev == MG_EV_CLOSE) {
            isConnected = false;
            nc = nullptr;
        }
    }

    static void wakeup_handler(struct mg_connection* c, int ev, void* ev_data) {
        // mg_wakeup triggers this in the worker thread.
        if (shouldToggle) {
            shouldToggle = false;
            if (enabled && nc == nullptr) {
                nc = mg_ws_connect(&mgr, url, ev_handler, NULL);
            } else if (!enabled && nc != nullptr) {
                nc->is_closing = 1;
                nc = nullptr;
                isConnected = false;
            }
        }
    }

    static void worker() {
        mg_mgr_init(&mgr);

        while (isRunning) {
            // We use a dummy wakeup call just to ensure the event loop processes toggles
            // if we are not blocking on poll (which we aren't, timeout is 100ms).
            // Direct processing in the loop is safe as long as no other threads touch `nc` directly.

            if (shouldToggle) {
                shouldToggle = false;
                if (enabled && nc == nullptr) {
                    nc = mg_ws_connect(&mgr, url, ev_handler, NULL);
                } else if (!enabled && nc != nullptr) {
                    nc->is_closing = 1;
                    nc = nullptr;
                    isConnected = false;
                }
            }

            mg_mgr_poll(&mgr, 100);
        }

        mg_mgr_free(&mgr);
    }

    void start() noexcept {
        if (!isRunning) {
            isRunning = true;
            workerThread = std::thread(worker);
        }
    }

    void stop() noexcept {
        if (isRunning) {
            isRunning = false;
            shouldToggle = true; // prompt one last check
            mg_wakeup(&mgr, 0, NULL, 0); // wakeup to immediately unblock poll
            if (workerThread.joinable()) {
                workerThread.join();
            }
        }
    }

    void toggleConnection() noexcept {
        // Signal the worker thread that the state has changed
        shouldToggle = true;
        mg_wakeup(&mgr, 0, NULL, 0); // wake up event loop
    }
}
