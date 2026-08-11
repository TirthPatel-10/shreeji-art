package com.shreejiart.settings;

import com.shreejiart.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SiteSettingService {

    private static final Set<String> PUBLIC_SETTING_KEYS = Set.of(
            "company_name",
            "company_phone",
            "company_email",
            "company_address",
            "company_city",
            "company_state",
            "short_location",
            "business_hours",
            "whatsapp_number",
            "company_description",
            "facebook_url",
            "instagram_url",
            "linkedin_url",
            "logo_url",
            "google_maps_url",
            "google_maps_directions_url",
            "google_maps_search_url",
            "google_maps_embed_url",
            "company_latitude",
            "company_longitude",
            "meta_title",
            "meta_description"
    );

    private final SiteSettingRepository repository;

    public Map<String, String> findAllAsMap() {
        return repository.findAll().stream()
                .collect(Collectors.toMap(SiteSetting::getKey, s -> s.getValue() != null ? s.getValue() : ""));
    }

    public Map<String, String> findPublicAsMap() {
        return repository.findAll().stream()
                .filter(setting -> PUBLIC_SETTING_KEYS.contains(setting.getKey()))
                .collect(Collectors.toMap(SiteSetting::getKey, s -> s.getValue() != null ? s.getValue() : ""));
    }

    public List<SiteSetting> findAll() {
        return repository.findAll();
    }

    public SiteSetting upsert(String key, String value) {
        SiteSetting setting = repository.findByKey(key)
                .orElseGet(() -> SiteSetting.builder().key(key).build());
        setting.setValue(value);
        return repository.save(setting);
    }

    public void delete(String key) {
        SiteSetting setting = repository.findByKey(key)
                .orElseThrow(() -> new ResourceNotFoundException("Setting not found: " + key));
        repository.delete(setting);
    }
}
