from typing import Iterable, Dict, Any, List, Optional
import re

def require_fields(data: Dict[str, Any], fields: Iterable[str]) -> List[str]:
    return [f for f in fields if not data.get(f)]

def is_valid_email(email: str) -> bool:
    """Validate email format"""
    if not email or not isinstance(email, str):
        return False
    email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    return bool(re.match(email_regex, email))

def is_valid_phone(phone: Optional[str]) -> bool:
    """Validate phone format - optional but must be valid if provided"""
    if not phone:
        return True  # Phone is optional
    if not isinstance(phone, str):
        return False
    # Allow various phone formats
    phone_regex = r'^[\d\s\-\(\)\+\.]+$'
    digits_only = re.sub(r'\D', '', phone)
    return bool(re.match(phone_regex, phone)) and 10 <= len(digits_only) <= 15

def validate_contact_data(data: Dict[str, Any], is_update: bool = False) -> Optional[str]:
    """
    Validate contact data for create/update operations.
    Returns error message if validation fails, None if valid.
    """
    # Validate firstName
    if "firstName" in data:
        first_name = data["firstName"]
        if not isinstance(first_name, str) or not first_name.strip():
            return "First name is required and must be a non-empty string"
        if len(first_name) > 60:
            return "First name must be 60 characters or less"
    elif not is_update:
        return "First name is required"
    
    # Validate lastName
    if "lastName" in data:
        last_name = data["lastName"]
        if not isinstance(last_name, str) or not last_name.strip():
            return "Last name is required and must be a non-empty string"
        if len(last_name) > 60:
            return "Last name must be 60 characters or less"
    elif not is_update:
        return "Last name is required"
    
    # Validate phone
    if "phone" in data:
        phone = data["phone"]
        if phone and not is_valid_phone(phone):
            return "Invalid phone number format (must be 10-15 digits)"
    
    # Validate emails
    if "emails" in data:
        emails = data["emails"]
        if not isinstance(emails, list):
            return "Emails must be a list"
        if not emails:
            return "At least one email is required"
        
        seen_emails = set()
        for email in emails:
            if not isinstance(email, str):
                return "Each email must be a string"
            email_lower = email.strip().lower()
            if not email_lower:
                return "Email addresses cannot be empty"
            if not is_valid_email(email_lower):
                return f"Invalid email format: {email}"
            if email_lower in seen_emails:
                return f"Duplicate email found: {email}"
            seen_emails.add(email_lower)
    elif not is_update:
        return "Emails are required"
    
    return None
