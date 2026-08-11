import { publicApi } from "@/lib/api";
import {
  resolveSiteContact,
  type PublicSiteSettings,
  type SiteContact,
} from "@/lib/contact";

export async function getPublicSiteContact(): Promise<SiteContact> {
  const settings = await getPublicSiteSettings();

  return resolveSiteContact(settings);
}

export async function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  try {
    const response = await publicApi.getSettings();
    if (!response.success || !response.data) {
      return {};
    }

    return response.data as PublicSiteSettings;
  } catch {
    return {};
  }
}
