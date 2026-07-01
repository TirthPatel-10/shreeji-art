package com.shreejiart.settings;

import com.shreejiart.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SiteSettingService {

    private final SiteSettingRepository repository;

    public Map<String, String> findAllAsMap() {
        return repository.findAll().stream()
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
