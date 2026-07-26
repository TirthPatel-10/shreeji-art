package com.shreejiart.blogs;

import com.shreejiart.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BlogPostService {

    private final BlogPostRepository repository;

    public List<BlogPost> findPublished() {
        return repository.findByStatusOrderByPublishedAtDesc(BlogStatus.PUBLISHED);
    }

    public List<BlogPost> findAll() {
        return repository.findAll();
    }

    public BlogPost findBySlug(String slug) {
        return repository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found: " + slug));
    }

    public BlogPost findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post", id));
    }

    public BlogPost create(BlogPost post) {
        post.setId(null);
        validatePost(post, null);
        if (post.getStatus() == BlogStatus.PUBLISHED && post.getPublishedAt() == null) {
            post.setPublishedAt(OffsetDateTime.now());
        }
        return repository.save(post);
    }

    public BlogPost update(Long id, BlogPost updates) {
        BlogPost existing = findById(id);
        validatePost(updates, id);
        existing.setTitle(updates.getTitle());
        existing.setSlug(updates.getSlug());
        existing.setExcerpt(updates.getExcerpt());
        existing.setContent(updates.getContent());
        existing.setFeaturedImage(updates.getFeaturedImage());
        if (updates.getStatus() == BlogStatus.PUBLISHED && existing.getPublishedAt() == null) {
            existing.setPublishedAt(OffsetDateTime.now());
        }
        existing.setStatus(updates.getStatus());
        return repository.save(existing);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Blog post", id);
        repository.deleteById(id);
    }

    private void validatePost(BlogPost post, Long currentId) {
        if (!StringUtils.hasText(post.getTitle())) {
            throw new IllegalArgumentException("Blog title is required.");
        }
        if (!StringUtils.hasText(post.getSlug()) || !post.getSlug().matches("^[a-z0-9]+(?:-[a-z0-9]+)*$")) {
            throw new IllegalArgumentException("Blog slug must use lowercase letters, numbers, and hyphens.");
        }
        if (!StringUtils.hasText(post.getContent())) {
            throw new IllegalArgumentException("Blog content is required.");
        }
        if (post.getStatus() == null) {
            post.setStatus(BlogStatus.DRAFT);
        }
        boolean exists = currentId == null
                ? repository.existsBySlug(post.getSlug())
                : repository.existsBySlugAndIdNot(post.getSlug(), currentId);
        if (exists) {
            throw new IllegalArgumentException("Blog slug already exists.");
        }
    }
}
