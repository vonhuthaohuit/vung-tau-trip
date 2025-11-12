import React, { useState, useCallback, useMemo, memo } from 'react';
import './index.css';

/**
 * ImagePreviewDialog - Component demo để preview ảnh qua iframe
 * Version đơn giản không cần dependencies phức tạp
 */
const ImagePreviewDialog = memo(({
  open,
  onOpenChange,
  fileUrl,
  fileName = 'Image Preview',
  fileType = 'jpg',
  onDownload,
  showDownload = true
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [iframeKey, setIframeKey] = useState(0);

  // Reset states khi dialog mở
  React.useEffect(() => {
    if (open) {
      setIsFullScreen(false);
      setLoading(true);
      setError(null);
      setIframeKey((prev) => prev + 1);
    }
  }, [open, fileUrl]);

  // Xử lý load iframe thành công
  const handleIframeLoad = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  // Xử lý lỗi load iframe
  const handleIframeError = useCallback(() => {
    setLoading(false);
    setError('Không thể tải ảnh. Vui lòng thử lại!');
  }, []);

  // Toggle fullscreen
  const toggleFullScreen = useCallback(() => {
    setIsFullScreen((prev) => !prev);
  }, []);

  // Reload iframe
  const handleReload = useCallback(() => {
    setLoading(true);
    setError(null);
    setIframeKey((prev) => prev + 1);
  }, []);

  // Ẩn scroll body khi fullscreen
  React.useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullScreen]);

  // Thoát fullscreen khi bấm ESC
  React.useEffect(() => {
    if (!isFullScreen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        setIsFullScreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isFullScreen]);

  // Tạo viewer URL cho ảnh
  const viewerUrl = useMemo(() => {
    // Đối với ảnh, có thể dùng URL trực tiếp hoặc wrap trong HTML
    // Tạo một HTML page đơn giản để hiển thị ảnh
    const htmlContent = `
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
              background: #f0f0f0;
              overflow: hidden;
            }
            img {
              max-width: 100%;
              max-height: 100vh;
              object-fit: contain;
              display: block;
            }
          </style>
        </head>
        <body>
          <img src="${fileUrl}" alt="${fileName}" onload="window.parent.postMessage('iframeLoaded', '*')" onerror="window.parent.postMessage('iframeError', '*')" />
        </body>
      </html>
    `;
    
    // Tạo blob URL từ HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' });
    return URL.createObjectURL(blob);
  }, [fileUrl, fileName]);

  // Cleanup blob URL
  React.useEffect(() => {
    return () => {
      if (viewerUrl && viewerUrl.startsWith('blob:')) {
        URL.revokeObjectURL(viewerUrl);
      }
    };
  }, [viewerUrl]);

  // Handler cho close dialog
  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  // Early return nếu dialog không mở
  if (!open) {
    return null;
  }

  return (
    <div 
      className="image-preview-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      {/* Header */}
      {!isFullScreen && (
        <div style={{
          padding: '16px 20px',
          backgroundColor: '#fff',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
            📷 {fileName}
          </h3>
          <button
            onClick={handleClose}
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
      )}

      {/* Toolbar */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleReload}
            disabled={loading}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            🔄 {loading ? 'Đang tải...' : 'Tải lại'}
          </button>

          {showDownload && onDownload && (
            <button
              onClick={onDownload}
              style={{
                padding: '8px 16px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                background: '#fff',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ⬇️ Tải xuống
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={toggleFullScreen}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: '#fff',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {isFullScreen ? '🗗 Thu nhỏ' : '🗖 Toàn màn hình'}
          </button>

          {isFullScreen && (
            <button
              onClick={handleClose}
              style={{
                padding: '8px 16px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                background: '#fff',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ✕ Đóng
            </button>
          )}
        </div>
      </div>

      {/* Preview Content */}
      <div style={{
        flex: 1,
        position: 'relative',
        backgroundColor: '#f5f5f5',
        overflow: 'hidden'
      }}>
        {/* Loading */}
        {loading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            zIndex: 10
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: '4px solid #007bff',
                borderTop: '4px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px'
              }}></div>
              <p style={{ color: '#666', fontSize: '14px' }}>Đang tải ảnh...</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            padding: '20px'
          }}>
            <p style={{ color: '#f00', marginBottom: '16px', fontSize: '16px' }}>{error}</p>
            <button
              onClick={handleReload}
              style={{
                padding: '10px 20px',
                border: '1px solid #007bff',
                borderRadius: '4px',
                background: '#007bff',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🔄 Thử lại
            </button>
          </div>
        )}

        {/* Iframe */}
        <iframe
          key={iframeKey}
          src={viewerUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            opacity: loading ? 0 : 1,
            display: error ? 'none' : 'block'
          }}
          title={fileName}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          sandbox="allow-same-origin allow-scripts"
        />
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
});

ImagePreviewDialog.displayName = 'ImagePreviewDialog';

/**
 * Demo Component - Sử dụng ImagePreviewDialog
 */
function ImagePreviewDemo() {
  const [open, setOpen] = useState(false);
  
  // URL ảnh demo - sử dụng Unsplash hoặc placeholder
  const demoImageUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80';
  const demoFileName = 'Beautiful Landscape.jpg';

  const handleDownload = () => {
    // Tạo link download
    const link = document.createElement('a');
    link.href = demoImageUrl;
    link.download = demoFileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{
      padding: '40px',
      textAlign: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <h1 style={{ marginBottom: '20px', color: '#333' }}>
        🖼️ Image Preview Dialog Demo
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
          boxShadow: '0 2px 8px rgba(0,123,255,0.3)',
          transition: 'all 0.3s'
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = '#0056b3';
          e.target.style.transform = 'translateY(-2px)';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = '#007bff';
          e.target.style.transform = 'translateY(0)';
        }}
      >
        📷 Mở Preview Ảnh
      </button>

      <div style={{ marginTop: '30px' }}>
        <h3 style={{ marginBottom: '15px', color: '#333' }}>Thông tin demo:</h3>
        <div style={{
          display: 'inline-block',
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'left',
          maxWidth: '600px'
        }}>
          <p><strong>URL ảnh:</strong> {demoImageUrl}</p>
          <p><strong>Tên file:</strong> {demoFileName}</p>
          <p><strong>Loại file:</strong> JPG</p>
        </div>
      </div>

      <ImagePreviewDialog
        open={open}
        onOpenChange={setOpen}
        fileUrl={demoImageUrl}
        fileName={demoFileName}
        fileType="jpg"
        onDownload={handleDownload}
        showDownload={true}
      />
    </div>
  );
}

export default ImagePreviewDemo;

