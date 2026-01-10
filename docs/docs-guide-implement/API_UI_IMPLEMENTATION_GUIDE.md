# 🎯 Hướng dẫn: Cách áp dụng các API mới vào UI/Frontend

## 📊 Tổng quan các API mới

Frontend cần tích hợp **3 nhóm tính năng chính**:

1. **🎪 Onboarding** - Hỏi preference khi user đăng ký lần đầu
2. **📈 User Profile Analytics** - Hiển thị profile & metrics của user
3. **❄️ Cold-Start Recommendations** - Gợi ý truyện cho user mới
4. **📊 Metrics Dashboard** - (ADMIN only) Xem chất lượng hệ thống

---

## 🎪 1. ONBOARDING FLOW (User Mới)

### Mục đích
Khi user đăng ký lần đầu, hỏi preferences để có cold-start recommendations tốt hơn.

### API Endpoints

#### 1.1 Check trạng thái onboarding
```javascript
GET /api/onboarding/status
Authorization: Bearer {token}

Response:
{
  "completed": false,
  "onboarding": {
    "id": 123,
    "userId": 456,
    "preferredGenres": "Romance,Fantasy",
    "readingFrequency": "DAILY",
    "preferredLength": "MEDIUM",
    "completionPreference": "BALANCED",
    "explorationPreference": "ADVENTUROUS",
    "completed": false,
    "createdAt": "2026-01-09T10:00:00"
  }
}
```

#### 1.2 Lưu preferences (form điền khi signup)
```javascript
POST /api/onboarding/preferences
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "preferredGenreIds": [1, 2, 3],           // Array of genre IDs
  "readingFrequency": "DAILY",               // DAILY, WEEKLY, MONTHLY
  "preferredLength": "MEDIUM",               // SHORT, MEDIUM, LONG
  "completionPreference": "BALANCED",        // BALANCED, COMPLETION_FOCUSED, EXPLORATION
  "explorationPreference": "ADVENTUROUS"     // CONSERVATIVE, BALANCED, ADVENTUROUS
}

Response:
{
  "id": 123,
  "userId": 456,
  "preferredGenres": "Romance,Fantasy",
  "readingFrequency": "DAILY",
  "preferredLength": "MEDIUM",
  "completionPreference": "BALANCED",
  "explorationPreference": "ADVENTUROUS",
  "completed": true,
  "createdAt": "2026-01-09T10:00:00"
}
```

#### 1.3 Lấy gợi ý dựa trên preferences
```javascript
GET /api/onboarding/recommendations?limit=10
Authorization: Bearer {token}

Response:
[
  {
    "id": 1,
    "name": "Cô Vợ Tây Du",
    "author": "Author Name",
    "description": "...",
    "genres": ["Romance", "Fantasy"],
    "rating": 4.5,
    "totalReviews": 150,
    ...
  },
  ...
]
```

### UI Implementation

