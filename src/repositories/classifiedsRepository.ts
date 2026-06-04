import { ClassifiedAd } from '../types/classifieds';

const STORAGE_KEY = 'axei_classifieds';
const REPORTS_KEY = 'axei_classified_reports';

export const classifiedsRepository = {
  getAll(): ClassifiedAd[] {
    const data = localStorage.getItem(STORAGE_KEY);
    const ads: ClassifiedAd[] = data ? JSON.parse(data) : [];
    
    // Auto-expire check
    const now = new Date();
    let changed = false;
    const updatedAds = ads.map(ad => {
      if (ad.status === 'active' && new Date(ad.expiresAt) < now) {
        changed = true;
        return { ...ad, status: 'expired' as const };
      }
      return ad;
    });

    if (changed) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAds));
    }
    
    return updatedAds;
  },

  getActive(): ClassifiedAd[] {
    return this.getAll().filter(ad => ad.status === 'active');
  },

  getByUser(userId: string): ClassifiedAd[] {
    return this.getAll().filter(ad => ad.userId === userId);
  },

  getById(id: string): ClassifiedAd | undefined {
    return this.getAll().find(ad => ad.id === id);
  },

  save(ad: ClassifiedAd): void {
    const ads = this.getAll();
    const index = ads.findIndex(a => a.id === ad.id);
    
    if (index >= 0) {
      ads[index] = ad;
    } else {
      ads.push(ad);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ads));
    window.dispatchEvent(new Event("storage"));
  },

  delete(id: string): void {
    const ads = this.getAll().filter(ad => ad.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ads));
    window.dispatchEvent(new Event("storage"));
  },

  report(report: { id: string; adId: string; reason: string; createdAt: string }): void {
    const reportsStr = localStorage.getItem(REPORTS_KEY);
    const reports: any[] = reportsStr ? JSON.parse(reportsStr) : [];
    reports.push(report);
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));

    // Increment report count on ad
    const ads = this.getAll();
    const adIndex = ads.findIndex(a => a.id === report.adId);
    if (adIndex >= 0) {
      ads[adIndex].reports = (ads[adIndex].reports || 0) + 1;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ads));
      window.dispatchEvent(new Event("storage"));
    }
  },

  getReports(): any[] {
    const data = localStorage.getItem(REPORTS_KEY);
    return data ? JSON.parse(data) : [];
  }
};
