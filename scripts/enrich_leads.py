#!/usr/bin/env python3
"""
Lead Enrichment Module
Enriches contractor leads with additional business information
"""

import csv
import json
import os
import re
from datetime import datetime

def clean_phone(phone):
    """Standardize phone number format"""
    if not phone:
        return ""
    # Remove all non-numeric characters
    digits = re.sub(r'\D', '', phone)
    if len(digits) == 10:
        return f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"
    elif len(digits) == 11 and digits[0] == '1':
        return f"({digits[1:4]}) {digits[4:7]}-{digits[7:]}"
    return phone

def generate_email_guess(company_name, domain=None):
    """Generate likely email addresses for outreach"""
    if not company_name:
        return ""
    
    # Clean company name for email generation
    clean_name = company_name.lower()
    clean_name = re.sub(r'[,.]', '', clean_name)
    clean_name = re.sub(r'\s+(inc|llc|corp|co|company|construction|builders|group)$', '', clean_name)
    clean_name = re.sub(r'\s+', '', clean_name)
    
    if domain:
        return f"info@{domain}"
    
    # Generate domain guess
    domain_guess = clean_name[:20] + ".com"
    return f"info@{domain_guess}"

def categorize_contractor(company_name):
    """Categorize contractor by specialty"""
    name_lower = company_name.lower()
    
    if any(word in name_lower for word in ['concrete', 'foundation', 'masonry']):
        return "Concrete/Foundation"
    elif any(word in name_lower for word in ['remodel', 'design', 'build']):
        return "Design-Build/Remodeling"
    elif any(word in name_lower for word in ['modular', 'prefab']):
        return "Modular Construction"
    elif any(word in name_lower for word in ['home', 'residential', 'habitat']):
        return "Residential"
    else:
        return "General Contractor"

def enrich_leads(input_file, output_file):
    """Main enrichment function"""
    enriched_leads = []
    
    with open(input_file, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Skip empty rows
            if not row.get('company_name'):
                continue
                
            enriched = {
                'company_name': row.get('company_name', '').strip(),
                'address': row.get('address', '').strip(),
                'city': row.get('city', '').strip(),
                'state': row.get('state', '').strip(),
                'zip': row.get('zip', '').strip(),
                'phone': clean_phone(row.get('phone', '')),
                'email_guess': generate_email_guess(row.get('company_name', '')),
                'category': categorize_contractor(row.get('company_name', '')),
                'source': row.get('source', ''),
                'status': 'enriched',
                'enriched_date': datetime.now().strftime('%Y-%m-%d'),
                'outreach_status': 'pending'
            }
            enriched_leads.append(enriched)
    
    # Remove duplicates based on company name
    seen = set()
    unique_leads = []
    for lead in enriched_leads:
        name_key = lead['company_name'].lower().replace(' ', '')
        if name_key not in seen:
            seen.add(name_key)
            unique_leads.append(lead)
    
    # Write enriched leads
    if unique_leads:
        fieldnames = ['company_name', 'address', 'city', 'state', 'zip', 'phone', 
                      'email_guess', 'category', 'source', 'status', 'enriched_date', 'outreach_status']
        
        with open(output_file, 'w', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(unique_leads)
    
    return unique_leads

if __name__ == "__main__":
    input_path = "/home/ubuntu/sd_contractor_leadgen/data/leads_raw.csv"
    output_path = "/home/ubuntu/sd_contractor_leadgen/data/leads_enriched.csv"
    
    leads = enrich_leads(input_path, output_path)
    print(f"Enriched {len(leads)} leads")
    print(f"Output saved to: {output_path}")
    
    # Print summary by category
    categories = {}
    for lead in leads:
        cat = lead['category']
        categories[cat] = categories.get(cat, 0) + 1
    
    print("\nLeads by Category:")
    for cat, count in sorted(categories.items()):
        print(f"  {cat}: {count}")