#### Step 1: Signup Form (sau khi user submit login form)
```jsx
import React, { useState } from 'react';

const OnboardingForm = ({ userId, token }) => {
  const [formData, setFormData] = useState({
    preferredGenreIds: [],
    readingFrequency: 'DAILY',
    preferredLength: 'MEDIUM',
    completionPreference: 'BALANCED',
    explorationPreference: 'ADVENTUROUS'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch('/api/onboarding/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      // Redirect to recommendations page
      window.location.href = '/recommendations';
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Tìm hiểu sở thích của bạn</h2>

      {/* Reading Frequency */}
      <div>
        <label>Bạn đọc truyện bao lâu một lần?</label>
        <select 
          value={formData.readingFrequency}
          onChange={(e) => setFormData({
            ...formData,
            readingFrequency: e.target.value
          })}
        >
          <option value="DAILY">Hàng ngày</option>
          <option value="WEEKLY">Hàng tuần</option>
          <option value="MONTHLY">Hàng tháng</option>
        </select>
      </div>

      {/* Preferred Length */}
      <div>
        <label>Bạn thích truyện dài hay ngắn?</label>
        <select 
          value={formData.preferredLength}
          onChange={(e) => setFormData({
            ...formData,
            preferredLength: e.target.value
          })}
        >
          <option value="SHORT">Ngắn</option>
          <option value="MEDIUM">Vừa</option>
          <option value="LONG">Dài</option>
        </select>
      </div>

      {/* Completion Preference */}
      <div>
        <label>Bạn thích hoàn thành truyện hay thích khám phá?</label>
        <select 
          value={formData.completionPreference}
          onChange={(e) => setFormData({
            ...formData,
            completionPreference: e.target.value
          })}
        >
          <option value="COMPLETION_FOCUSED">Hoàn thành truyện</option>
          <option value="BALANCED">Cân bằng</option>
          <option value="EXPLORATION">Khám phá</option>
        </select>
      </div>

      {/* Exploration Preference */}
      <div>
        <label>Bạn dễ dàng chấp nhận thể loại mới?</label>
        <select 
          value={formData.explorationPreference}
          onChange={(e) => setFormData({
            ...formData,
            explorationPreference: e.target.value
          })}
        >
          <option value="CONSERVATIVE">Thận trọng</option>
          <option value="BALANCED">Cân bằng</option>
          <option value="ADVENTUROUS">Phiêu lưu</option>
        </select>
      </div>

      <button type="submit">Tiếp tục</button>
    </form>
  );
};

export default OnboardingForm;
```

#### Step 2: Recommendations Display (sau onboarding)
```jsx
const OnboardingRecommendations = ({ token }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    const response = await fetch('/api/onboarding/recommendations?limit=10', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      setRecommendations(data);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>🎯 Truyện được gợi ý cho bạn</h2>
      <p>Dựa trên sở thích bạn vừa chọn</p>
      
      <div className="grid">
        {recommendations.map(story => (
          <div key={story.id} className="story-card">
            <img src={story.coverUrl} alt={story.name} />
            <h3>{story.name}</h3>
            <p>by {story.author}</p>
            <div className="rating">⭐ {story.rating}/5 ({story.totalReviews})</div>
            <button>Đọc ngay</button>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## 📈 2. USER PROFILE ANALYTICS

### Mục đích
Hiển thị profile & metrics của user: truyện đã đọc, thể loại yêu thích, độ hoàn thành, v.v.

### API Endpoints

#### 2.1 Lấy profile user
```javascript
GET /api/user/analytics
Authorization: Bearer {token}

Response:
{
  "id": 123,
  "userId": 456,
  "profileEmbedding": [0.12, 0.45, -0.23, ...],  // Vector 768 dimensions
  "totalStoriesRead": 25,
  "totalChaptersRead": 450,
  "averageCompletionRate": 0.75,                  // 75%
  "chaptersPerWeek": 32.5,
  "avgSessionDurationMinutes": 45,
  "genreDiversityScore": 0.68,                    // Shannon entropy, 0-1
  "lastProfileUpdate": "2026-01-09T10:00:00"
}
```

#### 2.2 Refresh profile (sau khi user đọc truyện)
```javascript
POST /api/user/analytics/refresh
Authorization: Bearer {token}

