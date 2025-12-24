#!/bin/bash
#
# SD Contractor Lead Generation Orchestrator
# Handles lead import, enrichment, and outreach automation
#
# Usage: ./run_autonomy.sh [--dry-run]
#

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATA_DIR="${SCRIPT_DIR}/data"
LOGS_DIR="${SCRIPT_DIR}/logs"
SCRIPTS_DIR="${SCRIPT_DIR}/scripts"

# Timestamp for logging
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
LOG_FILE="${LOGS_DIR}/orchestrator_${TIMESTAMP}.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    echo -e "${timestamp} [${level}] ${message}" | tee -a "${LOG_FILE}"
}

info() { log "INFO" "${BLUE}$@${NC}"; }
success() { log "SUCCESS" "${GREEN}$@${NC}"; }
warn() { log "WARN" "${YELLOW}$@${NC}"; }
error() { log "ERROR" "${RED}$@${NC}"; }

# Header
print_header() {
    echo ""
    echo "========================================================"
    echo "  SD Contractor Lead Generation Orchestrator"
    echo "  Started: $(date)"
    echo "========================================================"
    echo ""
}

# Phase 1: Lead Import
phase_import() {
    info "PHASE 1: Lead Import"
    info "----------------------------------------"
    
    if [ -f "${DATA_DIR}/leads_raw.csv" ]; then
        local count=$(tail -n +2 "${DATA_DIR}/leads_raw.csv" | wc -l)
        success "Found ${count} raw leads in leads_raw.csv"
    else
        warn "No raw leads file found. Please run lead scraping first."
        return 1
    fi
    
    echo ""
}

# Phase 2: Lead Enrichment
phase_enrich() {
    info "PHASE 2: Lead Enrichment"
    info "----------------------------------------"
    
    if [ -f "${SCRIPTS_DIR}/enrich_leads.py" ]; then
        python3 "${SCRIPTS_DIR}/enrich_leads.py" 2>&1 | tee -a "${LOG_FILE}"
        
        if [ -f "${DATA_DIR}/leads_enriched.csv" ]; then
            local count=$(tail -n +2 "${DATA_DIR}/leads_enriched.csv" | wc -l)
            success "Enriched ${count} leads successfully"
        fi
    else
        error "Enrichment script not found"
        return 1
    fi
    
    echo ""
}

# Phase 3: Outreach Preparation
phase_outreach() {
    info "PHASE 3: Outreach Preparation"
    info "----------------------------------------"
    
    local dry_run=${1:-true}
    
    if [ -f "${SCRIPTS_DIR}/outreach.py" ]; then
        if [ "$dry_run" = "true" ]; then
            info "Running in DRY RUN mode (no emails will be sent)"
        fi
        
        python3 "${SCRIPTS_DIR}/outreach.py" 2>&1 | tee -a "${LOG_FILE}"
        success "Outreach preparation complete"
    else
        error "Outreach script not found"
        return 1
    fi
    
    echo ""
}

# Generate Summary Report
generate_report() {
    info "Generating Summary Report"
    info "----------------------------------------"
    
    local report_file="${DATA_DIR}/orchestrator_report_${TIMESTAMP}.md"
    
    cat > "${report_file}" << EOF
# SD Contractor Lead Generation Report

**Generated:** $(date)
**Run ID:** ${TIMESTAMP}

## Summary

### Lead Statistics
EOF

    if [ -f "${DATA_DIR}/leads_raw.csv" ]; then
        local raw_count=$(tail -n +2 "${DATA_DIR}/leads_raw.csv" | wc -l)
        echo "- **Raw Leads Imported:** ${raw_count}" >> "${report_file}"
    fi
    
    if [ -f "${DATA_DIR}/leads_enriched.csv" ]; then
        local enriched_count=$(tail -n +2 "${DATA_DIR}/leads_enriched.csv" | wc -l)
        echo "- **Leads Enriched:** ${enriched_count}" >> "${report_file}"
        
        echo "" >> "${report_file}"
        echo "### Leads by Category" >> "${report_file}"
        echo "" >> "${report_file}"
        
        # Count by category
        tail -n +2 "${DATA_DIR}/leads_enriched.csv" | cut -d',' -f8 | sort | uniq -c | while read count category; do
            echo "- ${category}: ${count}" >> "${report_file}"
        done
        
        echo "" >> "${report_file}"
        echo "### Leads by Source" >> "${report_file}"
        echo "" >> "${report_file}"
        
        # Count by source
        tail -n +2 "${DATA_DIR}/leads_enriched.csv" | cut -d',' -f9 | sort | uniq -c | while read count source; do
            echo "- ${source}: ${count}" >> "${report_file}"
        done
    fi
    
    cat >> "${report_file}" << EOF

## Next Steps

1. Review enriched leads in \`data/leads_enriched.csv\`
2. Verify email addresses before sending outreach
3. Run outreach script with \`--send\` flag when ready
4. Monitor responses and update lead status

## Files Generated

- Raw Leads: \`data/leads_raw.csv\`
- Enriched Leads: \`data/leads_enriched.csv\`
- Log File: \`logs/orchestrator_${TIMESTAMP}.log\`
- This Report: \`data/orchestrator_report_${TIMESTAMP}.md\`
EOF

    success "Report saved to: ${report_file}"
    echo ""
    cat "${report_file}"
}

# Main execution
main() {
    print_header
    
    # Ensure directories exist
    mkdir -p "${DATA_DIR}" "${LOGS_DIR}" "${SCRIPTS_DIR}"
    
    # Initialize log
    echo "Orchestrator started at $(date)" > "${LOG_FILE}"
    
    # Parse arguments
    DRY_RUN=true
    for arg in "$@"; do
        case $arg in
            --send)
                DRY_RUN=false
                warn "LIVE MODE: Emails will be sent!"
                ;;
            --dry-run)
                DRY_RUN=true
                ;;
        esac
    done
    
    # Execute phases
    phase_import || { error "Import phase failed"; exit 1; }
    phase_enrich || { error "Enrichment phase failed"; exit 1; }
    phase_outreach $DRY_RUN || { error "Outreach phase failed"; exit 1; }
    
    # Generate report
    generate_report
    
    echo ""
    success "========================================================"
    success "  Orchestrator completed successfully!"
    success "  Log file: ${LOG_FILE}"
    success "========================================================"
    echo ""
}

# Run main
main "$@"
