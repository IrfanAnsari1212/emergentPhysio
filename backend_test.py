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
        
        required_fields = ['totalAppointments', 'pendingAppointments', 'todayAppointments', 'homeVisits', 'newEnquiries', 'activeDoctors']
        has_all_fields = all(field in data for field in required_fields)
        all_numbers = all(isinstance(data.get(field), int) for field in required_fields)
        
        passed = response.status_code == 200 and has_all_fields and all_numbers
        
        print_test("Admin stats returns all required fields including activeDoctors", passed,
                   f"Status: {response.status_code}, Has all fields: {has_all_fields}, All numbers: {all_numbers}")
        if passed:
            print(f"  Stats: {json.dumps(data, indent=2)}")
        return passed
    except Exception as e:
        print_test("Admin stats", False, f"Exception: {str(e)}")
        return False

def test_get_doctors_default_seeded():
    """Test 13: GET /api/doctors - verify 3 default doctors seeded"""
    print("\n" + "="*60)
    print("TEST 13: Get Doctors (Default Seeded)")
    print("="*60)
    try:
        response = requests.get(f"{BASE_URL}/doctors", timeout=10)
        data = response.json()
        
        has_array = 'doctors' in data and isinstance(data['doctors'], list)
        
        # Check for the 3 default doctors
        expected_names = ['Dr. Ashwani Kumar Gupta', 'Dr. Chhotelal Singh', 'Dr. Santosh Singh']
        found_doctors = []
        if has_array:
            for name in expected_names:
                found = any(doc.get('name') == name for doc in data['doctors'])
                found_doctors.append(found)
        
        # Verify all have required fields
        all_have_fields = True
        if has_array:
            for doc in data['doctors']:
                if not all(field in doc for field in ['name', 'specialization', 'experience', 'id']):
                    all_have_fields = False
                    break
        
        passed = response.status_code == 200 and has_array and all(found_doctors) and all_have_fields
        
        print_test("Get doctors returns 3 default seeded doctors with required fields", passed,
                   f"Status: {response.status_code}, Count: {len(data.get('doctors', []))}, Found all 3: {all(found_doctors)}, All have fields: {all_have_fields}")
        return passed
    except Exception as e:
        print_test("Get doctors default seeded", False, f"Exception: {str(e)}")
        return False

def test_get_doctors_with_all_param():
    """Test 14: GET /api/doctors?all=1 - returns including inactive"""
    print("\n" + "="*60)
    print("TEST 14: Get Doctors (Including Inactive)")
    print("="*60)
    try:
        response = requests.get(f"{BASE_URL}/doctors?all=1", timeout=10)
        data = response.json()
        
        has_array = 'doctors' in data and isinstance(data['doctors'], list)
        passed = response.status_code == 200 and has_array
        
        print_test("Get doctors with ?all=1 returns array", passed,
                   f"Status: {response.status_code}, Count: {len(data.get('doctors', []))}")
        return passed, len(data.get('doctors', [])) if has_array else 0
    except Exception as e:
        print_test("Get doctors with all param", False, f"Exception: {str(e)}")
        return False, 0

def test_create_doctor_valid():
    """Test 15: POST /api/doctors with valid data"""
    print("\n" + "="*60)
    print("TEST 15: Create Doctor (Valid Data)")
    print("="*60)
    try:
        payload = {
            "name": "Dr. Test Kumar",
            "title": "M.D., Ph.D.",
            "specialization": "Sports Medicine",
            "experience": "8+ years",
            "photo": "",
            "active": True,
            "order": 10
        }
        response = requests.post(f"{BASE_URL}/doctors", json=payload, timeout=10)
        data = response.json()
        
        has_id = 'doctor' in data and 'id' in data['doctor']
        has_success = data.get('success') == True
        is_active = 'doctor' in data and data['doctor'].get('active') == True
        
        passed = response.status_code == 200 and has_success and has_id and is_active
        
        print_test("Create doctor with valid data", passed,
                   f"Status: {response.status_code}, Has ID: {has_id}, Active: {is_active}, Success: {has_success}")
        
        if passed:
            return data['doctor']['id']
        return None
    except Exception as e:
        print_test("Create doctor with valid data", False, f"Exception: {str(e)}")
        return None

def test_create_doctor_missing_name():
    """Test 16: POST /api/doctors without name - should return 400"""
    print("\n" + "="*60)
    print("TEST 16: Create Doctor (Missing Name)")
    print("="*60)
    try:
        payload = {
            "title": "M.D.",
            "specialization": "General Practice"
        }
        response = requests.post(f"{BASE_URL}/doctors", json=payload, timeout=10)
        data = response.json()
        
        passed = response.status_code == 400 and 'error' in data
        print_test("Create doctor without name returns 400", passed,
                   f"Status: {response.status_code}, Response: {data}")
        return passed
    except Exception as e:
        print_test("Create doctor without name", False, f"Exception: {str(e)}")
        return False

