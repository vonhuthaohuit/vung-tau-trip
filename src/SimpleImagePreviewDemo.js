import React, { useState } from 'react';
import './index.css';

/**
 * Demo đơn giản - Preview ảnh trong iframe
 * Version đơn giản nhất, chỉ dùng iframe trực tiếp
 */
function SimpleImagePreviewDemo() {
  const [open, setOpen] = useState(false);
  
  // URL ảnh demo - có thể thay đổi bất kỳ URL ảnh nào
  const imageUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80';
  
  // Hoặc có thể dùng các URL ảnh khác:
  // const imageUrl = 'https://picsum.photos/1920/1080';
  // const imageUrl = 'https://via.placeholder.com/1920x1080.jpg';

  return (
    <div style={{
      padding: '40px',
      textAlign: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <h1 style={{ marginBottom: '20px', color: '#333' }}>
        🖼️ Simple Image Preview Demo
      </h1>
      <p style={{ marginBottom: '30px', color: '#666', fontSize: '16px' }}>
        Click vào nút bên dưới để xem demo preview ảnh trong iframe
      </p>
      
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: '600',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,123,255,0.3)'
        }}
      >
        📷 Mở Preview Ảnh
      </button>

      {/* Preview Dialog */}
      {open && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            backgroundColor: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>📷 Image Preview</h3>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '4px 8px'
              }}
            >
              ✕
            </button>
          </div>

          {/* Iframe Container */}
          <div style={{
            flex: 1,
            position: 'relative',
            backgroundColor: '#000',
            overflow: 'hidden'
          }}>
            {/* Tạo HTML content để hiển thị ảnh trong iframe */}
            <iframe
              srcDoc={`
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                      * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                      }
                      body {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        background: #1a1a1a;
                        overflow: hidden;
                      }
                      img {
                        max-width: 100%;
                        max-height: 100vh;
                        width: auto;
                        height: auto;
                        object-fit: contain;
                        display: block;
                      }
                    </style>
                  </head>
                  <body>
                    <img src="${imageUrl}" alt="Preview Image" />
                  </body>
                </html>
              `}
              style={{
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              title="Image Preview"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      )}

      {/* Info */}
      <div style={{ marginTop: '30px' }}>
        <h3 style={{ marginBottom: '15px', color: '#333' }}>Thông tin:</h3>
        <div style={{
          display: 'inline-block',
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'left',
          maxWidth: '600px'
        }}>
          <p><strong>URL ảnh:</strong></p>
          <p style={{ wordBreak: 'break-all', fontSize: '14px', color: '#666' }}>
            {imageUrl}
          </p>
          <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
            💡 Bạn có thể thay đổi URL ảnh trong code để test với ảnh khác
          </p>
        </div>
      </div>
    </div>
  );
}

export default SimpleImagePreviewDemo;

