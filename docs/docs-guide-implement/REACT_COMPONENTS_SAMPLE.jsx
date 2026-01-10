// ============================================
// REACT COMPONENTS - API Integration Sample
// ============================================
// Bạn có thể copy-paste và sử dụng trực tiếp

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ============ 1. ONBOARDING FORM ============

const OnboardingForm = ({ token, onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    preferredGenreIds: [],
    readingFrequency: 'DAILY',
    preferredLength: 'MEDIUM',
    completionPreference: 'BALANCED',
    explorationPreference: 'ADVENTUROUS'
  });
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách genres
  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await axios.get('/api/genres', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setGenres(response.data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        '/api/onboarding/preferences',
        formData,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      // Save result
      localStorage.setItem('onboarding_completed', 'true');

      // Call callback
      if (onComplete) {
        onComplete(response.data);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Có lỗi khi lưu sở thích. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const toggleGenre = (genreId) => {
    if (formData.preferredGenreIds.includes(genreId)) {
      setFormData({
        ...formData,
        preferredGenreIds: formData.preferredGenreIds.filter(id => id !== genreId)
      });
    } else {
      setFormData({
        ...formData,
        preferredGenreIds: [...formData.preferredGenreIds, genreId]
      });
    }
  };

  return (
    <div className="onboarding-form">
      <h1>🎯 Tìm hiểu sở thích của bạn</h1>

      {/* Step 1: Reading Frequency */}
      {step === 1 && (
        <div className="form-step">
          <h2>Bạn đọc truyện bao lâu một lần?</h2>
          <div className="options">
            <label>
              <input
                type="radio"
                value="DAILY"
                checked={formData.readingFrequency === 'DAILY'}
                onChange={(e) => setFormData({...formData, readingFrequency: e.target.value})}
              />
              <span>⏰ Hàng ngày</span>
            </label>
            <label>
              <input
                type="radio"
                value="WEEKLY"
                checked={formData.readingFrequency === 'WEEKLY'}
                onChange={(e) => setFormData({...formData, readingFrequency: e.target.value})}
              />
              <span>📅 Hàng tuần</span>
            </label>
            <label>
              <input
                type="radio"
                value="MONTHLY"
                checked={formData.readingFrequency === 'MONTHLY'}
                onChange={(e) => setFormData({...formData, readingFrequency: e.target.value})}
              />
              <span>📆 Hàng tháng</span>
            </label>
          </div>
          <button onClick={() => setStep(2)}>Tiếp Tục</button>
        </div>
      )}

      {/* Step 2: Preferred Length */}
      {step === 2 && (
        <div className="form-step">
          <h2>Bạn thích truyện dài hay ngắn?</h2>
          <div className="options">
            <label>
              <input
                type="radio"
                value="SHORT"
                checked={formData.preferredLength === 'SHORT'}
                onChange={(e) => setFormData({...formData, preferredLength: e.target.value})}
              />
              <span>📘 Ngắn (1-50 chương)</span>
            </label>
            <label>
              <input
                type="radio"
                value="MEDIUM"
                checked={formData.preferredLength === 'MEDIUM'}
                onChange={(e) => setFormData({...formData, preferredLength: e.target.value})}
              />
              <span>📗 Vừa (51-200 chương)</span>
            </label>
            <label>
              <input
                type="radio"
                value="LONG"
                checked={formData.preferredLength === 'LONG'}
                onChange={(e) => setFormData({...formData, preferredLength: e.target.value})}
              />
              <span>📙 Dài (>200 chương)</span>
            </label>
          </div>
          <div className="buttons">
            <button onClick={() => setStep(1)}>← Quay Lại</button>
            <button onClick={() => setStep(3)}>Tiếp Tục</button>
          </div>
        </div>
      )}

      {/* Step 3: Completion Preference */}
      {step === 3 && (
        <div className="form-step">
          <h2>Bạn thích hoàn thành hay khám phá?</h2>
          <div className="options">
            <label>
              <input
                type="radio"
                value="COMPLETION_FOCUSED"
                checked={formData.completionPreference === 'COMPLETION_FOCUSED'}
                onChange={(e) => setFormData({...formData, completionPreference: e.target.value})}
              />
              <span>✅ Hoàn thành truyện</span>
            </label>
            <label>
              <input
                type="radio"
                value="BALANCED"
                checked={formData.completionPreference === 'BALANCED'}
                onChange={(e) => setFormData({...formData, completionPreference: e.target.value})}
              />
              <span>⚖️ Cân bằng</span>
            </label>
            <label>
              <input
                type="radio"
                value="EXPLORATION"
                checked={formData.completionPreference === 'EXPLORATION'}
                onChange={(e) => setFormData({...formData, completionPreference: e.target.value})}
              />
              <span>🔍 Khám phá</span>
            </label>
          </div>
          <div className="buttons">
            <button onClick={() => setStep(2)}>← Quay Lại</button>
            <button onClick={() => setStep(4)}>Tiếp Tục</button>
          </div>
        </div>
      )}

      {/* Step 4: Exploration Preference */}
      {step === 4 && (
        <div className="form-step">
          <h2>Bạn dễ dàng chấp nhận thể loại mới?</h2>
          <div className="options">
            <label>
              <input
                type="radio"
                value="CONSERVATIVE"
                checked={formData.explorationPreference === 'CONSERVATIVE'}
                onChange={(e) => setFormData({...formData, explorationPreference: e.target.value})}
              />
              <span>🛡️ Thận trọng</span>
            </label>
            <label>
              <input
                type="radio"
                value="BALANCED"
                checked={formData.explorationPreference === 'BALANCED'}
                onChange={(e) => setFormData({...formData, explorationPreference: e.target.value})}
              />
              <span>⚖️ Cân bằng</span>
            </label>
            <label>
              <input
                type="radio"
                value="ADVENTUROUS"
                checked={formData.explorationPreference === 'ADVENTUROUS'}
                onChange={(e) => setFormData({...formData, explorationPreference: e.target.value})}
              />
              <span>🎒 Phiêu lưu</span>
            </label>
          </div>
          <div className="buttons">
            <button onClick={() => setStep(3)}>← Quay Lại</button>
            <button onClick={() => setStep(5)}>Tiếp Tục</button>
          </div>
        </div>
      )}

      {/* Step 5: Genres Selection */}
      {step === 5 && (
        <div className="form-step">
          <h2>Chọn thể loại yêu thích</h2>
          <div className="genres-grid">
            {genres.map(genre => (
              <label key={genre.id} className="genre-checkbox">
                <input
                  type="checkbox"
                  checked={formData.preferredGenreIds.includes(genre.id)}
                  onChange={() => toggleGenre(genre.id)}
                />
                <span>{genre.name}</span>
              </label>
            ))}
          </div>
          <div className="buttons">
            <button onClick={() => setStep(4)}>← Quay Lại</button>
            <button
              onClick={handleSubmit}
              disabled={loading || formData.preferredGenreIds.length === 0}
            >
              {loading ? 'Đang lưu...' : '🎉 Hoàn Thành'}
            </button>
          </div>
        </div>
      )}

      <div className="progress">
        Step {step} of 5
      </div>
    </div>
  );
};

// ============ 2. RECOMMENDATIONS DISPLAY ============

const RecommendationsList = ({ token, isOnboarding = false }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const endpoint = isOnboarding
        ? '/api/onboarding/recommendations?limit=10'
        : '/api/recommendations/cold-start?limit=10';

      const response = await axios.get(endpoint, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setRecommendations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">⏳ Đang tải...</div>;

  return (
    <div className="recommendations">
      <h2>
        {isOnboarding
          ? '🎯 Truyện được gợi ý cho bạn'
          : '❄️ Truyện phổ biến'
        }
      </h2>

      <div className="stories-grid">
        {recommendations.map(story => (
          <div key={story.id} className="story-card">
            <img
              src={story.coverUrl || '/placeholder.jpg'}
              alt={story.name}
              className="story-cover"
            />

            <div className="story-content">
              <h3 className="story-title">{story.name}</h3>
              <p className="story-author">by {story.author}</p>

              <div className="genres">
                {story.genres.slice(0, 2).map(genre => (
                  <span key={genre} className="genre-tag">{genre}</span>
                ))}
              </div>

              <div className="rating">
                <span className="stars">⭐ {story.rating?.toFixed(1) || 'N/A'}</span>
                <span className="reviews">({story.totalReviews || 0})</span>
              </div>

              <p className="story-description">
                {story.description?.substring(0, 100)}...
              </p>

              <button className="read-btn">
                👁️ Đọc Ngay
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============ 3. USER ANALYTICS ============

const UserAnalytics = ({ token }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/user/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setProfile(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const response = await axios.post(
        '/api/user/analytics/refresh',
        {},
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      setProfile(response.data);
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  if (loading) return <div className="loading">⏳ Đang tải...</div>;
  if (!profile) return <div className="error">❌ Không có dữ liệu</div>;

  return (
    <div className="analytics">
      <h2>📊 Thống kê Đọc Truyện</h2>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">📚</div>
          <div className="metric-info">
            <h3>Truyện Đã Đọc</h3>
            <p className="metric-value">{profile.totalStoriesRead}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📖</div>
          <div className="metric-info">
            <h3>Chương Đã Đọc</h3>
            <p className="metric-value">{profile.totalChaptersRead}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">✅</div>
          <div className="metric-info">
            <h3>Tỉ Lệ Hoàn Thành</h3>
            <p className="metric-value">
              {(profile.averageCompletionRate * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⚡</div>
          <div className="metric-info">
            <h3>Tốc Độ Đọc</h3>
            <p className="metric-value">
              {profile.chaptersPerWeek?.toFixed(1) || '0'}/tuần
            </p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⏱️</div>
          <div className="metric-info">
            <h3>Thời Gian Trung Bình</h3>
            <p className="metric-value">
              {profile.avgSessionDurationMinutes?.toFixed(0) || '0'} phút
            </p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🎨</div>
          <div className="metric-info">
            <h3>Đa Dạng Thể Loại</h3>
            <p className="metric-value">
              {(profile.genreDiversityScore * 100).toFixed(0)}%
            </p>
          </div>
        </div>
      </div>

      <button className="refresh-btn" onClick={refreshProfile}>
        🔄 Cập Nhật Thống Kê
      </button>

      <p className="update-time">
        Cập nhật: {new Date(profile.lastProfileUpdate).toLocaleString()}
      </p>
    </div>
  );
};

// ============ 4. COLD-START CHECK ============

const ColdStartCheck = ({ token }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkColdStart();
  }, []);

  const checkColdStart = async () => {
    try {
      const response = await axios.get('/api/recommendations/cold-start/check', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setStatus(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error checking cold-start status:', error);
      setLoading(false);
    }
  };

  if (loading) return null;
  if (!status?.isColdStart) return null;

  return (
    <div className="cold-start-banner">
      <h2>🆕 Chào mừng bạn!</h2>
      <p>Dựa vào sở thích của bạn, chúng tôi gợi ý những truyện hay nhất</p>
      <span className="strategy-badge">
        {status.recommendedStrategy === 'NEW_USER' ? '📈 Phổ Biến Nhất' : '🔥 Mới Nhất'}
      </span>
    </div>
  );
};

// ============ 5. FULL PAGE EXAMPLE ============

export default function DashboardPage({ token }) {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const response = await axios.get('/api/onboarding/status', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.data.completed) {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  };

  if (showOnboarding) {
    return (
      <OnboardingForm
        token={token}
        onComplete={() => setShowOnboarding(false)}
      />
    );
  }

  return (
    <div className="dashboard-page">
      <ColdStartCheck token={token} />

      <div className="main-content">
        <RecommendationsList token={token} />
      </div>

      <aside className="sidebar">
        <UserAnalytics token={token} />
      </aside>
    </div>
  );
}

// ============ CSS STYLES ============
/*
.onboarding-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
}

.form-step {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.form-step h2 {
  margin-bottom: 30px;
  font-size: 20px;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.options label {
  display: flex;
  align-items: center;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.options label:hover {
  border-color: #ff6b6b;
  background: #fff5f5;
}

.options label input[type="radio"] {
  margin-right: 12px;
}

.buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.buttons button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: #ff6b6b;
  color: white;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
}

.buttons button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.stories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.story-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.story-card:hover {
  transform: translateY(-4px);
}

.story-cover {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.story-content {
  padding: 15px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.metric-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.metric-icon {
  font-size: 32px;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  margin: 5px 0;
}
*/

