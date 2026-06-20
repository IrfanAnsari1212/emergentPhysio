#!/usr/bin/env python3
"""
Comprehensive Backend API Test Suite for CMS Endpoints
Tests all new CMS endpoints: Settings, CMS Services, Testimonials, Blogs, Gallery
"""

import requests
import json
import sys

BASE_URL = "https://physio-clinic-pro-1.preview.emergentagent.com/api"

# Store test data IDs for cleanup
test_data = {
    'service_id': None,
    'testimonial_id': None,
    'blog_id': None,
    'blog_slug': None,
    'gallery_id': None,
    'original_settings': None
}

def log(msg, status="INFO"):
    """Print formatted log message"""
    print(f"[{status}] {msg}")

def test_result(test_name, passed, details=""):
    """Print test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"\n{status}: {test_name}")
    if details:
        print(f"    {details}")
    return passed

# ==================== SETTINGS TESTS ====================

def test_1_get_settings():
    """Test 1: GET /api/settings - returns settings with clinic, content, seo"""
    try:
        log("Test 1: GET /api/settings")
        resp = requests.get(f"{BASE_URL}/settings", timeout=10)
        
        if resp.status_code != 200:
            return test_result("GET /api/settings", False, f"Status {resp.status_code}")
        
        data = resp.json()
        settings = data.get('settings')
        
        if not settings:
            return test_result("GET /api/settings", False, "No settings object")
        
        # Store original settings for restoration
        test_data['original_settings'] = settings
        
        # Verify clinic fields
        clinic = settings.get('clinic', {})
        if not clinic.get('name'):
            return test_result("GET /api/settings", False, "Missing clinic.name")
        
        phones = clinic.get('phones', [])
        if not isinstance(phones, list) or len(phones) != 3:
            return test_result("GET /api/settings", False, f"clinic.phones should be array of 3, got {len(phones)}")
        
        # Verify content fields
        content = settings.get('content', {})
        hero = content.get('hero', {})
        if not hero.get('title'):
            return test_result("GET /api/settings", False, "Missing content.hero.title")
        
        stats = content.get('stats', [])
        if not isinstance(stats, list) or len(stats) == 0:
            return test_result("GET /api/settings", False, "content.stats should be non-empty array")
        
        # Verify seo fields
        seo = settings.get('seo', {})
        home_seo = seo.get('home', {})
        if not home_seo:
            return test_result("GET /api/settings", False, "Missing seo.home")
        
        return test_result("GET /api/settings", True, 
            f"Settings loaded: clinic.name={clinic.get('name')}, phones={len(phones)}, stats={len(stats)}")
    
    except Exception as e:
        return test_result("GET /api/settings", False, str(e))

def test_2_put_settings():
    """Test 2: PUT /api/settings - update and verify, then restore"""
    try:
        log("Test 2: PUT /api/settings")
        
        # Update settings
        update_data = {
            'clinic': {
                'name': 'Updated Clinic Name',
                'phones': ['9999999999']
            },
            'content': test_data['original_settings'].get('content', {}),
            'seo': test_data['original_settings'].get('seo', {})
        }
        
        resp = requests.put(f"{BASE_URL}/settings", json=update_data, timeout=10)
        
        if resp.status_code != 200:
            return test_result("PUT /api/settings", False, f"Status {resp.status_code}")
        
        data = resp.json()
        if not data.get('success'):
            return test_result("PUT /api/settings", False, "No success field")
        
        # Verify update
        resp2 = requests.get(f"{BASE_URL}/settings", timeout=10)
        data2 = resp2.json()
        settings = data2.get('settings', {})
        
        if settings.get('clinic', {}).get('name') != 'Updated Clinic Name':
            return test_result("PUT /api/settings", False, "Update not persisted")
        
        # Restore original settings
        restore_data = {
            'clinic': test_data['original_settings'].get('clinic', {}),
            'content': test_data['original_settings'].get('content', {}),
            'seo': test_data['original_settings'].get('seo', {})
        }
        
        resp3 = requests.put(f"{BASE_URL}/settings", json=restore_data, timeout=10)
        if resp3.status_code != 200:
            return test_result("PUT /api/settings", False, "Failed to restore original settings")
        
        # Verify restoration
        resp4 = requests.get(f"{BASE_URL}/settings", timeout=10)
        data4 = resp4.json()
        restored = data4.get('settings', {})
        
        original_name = test_data['original_settings'].get('clinic', {}).get('name')
        if restored.get('clinic', {}).get('name') != original_name:
            return test_result("PUT /api/settings", False, "Failed to verify restoration")
        
        return test_result("PUT /api/settings", True, "Updated and restored successfully")
    
    except Exception as e:
        return test_result("PUT /api/settings", False, str(e))

# ==================== CMS SERVICES TESTS ====================

def test_3_get_cms_services_empty():
    """Test 3: GET /api/cms-services - returns empty array initially"""
    try:
        log("Test 3: GET /api/cms-services (initial)")
        resp = requests.get(f"{BASE_URL}/cms-services", timeout=10)
        
        if resp.status_code != 200:
            return test_result("GET /api/cms-services (empty)", False, f"Status {resp.status_code}")
        
        data = resp.json()
        services = data.get('services', [])
        
        # Note: May not be empty if services exist from previous tests
        return test_result("GET /api/cms-services (empty)", True, 
            f"Returned {len(services)} services")
    
    except Exception as e:
        return test_result("GET /api/cms-services (empty)", False, str(e))

def test_4_post_cms_service():
    """Test 4: POST /api/cms-services - create service with auto-generated slug"""
    try:
        log("Test 4: POST /api/cms-services")
        
        service_data = {
            'title': 'Test Acupressure Service',
            'short': 'Test description for acupressure',
            'symptoms': ['pain', 'stiffness'],
            'benefits': ['relief', 'mobility'],
            'active': True
        }
        
        resp = requests.post(f"{BASE_URL}/cms-services", json=service_data, timeout=10)
        
        if resp.status_code != 200:
            return test_result("POST /api/cms-services", False, f"Status {resp.status_code}")
        
        data = resp.json()
        if not data.get('success'):
            return test_result("POST /api/cms-services", False, "No success field")
        
        service = data.get('service', {})
        service_id = service.get('id')
        slug = service.get('slug')
        
        if not service_id:
            return test_result("POST /api/cms-services", False, "No id returned")
        
        if not slug:
            return test_result("POST /api/cms-services", False, "No slug generated")
        
        test_data['service_id'] = service_id
        
        return test_result("POST /api/cms-services", True, 
            f"Created service id={service_id}, slug={slug}")
    
    except Exception as e:
        return test_result("POST /api/cms-services", False, str(e))

def test_5_post_cms_service_no_title():
    """Test 5: POST /api/cms-services without title - should return 400"""
    try:
        log("Test 5: POST /api/cms-services (no title)")
        
        resp = requests.post(f"{BASE_URL}/cms-services", json={'short': 'desc'}, timeout=10)
        
        if resp.status_code != 400:
            return test_result("POST /api/cms-services (no title)", False, 
                f"Expected 400, got {resp.status_code}")
        
        return test_result("POST /api/cms-services (no title)", True, "Validation working")
    
    except Exception as e:
        return test_result("POST /api/cms-services (no title)", False, str(e))

def test_6_get_cms_services_with_new():
    """Test 6: GET /api/cms-services - should contain the new service"""
    try:
        log("Test 6: GET /api/cms-services (with new service)")
        resp = requests.get(f"{BASE_URL}/cms-services", timeout=10)
        
        if resp.status_code != 200:
            return test_result("GET /api/cms-services (with new)", False, f"Status {resp.status_code}")
        
        data = resp.json()
        services = data.get('services', [])
        
        found = any(s.get('id') == test_data['service_id'] for s in services)
        
        if not found:
            return test_result("GET /api/cms-services (with new)", False, 
                "New service not found in list")
        
        return test_result("GET /api/cms-services (with new)", True, 
            f"Found new service in list of {len(services)}")
    
    except Exception as e:
        return test_result("GET /api/cms-services (with new)", False, str(e))

def test_7_patch_cms_service_inactive():
    """Test 7: PATCH /api/cms-services/{id} - set active=false and verify filtering"""
    try:
        log("Test 7: PATCH /api/cms-services (set inactive)")
        
        if not test_data['service_id']:
            return test_result("PATCH /api/cms-services (inactive)", False, "No service_id")
        
        resp = requests.patch(f"{BASE_URL}/cms-services/{test_data['service_id']}", 
            json={'active': False}, timeout=10)
        
        if resp.status_code != 200:
            return test_result("PATCH /api/cms-services (inactive)", False, 
                f"Status {resp.status_code}")
        
        # GET without ?all=1 should NOT contain it
        resp2 = requests.get(f"{BASE_URL}/cms-services", timeout=10)
        data2 = resp2.json()
        services = data2.get('services', [])
        found = any(s.get('id') == test_data['service_id'] for s in services)
        
        if found:
            return test_result("PATCH /api/cms-services (inactive)", False, 
                "Inactive service still in default list")
        
        # GET with ?all=1 SHOULD contain it
        resp3 = requests.get(f"{BASE_URL}/cms-services?all=1", timeout=10)
        data3 = resp3.json()
        all_services = data3.get('services', [])
        found_all = any(s.get('id') == test_data['service_id'] for s in all_services)
        
        if not found_all:
            return test_result("PATCH /api/cms-services (inactive)", False, 
                "Inactive service not in ?all=1 list")
        
        return test_result("PATCH /api/cms-services (inactive)", True, 
            "Active filtering working correctly")
    
    except Exception as e:
        return test_result("PATCH /api/cms-services (inactive)", False, str(e))

def test_8_delete_cms_service():
    """Test 8: DELETE /api/cms-services/{id} - verify removed"""
    try:
        log("Test 8: DELETE /api/cms-services")
        
        if not test_data['service_id']:
            return test_result("DELETE /api/cms-services", False, "No service_id")
        
        resp = requests.delete(f"{BASE_URL}/cms-services/{test_data['service_id']}", timeout=10)
        
        if resp.status_code != 200:
            return test_result("DELETE /api/cms-services", False, f"Status {resp.status_code}")
        
        # Verify removed
        resp2 = requests.get(f"{BASE_URL}/cms-services?all=1", timeout=10)
        data2 = resp2.json()
        services = data2.get('services', [])
        found = any(s.get('id') == test_data['service_id'] for s in services)
        
        if found:
            return test_result("DELETE /api/cms-services", False, "Service still exists")
        
        test_data['service_id'] = None
        return test_result("DELETE /api/cms-services", True, "Service deleted successfully")
    
    except Exception as e:
        return test_result("DELETE /api/cms-services", False, str(e))

# ==================== TESTIMONIALS TESTS ====================

def test_9_get_testimonials_seeded():
    """Test 9: GET /api/testimonials - should have 6 default testimonials"""
    try:
        log("Test 9: GET /api/testimonials (seeded)")
        resp = requests.get(f"{BASE_URL}/testimonials", timeout=10)
        
        if resp.status_code != 200:
            return test_result("GET /api/testimonials (seeded)", False, f"Status {resp.status_code}")
        
        data = resp.json()
        testimonials = data.get('testimonials', [])
        
        if len(testimonials) < 6:
            return test_result("GET /api/testimonials (seeded)", False, 
                f"Expected at least 6 seeded testimonials, got {len(testimonials)}")
        
        return test_result("GET /api/testimonials (seeded)", True, 
            f"Found {len(testimonials)} testimonials (includes 6 seeded)")
    
    except Exception as e:
        return test_result("GET /api/testimonials (seeded)", False, str(e))

def test_10_post_testimonial():
    """Test 10: POST /api/testimonials - create testimonial"""
    try:
        log("Test 10: POST /api/testimonials")
        
        testimonial_data = {
            'patientName': 'Ramesh Kumar',
            'rating': 5,
            'review': 'Excellent treatment for my back pain. Highly recommend!',
            'role': 'Engineer',
            'active': True
        }
        
        resp = requests.post(f"{BASE_URL}/testimonials", json=testimonial_data, timeout=10)
        
        if resp.status_code != 200:
            return test_result("POST /api/testimonials", False, f"Status {resp.status_code}")
        
        data = resp.json()
        if not data.get('success'):
            return test_result("POST /api/testimonials", False, "No success field")
        
        testimonial = data.get('testimonial', {})
        testimonial_id = testimonial.get('id')
        
        if not testimonial_id:
            return test_result("POST /api/testimonials", False, "No id returned")
        
        test_data['testimonial_id'] = testimonial_id
        
        return test_result("POST /api/testimonials", True, f"Created testimonial id={testimonial_id}")
    
    except Exception as e:
        return test_result("POST /api/testimonials", False, str(e))

def test_11_post_testimonial_validation():
    """Test 11: POST /api/testimonials without required fields - should return 400"""
    try:
        log("Test 11: POST /api/testimonials (validation)")
        
        # Missing patientName
        resp1 = requests.post(f"{BASE_URL}/testimonials", json={'review': 'test'}, timeout=10)
        if resp1.status_code != 400:
            return test_result("POST /api/testimonials (validation)", False, 
                f"Missing patientName: expected 400, got {resp1.status_code}")
        
        # Missing review
        resp2 = requests.post(f"{BASE_URL}/testimonials", json={'patientName': 'test'}, timeout=10)
        if resp2.status_code != 400:
            return test_result("POST /api/testimonials (validation)", False, 
                f"Missing review: expected 400, got {resp2.status_code}")
        
        return test_result("POST /api/testimonials (validation)", True, "Validation working")
    
    except Exception as e:
        return test_result("POST /api/testimonials (validation)", False, str(e))

def test_12_patch_testimonial_inactive():
    """Test 12: PATCH /api/testimonials/{id} - set active=false and verify hidden"""
    try:
        log("Test 12: PATCH /api/testimonials (set inactive)")
        
        if not test_data['testimonial_id']:
            return test_result("PATCH /api/testimonials (inactive)", False, "No testimonial_id")
        
        resp = requests.patch(f"{BASE_URL}/testimonials/{test_data['testimonial_id']}", 
            json={'active': False}, timeout=10)
        
        if resp.status_code != 200:
            return test_result("PATCH /api/testimonials (inactive)", False, 
                f"Status {resp.status_code}")
        
        # GET without ?all=1 should NOT contain it
        resp2 = requests.get(f"{BASE_URL}/testimonials", timeout=10)
        data2 = resp2.json()
        testimonials = data2.get('testimonials', [])
        found = any(t.get('id') == test_data['testimonial_id'] for t in testimonials)
        
        if found:
            return test_result("PATCH /api/testimonials (inactive)", False, 
                "Inactive testimonial still in default list")
        
        return test_result("PATCH /api/testimonials (inactive)", True, 
            "Inactive testimonial hidden from default GET")
    
    except Exception as e:
        return test_result("PATCH /api/testimonials (inactive)", False, str(e))

def test_13_delete_testimonial():
    """Test 13: DELETE /api/testimonials/{id} - verify removed"""
    try:
        log("Test 13: DELETE /api/testimonials")
        
        if not test_data['testimonial_id']:
            return test_result("DELETE /api/testimonials", False, "No testimonial_id")
        
        resp = requests.delete(f"{BASE_URL}/testimonials/{test_data['testimonial_id']}", timeout=10)
        
        if resp.status_code != 200:
            return test_result("DELETE /api/testimonials", False, f"Status {resp.status_code}")
        
        # Verify removed
        resp2 = requests.get(f"{BASE_URL}/testimonials?all=1", timeout=10)
        data2 = resp2.json()
        testimonials = data2.get('testimonials', [])
        found = any(t.get('id') == test_data['testimonial_id'] for t in testimonials)
        
        if found:
            return test_result("DELETE /api/testimonials", False, "Testimonial still exists")
        
        test_data['testimonial_id'] = None
        return test_result("DELETE /api/testimonials", True, "Testimonial deleted successfully")
    
    except Exception as e:
        return test_result("DELETE /api/testimonials", False, str(e))

# ==================== BLOGS TESTS ====================

def test_14_get_blogs_empty():
    """Test 14: GET /api/blogs - empty list initially"""
    try:
        log("Test 14: GET /api/blogs (initial)")
        resp = requests.get(f"{BASE_URL}/blogs", timeout=10)
        
        if resp.status_code != 200:
            return test_result("GET /api/blogs (empty)", False, f"Status {resp.status_code}")
        
        data = resp.json()
        blogs = data.get('blogs', [])
        
        # Note: May not be empty if blogs exist from previous tests
        return test_result("GET /api/blogs (empty)", True, f"Returned {len(blogs)} published blogs")
    
    except Exception as e:
        return test_result("GET /api/blogs (empty)", False, str(e))

def test_15_post_blog():
    """Test 15: POST /api/blogs - create draft blog with auto-generated slug"""
    try:
        log("Test 15: POST /api/blogs")
        
        blog_data = {
            'title': 'Benefits of Acupressure Therapy',
            'content': '## Introduction\n\nAcupressure is a **natural** healing method.',
            'excerpt': 'Learn about the amazing benefits of acupressure',
            'category': 'Health Tips',
            'published': False
        }
        
        resp = requests.post(f"{BASE_URL}/blogs", json=blog_data, timeout=10)
        
        if resp.status_code != 200:
            return test_result("POST /api/blogs", False, f"Status {resp.status_code}")
        
        data = resp.json()
        if not data.get('success'):
            return test_result("POST /api/blogs", False, "No success field")
        
        blog = data.get('blog', {})
        blog_id = blog.get('id')
        slug = blog.get('slug')
        
        if not blog_id:
            return test_result("POST /api/blogs", False, "No id returned")
        
        if not slug:
            return test_result("POST /api/blogs", False, "No slug generated")
        
        test_data['blog_id'] = blog_id
        test_data['blog_slug'] = slug
        
        return test_result("POST /api/blogs", True, f"Created blog id={blog_id}, slug={slug}")
    
    except Exception as e:
        return test_result("POST /api/blogs", False, str(e))

def test_16_post_blog_duplicate_slug():
    """Test 16: POST /api/blogs with duplicate slug - should return 409"""
    try:
        log("Test 16: POST /api/blogs (duplicate slug)")
        
        if not test_data['blog_slug']:
            return test_result("POST /api/blogs (duplicate)", False, "No blog_slug")
        
        blog_data = {
            'title': 'Different Title',
            'slug': test_data['blog_slug'],  # Use existing slug
            'content': 'Content',
            'published': False
        }
        
        resp = requests.post(f"{BASE_URL}/blogs", json=blog_data, timeout=10)
        
        if resp.status_code != 409:
            return test_result("POST /api/blogs (duplicate)", False, 
                f"Expected 409, got {resp.status_code}")
        
        return test_result("POST /api/blogs (duplicate)", True, "Duplicate slug validation working")
    
    except Exception as e:
        return test_result("POST /api/blogs (duplicate)", False, str(e))

def test_17_get_blogs_draft_filtering():
    """Test 17: GET /api/blogs - draft should be hidden, visible with ?all=1"""
    try:
        log("Test 17: GET /api/blogs (draft filtering)")
        
        # GET without ?all=1 should NOT contain draft
        resp1 = requests.get(f"{BASE_URL}/blogs", timeout=10)
        data1 = resp1.json()
        blogs = data1.get('blogs', [])
        found = any(b.get('id') == test_data['blog_id'] for b in blogs)
        
        if found:
            return test_result("GET /api/blogs (draft filtering)", False, 
                "Draft blog visible in default list")
        
        # GET with ?all=1 SHOULD contain draft
        resp2 = requests.get(f"{BASE_URL}/blogs?all=1", timeout=10)
        data2 = resp2.json()
        all_blogs = data2.get('blogs', [])
        found_all = any(b.get('id') == test_data['blog_id'] for b in all_blogs)
        
        if not found_all:
            return test_result("GET /api/blogs (draft filtering)", False, 
                "Draft blog not in ?all=1 list")
        
        return test_result("GET /api/blogs (draft filtering)", True, 
            "Draft filtering working correctly")
    
    except Exception as e:
        return test_result("GET /api/blogs (draft filtering)", False, str(e))

def test_18_patch_blog_publish():
    """Test 18: PATCH /api/blogs/{id} - publish blog and verify publishedAt"""
    try:
        log("Test 18: PATCH /api/blogs (publish)")
        
        if not test_data['blog_id']:
            return test_result("PATCH /api/blogs (publish)", False, "No blog_id")
        
        resp = requests.patch(f"{BASE_URL}/blogs/{test_data['blog_id']}", 
            json={'published': True}, timeout=10)
        
        if resp.status_code != 200:
            return test_result("PATCH /api/blogs (publish)", False, f"Status {resp.status_code}")
        
        data = resp.json()
        blog = data.get('blog', {})
        
        if not blog.get('publishedAt'):
            return test_result("PATCH /api/blogs (publish)", False, "No publishedAt set")
        
        # Verify now visible in default GET
        resp2 = requests.get(f"{BASE_URL}/blogs", timeout=10)
        data2 = resp2.json()
        blogs = data2.get('blogs', [])
        found = any(b.get('id') == test_data['blog_id'] for b in blogs)
        
        if not found:
            return test_result("PATCH /api/blogs (publish)", False, 
                "Published blog not in default list")
        
        return test_result("PATCH /api/blogs (publish)", True, 
            "Blog published successfully with publishedAt")
    
    except Exception as e:
        return test_result("PATCH /api/blogs (publish)", False, str(e))

def test_19_get_blog_by_slug():
    """Test 19: GET /api/blogs/slug/{slug} - returns the blog"""
    try:
        log("Test 19: GET /api/blogs/slug/{slug}")
        
        if not test_data['blog_slug']:
            return test_result("GET /api/blogs/slug/{slug}", False, "No blog_slug")
        
        resp = requests.get(f"{BASE_URL}/blogs/slug/{test_data['blog_slug']}", timeout=10)
        
        if resp.status_code != 200:
            return test_result("GET /api/blogs/slug/{slug}", False, f"Status {resp.status_code}")
        
        data = resp.json()
        blog = data.get('blog', {})
        
        if blog.get('id') != test_data['blog_id']:
            return test_result("GET /api/blogs/slug/{slug}", False, "Wrong blog returned")
        
        return test_result("GET /api/blogs/slug/{slug}", True, 
            f"Retrieved blog by slug: {test_data['blog_slug']}")
    
    except Exception as e:
        return test_result("GET /api/blogs/slug/{slug}", False, str(e))

def test_20_delete_blog():
    """Test 20: DELETE /api/blogs/{id} - verify removed"""
    try:
        log("Test 20: DELETE /api/blogs")
        
        if not test_data['blog_id']:
            return test_result("DELETE /api/blogs", False, "No blog_id")
        
        resp = requests.delete(f"{BASE_URL}/blogs/{test_data['blog_id']}", timeout=10)
        
        if resp.status_code != 200:
            return test_result("DELETE /api/blogs", False, f"Status {resp.status_code}")
        
        # Verify removed
        resp2 = requests.get(f"{BASE_URL}/blogs?all=1", timeout=10)
        data2 = resp2.json()
        blogs = data2.get('blogs', [])
        found = any(b.get('id') == test_data['blog_id'] for b in blogs)
        
        if found:
            return test_result("DELETE /api/blogs", False, "Blog still exists")
        
        test_data['blog_id'] = None
        test_data['blog_slug'] = None
        return test_result("DELETE /api/blogs", True, "Blog deleted successfully")
    
    except Exception as e:
        return test_result("DELETE /api/blogs", False, str(e))

# ==================== GALLERY TESTS ====================

def test_21_get_gallery_empty():
    """Test 21: GET /api/gallery - empty array initially"""
    try:
        log("Test 21: GET /api/gallery (initial)")
        resp = requests.get(f"{BASE_URL}/gallery", timeout=10)
        
        if resp.status_code != 200:
            return test_result("GET /api/gallery (empty)", False, f"Status {resp.status_code}")
        
        data = resp.json()
        images = data.get('images', [])
        
        # Note: May not be empty if images exist from previous tests
        return test_result("GET /api/gallery (empty)", True, f"Returned {len(images)} images")
    
    except Exception as e:
        return test_result("GET /api/gallery (empty)", False, str(e))

def test_22_post_gallery():
    """Test 22: POST /api/gallery - create gallery image"""
    try:
        log("Test 22: POST /api/gallery")
        
        gallery_data = {
            'imageUrl': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=',
            'title': 'Test Clinic Photo',
            'category': 'clinic'
        }
        
        resp = requests.post(f"{BASE_URL}/gallery", json=gallery_data, timeout=10)
        
        if resp.status_code != 200:
            return test_result("POST /api/gallery", False, f"Status {resp.status_code}")
        
        data = resp.json()
        if not data.get('success'):
            return test_result("POST /api/gallery", False, "No success field")
        
        image = data.get('image', {})
        image_id = image.get('id')
        
        if not image_id:
            return test_result("POST /api/gallery", False, "No id returned")
        
        test_data['gallery_id'] = image_id
        
        return test_result("POST /api/gallery", True, f"Created gallery image id={image_id}")
    
    except Exception as e:
        return test_result("POST /api/gallery", False, str(e))

def test_23_post_gallery_validation():
    """Test 23: POST /api/gallery without imageUrl - should return 400"""
    try:
        log("Test 23: POST /api/gallery (validation)")
        
        resp = requests.post(f"{BASE_URL}/gallery", json={'title': 'test'}, timeout=10)
        
        if resp.status_code != 400:
            return test_result("POST /api/gallery (validation)", False, 
                f"Expected 400, got {resp.status_code}")
        
        return test_result("POST /api/gallery (validation)", True, "Validation working")
    
    except Exception as e:
        return test_result("POST /api/gallery (validation)", False, str(e))

def test_24_get_gallery_by_category():
    """Test 24: GET /api/gallery?category=clinic - filters by category"""
    try:
        log("Test 24: GET /api/gallery?category=clinic")
        
        resp = requests.get(f"{BASE_URL}/gallery?category=clinic", timeout=10)
        
        if resp.status_code != 200:
            return test_result("GET /api/gallery (category filter)", False, 
                f"Status {resp.status_code}")
        
        data = resp.json()
        images = data.get('images', [])
        
        # Verify all returned images are in 'clinic' category
        for img in images:
            if img.get('category') != 'clinic':
                return test_result("GET /api/gallery (category filter)", False, 
                    "Non-clinic image in filtered results")
        
        return test_result("GET /api/gallery (category filter)", True, 
            f"Category filter working, found {len(images)} clinic images")
    
    except Exception as e:
        return test_result("GET /api/gallery (category filter)", False, str(e))

def test_25_get_gallery_categories():
    """Test 25: GET /api/gallery/categories - returns array of unique categories"""
    try:
        log("Test 25: GET /api/gallery/categories")
        
        resp = requests.get(f"{BASE_URL}/gallery/categories", timeout=10)
        
        if resp.status_code != 200:
            return test_result("GET /api/gallery/categories", False, f"Status {resp.status_code}")
        
        data = resp.json()
        categories = data.get('categories', [])
        
        if not isinstance(categories, list):
            return test_result("GET /api/gallery/categories", False, "Not an array")
        
        # Should include 'clinic' since we just added one
        if 'clinic' not in categories:
            return test_result("GET /api/gallery/categories", False, 
                "'clinic' category not found")
        
        return test_result("GET /api/gallery/categories", True, 
            f"Categories: {categories}")
    
    except Exception as e:
        return test_result("GET /api/gallery/categories", False, str(e))

def test_26_delete_gallery():
    """Test 26: DELETE /api/gallery/{id} - verify removed"""
    try:
        log("Test 26: DELETE /api/gallery")
        
        if not test_data['gallery_id']:
            return test_result("DELETE /api/gallery", False, "No gallery_id")
        
        resp = requests.delete(f"{BASE_URL}/gallery/{test_data['gallery_id']}", timeout=10)
        
        if resp.status_code != 200:
            return test_result("DELETE /api/gallery", False, f"Status {resp.status_code}")
        
        # Verify removed
        resp2 = requests.get(f"{BASE_URL}/gallery", timeout=10)
        data2 = resp2.json()
        images = data2.get('images', [])
        found = any(img.get('id') == test_data['gallery_id'] for img in images)
        
        if found:
            return test_result("DELETE /api/gallery", False, "Gallery image still exists")
        
        test_data['gallery_id'] = None
        return test_result("DELETE /api/gallery", True, "Gallery image deleted successfully")
    
    except Exception as e:
        return test_result("DELETE /api/gallery", False, str(e))

# ==================== ADMIN STATS TESTS ====================

def test_27_get_admin_stats_updated():
    """Test 27: GET /api/admin/stats - includes new CMS fields"""
    try:
        log("Test 27: GET /api/admin/stats (updated)")
        resp = requests.get(f"{BASE_URL}/admin/stats", timeout=10)
        
        if resp.status_code != 200:
            return test_result("GET /api/admin/stats (updated)", False, f"Status {resp.status_code}")
        
        data = resp.json()
        
        # Check for new fields
        required_fields = ['testimonials', 'blogs', 'services', 'gallery']
        missing = [f for f in required_fields if f not in data]
        
        if missing:
            return test_result("GET /api/admin/stats (updated)", False, 
                f"Missing fields: {missing}")
        
        # Verify all are numbers
        for field in required_fields:
            if not isinstance(data[field], int):
                return test_result("GET /api/admin/stats (updated)", False, 
                    f"{field} is not a number")
        
        return test_result("GET /api/admin/stats (updated)", True, 
            f"Stats: testimonials={data['testimonials']}, blogs={data['blogs']}, "
            f"services={data['services']}, gallery={data['gallery']}")
    
    except Exception as e:
        return test_result("GET /api/admin/stats (updated)", False, str(e))

# ==================== REGRESSION TESTS ====================

def test_28_regression_health():
    """Test 28: GET /api/health - regression test"""
    try:
        log("Test 28: Regression - GET /api/health")
        resp = requests.get(f"{BASE_URL}/health", timeout=10)
        
        if resp.status_code != 200:
            return test_result("Regression: health", False, f"Status {resp.status_code}")
        
        data = resp.json()
        if not data.get('ok'):
            return test_result("Regression: health", False, "No ok field")
        
        return test_result("Regression: health", True, "Health endpoint working")
    
    except Exception as e:
        return test_result("Regression: health", False, str(e))

def test_29_regression_doctors():
    """Test 29: GET /api/doctors - regression test (3 seeded doctors)"""
    try:
        log("Test 29: Regression - GET /api/doctors")
        resp = requests.get(f"{BASE_URL}/doctors", timeout=10)
        
        if resp.status_code != 200:
            return test_result("Regression: doctors", False, f"Status {resp.status_code}")
        
        data = resp.json()
        doctors = data.get('doctors', [])
        
        if len(doctors) < 3:
            return test_result("Regression: doctors", False, 
                f"Expected at least 3 doctors, got {len(doctors)}")
        
        return test_result("Regression: doctors", True, f"Found {len(doctors)} doctors")
    
    except Exception as e:
        return test_result("Regression: doctors", False, str(e))

def test_30_regression_appointments():
    """Test 30: POST /api/appointments - regression test"""
    try:
        log("Test 30: Regression - POST /api/appointments")
        
        appt_data = {
            'patientName': 'Suresh Patel',
            'phone': '9876543210',
            'email': 'suresh@example.com',
            'service': 'Acupressure',
            'date': '2025-06-15',
            'time': '10:00 AM',
            'notes': 'Back pain'
        }
        
        resp = requests.post(f"{BASE_URL}/appointments", json=appt_data, timeout=10)
        
        if resp.status_code != 200:
            return test_result("Regression: appointments", False, f"Status {resp.status_code}")
        
        data = resp.json()
        if not data.get('success'):
            return test_result("Regression: appointments", False, "No success field")
        
        # Clean up
        appt_id = data.get('appointment', {}).get('id')
        if appt_id:
            requests.delete(f"{BASE_URL}/appointments/{appt_id}", timeout=10)
        
        return test_result("Regression: appointments", True, "Appointments endpoint working")
    
    except Exception as e:
        return test_result("Regression: appointments", False, str(e))

def test_31_regression_admin_login():
    """Test 31: POST /api/admin/login - regression test"""
    try:
        log("Test 31: Regression - POST /api/admin/login")
        
        resp = requests.post(f"{BASE_URL}/admin/login", 
            json={'password': 'admin123'}, timeout=10)
        
        if resp.status_code != 200:
            return test_result("Regression: admin login", False, f"Status {resp.status_code}")
        
        data = resp.json()
        if not data.get('success') or not data.get('token'):
            return test_result("Regression: admin login", False, "No success or token")
        
        return test_result("Regression: admin login", True, "Admin login working")
    
    except Exception as e:
        return test_result("Regression: admin login", False, str(e))

# ==================== MAIN TEST RUNNER ====================

def run_all_tests():
    """Run all tests in sequence"""
    print("\n" + "="*70)
    print("CMS ENDPOINTS COMPREHENSIVE TEST SUITE")
    print("="*70)
    
    results = []
    
    # Settings Tests
    print("\n### SETTINGS TESTS ###")
    results.append(test_1_get_settings())
    results.append(test_2_put_settings())
    
    # CMS Services Tests
    print("\n### CMS SERVICES TESTS ###")
    results.append(test_3_get_cms_services_empty())
    results.append(test_4_post_cms_service())
    results.append(test_5_post_cms_service_no_title())
    results.append(test_6_get_cms_services_with_new())
    results.append(test_7_patch_cms_service_inactive())
    results.append(test_8_delete_cms_service())
    
    # Testimonials Tests
    print("\n### TESTIMONIALS TESTS ###")
    results.append(test_9_get_testimonials_seeded())
    results.append(test_10_post_testimonial())
    results.append(test_11_post_testimonial_validation())
    results.append(test_12_patch_testimonial_inactive())
    results.append(test_13_delete_testimonial())
    
    # Blogs Tests
    print("\n### BLOGS TESTS ###")
    results.append(test_14_get_blogs_empty())
    results.append(test_15_post_blog())
    results.append(test_16_post_blog_duplicate_slug())
    results.append(test_17_get_blogs_draft_filtering())
    results.append(test_18_patch_blog_publish())
    results.append(test_19_get_blog_by_slug())
    results.append(test_20_delete_blog())
    
    # Gallery Tests
    print("\n### GALLERY TESTS ###")
    results.append(test_21_get_gallery_empty())
    results.append(test_22_post_gallery())
    results.append(test_23_post_gallery_validation())
    results.append(test_24_get_gallery_by_category())
    results.append(test_25_get_gallery_categories())
    results.append(test_26_delete_gallery())
    
    # Admin Stats Tests
    print("\n### ADMIN STATS TESTS ###")
    results.append(test_27_get_admin_stats_updated())
    
    # Regression Tests
    print("\n### REGRESSION TESTS ###")
    results.append(test_28_regression_health())
    results.append(test_29_regression_doctors())
    results.append(test_30_regression_appointments())
    results.append(test_31_regression_admin_login())
    
    # Summary
    print("\n" + "="*70)
    print("TEST SUMMARY")
    print("="*70)
    passed = sum(results)
    total = len(results)
    print(f"\nTotal Tests: {total}")
    print(f"Passed: {passed}")
    print(f"Failed: {total - passed}")
    print(f"Success Rate: {(passed/total)*100:.1f}%")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED!")
        return 0
    else:
        print(f"\n⚠️  {total - passed} TEST(S) FAILED")
        return 1

if __name__ == "__main__":
    sys.exit(run_all_tests())
