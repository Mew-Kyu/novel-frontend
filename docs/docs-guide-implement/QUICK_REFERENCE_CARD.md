# 🚀 QUICK REFERENCE CARD - Các API Mới

## 📌 In 60 Seconds

### Có 4 nhóm API mới:

```
1. 🎪 ONBOARDING (cho user mới)
   → Hỏi preferences → Lưu vào DB → Gợi ý truyện

2. 📈 USER ANALYTICS (cho mọi user)
   → Hiển thị stats → Update sau khi đọc

3. ❄️ COLD-START (cho user mới)
   → Check nếu new user → Gợi ý trending/popular

4. 📊 METRICS (cho admin)
   → Evaluate system quality
```

---

## 🎪 ONBOARDING - 3 Endpoints

| Endpoint | Method | Input | Output | Use |
|----------|--------|-------|--------|-----|
| `/api/onboarding/status` | GET | - | `{completed: bool}` | Check if done |
| `/api/onboarding/preferences` | POST | Preferences | `{completed: true}` | Save form |
| `/api/onboarding/recommendations` | GET | `?limit=10` | `[Story, ...]` | Show results |

### UI Flow:
```
Check Status
  ↓ (not completed)
Show Form (5 questions)
  ↓ (submit)
POST Preferences
  ↓ (success)
GET Recommendations
  ↓
Display Stories
```

### 5 Questions:
1. Reading frequency? (DAILY/WEEKLY/MONTHLY)
2. Prefer length? (SHORT/MEDIUM/LONG)
3. Completion or exploration? (FOCUSED/BALANCED/EXPLORATION)
4. Adventurous? (CONSERVATIVE/BALANCED/ADVENTUROUS)
5. Genres? (SELECT MULTIPLE)

---

## 📈 USER ANALYTICS - 3 Endpoints

| Endpoint | Method | Input | Output | Use |
|----------|--------|-------|--------|-----|
| `/api/user/analytics` | GET | - | Profile | Get stats |
| `/api/user/analytics/refresh` | POST | - | Profile | Update |
| `/api/user/analytics/refresh-embedding` | POST | - | - | Update embedding |

### 6 Metrics to Display:
```
📚 Stories Read         25
📖 Chapters Read        450
✅ Completion Rate      75%
⚡ Reading Velocity     32 ch/week
⏱️ Session Duration    45 min
🎨 Genre Diversity      68%
```

### UI Flow:
```
GET /api/user/analytics
  ↓
Display 6 Metric Cards
  ↓ (user reads story)
POST /api/user/analytics/refresh
  ↓ (optional, auto-update)
Refresh Display
```

---

## ❄️ COLD-START - 2 Endpoints

| Endpoint | Method | Input | Output | Use |
|----------|--------|-------|--------|-----|
| `/api/recommendations/cold-start/check` | GET | - | `{isColdStart, strategy}` | Check status |
| `/api/recommendations/cold-start` | GET | `?limit=10` | `[Story, ...]` | Get recs |

### Strategies:
- **NEW_USER**: Trending + popular (high quality)
- **NEW_ITEM**: Recent + high-rated (discovery)

### UI Flow:
```
GET /cold-start/check
  ↓ (true = new user)
GET /cold-start/recommendations
  ↓
Show Banner "Welcome! Here are trending stories"
  ↓
Display Story Cards with strategy badge
```

---

## 📊 METRICS - 4 Endpoints (ADMIN ONLY)

| Endpoint | Method | Input | Output | Use |
|----------|--------|-------|--------|-----|
| `/api/recommendations/metrics/user/{id}` | GET | `?k=10` | Metrics | 1 user |
| `/api/recommendations/metrics/aggregate` | GET | `?userIds=1,2,3&k=10` | Metrics | Many users |
| `/api/recommendations/metrics/evaluate-system` | POST | `?maxUsers=100` | Report | Full eval |
| `/api/recommendations/metrics/evaluate-system/summary` | GET | `?maxUsers=50` | Text | Summary |

### 8 Metrics:
```
Precision@10     68%  → % recommendations user liked
Recall@10        62%  → % liked items recommended
F1 Score         65%  → Harmonic mean
MAP              70%  → Mean average precision
NDCG             76%  → Ranking quality
MRR              82%  → Mean reciprocal rank
Coverage         38%  → % catalog covered
Diversity        63%  → How different recs are
```

### UI Flow:
```
Admin Dashboard
  ↓ (input filters)
GET /metrics/aggregate
  ↓
Display Charts & Tables
  ↓ (heavy operation)
POST /evaluate-system
  ↓
Show Report
```