def test_disable_doctor(doctor_id):
    """Test 17: PATCH /api/doctors/{id} with active:false"""
    print("\n" + "="*60)
    print("TEST 17: Disable Doctor")
    print("="*60)
    try:
        payload = {"active": False}
        response = requests.patch(f"{BASE_URL}/doctors/{doctor_id}", json=payload, timeout=10)
        data = response.json()
        
        passed = response.status_code == 200 and data.get('success') == True
        print_test("Disable doctor", passed,
                   f"Status: {response.status_code}, Response: {data}")
        return passed
    except Exception as e:
        print_test("Disable doctor", False, f"Exception: {str(e)}")
        return False

def test_verify_disabled_doctor_not_in_default_list(doctor_id):
    """Test 18: Verify disabled doctor NOT in GET /api/doctors"""
    print("\n" + "="*60)
    print("TEST 18: Verify Disabled Doctor Not in Default List")
    print("="*60)
    try:
        response = requests.get(f"{BASE_URL}/doctors", timeout=10)
        data = response.json()
        
        has_array = 'doctors' in data and isinstance(data['doctors'], list)
        not_found = True
        if has_array:
            not_found = not any(doc.get('id') == doctor_id for doc in data['doctors'])
        
        passed = response.status_code == 200 and has_array and not_found
        print_test("Disabled doctor not in default list", passed,
                   f"Status: {response.status_code}, Doctor not found: {not_found}")
        return passed
    except Exception as e:
        print_test("Verify disabled doctor not in list", False, f"Exception: {str(e)}")
        return False

def test_verify_disabled_doctor_in_all_list(doctor_id):
    """Test 19: Verify disabled doctor IS in GET /api/doctors?all=1"""
    print("\n" + "="*60)
    print("TEST 19: Verify Disabled Doctor in All List")
    print("="*60)
    try:
        response = requests.get(f"{BASE_URL}/doctors?all=1", timeout=10)
        data = response.json()
        
        has_array = 'doctors' in data and isinstance(data['doctors'], list)
        found = False
        if has_array:
            found = any(doc.get('id') == doctor_id for doc in data['doctors'])
        
        passed = response.status_code == 200 and has_array and found
        print_test("Disabled doctor in all list", passed,
                   f"Status: {response.status_code}, Doctor found: {found}")
        return passed
    except Exception as e:
        print_test("Verify disabled doctor in all list", False, f"Exception: {str(e)}")
        return False

def test_update_doctor_fields(doctor_id):
    """Test 20: PATCH /api/doctors/{id} with name and specialization update"""
    print("\n" + "="*60)
    print("TEST 20: Update Doctor Fields")
    print("="*60)
    try:
        payload = {
            "name": "Dr. Updated Name",
            "specialization": "New Specialization"
        }
        response = requests.patch(f"{BASE_URL}/doctors/{doctor_id}", json=payload, timeout=10)
        data = response.json()
        
        update_passed = response.status_code == 200 and data.get('success') == True
        
        # Verify the update persisted
        response_all = requests.get(f"{BASE_URL}/doctors?all=1", timeout=10)
        data_all = response_all.json()
        
        doctor = next((d for d in data_all.get('doctors', []) if d.get('id') == doctor_id), None)
        verified = doctor and doctor.get('name') == "Dr. Updated Name" and doctor.get('specialization') == "New Specialization"
        
        passed = update_passed and verified
        print_test("Update doctor fields and verify persistence", passed,
                   f"Status: {response.status_code}, Updated: {update_passed}, Verified: {verified}")
        return passed
    except Exception as e:
        print_test("Update doctor fields", False, f"Exception: {str(e)}")
        return False

def test_update_doctor_photo(doctor_id):
    """Test 21: PATCH /api/doctors/{id} with photo (base64)"""
    print("\n" + "="*60)
    print("TEST 21: Update Doctor Photo")
    print("="*60)
    try:
        # Small base64 encoded image (1x1 pixel PNG)
        small_base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        payload = {"photo": small_base64}
        response = requests.patch(f"{BASE_URL}/doctors/{doctor_id}", json=payload, timeout=10)
        data = response.json()
        
        update_passed = response.status_code == 200 and data.get('success') == True
        
        # Verify photo stored
        response_all = requests.get(f"{BASE_URL}/doctors?all=1", timeout=10)
        data_all = response_all.json()
        
        doctor = next((d for d in data_all.get('doctors', []) if d.get('id') == doctor_id), None)
        verified = doctor and doctor.get('photo') == small_base64
        
        passed = update_passed and verified
        print_test("Update doctor photo and verify storage", passed,
                   f"Status: {response.status_code}, Updated: {update_passed}, Verified: {verified}")
        return passed
    except Exception as e:
        print_test("Update doctor photo", False, f"Exception: {str(e)}")
        return False

