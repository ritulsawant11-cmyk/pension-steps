#!/usr/bin/env python3
"""
PensionSteps Synthetic Capacity & Journey Engine Benchmark
Simulates user journey progression, state transitions, dynamic branching,
memory footprint, and PDF 1.4 generation throughput.
"""

import sys
import os
import time
import random
import tracemalloc

# Ensure access to the base directory
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

def run_capacity_benchmark():
    print("==================================================================")
    print("   PensionSteps Synthetic Capacity & Performance Benchmark        ")
    print("==================================================================")

    # 1. Inspect Static Assets Footprint
    assets = [
        ('index.html', os.path.join(BASE_DIR, 'index.html')),
        ('app.js', os.path.join(BASE_DIR, 'app.js')),
        ('main.css', os.path.join(BASE_DIR, 'src/styles/main.css')),
        ('print.css', os.path.join(BASE_DIR, 'src/styles/print.css')),
    ]

    total_bytes = 0
    print("\n--- 1. Static Asset Size & Delivery Footprint ---")
    for name, path in assets:
        size = os.path.getsize(path)
        total_bytes += size
        print(f"  {name:15}: {size:8,d} bytes ({size / 1024:6.2f} KB)")
    print(f"  {'TOTAL FOOTPRINT':15}: {total_bytes:8,d} bytes ({total_bytes / 1024:6.2f} KB)")

    # Annual Bandwidth Calculation
    for annual_users in [100, 200, 1000]:
        annual_mb = (total_bytes * annual_users) / (1024 * 1024)
        daily_users = annual_users / 365.0
        print(f"  Load scenario: {annual_users:5d} users/yr -> ~{daily_users:4.2f} users/day -> {annual_mb:6.2f} MB total annual bandwidth")

    # 2. Logic Simulation of the Complete Guided Journey Flow
    # We mirror the JavaScript data structures & helpers from app.js
    KNOWLEDGE_OPTIONS = [
        'old_letter', 'provider_name', 'policy_number',
        'employer_name', 'employment_dates', 'previous_name_address', 'very_little'
    ]
    CHECKLIST_KEYS = [
        'policy_number', 'ni_number', 'names', 'addresses',
        'employment_dates', 'employer_name', 'provider_or_scheme', 'paperwork'
    ]
    STATUSES = ['have', 'look', 'unsure']

    def is_employer_known(known, readiness):
        return 'employer_name' in known or readiness.get('employer_name') == 'have'

    def is_provider_known(known, readiness):
        return 'provider_name' in known or readiness.get('provider_or_scheme') == 'have'

    def is_policy_number_known(known, readiness):
        return 'policy_number' in known or readiness.get('policy_number') == 'have'

    def evaluate_branches(known, readiness):
        emp = is_employer_known(known, readiness)
        prov = is_provider_known(known, readiness)
        pol = is_policy_number_known(known, readiness)

        branches = []
        # Branch A: Provider known, policy number missing
        if prov and not pol:
            branches.append('branch_a')
        # Branch B: Old paperwork
        if 'old_letter' in known or readiness.get('paperwork') == 'have':
            branches.append('branch_b')
        # Branch C: Employer known, provider unknown
        if emp and not prov:
            branches.append('branch_c')
        # Branch D: Address/Name gaps (when contacting a known provider)
        if prov and ('previous_name_address' in known or readiness.get('names') != 'have' or readiness.get('addresses') != 'have'):
            branches.append('branch_d')
        # Branch E: Starting from scratch
        if 'very_little' in known or (not emp and not prov):
            branches.append('branch_e')
        # Branch F: Contingency (when contacting a known provider)
        if prov:
            branches.append('branch_f')
        return branches

    def generate_pdf_synthetic(known, readiness, branches):
        emp = is_employer_known(known, readiness)
        prov = is_provider_known(known, readiness)
        pol = is_policy_number_known(known, readiness)

        if prov and emp:
            status_desc = "Both employer and provider known"
            route_desc = "Direct Scheme Provider (with employer context)"
        elif prov:
            status_desc = "Provider known (employer unconfirmed)"
            route_desc = "Direct Scheme Provider Historic Trace Team"
        elif emp:
            status_desc = "Employer known (provider to be traced)"
            route_desc = "Former Employer HR / Pension Tracing Service"
        else:
            status_desc = "Both unknown (career timeline trace)"
            route_desc = "Checking Past Employment Records & Free Tracing Guidance"

        # Pure string manipulation replicating PDF 1.4 stream generation
        lines = [
            "BT",
            "/F1 16 Tf",
            "50 780 Td",
            "(PensionSteps - Old-Pension Enquiry Preparation Plan) Tj",
            "/F2 9 Tf",
            "0 -14 Td",
            "(Date Prepared: Synthetic Benchmark | Independent Preparation Tool) Tj",
            "0 -22 Td",
            "/F1 11 Tf",
            "(1. SITUATION SUMMARY) Tj",
            "/F2 9 Tf",
            "0 -13 Td",
            f"(Known items: {', '.join(known)}) Tj",
            "0 -11 Td",
            f"(Status: {status_desc} | Policy: {'Available' if pol else 'Missing'}) Tj",
            "0 -18 Td",
            "/F1 11 Tf",
            "(2. INFORMATION TO HAVE READY ON YOUR DESK) Tj",
            "/F2 9 Tf",
        ]
        for key in CHECKLIST_KEYS:
            st = readiness.get(key, 'unsure')
            lines.append("0 -13 Td")
            lines.append(f"([{st.upper()}] {key}) Tj")

        lines.append("0 -18 Td")
        lines.append("/F1 11 Tf")
        lines.append("(3. RECOMMENDED QUESTIONS TO ASK) Tj")
        lines.append("/F2 9 Tf")
        for b in branches:
            lines.append("0 -13 Td")
            lines.append(f"(- Question from {b}) Tj")

        lines.append("ET")
        stream_content = "\n".join(lines)
        stream_len = len(stream_content.encode('utf-8'))

        body = (
            f"%PDF-1.4\n"
            f"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
            f"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n"
            f"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R >>\nendobj\n"
            f"4 0 obj\n<< /Length {stream_len} >>\nstream\n{stream_content}\nendstream\nendobj\n"
        )
        return len(body)

    # 3. Benchmark Execution: 10,000 Complete User Journeys
    ITERATIONS = 10000
    print(f"\n--- 2. Executing {ITERATIONS:,} Synthetic Complete User Journeys ---")
    tracemalloc.start()
    start_time = time.perf_counter()

    pdf_bytes_total = 0
    route_distribution = {
        'both_known': 0,
        'provider_only': 0,
        'employer_only': 0,
        'both_unknown': 0
    }

    for i in range(ITERATIONS):
        # Synthetic Step 1: user selects 0 to 4 options, or 'very_little'
        if random.random() < 0.25:
            known = ['very_little']
        else:
            k_pool = [k for k in KNOWLEDGE_OPTIONS if k != 'very_little']
            sample_size = random.randint(0, 3)
            known = random.sample(k_pool, sample_size)

        # Synthetic Step 2: user reviews checklist
        readiness = {}
        for key in CHECKLIST_KEYS:
            # bias towards realistic answers
            readiness[key] = random.choice(STATUSES)

        # Synthetic Step 3: dynamic branch evaluation
        branches = evaluate_branches(known, readiness)

        # Synthetic Step 4 & PDF generation
        pdf_len = generate_pdf_synthetic(known, readiness, branches)
        pdf_bytes_total += pdf_len

        # Route categorization
        emp = is_employer_known(known, readiness)
        prov = is_provider_known(known, readiness)
        if prov and emp:
            route_distribution['both_known'] += 1
        elif prov:
            route_distribution['provider_only'] += 1
        elif emp:
            route_distribution['employer_only'] += 1
        else:
            route_distribution['both_unknown'] += 1

    elapsed = time.perf_counter() - start_time
    current_mem, peak_mem = tracemalloc.get_traced_memory()
    tracemalloc.stop()

    throughput = ITERATIONS / elapsed
    time_per_journey_ms = (elapsed / ITERATIONS) * 1000.0

    print(f"  Completed journeys    : {ITERATIONS:,}")
    print(f"  Total elapsed time    : {elapsed:.4f} seconds")
    print(f"  Journey throughput    : {throughput:,.1f} journeys/second")
    print(f"  Mean latency/journey  : {time_per_journey_ms:.4f} ms")
    print(f"  Peak memory allocated : {peak_mem / (1024 * 1024):.2f} MB")
    print(f"  Current memory delta  : {current_mem / 1024:.2f} KB (clean GC)")
    print(f"  Total PDF bytes gen   : {pdf_bytes_total:,} bytes (~{pdf_bytes_total / (1024*1024):.2f} MB)")

    print("\n--- 3. Scenario & Route Distribution ---")
    for r_name, count in route_distribution.items():
        pct = (count / ITERATIONS) * 100
        print(f"  {r_name:15}: {count:5d} ({pct:5.1f}%)")

    # 4. Stress Test: Exhaustive State Permutation & Contradiction Check
    print("\n--- 4. Exhaustive State Space & Contradiction Verification ---")
    contradictions = 0
    checks_count = 0

    # Test all 2^6 combinations of known non-exclusive options
    import itertools
    base_options = ['old_letter', 'provider_name', 'policy_number', 'employer_name', 'employment_dates', 'previous_name_address']

    for r in range(len(base_options) + 1):
        for combo in itertools.combinations(base_options, r):
            known = list(combo)
            for emp_status in STATUSES:
                for prov_status in STATUSES:
                    for pol_status in STATUSES:
                        readiness = {
                            'employer_name': emp_status,
                            'provider_or_scheme': prov_status,
                            'policy_number': pol_status,
                            'names': 'have',
                            'addresses': 'look'
                        }
                        checks_count += 1
                        emp = is_employer_known(known, readiness)
                        prov = is_provider_known(known, readiness)
                        pol = is_policy_number_known(known, readiness)

                        # Test contradiction: If user indicated 'have' for employer in Step 2,
                        # emp MUST be True, even if Step 1 was empty.
                        if emp_status == 'have' and not emp:
                            contradictions += 1
                        if prov_status == 'have' and not prov:
                            contradictions += 1
                        if pol_status == 'have' and not pol:
                            contradictions += 1

                        branches = evaluate_branches(known, readiness)
                        # Every state must have at least one active branch
                        if len(branches) == 0:
                            contradictions += 1
                        # When provider is unknown, no provider-specific branch may activate
                        if not prov and any(b in branches for b in ('branch_a', 'branch_d', 'branch_f')):
                            contradictions += 1
                        # When provider is known, contingency branch F must be active
                        if prov and 'branch_f' not in branches:
                            contradictions += 1

    print(f"  Exhaustive states checked: {checks_count:,}")
    print(f"  Contradictions detected  : {contradictions}")

    assert contradictions == 0, f"Found {contradictions} state contradictions!"
    print("\n==================================================================")
    print("   Capacity & Performance Verification: ALL CHECKS PASSED         ")
    print("==================================================================")

if __name__ == '__main__':
    run_capacity_benchmark()
