# THE QUIET · Android, Google Play & Chrome Edition (v2.0)

> *"You were never broken. The world was built for a default that was never you."*  
> Built with and for Deaf, hard-of-hearing, and neurodivergent communities by Unmute1AI.

---

## 📱 What's New in this Android & Chrome Edition

### 1. Android & Chrome Hardware Integrations
- **Screen Wake Lock API (`navigator.wakeLock`)**: Prevents the screen from dimming or sleeping while concentrating on haptic pulses.
- **Hardware Back Gesture (`popstate`)**: Android back button / swipe gracefully pauses the game or dismisses modal dialogs without dumping the user out to Chrome or Home.
- **Dynamic Touch Joystick**: Touch-and-drag provides a floating virtual thumbstick with smooth deadzones and velocity clamping tailored for single-thumb mobile play.
- **Gamepad API**: Native controller support for Bluetooth gamepads (Xbox, PlayStation, or 8BitDo on Android and Chrome).
- **Vibration API & Android Haptics**: Rich, non-blocking vibration patterns with a dedicated visual fallback ring that never detaches or crashes.
- **Procedural Web Audio Engine (`audio-engine.js`)**: 100% offline, zero-asset Web Audio synthesis translating haptics into 55Hz sub-bass pulses and resonance chords for Chrome/desktop users without vibration motors.

### 2. Google Marketplace & Ad Monetization (`ads-manager.js`)
- **Google AdMob / H5 Game Placement API Ready**:
  - **Rewarded Ad ("Second Breath")**: When time runs out in *The Climb*, players can watch a short message to regain +20 seconds and continue their ascent once per run.
  - **Interstitial Ads**: Shown with a 90-second cooldown at floor 10 checkpoints or run completions.
  - **Offline & Ad-Block Immunity**: If ads fail to load or the player is offline, the game grants the reward or proceeds smoothly without interruption.

### 3. Four Complete Game Modes
1. **Mode I: Spectrum (Navigate)**
   - *Stripped*: Achromatopsia, complete visual void, navigating by tactile pulse.
   - *Flooded*: Sensory overload, flashing decoys, auditory/visual chaos.
   - *Unmute*: Universal design, clear contrast, harmonious pathways.
2. **Mode II: Resonate (Communicate)**
   - Approach five unique human figures. Rushing causes anxiety and pushes them away; stillness and presence build concentric resonance rings.
3. **Mode III: The Ascent (The Climb)**
   - 80 progressive floors with escalating sensory challenges (visual dropouts, diplopia double-vision, ground tremors, control reversals).
4. **Mode IV: Empathy Lab (Sandbox)**
   - Brand new interactive laboratory allowing players and educators to toggle individual neurodivergent and sensory conditions:
     - Dyslexic letter jitter & mirroring
     - Tinnitus frequency simulation (8.4 kHz)
     - Macular degeneration / tunnel vision mask
     - Motor tremor / movement drift
     - Horizontal control inversion
     - Diplopia (double vision)

---

## 🚀 How to Run & Test Locally

You can launch a local HTTP server right inside this directory to test in Google Chrome or on your Android device over local Wi-Fi:

```powershell
cd C:\Users\Mattj\.gemini\antigravity\scratch\the_quiet_android
python -m http.server 8080
```

1. Open `http://localhost:8080` in Google Chrome.
2. Notice the **Install on Android / Chrome** button appears, allowing full standalone PWA installation.
3. Open Chrome DevTools (`F12`), toggle Device Toolbar (Ctrl+Shift+M), and select **Pixel 7** or **Samsung Galaxy S20** to test touch joystick controls.

---

## 📦 Packaging for Google Play Store (TWA / Bubblewrap)

This project contains `manifest.json`, `twa-manifest.json`, and `.well-known/assetlinks.json` configured for Google Play Trusted Web Activity (TWA).

### Prerequisites:
- Node.js (`npm install -g @bubblewrap/cli`)
- JDK 17+ & Android SDK Command-line Tools

### Step-by-step Build:
```bash
# 1. Initialize Bubblewrap project from web manifest
bubblewrap init --manifest https://quiet.u1ai.app/manifest.json

# 2. Build production Android App Bundle (.aab)
bubblewrap build

# Output: app-release-bundle.aab ready for upload to Google Play Console!
```

---

## 🎨 Accessibility & Comfort Suite
- Strict compliance with photosafety thresholds (&lt; 3 flashes per second).
- Respects `prefers-reduced-motion`.
- High-contrast toggle for thick neon pathways.
- Clean semantic HTML structure accessible to screen readers (TalkBack on Android).