def test_delete_doctor(doctor_id):
    """Test 22: DELETE /api/doctors/{id}"""
    print("\n" + "="*60)
    print("TEST 22: Delete Doctor")
    print("="*60)
    try:
        response = requests.delete(f"{BASE_URL}/doctors/{doctor_id}", timeout=10)
        data = response.json()
        
        delete_passed = response.status_code == 200 and data.get('success') == True
        
        # Verify deletion
        response_all = requests.get(f"{BASE_URL}/doctors?all=1", timeout=10)
        data_all = response_all.json()
        
        not_found = not any(d.get('id') == doctor_id for d in data_all.get('doctors', []))
        
        passed = delete_passed and not_found
        print_test("Delete doctor and verify removal", passed,
                   f"Status: {response.status_code}, Deleted: {delete_passed}, Not found: {not_found}")
        return passed
    except Exception as e:
        print_test("Delete doctor", False, f"Exception: {str(e)}")
        return False

def cleanup_test_doctors():
    """Cleanup any test doctors created during testing"""
    print("\n" + "="*60)
    print("CLEANUP: Removing Test Doctors")
    print("="*60)
    try:
        response = requests.get(f"{BASE_URL}/doctors?all=1", timeout=10)
        data = response.json()
        
        if 'doctors' in data:
            for doctor in data['doctors']:
                if doctor.get('name', '').startswith('Dr. Test') or doctor.get('name') == 'Dr. Updated Name':
                    doctor_id = doctor.get('id')
                    del_response = requests.delete(f"{BASE_URL}/doctors/{doctor_id}", timeout=10)
                    print(f"  Deleted test doctor: {doctor.get('name')} (ID: {doctor_id})")
        
        print("  Cleanup completed")
        return True
    except Exception as e:
        print(f"  Cleanup failed: {str(e)}")
        return False

def main():
    print("\n" + "="*60)
    print("PHYSIOTHERAPY CLINIC BACKEND API TEST SUITE")
    print("="*60)
    print(f"Base URL: {BASE_URL}")
    print("="*60)
    
    results = {}
    
    # ========== REGRESSION TESTS (Existing Endpoints) ==========
    print("\n" + "="*60)
    print("REGRESSION TESTS - Existing Endpoints")
    print("="*60)
    
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
    
    # Test 12: Admin stats (now includes activeDoctors)
    results['admin_stats'] = test_admin_stats()
    
    # ========== NEW DOCTOR MANAGEMENT TESTS ==========
    print("\n" + "="*60)
    print("NEW TESTS - Doctor Management Endpoints")
    print("="*60)
    
    # Test 13: Get default seeded doctors
    results['get_doctors_default'] = test_get_doctors_default_seeded()
    
    # Test 14: Get doctors with all param
    all_result, initial_count = test_get_doctors_with_all_param()
    results['get_doctors_all'] = all_result
    
    # Test 15: Create doctor with valid data
    doctor_id = test_create_doctor_valid()
    results['create_doctor_valid'] = doctor_id is not None
    
    # Test 16: Create doctor without name (should fail)
    results['create_doctor_no_name'] = test_create_doctor_missing_name()
    
    # Test 17-19: Disable doctor and verify visibility
    if doctor_id:
        results['disable_doctor'] = test_disable_doctor(doctor_id)
        results['disabled_not_in_default'] = test_verify_disabled_doctor_not_in_default_list(doctor_id)
        results['disabled_in_all'] = test_verify_disabled_doctor_in_all_list(doctor_id)
        
        # Test 20: Update doctor fields
        results['update_doctor_fields'] = test_update_doctor_fields(doctor_id)
        
        # Test 21: Update doctor photo
        results['update_doctor_photo'] = test_update_doctor_photo(doctor_id)
        
        # Test 22: Delete doctor
        results['delete_doctor'] = test_delete_doctor(doctor_id)
    else:
        results['disable_doctor'] = False
        results['disabled_not_in_default'] = False
        results['disabled_in_all'] = False
        results['update_doctor_fields'] = False
        results['update_doctor_photo'] = False
        results['delete_doctor'] = False
        print("\n❌ SKIP: Doctor tests (no doctor ID)")
    
    # Cleanup any remaining test doctors
    cleanup_test_doctors()
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    print(f"\nTotal: {passed}/{total} tests passed")
    
    print("\n" + "="*60)
    print("REGRESSION TESTS (Existing Endpoints):")
    print("="*60)
    regression_tests = ['health', 'create_appointment_valid', 'create_appointment_invalid', 
                        'get_appointments', 'update_appointment', 'create_home_visit', 
                        'get_home_visits', 'update_home_visit', 'create_contact', 
                        'get_contacts', 'update_contact', 'admin_login_wrong', 
                        'admin_login_correct', 'admin_stats']
    for test_name in regression_tests:
        if test_name in results:
            status = "✅ PASS" if results[test_name] else "❌ FAIL"
            print(f"  {status}: {test_name}")
    
    print("\n" + "="*60)
    print("NEW DOCTOR MANAGEMENT TESTS:")
    print("="*60)
    doctor_tests = ['get_doctors_default', 'get_doctors_all', 'create_doctor_valid', 
                    'create_doctor_no_name', 'disable_doctor', 'disabled_not_in_default', 
                    'disabled_in_all', 'update_doctor_fields', 'update_doctor_photo', 
                    'delete_doctor']
    for test_name in doctor_tests:
        if test_name in results:
            status = "✅ PASS" if results[test_name] else "❌ FAIL"
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
