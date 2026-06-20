#!/usr/bin/env python3
"""
Comprehensive Backend API Test for Physiotherapy Clinic
Tests all endpoints with real HTTP requests
"""

import requests
import json
from datetime import datetime, timedelta

# Base URL from environment
BASE_URL = "https://physio-clinic-pro-1.preview.emergentagent.com/api"

def print_test(name, passed, details=""):
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"\n{status}: {name}")
    if details:
        print(f"  Details: {details}")

def test_health():
    """Test 1: GET /api/health"""
    print("\n" + "="*60)
    print("TEST 1: Health Check")
    print("="*60)
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=10)
        data = response.json()
        passed = response.status_code == 200 and data.get('ok') == True
        print_test("Health endpoint", passed, f"Status: {response.status_code}, Response: {data}")
        return passed
    except Exception as e:
        print_test("Health endpoint", False, f"Exception: {str(e)}")
        return False

def test_create_appointment_success():
    """Test 2: POST /api/appointments with valid data"""
    print("\n" + "="*60)
    print("TEST 2: Create Appointment (Valid Data)")
    print("="*60)
    try:
        tomorrow = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
        payload = {
            "patientName": "John Smith",
            "phone": "+1234567890",
            "email": "john.smith@example.com",
            "service": "Physical Therapy",
            "date": tomorrow,
            "time": "10:00",
            "notes": "First time patient"
        }
        response = requests.post(f"{BASE_URL}/appointments", json=payload, timeout=10)
        data = response.json()
        
        has_id = 'appointment' in data and 'id' in data['appointment']
        has_status = 'appointment' in data and data['appointment'].get('status') == 'pending'
        passed = response.status_code == 200 and data.get('success') == True and has_id and has_status
        
        print_test("Create appointment with valid data", passed, 
                   f"Status: {response.status_code}, Has ID: {has_id}, Status: {data.get('appointment', {}).get('status')}")
        
        if passed:
            return data['appointment']['id']
        return None
    except Exception as e:
        print_test("Create appointment with valid data", False, f"Exception: {str(e)}")
        return None

def test_create_appointment_missing_fields():
    """Test 3: POST /api/appointments with missing required fields"""
    print("\n" + "="*60)
    print("TEST 3: Create Appointment (Missing Fields)")
    print("="*60)
    try:
        payload = {
            "patientName": "Jane Doe",
            "phone": "+1234567890"
            # Missing: service, date, time
        }
        response = requests.post(f"{BASE_URL}/appointments", json=payload, timeout=10)
        data = response.json()
        
        passed = response.status_code == 400 and 'error' in data
        print_test("Create appointment with missing fields returns 400", passed,
                   f"Status: {response.status_code}, Response: {data}")
        return passed
    except Exception as e:
        print_test("Create appointment with missing fields returns 400", False, f"Exception: {str(e)}")
        return False

def test_get_appointments(expected_id=None):
    """Test 4: GET /api/appointments"""
    print("\n" + "="*60)
    print("TEST 4: Get All Appointments")
    print("="*60)
    try:
        response = requests.get(f"{BASE_URL}/appointments", timeout=10)
        data = response.json()
        
        has_array = 'appointments' in data and isinstance(data['appointments'], list)
        found_appointment = False
        if expected_id and has_array:
            found_appointment = any(apt.get('id') == expected_id for apt in data['appointments'])
        
        passed = response.status_code == 200 and has_array
        if expected_id:
            passed = passed and found_appointment
            print_test("Get appointments returns array with created appointment", passed,
                       f"Status: {response.status_code}, Count: {len(data.get('appointments', []))}, Found ID: {found_appointment}")
        else:
            print_test("Get appointments returns array", passed,
                       f"Status: {response.status_code}, Count: {len(data.get('appointments', []))}")
        return passed
    except Exception as e:
        print_test("Get appointments", False, f"Exception: {str(e)}")
        return False

