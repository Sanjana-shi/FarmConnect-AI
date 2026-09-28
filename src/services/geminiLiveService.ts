export interface GeminiLiveStatus {
  isConfigured: boolean;
  isAvailable: boolean;
  model: string;
  message: string;
  error?: string;
}

export class GeminiLiveService {
  /**
   * Checks the Gemini Live API credential availability and connection status.
   * If credentials or the Live WebSocket audio pipeline are not available,
   * it returns isAvailable: false with message: "Voice chat coming soon!"
   */
  static async checkLiveStatus(): Promise<GeminiLiveStatus> {
    try {
      const response = await fetch('/api/ai/live-status', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        return {
          isConfigured: false,
          isAvailable: false,
          model: 'gemini-3.8-live',
          message: 'Voice chat coming soon!',
          error: 'Live API endpoint returned non-200'
        };
      }

      const data = await response.json();
      if (!data.success || !data.isLiveReady) {
        return {
          isConfigured: false,
          isAvailable: false,
          model: data.model || 'gemini-3.8-live',
          message: 'Voice chat coming soon!',
          error: data.message
        };
      }

      return {
        isConfigured: true,
        isAvailable: true,
        model: data.model || 'gemini-3.8-live',
        message: 'Gemini Live Voice Chat Ready'
      };
    } catch (err: any) {
      return {
        isConfigured: false,
        isAvailable: false,
        model: 'gemini-3.8-live',
        message: 'Voice chat coming soon!',
        error: err.message
      };
    }
  }

  /**
   * Initiates a live audio voice session with comprehensive error handling.
   * Gracefully falls back if microphone or credentials are unavailable.
   */
  static async startVoiceConversation(): Promise<{
    success: boolean;
    message: string;
    stream?: MediaStream;
  }> {
    // 1. Verify credentials and Live API readiness
    const status = await this.checkLiveStatus();
    if (!status.isAvailable) {
      return {
        success: false,
        message: 'Voice chat coming soon!'
      };
    }

    // 2. Verify microphone hardware & user permission
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return {
        success: false,
        message: 'Voice chat coming soon!'
      };
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      return {
        success: true,
        message: 'Gemini Live voice channel connected',
        stream
      };
    } catch {
      return {
        success: false,
        message: 'Voice chat coming soon!'
      };
    }
  }
}