---

## 🎯 COMPONENT CHECKLIST

### Week 1: ONBOARDING
- [ ] OnboardingForm.jsx (5-step form)
- [ ] OnboardingRecommendations.jsx (display)
- [ ] API integration

### Week 2: ANALYTICS
- [ ] UserAnalytics.jsx (dashboard)
- [ ] MetricsCard.jsx (individual)
- [ ] Refresh logic

### Week 3: COLD-START
- [ ] ColdStartCheck.jsx (banner)
- [ ] ColdStartRecommendations.jsx (display)
- [ ] Conditional rendering

### Week 4: METRICS (Optional)
- [ ] MetricsDashboard.jsx (main)
- [ ] MetricsChart.jsx (charts)
- [ ] EvaluationReport.jsx

---

## 💻 CODE SNIPPET - Basic Usage

```javascript
// 1. Check onboarding status
const response = await fetch('/api/onboarding/status', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { completed } = await response.json();

// 2. Save preferences
await fetch('/api/onboarding/preferences', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    preferredGenreIds: [1, 3, 5],
    readingFrequency: 'DAILY',
    preferredLength: 'MEDIUM',
    completionPreference: 'BALANCED',
    explorationPreference: 'ADVENTUROUS'
  })
});

// 3. Get recommendations
const recs = await fetch('/api/onboarding/recommendations', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// 4. Get user analytics
const profile = await fetch('/api/user/analytics', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// 5. Check cold-start
const status = await fetch('/api/recommendations/cold-start/check', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// 6. Get metrics (admin)
const metrics = await fetch('/api/recommendations/metrics/aggregate?userIds=1,2,3', {
  headers: { 'Authorization': `Bearer ${adminToken}` }
});
```

---

## 🔑 Key Dates & Expiration

```
Access Token: 24 hours (then need to login again)
Refresh Token: 7 days
Profile Update: Auto-update after each reading session
Metrics Cache: Real-time calculation
```

---

## ⚡ Performance Tips

```
✅ Cache onboarding status (doesn't change often)
✅ Call /refresh only after reading (don't spam)
✅ Cache profile for 5 minutes
✅ /evaluate-system runs offline (takes 1-2 min)
✅ Use limit parameter (default 10, max 100)
✅ Batch user IDs in metrics calls
```

---

## 🆘 ERROR CODES

```
200 ✅ Success
400 ⚠️ Bad request (check params)
401 🔒 Unauthorized (need token)
403 🚫 Forbidden (permission denied)
404 ❌ Not found (wrong endpoint)
500 💥 Server error (backend issue)
```

---

## 🧪 Test with Curl

```bash
# Login
TOKEN=$(curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.accessToken')

# Check onboarding
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/onboarding/status

# Get analytics
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/user/analytics

# Check cold-start
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/recommendations/cold-start/check

# Get metrics (admin only)
curl -H "Authorization: Bearer $TOKEN" \
  'http://localhost:8080/api/recommendations/metrics/aggregate?userIds=1,2,3&k=10'
```

---

## 📱 Mobile Considerations

```
✅ Use responsive design (mobile first)
✅ Large buttons for touch
✅ Simple forms (avoid long lists)
✅ Lazy load recommendations
✅ Cache images
✅ Minimize API calls
```

---

## 🚀 DEPLOYMENT CHECKLIST

- [x] Backend APIs ready ✅
- [x] Database migrations done ✅
- [x] Default users created ✅
- [ ] Frontend components built
- [ ] Integration testing done
- [ ] Performance optimized
- [ ] Mobile tested
- [ ] Admin dashboard ready
- [ ] Production deployment

---

## 📖 WHERE TO FIND MORE INFO

| What | Where |
|------|-------|
| Full implementation guide | API_UI_IMPLEMENTATION_GUIDE.md |
| Visual flowcharts | API_UI_VISUAL_FLOWCHART.md |
| React components | REACT_COMPONENTS_SAMPLE.jsx |
| API reference | API_APPLICATION_SUMMARY.md |
| Index of all docs | API_DOCUMENTATION_INDEX.md |
| Original report | FINAL_REPORT.md |

---

## ✅ READY TO START?

1. Pick an API group above (Week 1 = Onboarding)
2. Read the full guide for that group
3. Copy the React component
4. Implement step-by-step
5. Test with Curl first
6. Integrate with app
7. Test end-to-end
8. Deploy! 🚀

---

**Print this card & keep it handy! 📌**

Last Updated: January 9, 2026

