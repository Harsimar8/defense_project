import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GeocodeService {
  private cache: Map<string, [number, number] | null> = new Map();
  private queue: Promise<any> = Promise.resolve();

  async getCoordinates(location: string): Promise<[number, number] | null> {
    // 1. Return immediately if we have a result (or a previous failure) in cache
    if (this.cache.has(location)) return this.cache.get(location)!;

    // 2. Queue the request so they happen one after another
    this.queue = this.queue.then(async (): Promise<[number, number] | null> => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)},India&limit=1`;
        
        const res = await fetch(url, { 
          headers: { 'User-Agent': 'DefenseMapApp-1.0' } 
        });

        // 3. Always wait 1.5 seconds regardless of success/failure to respect TOS
        await new Promise(r => setTimeout(r, 1500));

        if (res.ok) {
          const data = await res.json();
          if (data?.length > 0) {
            const coords: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
            this.cache.set(location, coords);
            return coords;
          }
        }
      } catch (err) {
        console.error('Geocoding fetch failed:', err);
      }

      // 4. Cache the null result so we don't keep trying a bad location
      this.cache.set(location, null);
      return null;
    });

    return this.queue;
  }
}