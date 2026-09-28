export type LocationPermissionStatus = 'prompt' | 'granted' | 'denied' | 'unsupported' | 'loading';

export interface UserLocationData {
  status: LocationPermissionStatus;
  latitude: number | null;
  longitude: number | null;
  district: string;
  villageTown: string;
  accuracyMeters?: number;
  errorMessage?: string;
  isManualFallback: boolean;
}

export const TAMIL_NADU_DISTRICTS = [
  'Thanjavur',
  'Tiruvarur',
  'Nagapattinam',
  'Mayiladuthurai',
  'Cuddalore',
  'Tiruchirappalli',
  'Pudukkottai',
  'Madurai',
  'Coimbatore',
  'Salem',
  'Erode',
  'Tiruppur',
  'Dindigul',
  'Villupuram'
];

const STORAGE_KEY_LOCATION = 'farmconnect_user_location_pref_v1';
const STORAGE_KEY_DENIED_FLAG = 'farmconnect_location_denied_v1';

export class LocationService {
  private static listeners: Array<(loc: UserLocationData) => void> = [];

  private static currentLocation: UserLocationData = {
    status: 'prompt',
    latitude: 10.7870, // Default center: Thanjavur
    longitude: 79.1378,
    district: 'Thanjavur',
    villageTown: 'Thiruvaiyaru',
    isManualFallback: false
  };

  static init(): void {
    // Check if user previously marked location as denied
    const isDenied = localStorage.getItem(STORAGE_KEY_DENIED_FLAG) === 'true';
    const saved = localStorage.getItem(STORAGE_KEY_LOCATION);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.currentLocation = {
          ...this.currentLocation,
          ...parsed,
          status: isDenied ? 'denied' : (parsed.status || 'prompt')
        };
      } catch {
        // ignore
      }
    } else if (isDenied) {
      this.currentLocation.status = 'denied';
      this.currentLocation.errorMessage = 'Location access is required for this feature';
    }

    // Check browser permission status if supported
    if (typeof navigator !== 'undefined' && navigator.permissions?.query) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName })
        .then((permissionStatus) => {
          if (permissionStatus.state === 'denied') {
            this.setDenied('Location access is required for this feature');
          } else if (permissionStatus.state === 'granted') {
            this.requestPosition();
          }

          permissionStatus.onchange = () => {
            if (permissionStatus.state === 'denied') {
              this.setDenied('Location access is required for this feature');
            } else if (permissionStatus.state === 'granted') {
              this.requestPosition();
            }
          };
        })
        .catch(() => {
          // Permissions API not fully supported for geolocation in some iframe contexts
        });
    }
  }

  static getLocation(): UserLocationData {
    return this.currentLocation;
  }

  static subscribe(listener: (loc: UserLocationData) => void): () => void {
    this.listeners.push(listener);
    listener(this.currentLocation);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private static notify(): void {
    this.listeners.forEach(fn => fn(this.currentLocation));
  }

  static setDenied(message: string = 'Location access is required for this feature'): void {
    this.currentLocation = {
      ...this.currentLocation,
      status: 'denied',
      errorMessage: message,
      isManualFallback: true
    };
    localStorage.setItem(STORAGE_KEY_DENIED_FLAG, 'true');
    this.notify();
  }

  static setManualDistrict(district: string, villageTown: string = 'Central'): void {
    this.currentLocation = {
      ...this.currentLocation,
      district,
      villageTown,
      isManualFallback: true
    };
    localStorage.setItem(STORAGE_KEY_LOCATION, JSON.stringify(this.currentLocation));
    this.notify();
  }

  static requestPosition(): Promise<UserLocationData> {
    return new Promise((resolve) => {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        this.currentLocation = {
          ...this.currentLocation,
          status: 'unsupported',
          errorMessage: 'Geolocation is not supported by your browser',
          isManualFallback: true
        };
        this.notify();
        return resolve(this.currentLocation);
      }

      this.currentLocation = {
        ...this.currentLocation,
        status: 'loading',
        errorMessage: undefined
      };
      this.notify();

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          localStorage.removeItem(STORAGE_KEY_DENIED_FLAG);
          this.currentLocation = {
            status: 'granted',
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracyMeters: Math.round(pos.coords.accuracy),
            district: this.currentLocation.district || 'Thanjavur',
            villageTown: this.currentLocation.villageTown || 'Thiruvaiyaru',
            isManualFallback: false,
            errorMessage: undefined
          };
          localStorage.setItem(STORAGE_KEY_LOCATION, JSON.stringify(this.currentLocation));
          this.notify();
          resolve(this.currentLocation);
        },
        (error) => {
          let msg = 'Location access is required for this feature';
          if (error.code === error.PERMISSION_DENIED) {
            msg = 'Location access is required for this feature';
            localStorage.setItem(STORAGE_KEY_DENIED_FLAG, 'true');
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            msg = 'Location position unavailable. Please select your district.';
          } else if (error.code === error.TIMEOUT) {
            msg = 'Location request timed out. Please try again or select district.';
          }

          this.currentLocation = {
            ...this.currentLocation,
            status: 'denied',
            errorMessage: msg,
            isManualFallback: true
          };
          this.notify();
          resolve(this.currentLocation);
        },
        { timeout: 10000, maximumAge: 60000, enableHighAccuracy: true }
      );
    });
  }
}

// Auto-initialize
if (typeof window !== 'undefined') {
  LocationService.init();
}