def test_update_appointment_status(appointment_id):
    """Test 5: PATCH /api/appointments/{id} and verify status change"""
    print("\n" + "="*60)
    print("TEST 5: Update Appointment Status")
    print("="*60)
    try:
        # Update status
        payload = {"status": "confirmed"}
        response = requests.patch(f"{BASE_URL}/appointments/{appointment_id}", json=payload, timeout=10)
        data = response.json()
        
        update_passed = response.status_code == 200 and data.get('success') == True
        print_test("Update appointment status", update_passed,
                   f"Status: {response.status_code}, Response: {data}")
        
        if not update_passed:
            return False
        
        # Verify the change
        response = requests.get(f"{BASE_URL}/appointments", timeout=10)
        data = response.json()
        
        appointment = next((apt for apt in data.get('appointments', []) if apt.get('id') == appointment_id), None)
        verified = appointment and appointment.get('status') == 'confirmed'
        
        print_test("Verify status changed to confirmed", verified,
                   f"Found appointment: {appointment is not None}, Status: {appointment.get('status') if appointment else 'N/A'}")
        
        return update_passed and verified
    except Exception as e:
        print_test("Update appointment status", False, f"Exception: {str(e)}")
        return False

def test_create_home_visit():
    """Test 6: POST /api/home-visits with valid data"""
    print("\n" + "="*60)
    print("TEST 6: Create Home Visit")
    print("="*60)
    try:
        tomorrow = (datetime.now() + timedelta(days=2)).strftime('%Y-%m-%d')
        payload = {
            "patientName": "Alice Johnson",
            "phone": "+1987654321",
            "address": "123 Main Street, Apt 4B, Springfield",
            "treatment": "Post-surgery rehabilitation",
            "preferredDate": tomorrow,
            "preferredTime": "14:00",
            "notes": "Please call before arriving"
        }
        response = requests.post(f"{BASE_URL}/home-visits", json=payload, timeout=10)
        data = response.json()
        
        has_id = 'request' in data and 'id' in data['request']
        passed = response.status_code == 200 and data.get('success') == True and has_id
        
        print_test("Create home visit", passed,
                   f"Status: {response.status_code}, Has ID: {has_id}")
        
        if passed:
            return data['request']['id']
        return None
    except Exception as e:
        print_test("Create home visit", False, f"Exception: {str(e)}")
        return None

def test_get_home_visits(expected_id=None):
    """Test 7: GET /api/home-visits"""
    print("\n" + "="*60)
    print("TEST 7: Get All Home Visits")
    print("="*60)
    try:
        response = requests.get(f"{BASE_URL}/home-visits", timeout=10)
        data = response.json()
        
        has_array = 'visits' in data and isinstance(data['visits'], list)
        found_visit = False
        if expected_id and has_array:
            found_visit = any(visit.get('id') == expected_id for visit in data['visits'])
        
        passed = response.status_code == 200 and has_array
        if expected_id:
            passed = passed and found_visit
            print_test("Get home visits with created visit", passed,
                       f"Status: {response.status_code}, Count: {len(data.get('visits', []))}, Found ID: {found_visit}")
        else:
            print_test("Get home visits", passed,
                       f"Status: {response.status_code}, Count: {len(data.get('visits', []))}")
        return passed
    except Exception as e:
        print_test("Get home visits", False, f"Exception: {str(e)}")
        return False

def test_update_home_visit_status(visit_id):
    """Test 8: PATCH /api/home-visits/{id} status update"""
    print("\n" + "="*60)
    print("TEST 8: Update Home Visit Status")
    print("="*60)
    try:
        payload = {"status": "scheduled"}
        response = requests.patch(f"{BASE_URL}/home-visits/{visit_id}", json=payload, timeout=10)
        data = response.json()
        
        update_passed = response.status_code == 200 and data.get('success') == True
        print_test("Update home visit status", update_passed,
                   f"Status: {response.status_code}, Response: {data}")
        
        if not update_passed:
            return False
        
        # Verify the change
        response = requests.get(f"{BASE_URL}/home-visits", timeout=10)
        data = response.json()
        
        visit = next((v for v in data.get('visits', []) if v.get('id') == visit_id), None)
        verified = visit and visit.get('status') == 'scheduled'
        
        print_test("Verify home visit status changed", verified,
                   f"Found visit: {visit is not None}, Status: {visit.get('status') if visit else 'N/A'}")
        
        return update_passed and verified
    except Exception as e:
        print_test("Update home visit status", False, f"Exception: {str(e)}")
        return False

