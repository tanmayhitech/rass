// ============================================================================
// Rass by Riddhima — Indian Pincode Auto-Detection Service
// Automatically detects City, District, and State from a 6-digit PIN code.
// Uses India Post official API with fallback to Zippopotam & offline directory.
// ============================================================================

export interface PincodeDetails {
  pincode: string;
  city: string;
  state: string;
  district?: string;
  area?: string;
  formattedLocation: string;
}

export interface PincodeLookupResponse {
  success: boolean;
  data?: PincodeDetails;
  error?: string;
}

// In-memory cache for ultra-fast repeated lookups
const pincodeMemoryCache = new Map<string, PincodeDetails>();

// Load persistent cache from localStorage if available
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const saved = localStorage.getItem('rass_pincode_cache');
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.entries(parsed).forEach(([pin, details]) => {
        pincodeMemoryCache.set(pin, details as PincodeDetails);
      });
    }
  }
} catch {
  // Ignore localStorage parsing errors
}

function persistCache() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const obj: Record<string, PincodeDetails> = {};
      pincodeMemoryCache.forEach((v, k) => {
        obj[k] = v;
      });
      localStorage.setItem('rass_pincode_cache', JSON.stringify(obj));
    }
  } catch {
    // Ignore quota or storage errors
  }
}

// Offline fallback mapping based on first 2 digits of Indian Postal Index Numbers
const OFFLINE_PREFIX_MAP: Record<string, { city: string; state: string }> = {
  '11': { city: 'New Delhi', state: 'Delhi' },
  '12': { city: 'Gurugram / Faridabad', state: 'Haryana' },
  '13': { city: 'Ambala', state: 'Haryana' },
  '14': { city: 'Amritsar / Jalandhar', state: 'Punjab' },
  '15': { city: 'Bathinda', state: 'Punjab' },
  '16': { city: 'Chandigarh', state: 'Chandigarh' },
  '17': { city: 'Shimla', state: 'Himachal Pradesh' },
  '18': { city: 'Jammu', state: 'Jammu and Kashmir' },
  '19': { city: 'Srinagar', state: 'Jammu and Kashmir' },
  '20': { city: 'Noida / Ghaziabad', state: 'Uttar Pradesh' },
  '21': { city: 'Prayagraj', state: 'Uttar Pradesh' },
  '22': { city: 'Lucknow', state: 'Uttar Pradesh' },
  '23': { city: 'Varanasi', state: 'Uttar Pradesh' },
  '24': { city: 'Dehradun', state: 'Uttarakhand' },
  '25': { city: 'Meerut', state: 'Uttar Pradesh' },
  '26': { city: 'Bareilly', state: 'Uttar Pradesh' },
  '27': { city: 'Gorakhpur', state: 'Uttar Pradesh' },
  '28': { city: 'Agra', state: 'Uttar Pradesh' },
  '30': { city: 'Jaipur', state: 'Rajasthan' },
  '31': { city: 'Udaipur', state: 'Rajasthan' },
  '32': { city: 'Kota', state: 'Rajasthan' },
  '33': { city: 'Bikaner', state: 'Rajasthan' },
  '34': { city: 'Jodhpur', state: 'Rajasthan' },
  '36': { city: 'Rajkot', state: 'Gujarat' },
  '37': { city: 'Jamnagar', state: 'Gujarat' },
  '38': { city: 'Ahmedabad', state: 'Gujarat' },
  '39': { city: 'Surat', state: 'Gujarat' },
  '40': { city: 'Mumbai', state: 'Maharashtra' },
  '41': { city: 'Pune', state: 'Maharashtra' },
  '42': { city: 'Nashik', state: 'Maharashtra' },
  '43': { city: 'Chhatrapati Sambhaji Nagar', state: 'Maharashtra' },
  '44': { city: 'Nagpur', state: 'Maharashtra' },
  '45': { city: 'Indore', state: 'Madhya Pradesh' },
  '46': { city: 'Bhopal', state: 'Madhya Pradesh' },
  '47': { city: 'Gwalior', state: 'Madhya Pradesh' },
  '48': { city: 'Jabalpur', state: 'Madhya Pradesh' },
  '49': { city: 'Raipur', state: 'Chhattisgarh' },
  '50': { city: 'Hyderabad', state: 'Telangana' },
  '51': { city: 'Tirupati', state: 'Andhra Pradesh' },
  '52': { city: 'Vijayawada', state: 'Andhra Pradesh' },
  '53': { city: 'Visakhapatnam', state: 'Andhra Pradesh' },
  '56': { city: 'Bengaluru', state: 'Karnataka' },
  '57': { city: 'Mangalore', state: 'Karnataka' },
  '58': { city: 'Hubli', state: 'Karnataka' },
  '59': { city: 'Belagavi', state: 'Karnataka' },
  '60': { city: 'Chennai', state: 'Tamil Nadu' },
  '61': { city: 'Thanjavur', state: 'Tamil Nadu' },
  '62': { city: 'Madurai', state: 'Tamil Nadu' },
  '63': { city: 'Salem', state: 'Tamil Nadu' },
  '64': { city: 'Coimbatore', state: 'Tamil Nadu' },
  '67': { city: 'Kozhikode', state: 'Kerala' },
  '68': { city: 'Kochi', state: 'Kerala' },
  '69': { city: 'Thiruvananthapuram', state: 'Kerala' },
  '70': { city: 'Kolkata', state: 'West Bengal' },
  '71': { city: 'Howrah', state: 'West Bengal' },
  '72': { city: 'Kharagpur', state: 'West Bengal' },
  '73': { city: 'Siliguri', state: 'West Bengal' },
  '74': { city: 'North 24 Parganas', state: 'West Bengal' },
  '75': { city: 'Bhubaneswar', state: 'Odisha' },
  '76': { city: 'Berhampur', state: 'Odisha' },
  '77': { city: 'Sambalpur', state: 'Odisha' },
  '78': { city: 'Guwahati', state: 'Assam' },
  '79': { city: 'Shillong', state: 'Meghalaya' },
  '80': { city: 'Patna', state: 'Bihar' },
  '81': { city: 'Bhagalpur', state: 'Bihar' },
  '82': { city: 'Gaya', state: 'Bihar' },
  '83': { city: 'Ranchi', state: 'Jharkhand' },
  '84': { city: 'Muzaffarpur', state: 'Bihar' },
  '85': { city: 'Purnia', state: 'Bihar' },
};

