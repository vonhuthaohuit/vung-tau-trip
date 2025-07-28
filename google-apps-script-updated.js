// Google Apps Script để xử lý requests từ React App
// Copy code này vào Google Apps Script và deploy as web app

// Thêm function này để xử lý preflight request (CORS)
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    .setHeader('Access-Control-Max-Age', '3600');
}

function doPost(e) {
  try {
    Logger.log('POST request received from React App');
    Logger.log('Post data: ' + e.postData.contents);
    
    // Parse JSON data from the request
    const data = JSON.parse(e.postData.contents);
    Logger.log('Parsed data: ' + JSON.stringify(data));
    
    // Get the active spreadsheet
    const spreadsheetId = '1k6FC5cA7aZMtxfMK5347VW8PkJN7tS5pAKRmwrIulKo';
    Logger.log('Opening spreadsheet: ' + spreadsheetId);
    
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    Logger.log('Spreadsheet opened successfully');
    
    // Get the appropriate sheet based on form type
    let sheet;
    if (data.type === 'confirm') {
      sheet = spreadsheet.getSheetByName('Xác nhận tham gia') || spreadsheet.insertSheet('Xác nhận tham gia');
      Logger.log('Using confirmation sheet');
    } else if (data.type === 'suggest') {
      sheet = spreadsheet.getSheetByName('Góp ý thời gian') || spreadsheet.insertSheet('Góp ý thời gian');
      Logger.log('Using suggestion sheet');
    } else {
      throw new Error('Invalid form type: ' + data.type);
    }
    
    // Prepare data for insertion
    const rowData = prepareRowData(data);
    Logger.log('Row data prepared: ' + JSON.stringify(rowData));
    
    // Insert data into sheet
    sheet.appendRow(rowData);
    Logger.log('Data inserted successfully');
    
    // Return success response with CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'message': 'Data saved successfully' }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    Logger.log('Error stack: ' + error.stack);
    
    // Return error response with CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
}

function doGet(e) {
  try {
    Logger.log('GET request received');
    Logger.log('Parameters: ' + JSON.stringify(e.parameter));
    
    // Return basic response with CORS headers
    return ContentService
      .createTextOutput('React-Google Sheets integration is working!')
      .setMimeType(ContentService.MimeType.TEXT)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
  } catch (error) {
    Logger.log('Error in doGet: ' + error.toString());
    return ContentService
      .createTextOutput('Error: ' + error.toString())
      .setMimeType(ContentService.MimeType.TEXT)
      .setHeader('Access-Control-Allow-Origin', '*');
  }
}

function prepareRowData(data) {
  try {
    Logger.log('Preparing row data for type: ' + data.type);
    
    const timestamp = new Date(data.timestamp);
    const formattedDate = Utilities.formatDate(timestamp, 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy HH:mm:ss');
    Logger.log('Formatted date: ' + formattedDate);
    
    if (data.type === 'confirm') {
      const rowData = [
        formattedDate,           // Thời gian gửi
        data.name || '',         // Họ và tên
        data.phone || '',        // Số điện thoại
        data.email || '',        // Email
        data.message || ''       // Lời nhắn
      ];
      Logger.log('Confirmation row data: ' + JSON.stringify(rowData));
      return rowData;
    } else if (data.type === 'suggest') {
      const rowData = [
        formattedDate,           // Thời gian gửi
        data.name || '',         // Họ và tên
        data.phone || '',        // Số điện thoại
        data.suggestedDate || '', // Ngày đề xuất
        data.duration || '',     // Thời gian đi
        data.activities || '',   // Hoạt động mong muốn
        data.budget || ''        // Ngân sách dự kiến
      ];
      Logger.log('Suggestion row data: ' + JSON.stringify(rowData));
      return rowData;
    }
    
    Logger.log('Unknown data type, returning empty array');
    return [];
  } catch (error) {
    Logger.log('Error in prepareRowData: ' + error.toString());
    throw error;
  }
}

// Function to set up headers for the sheets
function setupSheetHeaders() {
  try {
    Logger.log('Setting up sheet headers');
    
    const spreadsheetId = '1k6FC5cA7aZMtxfMK5347VW8PkJN7tS5pAKRmwrIulKo';
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    Logger.log('Spreadsheet opened for header setup');
    
    // Setup headers for confirmation sheet
    let confirmSheet = spreadsheet.getSheetByName('Xác nhận tham gia');
    if (!confirmSheet) {
      confirmSheet = spreadsheet.insertSheet('Xác nhận tham gia');
      Logger.log('Created confirmation sheet');
    } else {
      Logger.log('Found existing confirmation sheet');
    }
    
    const confirmHeaders = [
      'Thời gian gửi',
      'Họ và tên',
      'Số điện thoại',
      'Email',
      'Lời nhắn'
    ];
    
    confirmSheet.getRange(1, 1, 1, confirmHeaders.length).setValues([confirmHeaders]);
    confirmSheet.getRange(1, 1, 1, confirmHeaders.length).setFontWeight('bold');
    confirmSheet.getRange(1, 1, 1, confirmHeaders.length).setBackground('#667eea');
    confirmSheet.getRange(1, 1, 1, confirmHeaders.length).setFontColor('white');
    Logger.log('Confirmation headers set up');
    
    // Setup headers for suggestion sheet
    let suggestSheet = spreadsheet.getSheetByName('Góp ý thời gian');
    if (!suggestSheet) {
      suggestSheet = spreadsheet.insertSheet('Góp ý thời gian');
      Logger.log('Created suggestion sheet');
    } else {
      Logger.log('Found existing suggestion sheet');
    }
    
    const suggestHeaders = [
      'Thời gian gửi',
      'Họ và tên',
      'Số điện thoại',
      'Ngày đề xuất',
      'Thời gian đi',
      'Hoạt động mong muốn',
      'Ngân sách dự kiến'
    ];
    
    suggestSheet.getRange(1, 1, 1, suggestHeaders.length).setValues([suggestHeaders]);
    suggestSheet.getRange(1, 1, 1, suggestHeaders.length).setFontWeight('bold');
    suggestSheet.getRange(1, 1, 1, suggestHeaders.length).setBackground('#667eea');
    suggestSheet.getRange(1, 1, 1, suggestHeaders.length).setFontColor('white');
    Logger.log('Suggestion headers set up');
    
    // Auto-resize columns
    confirmSheet.autoResizeColumns(1, confirmHeaders.length);
    suggestSheet.autoResizeColumns(1, suggestHeaders.length);
    Logger.log('Columns auto-resized');
    
    Logger.log('Sheet headers setup completed successfully');
  } catch (error) {
    Logger.log('Error in setupSheetHeaders: ' + error.toString());
    throw error;
  }
}

// Function to test the setup
function testSetup() {
  setupSheetHeaders();
  Logger.log('Sheet headers have been set up successfully!');
}

// Function to test React integration
function testReactIntegration() {
  try {
    Logger.log('Testing React integration');
    
    const testData = {
      type: 'confirm',
      timestamp: new Date().toISOString(),
      name: 'Test User from React',
      phone: '0123456789',
      email: 'test@react.com',
      message: 'Test message from React integration'
    };
    
    const spreadsheetId = '1k6FC5cA7aZMtxfMK5347VW8PkJN7tS5pAKRmwrIulKo';
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    
    let sheet = spreadsheet.getSheetByName('Xác nhận tham gia');
    if (!sheet) {
      sheet = spreadsheet.insertSheet('Xác nhận tham gia');
    }
    
    const rowData = prepareRowData(testData);
    sheet.appendRow(rowData);
    
    Logger.log('React integration test successful');
  } catch (error) {
    Logger.log('Error in testReactIntegration: ' + error.toString());
  }
} 