Response:
{
  "id": 123,
  "userId": 456,
  "totalStoriesRead": 26,
  "totalChaptersRead": 460,
  "averageCompletionRate": 0.76,
  "chaptersPerWeek": 35.2,
  ...
}
```

### UI Implementation

```jsx
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const UserProfileAnalytics = ({ token }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const response = await fetch('/api/user/analytics', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      setProfile(data);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile data</div>;

  return (
    <div className="profile-analytics">
      <h2>📊 Thống kê Đọc Truyện Của Bạn</h2>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>📚 Truyện Đã Đọc</h3>
          <p className="metric-value">{profile.totalStoriesRead}</p>
        </div>

        <div className="metric-card">
          <h3>📖 Chương Đã Đọc</h3>
          <p className="metric-value">{profile.totalChaptersRead}</p>
        </div>

        <div className="metric-card">
          <h3>✅ Tỉ Lệ Hoàn Thành</h3>
          <p className="metric-value">
            {(profile.averageCompletionRate * 100).toFixed(1)}%
          </p>
        </div>

        <div className="metric-card">
          <h3>⚡ Tốc Độ Đọc</h3>
          <p className="metric-value">
            {profile.chaptersPerWeek.toFixed(1)}/tuần
          </p>
        </div>

        <div className="metric-card">
          <h3>⏱️ Trung Bình Thời Gian</h3>
          <p className="metric-value">
            {profile.avgSessionDurationMinutes.toFixed(0)} phút
          </p>
        </div>

        <div className="metric-card">
          <h3>🎨 Đa Dạng Thể Loại</h3>
          <p className="metric-value">
            {(profile.genreDiversityScore * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-section">
        <h3>📈 Xu Hướng Đọc (7 ngày gần đây)</h3>
        <BarChart width={600} height={300} data={getTrendData()}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="chapters" fill="#8884d8" name="Chương Đã Đọc" />
        </BarChart>
      </div>

      {/* Refresh Button */}
      <button 
        onClick={async () => {
          await fetch('/api/user/analytics/refresh', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          fetchProfile();
        }}
      >
        🔄 Cập Nhật Thống Kê
      </button>

      <p className="update-time">
        Cập nhật lần cuối: {new Date(profile.lastProfileUpdate).toLocaleString()}
      </p>
    </div>
  );
};

export default UserProfileAnalytics;
```

---

## ❄️ 3. COLD-START RECOMMENDATIONS

### Mục đích
Hiển thị gợi ý truyện cho user mới (chưa có lịch sử đọc).

### API Endpoints

#### 3.1 Kiểm tra user có đang ở trạng thái cold-start không
```javascript
GET /api/recommendations/cold-start/check
Authorization: Bearer {token}

Response:
{
  "isColdStart": true,
  "recommendedStrategy": "NEW_USER"  // NEW_USER or NEW_ITEM
}
```

#### 3.2 Lấy gợi ý cold-start
```javascript
GET /api/recommendations/cold-start?limit=10
Authorization: Bearer {token}

Response:
[
  {
    "id": 1,
    "name": "Truyện Hot",
    "author": "Author",
    "genres": ["Romance", "Fantasy"],
    "rating": 4.8,
    "viewCount": 50000,
    ...
  },
  ...
]
```

### UI Implementation

```jsx
import React, { useState, useEffect } from 'react';

const ColdStartRecommendations = ({ token }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [coldStartStatus, setColdStartStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchColdStartStatus();
    fetchRecommendations();
  }, []);

  const fetchColdStartStatus = async () => {
    const response = await fetch('/api/recommendations/cold-start/check', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      setColdStartStatus(data);
    }
  };

  const fetchRecommendations = async () => {
    const response = await fetch('/api/recommendations/cold-start?limit=10', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      setRecommendations(data);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="cold-start-recommendations">
      {coldStartStatus?.isColdStart && (
        <div className="banner">
          <h2>🎉 Chào mừng bạn đến với Novel!</h2>
          <p>Dựa vào sở thích của bạn, chúng tôi gợi ý những truyện hay nhất</p>
          <span className="strategy-tag">
            {coldStartStatus.recommendedStrategy === 'NEW_USER' 
              ? '🆕 Truyện Phổ Biến Nhất'
              : '🔥 Truyện Mới Nhất'
            }
          </span>
        </div>
      )}

      <div className="stories-grid">
        {recommendations.map(story => (
          <div key={story.id} className="story-card">
            <img src={story.coverUrl} alt={story.name} />
            <div className="story-info">
              <h3>{story.name}</h3>
              <p className="author">{story.author}</p>
              
              <div className="genres">
                {story.genres.map(genre => (
                  <span key={genre} className="genre-tag">{genre}</span>
                ))}
              </div>

              <div className="rating">
                <span className="stars">⭐ {story.rating}</span>
                <span className="reviews">({story.totalReviews} reviews)</span>
              </div>

              <p className="description">{story.description.substring(0, 100)}...</p>

              <button className="read-btn">Đọc Ngay</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColdStartRecommendations;
```

---

## 📊 4. METRICS DASHBOARD (ADMIN ONLY)

### Mục đích
ADMIN xem chất lượng hệ thống gợi ý: Precision, Recall, NDCG, v.v.

### API Endpoints

#### 4.1 Lấy metrics của một user
```javascript
GET /api/recommendations/metrics/user/{userId}?k=10
Authorization: Bearer {admin_token}

Response:
{
  "userId": 456,
  "k": 10,
  "precision": 0.7,        // 70% recommendations user liked
  "recall": 0.65,          // 65% of liked items were recommended
  "f1Score": 0.675,
  "map": 0.72,            // Mean Average Precision
  "ndcg": 0.78,           // Normalized Discounted Cumulative Gain
  "mrr": 0.85,            // Mean Reciprocal Rank
  "coverage": 0.4,        // 40% of catalog was recommended
  "diversity": 0.65       // Diversity score (0-1)
}
```

#### 4.2 Lấy metrics tổng hợp
```javascript
GET /api/recommendations/metrics/aggregate?userIds=1,2,3,4,5&k=10
Authorization: Bearer {admin_token}

Response:
{
  "avgPrecision": 0.68,
  "avgRecall": 0.62,
  "avgF1Score": 0.65,
  "avgMap": 0.70,
  "avgNdcg": 0.76,
  "avgMrr": 0.82,
  "avgCoverage": 0.38,
  "avgDiversity": 0.63,
  "evaluatedUsers": 5
}
```

#### 4.3 Đánh giá toàn bộ hệ thống
```javascript
POST /api/recommendations/metrics/evaluate-system?maxUsers=100
Authorization: Bearer {admin_token}

Response:
{
  "totalUsersEvaluated": 100,
  "metricsPerK": {
    "10": { "precision": 0.68, "recall": 0.62, ... },
    "20": { "precision": 0.65, "recall": 0.68, ... },
    "50": { "precision": 0.60, "recall": 0.75, ... }
  },
  "summary": "System Performance Summary\n..."
}
```

### UI Implementation

```jsx
import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const MetricsDashboard = ({ token }) => {
  const [aggregateMetrics, setAggregateMetrics] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState('1,2,3,4,5');
  const [kValue, setKValue] = useState(10);

  const fetchMetrics = async () => {
    const response = await fetch(
      `/api/recommendations/metrics/aggregate?userIds=${selectedUsers}&k=${kValue}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      setAggregateMetrics(data);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (!aggregateMetrics) return <div>Loading...</div>;

  const metricsData = [
    { name: 'Precision', value: (aggregateMetrics.avgPrecision * 100).toFixed(1) },
    { name: 'Recall', value: (aggregateMetrics.avgRecall * 100).toFixed(1) },
    { name: 'F1 Score', value: (aggregateMetrics.avgF1Score * 100).toFixed(1) },
    { name: 'NDCG', value: (aggregateMetrics.avgNdcg * 100).toFixed(1) },
    { name: 'MAP', value: (aggregateMetrics.avgMap * 100).toFixed(1) }
  ];

  return (
    <div className="metrics-dashboard">
      <h1>📊 Metrics Dashboard - Đánh Giá Hệ Thống Gợi Ý</h1>

      {/* Controls */}
      <div className="controls">
        <input
          type="text"
          placeholder="User IDs (comma-separated)"
          value={selectedUsers}
          onChange={(e) => setSelectedUsers(e.target.value)}
        />
        <input
          type="number"
          value={kValue}
          onChange={(e) => setKValue(e.target.value)}
          min="1"
          max="100"
        />
        <button onClick={fetchMetrics}>Lấy Metrics</button>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-box">
          <h3>Precision@{kValue}</h3>
          <p className="value">{(aggregateMetrics.avgPrecision * 100).toFixed(1)}%</p>
          <p className="description">Tỷ lệ gợi ý đúng</p>
        </div>

        <div className="metric-box">
          <h3>Recall@{kValue}</h3>
          <p className="value">{(aggregateMetrics.avgRecall * 100).toFixed(1)}%</p>
          <p className="description">Khả năng tìm đúng item</p>
        </div>

        <div className="metric-box">
          <h3>NDCG@{kValue}</h3>
          <p className="value">{(aggregateMetrics.avgNdcg * 100).toFixed(1)}%</p>
          <p className="description">Chất lượng ranking</p>
        </div>

        <div className="metric-box">
          <h3>Coverage</h3>
          <p className="value">{(aggregateMetrics.avgCoverage * 100).toFixed(1)}%</p>
          <p className="description">Bao phủ catalog</p>
        </div>
      </div>

      {/* Charts */}
      <div className="charts">
        <BarChart width={600} height={300} data={metricsData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </div>

      <p className="info">
        Đã đánh giá {aggregateMetrics.evaluatedUsers} users
      </p>
    </div>
  );
};

export default MetricsDashboard;
```

---

## 🔄 FLOW TÓM TẮT

### User Mới Vừa Đăng Ký:
```
1. Signup ❌ Không có data
2. → Hiển thị Onboarding Form
3. → User điền preferences
4. → Save /api/onboarding/preferences
5. → Hiển thị Cold-Start Recommendations
6. → GET /api/onboarding/recommendations
```

### User Đã Có Data:
```
1. Vào trang Dashboard
2. → Check /api/recommendations/cold-start/check
3. → Nếu isColdStart=false:
     → Hiển thị Personalized Recommendations
   → Nếu isColdStart=true:
     → Hiển thị Cold-Start Recommendations
4. → Hiển thị Profile Analytics: GET /api/user/analytics
```

### Admin Monitoring:
```
1. Vào Admin Dashboard
2. → GET /api/recommendations/metrics/aggregate
3. → Hiển thị Metrics Charts
4. → POST /api/recommendations/metrics/evaluate-system
5. → Xem Summary Report
```

---

## 📋 Checklist Implementation

### Frontend
- [ ] Login/Signup Form
- [ ] Onboarding Form (5 questions)
- [ ] Onboarding Recommendations Page
- [ ] User Profile Analytics Page
- [ ] Cold-Start Check & Recommendations
- [ ] Metrics Dashboard (Admin)
- [ ] Auto-refresh profile sau khi read

### Backend (Đã xong ✅)
- [x] /api/onboarding/preferences (POST)
- [x] /api/onboarding/status (GET)
- [x] /api/onboarding/recommendations (GET)
- [x] /api/user/analytics (GET)
- [x] /api/user/analytics/refresh (POST)
- [x] /api/recommendations/cold-start (GET)
- [x] /api/recommendations/cold-start/check (GET)
- [x] /api/recommendations/metrics/* (GET/POST)

---

## 🎨 UI/UX Tips

1. **Onboarding Form**: Làm đơn giản, 5-6 questions không quá
2. **Cold-Start**: Highlight trending + popular stories với badge
3. **Profile Analytics**: Dùng charts để visualize data
4. **Metrics Dashboard**: Chỉ dành cho admin, có permission check

---

## 🚀 Deployment

1. Backend: ✅ Sẵn sàng (migrations tự-run)
2. Frontend: Cần implement components (React/Vue/Angular)
3. Testing: Test flow onboarding → recommendations
4. Monitoring: Xem metrics dashboard để evaluate

