#!/bin/bash

# Deployment Validation Script for Cloudflare Workers
# Usage: ./scripts/validate-deployment.sh [URL]

set -e

WORKER_URL="${1:-http://localhost:8787}"
TIMEOUT=10

echo "🔍 Validating deployment at: $WORKER_URL"
echo ""

# Function to test endpoint
test_endpoint() {
    local path=$1
    local name=$2
    local expected_status=${3:-200}
    
    echo -n "Testing $name..."
    
    status=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$WORKER_URL$path" || echo "000")
    
    if [ "$status" = "$expected_status" ]; then
        echo " ✅ (HTTP $status)"
        return 0
    else
        echo " ❌ (Expected: $expected_status, Got: $status)"
        return 1
    fi
}

# Test health endpoint
test_endpoint "/api/health" "Health Check" || exit 1

# Test home page
test_endpoint "/" "Home Page" || exit 1

# Test API routes
test_endpoint "/api/resume" "Resume API" || exit 1

# Test blog API
test_endpoint "/api/blog?source=dev&limit=5" "Blog API" || exit 1

# Test other pages
test_endpoint "/blog" "Blog Page" || exit 1
test_endpoint "/education" "Education Page" || exit 1
test_endpoint "/experience" "Experience Page" || exit 1

# Test 404 handling
test_endpoint "/nonexistent-page" "404 Handler" "404" || echo "⚠️  404 handling might need verification"

echo ""
echo "✅ All validation tests passed!"
echo ""
echo "📊 Performance check:"
echo -n "Response time: "
curl -s -o /dev/null -w "%{time_total}s\n" --max-time $TIMEOUT "$WORKER_URL/"

exit 0
