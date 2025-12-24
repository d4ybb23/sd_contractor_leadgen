#!/usr/bin/env python3
"""
Outreach Module
Handles email outreach to enriched contractor leads
"""

import csv
import json
import os
import subprocess
from datetime import datetime

# Email templates
OUTREACH_TEMPLATES = {
    "initial": {
        "subject": "Partnership Opportunity for {company_name}",
        "body": """Hi there,

I came across {company_name} while researching top contractors in the San Diego area, and I was impressed by your work.

I'm reaching out because I believe there may be an opportunity for us to work together. We help contractors like yourself streamline operations and grow their business through innovative solutions.

Would you be open to a brief 15-minute call this week to explore if there's a fit?

Looking forward to connecting.

Best regards"""
    },
    "follow_up": {
        "subject": "Following up - {company_name}",
        "body": """Hi,

I wanted to follow up on my previous email regarding a potential partnership opportunity.

I understand you're busy running {company_name}, but I believe a quick conversation could be valuable for both of us.

Would you have 10 minutes this week for a brief call?

Best regards"""
    }
}

def load_enriched_leads(filepath):
    """Load enriched leads from CSV"""
    leads = []
    with open(filepath, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            leads.append(row)
    return leads

def prepare_outreach_batch(leads, template_type="initial", max_batch=10):
    """Prepare a batch of outreach emails"""
    template = OUTREACH_TEMPLATES.get(template_type, OUTREACH_TEMPLATES["initial"])
    
    # Filter leads that are pending outreach
    pending_leads = [l for l in leads if l.get('outreach_status') == 'pending'][:max_batch]
    
    messages = []
    for lead in pending_leads:
        company_name = lead.get('company_name', 'your company')
        email = lead.get('email_guess', '')
        
        if not email or '@' not in email:
            continue
            
        message = {
            "to": [email],
            "subject": template["subject"].format(company_name=company_name),
            "content": template["body"].format(company_name=company_name)
        }
        messages.append({
            "lead": lead,
            "message": message
        })
    
    return messages

def send_outreach_via_mcp(messages, dry_run=True):
    """Send outreach emails via Gmail MCP"""
    results = []
    
    if dry_run:
        print(f"\n[DRY RUN] Would send {len(messages)} emails:")
        for msg in messages:
            print(f"  - To: {msg['message']['to'][0]}")
            print(f"    Subject: {msg['message']['subject']}")
        return results
    
    # Prepare messages for MCP
    mcp_messages = [m['message'] for m in messages]
    
    # Build MCP command
    mcp_input = json.dumps({"messages": mcp_messages})
    cmd = f"manus-mcp-cli tool call gmail_send_messages --server gmail --input '{mcp_input}'"
    
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=60)
        if result.returncode == 0:
            print(f"Successfully sent {len(messages)} outreach emails")
            results = [{"status": "sent", "lead": m['lead']} for m in messages]
        else:
            print(f"Error sending emails: {result.stderr}")
            results = [{"status": "failed", "lead": m['lead'], "error": result.stderr} for m in messages]
    except Exception as e:
        print(f"Exception during send: {e}")
        results = [{"status": "failed", "lead": m['lead'], "error": str(e)} for m in messages]
    
    return results

def update_outreach_status(leads_file, sent_leads):
    """Update the status of leads that received outreach"""
    # Read all leads
    all_leads = []
    with open(leads_file, 'r') as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        for row in reader:
            all_leads.append(row)
    
    # Update status for sent leads
    sent_companies = {l['lead']['company_name'] for l in sent_leads if l['status'] == 'sent'}
    
    for lead in all_leads:
        if lead['company_name'] in sent_companies:
            lead['outreach_status'] = 'contacted'
            lead['outreach_date'] = datetime.now().strftime('%Y-%m-%d')
    
    # Write back
    with open(leads_file, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=list(all_leads[0].keys()))
        writer.writeheader()
        writer.writerows(all_leads)

def generate_outreach_report(leads):
    """Generate a summary report of outreach status"""
    total = len(leads)
    pending = sum(1 for l in leads if l.get('outreach_status') == 'pending')
    contacted = sum(1 for l in leads if l.get('outreach_status') == 'contacted')
    responded = sum(1 for l in leads if l.get('outreach_status') == 'responded')
    
    report = f"""
=====================================
OUTREACH STATUS REPORT
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
=====================================

Total Leads: {total}
Pending Outreach: {pending}
Contacted: {contacted}
Responded: {responded}

Conversion Rate: {(responded/contacted*100 if contacted > 0 else 0):.1f}%
=====================================
"""
    return report

if __name__ == "__main__":
    leads_file = "/home/ubuntu/sd_contractor_leadgen/data/leads_enriched.csv"
    
    # Load leads
    leads = load_enriched_leads(leads_file)
    print(f"Loaded {len(leads)} enriched leads")
    
    # Prepare outreach batch
    batch = prepare_outreach_batch(leads, template_type="initial", max_batch=5)
    print(f"Prepared {len(batch)} emails for outreach")
    
    # Dry run by default
    results = send_outreach_via_mcp(batch, dry_run=True)
    
    # Generate report
    report = generate_outreach_report(leads)
    print(report)