def test_create_contact():
    """Test 9a: POST /api/contact"""
    print("\n" + "="*60)
    print("TEST 9a: Create Contact Enquiry")
    print("="*60)
    try:
        payload = {
            "name": "Bob Williams",
            "phone": "+1555123456",
            "email": "bob.williams@example.com",
            "message": "I would like to know more about your sports injury treatment programs."
        }
        response = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        data = response.json()
        
        has_id = 'enquiry' in data and 'id' in data['enquiry']
        passed = response.status_code == 200 and data.get('success') == True and has_id
        
        print_test("Create contact enquiry", passed,
                   f"Status: {response.status_code}, Has ID: {has_id}")
        
        if passed:
            return data['enquiry']['id']
        return None
    except Exception as e:
        print_test("Create contact enquiry", False, f"Exception: {str(e)}")
        return None

def test_get_contacts(expected_id=None):
    """Test 9b: GET /api/contact"""
    print("\n" + "="*60)
    print("TEST 9b: Get All Contact Enquiries")
    print("="*60)
    try:
        response = requests.get(f"{BASE_URL}/contact", timeout=10)
        print(f"  Raw response status: {response.status_code}")
        print(f"  Raw response text: {response.text[:200]}")
        data = response.json()
        
        has_array = 'enquiries' in data and isinstance(data['enquiries'], list)
        found_contact = False
        if expected_id and has_array:
            found_contact = any(enq.get('id') == expected_id for enq in data['enquiries'])
        
        passed = response.status_code == 200 and has_array
        if expected_id:
            passed = passed and found_contact
            print_test("Get contacts with created enquiry", passed,
                       f"Status: {response.status_code}, Count: {len(data.get('enquiries', []))}, Found ID: {found_contact}")
        else:
            print_test("Get contacts", passed,
                       f"Status: {response.status_code}, Count: {len(data.get('enquiries', []))}")
        return passed
    except Exception as e:
        print_test("Get contacts", False, f"Exception: {str(e)}, Response: {response.text[:200] if 'response' in locals() else 'N/A'}")
        return False

def test_update_contact_status(contact_id):
    """Test 9c: PATCH /api/contact/{id}"""
    print("\n" + "="*60)
    print("TEST 9c: Update Contact Status")
    print("="*60)
    try:
        payload = {"status": "resolved"}
        response = requests.patch(f"{BASE_URL}/contact/{contact_id}", json=payload, timeout=10)
        data = response.json()
        
        update_passed = response.status_code == 200 and data.get('success') == True
        print_test("Update contact status", update_passed,
                   f"Status: {response.status_code}, Response: {data}")
        
        if not update_passed:
            return False
        
        # Verify the change
        response = requests.get(f"{BASE_URL}/contact", timeout=10)
        data = response.json()
        
        contact = next((c for c in data.get('enquiries', []) if c.get('id') == contact_id), None)
        verified = contact and contact.get('status') == 'resolved'
        
        print_test("Verify contact status changed to resolved", verified,
                   f"Found contact: {contact is not None}, Status: {contact.get('status') if contact else 'N/A'}")
        
        return update_passed and verified
    except Exception as e:
        print_test("Update contact status", False, f"Exception: {str(e)}")
        return False

def test_admin_login_wrong_password():
    """Test 10: POST /api/admin/login with wrong password"""
    print("\n" + "="*60)
    print("TEST 10: Admin Login (Wrong Password)")
    print("="*60)
    try:
        payload = {"password": "wrongpassword123"}
        response = requests.post(f"{BASE_URL}/admin/login", json=payload, timeout=10)
        print(f"  Raw response status: {response.status_code}")
        print(f"  Raw response text: {response.text[:200]}")
        data = response.json()
        
        passed = response.status_code == 401 and 'error' in data
        print_test("Admin login with wrong password returns 401", passed,
                   f"Status: {response.status_code}, Response: {data}")
        return passed
    except Exception as e:
        print_test("Admin login with wrong password", False, f"Exception: {str(e)}, Response: {response.text[:200] if 'response' in locals() else 'N/A'}")
        return False

