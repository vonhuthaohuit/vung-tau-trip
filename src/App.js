import React, { useState } from 'react';
import './index.css';

function App() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [confirmationSent, setConfirmationSent] = useState(false);

  const handleConfirm = () => {
    setConfirmationSent(true);
    setShowConfirmModal(false);
    setTimeout(() => setConfirmationSent(false), 3000);
  };

  const handleFeedbackSubmit = () => {
    // Here you would typically send the feedback to a server
    console.log('Feedback submitted:', feedback);
    setShowFeedbackModal(false);
    setFeedback('');
    alert('Cảm ơn góp ý của bạn! 🙏');
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
              >
                ✅ Xác nhận tham gia
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowFeedbackModal(true)}
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
            <p>Bạn có chắc chắn muốn tham gia chuyến hành hương thiêng liêng này không?</p>
            <div className="modal-buttons">
              <button className="btn btn-primary" onClick={handleConfirm}>
                Chắc chắn! 🚀
              </button>
              <button className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>
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
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Chia sẻ ý kiến của bạn về thời gian, địa điểm hoặc hoạt động..."
            />
            <div className="modal-buttons">
              <button className="btn btn-primary" onClick={handleFeedbackSubmit}>
                Gửi góp ý 📤
              </button>
              <button className="btn btn-secondary" onClick={() => setShowFeedbackModal(false)}>
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