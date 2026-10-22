/**
 * Google AdSense / AdMob H5 Games Ads & Monetization Manager
 * Provides rewarded ads (Second Breath), interstitials, and banner management
 * with seamless offline and ad-block fallbacks.
 */
class QuietAdsManager {
  constructor() {
    this.initialized = false;
    this.adBlockDetected = false;
    this.lastInterstitialTime = 0;
    this.interstitialCooldown = 90000; // 90 seconds minimum between interstitials
    this.rewardedAvailable = true;
    this.bannerActive = false;
    this.isAndroid = /Android/i.test(navigator.userAgent);
    this.isChrome = /Chrome/i.test(navigator.userAgent) && !/Edge|OPR/i.test(navigator.userAgent);

    this.init();
  }

  init() {
    console.log(`[AdsManager] Initializing for ${this.isAndroid ? 'Android' : 'Chrome/Desktop'}...`);
    // Hook into Google H5 Games Ad Placement API if present
    if (typeof window.adBreak === 'function') {
      this.initialized = true;
      console.log('[AdsManager] Google AdBreak API detected.');
    } else {
      // Setup mock / simulation interface for testing and offline environments
      this.initialized = true;
      console.log('[AdsManager] Running in compliant simulation mode. (Ready for Google AdMob client ID)');
    }
  }

  /**
   * Request an interstitial ad (e.g. between floors or on game over)
   * Respects cooldown intervals to prevent user fatigue.
   */
  showInterstitial(placementName = 'checkpoint', onComplete) {
    const now = Date.now();
    if (now - this.lastInterstitialTime < this.interstitialCooldown) {
      console.log(`[AdsManager] Interstitial skipped: Cooldown active (${Math.round((this.interstitialCooldown - (now - this.lastInterstitialTime))/1000)}s remaining).`);
      if (onComplete) onComplete(false);
      return;
    }

    this.lastInterstitialTime = now;

    if (typeof window.adBreak === 'function') {
      window.adBreak({
        type: 'start',
        name: placementName,
        beforeAd: () => {
          if (window.QuietGame) window.QuietGame.setAdPaused(true);
        },
        afterAd: () => {
          if (window.QuietGame) window.QuietGame.setAdPaused(false);
          if (onComplete) onComplete(true);
        }
      });
    } else {
      // Simulated interstitial overlay for testing / offline
      this.renderAdModal('Sponsor Break', 'Simulated Google AdMob Interstitial. Continuing in 2 seconds...', 2000, () => {
        if (onComplete) onComplete(true);
      });
    }
  }

  /**
   * Request a Rewarded Ad (e.g., "Second Breath" in The Climb to gain time or resume)
   */
  showRewarded(rewardType = 'extra_time', onRewardGranted, onRewardDismissed) {
    if (typeof window.adBreak === 'function') {
      window.adBreak({
        type: 'reward',
        name: rewardType,
        beforeReward: (showAdFn) => {
          showAdFn();
        },
        adDismissed: () => {
          if (onRewardDismissed) onRewardDismissed();
        },
        adViewed: () => {
          console.log(`[AdsManager] Reward granted for: ${rewardType}`);
          if (onRewardGranted) onRewardGranted();
        }
      });
    } else {
      // Interactive simulated rewarded ad for development and offline testing
      this.renderRewardedModal(
        'Second Breath · Rewarded Sponsor',
        'Watch a short message to regain +20 seconds on your climb timer.',
        3500,
        () => {
          console.log(`[AdsManager] Reward successfully granted: ${rewardType}`);
          if (onRewardGranted) onRewardGranted();
        },
        () => {
          if (onRewardDismissed) onRewardDismissed();
        }
      );
    }
  }

  renderAdModal(title, message, durationMs, onDone) {
    const overlay = document.createElement('div');
    overlay.className = 'ad-modal-overlay';
    overlay.innerHTML = `
      <div class="ad-modal-card">
        <div class="ad-badge">Google AdMob / H5 Placement</div>
        <h3>${title}</h3>
        <p>${message}</p>
        <div class="ad-progress"><div class="ad-bar"></div></div>
      </div>
    `;
    document.body.appendChild(overlay);

    const bar = overlay.querySelector('.ad-bar');
    bar.style.transition = `width ${durationMs}ms linear`;
    requestAnimationFrame(() => bar.style.width = '100%');

    setTimeout(() => {
      overlay.remove();
      if (onDone) onDone();
    }, durationMs);
  }

  renderRewardedModal(title, message, durationMs, onGranted, onSkipped) {
    const overlay = document.createElement('div');
    overlay.className = 'ad-modal-overlay';
    overlay.innerHTML = `
      <div class="ad-modal-card">
        <div class="ad-badge">Google Play Rewarded Ad</div>
        <h3>${title}</h3>
        <p>${message}</p>
        <div class="ad-progress"><div class="ad-bar"></div></div>
        <div class="row" style="margin-top:14px;justify-content:center;">
          <button class="btn ghost" id="adSkipBtn" style="font-size:12px;padding:8px 14px;">Skip (No reward)</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    let skipped = false;
    const skipBtn = overlay.querySelector('#adSkipBtn');
    skipBtn.onclick = () => {
      skipped = true;
      overlay.remove();
      if (onSkipped) onSkipped();
    };

    const bar = overlay.querySelector('.ad-bar');
    bar.style.transition = `width ${durationMs}ms linear`;
    requestAnimationFrame(() => bar.style.width = '100%');

    setTimeout(() => {
      if (!skipped) {
        overlay.remove();
        if (onGranted) onGranted();
      }
    }, durationMs);
  }
}

window.AdsManager = new QuietAdsManager();
