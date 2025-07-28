import React, { useState } from 'react';
import './index.css';

function App() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data states for confirmation
  const [confirmData, setConfirmData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  
  // Form data states for suggestions
  const [suggestData, setSuggestData] = useState({
    name: '',
    phone: '',
    suggestedDate: '',
    duration: '',
    activities: '',
    budget: ''
  });

  // Google Apps Script Web App URL - Replace with your actual URL
  const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyUm6yNoO8uoXfqJju52OkuGyTPBHPQnBfbsQE8CIPR106WA7EqpA3E5FgNjq1uxvDx/exec';

  // JSONP method to avoid CORS issues
  const submitDataViaJSONP = (data, type) => {
    return new Promise((resolve, reject) => {
      // Create a unique callback name
      const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
      
      // Create the callback function
      window[callbackName] = function(response) {
        delete window[callbackName];
        document.body.removeChild(script);
        
        if (response.result === 'success') {
          resolve(response);
        } else {
          reject(new Error(response.error || 'Unknown error'));
        }
      };
      
      // Prepare data with callback parameter
      const params = new URLSearchParams({
        type: type,
        timestamp: new Date().toISOString(),
        callback: callbackName,
        ...data
      });
      
      // Create script tag for JSONP
      const script = document.createElement('script');
      script.src = `${GAS_WEB_APP_URL}?${params.toString()}`;
      script.onerror = () => {
        delete window[callbackName];
        document.body.removeChild(script);
        reject(new Error('Network error'));
      };
      
      document.body.appendChild(script);
      
      // Timeout after 10 seconds
      setTimeout(() => {
        if (window[callbackName]) {
          delete window[callbackName];
          document.body.removeChild(script);
          reject(new Error('Request timeout'));
        }
      }, 10000);
    });
  };

  const handleConfirm = async () => {
    if (!confirmData.name || !confirmData.phone) {
      alert('Vui lòng điền đầy đủ họ tên và số điện thoại!');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('📤 Sending confirmation data via JSONP:', confirmData);
      console.log('📡 GAS URL:', GAS_WEB_APP_URL);

      // Use JSONP to avoid CORS issues
      const result = await submitDataViaJSONP(confirmData, 'confirm');
      console.log('✅ Response result:', result);
      
      setConfirmationSent(true);
      setShowConfirmModal(false);
      setConfirmData({ name: '', phone: '', email: '', message: '' });
      setTimeout(() => setConfirmationSent(false), 5000);
      alert('✅ Đã gửi xác nhận thành công!\nDữ liệu đã được lưu vào Google Sheets.');
      
    } catch (error) {
      console.error('💥 Error submitting confirmation:', error);
      alert(`Có lỗi xảy ra khi gửi xác nhận: ${error.message}\nVui lòng thử lại!`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!suggestData.name || !suggestData.phone || !suggestData.suggestedDate) {
      alert('Vui lòng điền đầy đủ họ tên, số điện thoại và ngày đề xuất!');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('📤 Sending suggestion data via JSONP:', suggestData);
      console.log('📡 GAS URL:', GAS_WEB_APP_URL);

      // Use JSONP to avoid CORS issues
      const result = await submitDataViaJSONP(suggestData, 'suggest');
      console.log('✅ Response result:', result);
      
      setShowFeedbackModal(false);
      setSuggestData({
        name: '',
        phone: '',
        suggestedDate: '',
        duration: '',
        activities: '',
        budget: ''
      });
      alert('✅ Cảm ơn góp ý của bạn!\nDữ liệu đã được lưu vào Google Sheets.');
      
    } catch (error) {
      console.error('💥 Error submitting feedback:', error);
      alert(`Có lỗi xảy ra khi gửi góp ý: ${error.message}\nVui lòng thử lại!`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDataChange = (field, value) => {
    setConfirmData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSuggestDataChange = (field, value) => {
    setSuggestData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="app">
      <div className="announcement-card">
        <div className="header">
          <h1>🌊📢 THÔNG BÁO KHẨN CẤP TỪ GIÁO CHỦ</h1>
          <p>Kính gửi toàn thể chư vị member thuộc Giáo phái Ngưng Trình Bày!</p>
        </div>

        <div className="content">
          <section className="intro-section">
            <h2>🎓 Lời Mở Đầu</h2>
            <p>
              Sau 4 năm tu luyện khổ cực tại học viện IT chính đạo – nơi đã rèn luyện cho chúng ta khả năng 
              nhìn bug là biết lỗi, nhìn deadline là biết chạy – thì cuối cùng, chúng ta cũng đã đắc đạo, 
              rời khỏi xiềng xích đồ án và bước vào xiềng xích customer, lĩ, deadline, ....🧑‍💻🎓
            </p>
          </section>

          <section className="intro-section">
            <h2>🎯 Thông Báo Chính</h2>
            <p>
              Nhân dịp trọng đại này, giáo chủ quyết định triệu tập toàn bộ giáo chúng cùng nhau thực hiện 
              một chuyến hành hương về miền biển Vũng Tàu – nơi gió mát, cát êm, nước mặn và lòng người thì đậm đà 😎
            </p>
          </section>

          <div className="info-grid">
            <div className="info-card">
              <h3>📅 Thời gian</h3>
              <p>Tháng 10/2025 – mùa đẹp nhất để tạm biệt thanh xuân</p>
            </div>

            <div className="info-card">
              <h3>📍 Địa điểm</h3>
              <p>
                VŨNG TÀU – nơi giáo phái ta sẽ "deploy" những trận cười, "host" những cuộc vui 
                và "log" lại kỷ niệm đẹp nhất thời sinh viên
              </p>
            </div>
          </div>

          <section className="objectives">
            <h3>🎯 Mục tiêu chuyến đi</h3>
            <ul>
              <li>🔄 Reconnect tình huynh đệ</li>
              <li>🎮 Release stress hậu tốt nghiệp</li>
              <li>📸 Update album sống ảo</li>
              <li>🐛 Fix bug tâm trạng sau những ngày deadline dồn dập</li>
            </ul>
          </section>

          <div className="warning">
            ⚠️ CHÚ Ý: Chuyến đi này không phải là một chuyến đi bình thường. Đây là một nghi lễ thiêng liêng 
            của giáo phái. Đứa nào không đi thì hiểu rồi đó nay tính giáo chủ hơi lóng.
          </div>

          <section className="important-note">
            <h3>📢 Thông Báo Quan Trọng</h3>
            <p>
              Tất cả member vui lòng comment xác nhận bên dưới, góp ý thêm về thời gian – giáo chủ sẽ 
              compile lại lịch trình và thông báo sau. (Chốt luôn ngày và giờ đi để mấy đệ chuẩn bị trong vòng 2 tháng)
            </p>
          </section>

          <section className="call-to-action">
            <h3>🚀 Hỡi các chiến binh bàn phím… đã đến lúc cùng nhau tạo ra dòng code cuối cùng của thanh xuân!</h3>
            
            <div className="action-buttons">
              <button 
                className="btn btn-primary" 
                onClick={() => setShowConfirmModal(true)}
                disabled={isSubmitting}
              >
                ✅ Xác nhận tham gia
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowFeedbackModal(true)}
                disabled={isSubmitting}
              >
                💬 Góp ý thời gian
              </button>
            </div>
            
            {confirmationSent && (
              <div style={{marginTop: '20px', color: 'white', fontWeight: 'bold'}}>
                🎉 Đã xác nhận thành công! Chào mừng chiến binh gia nhập hành trình!
              </div>
            )}
          </section>
        </div>

        <div className="footer">
          <p>© 2025 Giáo phái Ngưng Trình Bày - Hành hương Vũng Tàu</p>
          <p>Được tạo bởi <strong>Võ Nhựt Hào</strong></p>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="feedback-modal">
          <div className="modal-content">
            <h3>🎉 Xác nhận tham gia</h3>
            <div className="form-group">
              <label>Họ và tên *</label>
              <input
                type="text"
                value={confirmData.name}
                onChange={(e) => handleConfirmDataChange('name', e.target.value)}
                placeholder="Nhập họ và tên đầy đủ"
                required
              />
            </div>
            <div className="form-group">
              <label>Số điện thoại *</label>
              <input
                type="tel"
                value={confirmData.phone}
                onChange={(e) => handleConfirmDataChange('phone', e.target.value)}
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={confirmData.email}
                onChange={(e) => handleConfirmDataChange('email', e.target.value)}
                placeholder="Nhập email (tùy chọn)"
              />
            </div>
            <div className="form-group">
              <label>Lời nhắn</label>
              <textarea
                value={confirmData.message}
                onChange={(e) => handleConfirmDataChange('message', e.target.value)}
                placeholder="Lời nhắn gửi giáo chủ (tùy chọn)"
                rows="3"
              />
            </div>
            <div className="modal-buttons">
              <button 
                className="btn btn-primary" 
                onClick={handleConfirm}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang gửi...' : 'Chắc chắn! 🚀'}
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
              >
                Để tôi suy nghĩ thêm 🤔
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="feedback-modal">
          <div className="modal-content">
            <h3>💬 Góp ý thời gian</h3>
            <div className="form-group">
              <label>Họ và tên *</label>
              <input
                type="text"
                value={suggestData.name}
                onChange={(e) => handleSuggestDataChange('name', e.target.value)}
                placeholder="Nhập họ và tên đầy đủ"
                required
              />
            </div>
            <div className="form-group">
              <label>Số điện thoại *</label>
              <input
                type="tel"
                value={suggestData.phone}
                onChange={(e) => handleSuggestDataChange('phone', e.target.value)}
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
            <div className="form-group">
              <label>Ngày đề xuất *</label>
              <input
                type="text"
                value={suggestData.suggestedDate}
                onChange={(e) => handleSuggestDataChange('suggestedDate', e.target.value)}
                placeholder="VD: 15-20/10/2025 hoặc cuối tuần đầu tháng 10"
                required
              />
            </div>
            <div className="form-group">
              <label>Thời gian đi</label>
              <select
                value={suggestData.duration}
                onChange={(e) => handleSuggestDataChange('duration', e.target.value)}
              >
                <option value="">Chọn thời gian</option>
                <option value="1 ngày">1 ngày</option>
                <option value="2 ngày 1 đêm">2 ngày 1 đêm</option>
                <option value="3 ngày 2 đêm">3 ngày 2 đêm</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div className="form-group">
              <label>Hoạt động mong muốn</label>
              <textarea
                value={suggestData.activities}
                onChange={(e) => handleSuggestDataChange('activities', e.target.value)}
                placeholder="VD: Tắm biển, BBQ, karaoke, chụp ảnh, thăm thú địa danh..."
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Ngân sách dự kiến</label>
              <select
                value={suggestData.budget}
                onChange={(e) => handleSuggestDataChange('budget', e.target.value)}
              >
                <option value="">Chọn ngân sách</option>
                <option value="Dưới 500k">Dưới 500k</option>
                <option value="500k - 1 triệu">500k - 1 triệu</option>
                <option value="1 - 1.5 triệu">1 - 1.5 triệu</option>
                <option value="1.5 - 2 triệu">1.5 - 2 triệu</option>
                <option value="Trên 2 triệu">Trên 2 triệu</option>
                <option value="Tùy giáo chủ">Tùy giáo chủ</option>
              </select>
            </div>
            <div className="modal-buttons">
              <button 
                className="btn btn-primary" 
                onClick={handleFeedbackSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi góp ý 📤'}
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowFeedbackModal(false)}
                disabled={isSubmitting}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 