def test_admin_login_correct_password():
    """Test 11: POST /api/admin/login with correct password"""
    print("\n" + "="*60)
    print("TEST 11: Admin Login (Correct Password)")
    print("="*60)
    try:
        payload = {"password": "admin123"}
        response = requests.post(f"{BASE_URL}/admin/login", json=payload, timeout=10)
        print(f"  Raw response status: {response.status_code}")
        print(f"  Raw response text: {response.text[:200]}")
        data = response.json()
        
        has_token = 'token' in data and data['token']
        passed = response.status_code == 200 and data.get('success') == True and has_token
        
        print_test("Admin login with correct password", passed,
                   f"Status: {response.status_code}, Has token: {has_token}")
        return passed
    except Exception as e:
        print_test("Admin login with correct password", False, f"Exception: {str(e)}, Response: {response.text[:200] if 'response' in locals() else 'N/A'}")
        return False

def test_admin_stats():
    """Test 12: GET /api/admin/stats"""
    print("\n" + "="*60)
    print("TEST 12: Admin Stats")
    print("="*60)
    try:
        response = requests.get(f"{BASE_URL}/admin/stats", timeout=10)
        data = response.json()
        
        required_fields = ['totalAppointments', 'pendingAppointments', 'todayAppointments', 'homeVisits', 'newEnquiries']
        has_all_fields = all(field in data for field in required_fields)
        all_numbers = all(isinstance(data.get(field), int) for field in required_fields)
        
        passed = response.status_code == 200 and has_all_fields and all_numbers
        
        print_test("Admin stats returns all required fields", passed,
                   f"Status: {response.status_code}, Has all fields: {has_all_fields}, All numbers: {all_numbers}")
        if passed:
            print(f"  Stats: {json.dumps(data, indent=2)}")
        return passed
    except Exception as e:
        print_test("Admin stats", False, f"Exception: {str(e)}")
        return False

def main():
    print("\n" + "="*60)
    print("PHYSIOTHERAPY CLINIC BACKEND API TEST SUITE")
    print("="*60)
    print(f"Base URL: {BASE_URL}")
    print("="*60)
    
    results = {}
    
    # Test 1: Health check
    results['health'] = test_health()
    
    # Test 2: Create appointment (valid)
    appointment_id = test_create_appointment_success()
    results['create_appointment_valid'] = appointment_id is not None
    
    # Test 3: Create appointment (missing fields)
    results['create_appointment_invalid'] = test_create_appointment_missing_fields()
    
    # Test 4: Get appointments
    results['get_appointments'] = test_get_appointments(appointment_id)
    
    # Test 5: Update appointment status
    if appointment_id:
        results['update_appointment'] = test_update_appointment_status(appointment_id)
    else:
        results['update_appointment'] = False
        print("\n❌ SKIP: Update appointment (no appointment ID)")
    
    # Test 6: Create home visit
    visit_id = test_create_home_visit()
    results['create_home_visit'] = visit_id is not None
    
    # Test 7: Get home visits
    results['get_home_visits'] = test_get_home_visits(visit_id)
    
    # Test 8: Update home visit status
    if visit_id:
        results['update_home_visit'] = test_update_home_visit_status(visit_id)
    else:
        results['update_home_visit'] = False
        print("\n❌ SKIP: Update home visit (no visit ID)")
    
    # Test 9: Contact enquiries (create, get, update)
    contact_id = test_create_contact()
    results['create_contact'] = contact_id is not None
    results['get_contacts'] = test_get_contacts(contact_id)
    if contact_id:
        results['update_contact'] = test_update_contact_status(contact_id)
    else:
        results['update_contact'] = False
        print("\n❌ SKIP: Update contact (no contact ID)")
    
    # Test 10: Admin login (wrong password)
    results['admin_login_wrong'] = test_admin_login_wrong_password()
    
    # Test 11: Admin login (correct password)
    results['admin_login_correct'] = test_admin_login_correct_password()
    
    # Test 12: Admin stats
    results['admin_stats'] = test_admin_stats()
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    print(f"\nTotal: {passed}/{total} tests passed")
    print("\nDetailed Results:")
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {status}: {test_name}")
    
    print("\n" + "="*60)
    if passed == total:
        print("🎉 ALL TESTS PASSED!")
    else:
        print(f"⚠️  {total - passed} TEST(S) FAILED")
    print("="*60)
    
    return passed == total

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