export const pincodeService = {
  /**
   * Sanitizes pincode input: trims and removes non-numeric characters
   */
  sanitize(pincode: string): string {
    return pincode.replace(/\D/g, '').slice(0, 6);
  },

  /**
   * Validates if a string is a 6-digit Indian PIN code
   */
  isValid(pincode: string): boolean {
    return /^[1-9][0-9]{5}$/.test(pincode.trim());
  },

  /**
   * Look up city, state, and district for an Indian PIN code.
   * Auto-detects with caching, online API, and offline fallback.
   */
  async lookup(rawPincode: string): Promise<PincodeLookupResponse> {
    const pin = this.sanitize(rawPincode);

    if (pin.length !== 6) {
      return {
        success: false,
        error: 'Please enter a 6-digit PIN code.',
      };
    }

    if (!/^[1-9]/.test(pin)) {
      return {
        success: false,
        error: 'Indian PIN codes cannot start with 0.',
      };
    }

    // 1. Check in-memory / local cache
    if (pincodeMemoryCache.has(pin)) {
      return {
        success: true,
        data: pincodeMemoryCache.get(pin)!,
      };
    }

    // 2. Try official India Post API
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6500);

      const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        if (Array.isArray(json) && json.length > 0) {
          const firstResult = json[0];
          if (firstResult.Status === 'Success' && Array.isArray(firstResult.PostOffice) && firstResult.PostOffice.length > 0) {
            const po = firstResult.PostOffice[0];
            const city = po.District || po.Block || po.Circle || po.Name || OFFLINE_PREFIX_MAP[pin.slice(0, 2)]?.city || '';
            const state = po.State || OFFLINE_PREFIX_MAP[pin.slice(0, 2)]?.state || '';
            const area = po.Name || '';

            const details: PincodeDetails = {
              pincode: pin,
              city: city.trim(),
              state: state.trim(),
              district: po.District ? po.District.trim() : undefined,
              area: area ? area.trim() : undefined,
              formattedLocation: `${city.trim()}, ${state.trim()}`,
            };

            pincodeMemoryCache.set(pin, details);
            persistCache();

            return {
              success: true,
              data: details,
            };
          }
        }
      }
    } catch {
      // Fall through to fallback provider
    }

    // 3. Fallback to Zippopotam
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(`https://api.zippopotam.us/IN/${pin}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        if (json.places && json.places.length > 0) {
          const place = json.places[0];
          const state = place.state || OFFLINE_PREFIX_MAP[pin.slice(0, 2)]?.state || '';
          const fallbackCity = OFFLINE_PREFIX_MAP[pin.slice(0, 2)]?.city;
          const city = fallbackCity || place['place name'] || '';

          const details: PincodeDetails = {
            pincode: pin,
            city: city.trim(),
            state: state.trim(),
            area: place['place name'] ? place['place name'].trim() : undefined,
            formattedLocation: `${city.trim()}, ${state.trim()}`,
          };

            pincodeMemoryCache.set(pin, details);
            persistCache();

            return {
              success: true,
              data: details,
            };
        }
      }
    } catch {
      // Fall through to offline fallback
    }

    // 4. Offline fallback mapping
    const prefix = pin.slice(0, 2);
    if (OFFLINE_PREFIX_MAP[prefix]) {
      const fallback = OFFLINE_PREFIX_MAP[prefix];
      const details: PincodeDetails = {
        pincode: pin,
        city: fallback.city,
        state: fallback.state,
        formattedLocation: `${fallback.city}, ${fallback.state}`,
      };

      pincodeMemoryCache.set(pin, details);
      persistCache();

      return {
        success: true,
        data: details,
      };
    }

    return {
      success: false,
      error: `Could not detect city and state for PIN code ${pin}. Please verify the code.`,
    };
  },

  /**
   * Helper to retrieve cached location if already looked up
   */
  getCached(pincode: string): PincodeDetails | null {
    const pin = this.sanitize(pincode);
    return pincodeMemoryCache.get(pin) || null;
  },
};
